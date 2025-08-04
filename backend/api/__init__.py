"""
API package for HTTP endpoints.

This package contains FastAPI routers and endpoint definitions for the
Crisis Unleashed backend API. It provides the HTTP interface for external
clients to interact with the application.
"""

from .blockchain_endpoints import router as blockchain_router

__all__ = [
    "blockchain_router"
]

# Version info
__version__ = "1.0.0"