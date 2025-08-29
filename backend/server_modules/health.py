"""
Health Endpoints Module

This module provides health check endpoints for monitoring the application status.
"""

import logging
from fastapi import APIRouter
from typing import Any, Dict

logger = logging.getLogger(__name__)

def register_health_endpoints(api_router: APIRouter, health_manager: Any):
    """
    Register health-related endpoints to the provided router.

    Args:
        api_router: FastAPI router to add endpoints to
        health_manager: Service health manager instance
    """

    @api_router.get("/health", tags=["health"])
    async def health_check() -> Dict[str, str]:
        """
        Basic health check endpoint.

        Returns:
            Dict containing status information
        """
        return {
            "status": "ok",
            "version": "1.0.0"
        }

    @api_router.get("/health/services", tags=["health"])
    async def get_service_status() -> Dict[str, Any]:
        """
        Get detailed health status for all services.

        Returns:
            Dict containing service health information
        """
        return {
            "status": "ok",
            "services": health_manager.get_health_status()
        }
