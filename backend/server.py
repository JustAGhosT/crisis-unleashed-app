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

# StartupError is now imported from lifecycle module

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
    from backend.server_modules.services import setup_services
    from backend.server_modules.lifecycle import create_lifespan_handler
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

# Create lifespan handler using the new lifecycle manager
lifespan = create_lifespan_handler(
    health_manager=health_manager,
    blockchain_service=blockchain_service,
    outbox_processor=outbox_processor,
    db=db
)

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
