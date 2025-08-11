"""
Crisis Unleashed Backend Server

🔐 SETUP REQUIRED: Before running this server:
1. Copy .env.example to .env
2. Replace SECRET_KEY placeholder with secure key: python generate_secret_key.py
3. Configure database and other settings in .env

See SETUP.md for detailed instructions.
"""

from fastapi import FastAPI, APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Any
import uuid
import sys
from datetime import datetime

# Import routers and configuration
from .api import blockchain_router
from .config import get_settings
from .services import BlockchainService
from .services.health_manager import ServiceHealthManager, CriticalServiceException
from .workers import OutboxProcessor
from .middleware.service_dependency import ServiceDependencyMiddleware


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Load settings
settings = get_settings()

# MongoDB connection
client: AsyncIOMotorClient = AsyncIOMotorClient(settings.mongo_url)
db = client[settings.database_name]

# Global services and health manager
blockchain_service: Optional[BlockchainService] = None
outbox_processor: Optional[OutboxProcessor] = None
health_manager: ServiceHealthManager = ServiceHealthManager()

# Create the main app without a prefix
app = FastAPI(
    title="Crisis Unleashed Backend",
    description="Backend API for Crisis Unleashed card game with blockchain integration",
    version="1.0.0",
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root() -> dict[str, str]:
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate) -> StatusCheck:
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks(
    limit: int = Query(100, ge=1, le=1000)
) -> list[StatusCheck]:
    # Fetch the most recent status checks, limited by the query parameter
    status_checks = (
        await db.status_checks.find().sort("timestamp", -1).limit(limit).to_list(limit)
    )
    return [StatusCheck(**status_check) for status_check in status_checks]


# Include the routers in the main app
app.include_router(api_router)
app.include_router(blockchain_router, prefix="/api")

# Add service dependency middleware
app.add_middleware(ServiceDependencyMiddleware, health_manager=health_manager)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event() -> None:
    """Initialize services on application startup with fail-fast behavior."""
    global blockchain_service, outbox_processor

    logger.info("Starting Crisis Unleashed Backend...")

    # Determine if we should fail fast based on environment
    fail_fast = os.environ.get("ENVIRONMENT", "development") != "development"
    
    try:
        # 1. Initialize blockchain service
        logger.info("Initializing blockchain service...")
        blockchain_config = settings.get_blockchain_config()
        blockchain_service = BlockchainService(blockchain_config)
        
        # Register blockchain service for health monitoring
        health_manager.register_service(
            name="blockchain_service",
            service_instance=blockchain_service,
            health_check_func=blockchain_service.health_check,
            is_critical=True  # Blockchain service is critical
        )

        # 2. Initialize outbox processor
        logger.info("Initializing outbox processor...")
        outbox_config = settings.get_outbox_config()
        outbox_processor = OutboxProcessor(
            db=db,
            blockchain_service=blockchain_service,
            processing_interval=outbox_config["processing_interval"],
            max_entries_per_batch=outbox_config["max_batch_size"],
        )
        
        # Register outbox processor for health monitoring
        health_manager.register_service(
            name="outbox_processor", 
            service_instance=outbox_processor,
            health_check_func=outbox_processor.get_health_status,
            is_critical=True,  # Outbox processor is critical for blockchain operations
            dependencies=["blockchain_service"]  # Depends on blockchain service
        )

        # 3. Initialize all services with dependency management
        logger.info("Initializing services with health manager...")
        init_results = await health_manager.initialize_services(fail_fast=fail_fast)
        
        # 4. Start outbox processor background processing
        await outbox_processor.start()
        logger.info("Outbox processor background processing started")
        
        # Log initialization summary
        logger.info("=" * 60)
        logger.info("SERVICE INITIALIZATION SUMMARY")
        logger.info("=" * 60)
        logger.info(f"✅ Successful: {', '.join(init_results['successful'])}")
        if init_results['failed']:
            logger.warning(f"❌ Failed: {', '.join(init_results['failed'])}")
        if init_results['critical_failures']:
            logger.error(f"💥 Critical failures: {', '.join(init_results['critical_failures'])}")
        logger.info("=" * 60)

        logger.info("🚀 Crisis Unleashed Backend started successfully!")

    except CriticalServiceException as e:
        # Critical service failed - this should fail startup
        logger.critical("=" * 60)
        logger.critical("💥 CRITICAL SERVICE INITIALIZATION FAILURE")
        logger.critical("=" * 60)
        logger.critical(f"Error: {e}")
        logger.critical("Application cannot continue without critical services.")
        logger.critical("Check your configuration and external service connectivity.")
        logger.critical("=" * 60)
        
        # Force exit the application
        sys.exit(1)
        
    except Exception as e:
        # Unexpected initialization error
        logger.critical(f"💥 Unexpected error during service initialization: {e}")
        
        if fail_fast:
            logger.critical("Failing fast due to unexpected initialization error")
            sys.exit(1)
        else:
            logger.warning("Continuing startup despite initialization error (development mode)")


@app.on_event("shutdown")
async def shutdown_event() -> None:
    """Cleanup on application shutdown."""
    global outbox_processor, health_manager

    logger.info("Shutting down Crisis Unleashed Backend...")

    try:
        # Stop health monitoring
        await health_manager.stop_health_monitoring()
        logger.info("Health monitoring stopped")

        # Stop outbox processor
        if outbox_processor:
            await outbox_processor.stop()
            logger.info("Outbox processor stopped")

        # Close database connection
        client.close()
        logger.info("Database connection closed")

        logger.info("🛑 Crisis Unleashed Backend shut down successfully!")

    except Exception as e:
        logger.error(f"Error during shutdown: {e}")


# Add health check endpoint
@api_router.get("/health")
async def health_check() -> JSONResponse:
    """
    Application health check endpoint.
    
    Returns detailed health status of all services.
    """
    try:
        health_status = await health_manager.get_health_status()
        
        # Determine HTTP status code based on overall health
        if health_status["overall_status"] == "healthy":
            status_code = 200
        elif health_status["overall_status"] == "degraded":
            status_code = 200  # Still accepting requests
        else:
            status_code = 503  # Service unavailable
        
        return JSONResponse(
            status_code=status_code,
            content={
                "status": health_status["overall_status"],
                "timestamp": health_status["last_health_check"],
                "services": health_status["services"],
                "critical_issues": health_status["critical_issues"],
                "version": "1.0.0"
            }
        )
    
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error": "Health check failed",
                "detail": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )


# Add service status endpoint  
@api_router.get("/services/status")
async def get_service_status() -> dict[str, Any]:
    """Get detailed status of individual services."""
    try:
        return await health_manager.get_health_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get service status: {e}")