"""
Crisis Unleashed Backend Server

🔐 SETUP REQUIRED: Before running this server:
1. Copy .env.example to .env
2. Replace SECRET_KEY placeholder with secure key: python generate_secret_key.py
3. Configure database and other settings in .env

See SETUP.md for detailed instructions.
"""

import logging
import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI

# Configure logging early
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Add the project root to the Python path to enable absolute imports
ROOT_DIR = Path(__file__).parent
REPO_ROOT = ROOT_DIR.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

# Load environment variables from repository root
load_dotenv(REPO_ROOT / ".env")

# Define custom exception for startup failures
class StartupError(RuntimeError):
    """Raised when a critical service fails during startup."""
    pass

# Import our modular server components (absolute imports rooted at 'backend')
try:
    from backend import api, config
    from backend import services as services

    # Import auth redirects
    from backend.api.auth_redirects import auth_redirect_router
    from backend.api.card_endpoints import router as card_router
    from backend.api.deck_endpoints import router as deck_router
    from backend.api.deck_share_endpoints import router as deck_share_router
    from backend.api.realtime_ws import router as realtime_router
    from backend.api.metrics_endpoints import router as metrics_router

    # Import server modules correctly based on the actual structure
    from backend.server_modules.app import create_application
    from backend.server_modules.database import setup_database
    from backend.server_modules.health import register_health_endpoints
    from backend.server_modules.services import setup_services, start_services
except ImportError as e:
    logger.critical(f"Failed to import required modules: {e}")
    logger.critical(
        "Please ensure all dependencies are installed: pip install -r requirements.txt"
    )
    sys.exit(1)

# Load settings
settings = config.get_settings()

# Create health manager
health_manager = services.health_manager.ServiceHealthManager()

# Set up database connection
db = setup_database(settings)

# Initialize services
blockchain_service, outbox_processor = setup_services(
    settings=settings,
    db=db,
    health_manager=health_manager
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup
    logger.info("Starting Crisis Unleashed Backend...")

    # Determine if we should fail fast based on environment
    environment = os.environ.get("ENVIRONMENT", "development")
    fail_fast = environment != "development"

    try:
        # Start all services
        await start_services(
            blockchain_service=blockchain_service,
            outbox_processor=outbox_processor,
            health_manager=health_manager,
            fail_fast=fail_fast,
        )

        logger.info("🚀 Crisis Unleashed Backend started successfully!")

    except services.health_manager.CriticalServiceException as e:
        # Critical service failed - this should fail startup in production
        logger.critical("=" * 60)
        logger.critical("💥 CRITICAL SERVICE INITIALIZATION FAILURE")
        logger.critical("=" * 60)
        logger.critical(f"Error: {e}")
        logger.critical(
            "Application cannot continue without critical services."
        )
        logger.critical(
            "Check your configuration and external service connectivity."
        )
        logger.critical("=" * 60)

        # Raise an exception instead of exiting the process
        if fail_fast:
            raise StartupError(f"Critical service initialization failed: {e}")
        # In development mode, continue despite the error

    except Exception as e:
        # Unexpected initialization error
        logger.critical(f"💥 Unexpected error during service initialization: {e}")

        if fail_fast:
            logger.critical("Failing fast due to unexpected initialization error")
            # Raise an exception instead of exiting the process
            raise StartupError(
                f"Unexpected error during service initialization: {e}"
            )
        else:
            logger.warning("Continuing startup despite initialization error (development mode)")

    yield

    # Shutdown
    logger.info("Shutting down Crisis Unleashed Backend...")

    try:
        # Stop health monitoring
        if health_manager:
            await health_manager.stop()
            logger.info("Health monitoring stopped")
    except Exception as e:
        logger.error(f"Error stopping health manager: {e}")

    try:
        # Stop outbox processor
        if outbox_processor:
            await outbox_processor.stop()
            logger.info("Outbox processor stopped")
    except Exception as e:
        logger.error(f"Error stopping outbox processor: {e}")

    try:
        # Close database connection only if it's a real database connection
        if db and hasattr(db, 'close'):
            # Check if it's not an in-memory database
            is_in_memory = (
                hasattr(db, 'outbox')
                and hasattr(db.outbox, '__class__')
                and 'InMemoryCollection' in db.outbox.__class__.__name__
            )
            if not is_in_memory:
                await db.close()
                logger.info("Database connection closed")
            else:
                logger.info("In-memory database detected, skipping close()")
        elif db:
            logger.info("Database object has no close() method, skipping")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

# Create the FastAPI application
app = create_application(
    settings=settings,
    blockchain_router=api.blockchain_router,
    health_manager=health_manager,
    db=db,
    lifespan=lifespan
)

# Create a new API router for health endpoints
api_router = APIRouter(prefix="/api")
register_health_endpoints(api_router, health_manager, settings=settings)

# Include the health router in the main app
app.include_router(api_router)

# Include the auth redirects router in the main app (no prefix)
app.include_router(auth_redirect_router)

# Include deck sharing endpoints
app.include_router(deck_share_router)

# Include realtime WebSocket endpoint
app.include_router(realtime_router)

# Include metrics endpoints
app.include_router(metrics_router)


# Include deck CRUD endpoints
app.include_router(deck_router)

# Include card endpoints
app.include_router(card_router)




# Direct execution entry point
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8010))
    host = os.environ.get("HOST", "0.0.0.0")
    logger.info(f"Starting server on {host}:{port}...")
    uvicorn.run("server:app", host=host, port=port, reload=True)
