# c:\Users\smitj\repos\crisis-unleashed-app\crisis-unleashed-app\backend\server_modules\health.py
"""
Health Endpoints Module

This module provides health check endpoints for monitoring the application status.
"""

import logging
from fastapi import APIRouter
from typing import Any, Dict

from backend.config.settings import Settings


logger = logging.getLogger(__name__)

def register_health_endpoints(
    api_router: APIRouter, health_manager: Any, settings: Settings
):
    """
    Register health-related endpoints to the provided router.

    Args:
        api_router: FastAPI router to add endpoints to
        health_manager: Service health manager instance
        settings: Application settings instance
    """

    @api_router.get("/health", tags=["health"])
    async def health_check() -> Dict[str, str]:
        """
        Basic health check endpoint.

        Returns:
            Dict containing status information
        """
        return {"status": "ok", "version": settings.app_version}

    @api_router.get("/health/services", tags=["health"])
    async def get_service_status() -> Dict[str, Any]:
        """
        Get detailed health status for all services.

        Returns:
            Dict containing service health information
        """
        try:
            return {
                "status": "ok",
                "services": health_manager.get_health_status(),
            }
        except Exception as e:
            logger.error(f"Failed to retrieve service health status: {e}")
            return {
                "status": "degraded",
                "services": {},
                "error": "Failed to retrieve service health",
            }