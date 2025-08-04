"""
Crisis Unleashed Backend Package.

This is the main backend package for Crisis Unleashed, a strategic digital
collectible card game. The backend provides APIs for game management,
blockchain integration, and user operations.

Architecture:
- api/: HTTP endpoints and FastAPI routers
- repository/: Data access layer and database operations  
- services/: Business logic and service layer
- src/: Additional source code and utilities

Key Features:
- Transaction outbox pattern for blockchain consistency
- RESTful API endpoints
- MongoDB data persistence
- Blockchain integration (Etherlink, Ethereum)
"""

# Package metadata
__title__ = "Crisis Unleashed Backend"
__version__ = "1.0.0" 
__author__ = "Crisis Unleashed Team"
__description__ = "Backend API for Crisis Unleashed card game"

# Main package imports
from . import api
from . import repository
from . import services

__all__ = [
    "api",
    "repository", 
    "services"
]