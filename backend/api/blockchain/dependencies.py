"""
Dependency functions for blockchain API endpoints.
"""

from fastapi import Request, HTTPException, Depends
from typing import Any
import logging

from ...services.health_manager import ServiceHealthManager, CriticalServiceException

logger = logging.getLogger(__name__)


async def get_health_manager(request: Request) -> ServiceHealthManager:
    """Dependency to get the health manager from the app state."""
    if not hasattr(request.app.state, "health_manager"):
        logger.error("Health manager not initialized in application state")
        raise HTTPException(
            status_code=503, detail="Health manager service not initialized"
        )
    health_manager = request.app.state.health_manager
    if not isinstance(health_manager, ServiceHealthManager):
        logger.error(f"Expected ServiceHealthManager, got {type(health_manager)}")
        raise HTTPException(
            status_code=503, detail="Invalid health manager service type"
        )
    return health_manager


async def get_blockchain_service(
    health_manager: ServiceHealthManager = Depends(get_health_manager),
) -> Any:
    """Dependency to get blockchain service with availability check."""
    try:
        return health_manager.get_service("blockchain_service")
    except CriticalServiceException as e:
        logger.error(f"Blockchain service not available: {e}")
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Blockchain service unavailable",
                "message": "The blockchain service is not available. Please try again later.",
                "service_status": str(e),
            },
        )


async def get_outbox_processor(
    health_manager: ServiceHealthManager = Depends(get_health_manager),
) -> Any:
    """Dependency to get outbox processor with availability check."""
    try:
        return health_manager.get_service("outbox_processor")
    except CriticalServiceException as e:
        logger.error(f"Outbox processor not available: {e}")
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Outbox processor unavailable",
                "message": (
                    "The transaction processing service is not available. "
                    "Please try again later."
                ),
                "service_status": str(e),
            },
        )
