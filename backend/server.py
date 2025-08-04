from fastapi import FastAPI, APIRouter, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

# Import routers and configuration
from .api import blockchain_router
from .config import get_settings
from .services import BlockchainService
from .workers import OutboxProcessor


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Load settings
settings = get_settings()

# MongoDB connection
client = AsyncIOMotorClient(settings.mongo_url)
db = client[settings.database_name]

# Global services (will be initialized on startup)
blockchain_service: Optional[BlockchainService] = None
outbox_processor: Optional[OutboxProcessor] = None

# Create the main app without a prefix
app = FastAPI()

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
async def create_status_check(input: StatusCheckCreate):
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

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    """Initialize services on application startup."""
    global blockchain_service, outbox_processor

    logger.info("Starting Crisis Unleashed Backend...")

    try:
        # Initialize blockchain service
        blockchain_config = settings.get_blockchain_config()
        blockchain_service = BlockchainService(blockchain_config)

        # Initialize blockchain providers
        init_results = await blockchain_service.initialize()
        logger.info(f"Blockchain initialization results: {init_results}")

        # Initialize outbox processor
        outbox_config = settings.get_outbox_config()
        outbox_processor = OutboxProcessor(
            db=db,
            blockchain_service=blockchain_service,
            processing_interval=outbox_config["processing_interval"],
            max_entries_per_batch=outbox_config["max_batch_size"],
        )

        # Start background processing
        await outbox_processor.start()
        logger.info("Outbox processor started")

        logger.info("Crisis Unleashed Backend started successfully!")

    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        # Don't fail startup, but log the error


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown."""
    global outbox_processor

    logger.info("Shutting down Crisis Unleashed Backend...")

    try:
        # Stop outbox processor
        if outbox_processor:
            await outbox_processor.stop()
            logger.info("Outbox processor stopped")

        # Close database connection
        client.close()
        logger.info("Database connection closed")

        logger.info("Crisis Unleashed Backend shut down successfully!")

    except Exception as e:
        logger.error(f"Error during shutdown: {e}")
