"""
API package for HTTP endpoints.

This package contains FastAPI routers and endpoint definitions for the
Crisis Unleashed backend API. It provides the HTTP interface for external
clients to interact with the application.
"""

from fastapi import APIRouter
from .blockchain_endpoints import router as _blockchain_router

# Explicit type annotation for mypy to resolve the exported symbol type
blockchain_router: APIRouter = _blockchain_router

__all__ = [
    "blockchain_router"
]

# Version info
__version__ = "1.0.0"