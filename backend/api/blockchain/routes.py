"""
Main router for blockchain API endpoints.

This file combines all blockchain-related routers into a single router
that can be imported by the main application.
"""

from fastapi import APIRouter

from .transaction_endpoints import router as transaction_router
from .status_endpoints import router as status_router
from .health_endpoints import router as health_router
from .stats_endpoints import router as stats_router

# Create main router with common prefix and tags
router = APIRouter(prefix="/blockchain", tags=["blockchain"])

# Include all sub-routers
router.include_router(transaction_router)
router.include_router(status_router)
router.include_router(health_router)
router.include_router(stats_router)