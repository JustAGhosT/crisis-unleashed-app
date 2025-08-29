"""
API Module for Crisis Unleashed Backend

This module exposes all API routers used in the application.
"""

from fastapi import APIRouter

# Import all API routers
from .blockchain.router import router as blockchain_router
from .auth_redirects import auth_redirect_router

# Re-export routers for use in server.py
__all__ = ["blockchain_router", "auth_redirect_router"]
