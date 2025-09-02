# c:\Users\smitj\repos\crisis-unleashed-app\crisis-unleashed-app\backend\server_modules\health.py
"""
Health Endpoints Module

This module provides health check endpoints for monitoring the application status.
"""

import logging
import inspect
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from fastapi.concurrency import run_in_threadpool
from typing import Any, Dict, Protocol

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

    @api_router.get(
        "/health/services",
        tags=["health"],
        status_code=200,
        responses={503: {"description": "Service Unavailable"}},
    )
    async def get_service_status():
        """
        Get detailed health status for all services.

        Returns:
            Dict containing service health information or JSONResponse for errors
        """
        try:
            # Offload sync work to a thread; await if the method is async.
            if inspect.iscoroutinefunction(health_manager.get_health_status):
                services = await health_manager.get_health_status()
            else:
                services = await run_in_threadpool(health_manager.get_health_status)
            return {"status": "ok", "services": services}
        except Exception:
            logger.exception("Failed to retrieve service health status")
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={
                    "status": "degraded",
                    "services": {},
                    "error": "Failed to retrieve service health",
                },
            )
