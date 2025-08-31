"""
Dependency injection for blockchain API endpoints.
"""

import logging
from fastapi import Depends, HTTPException, Request
from typing import Any

from backend.services.health_manager import ServiceHealthManager, CriticalServiceException

logger = logging.getLogger(__name__)


async def get_health_manager(request: Request) -> ServiceHealthManager:
    """Dependency to get the health manager from the app state."""
    # This assumes the health_manager is attached to the app state
    # In server.py, typically as app.state.health_manager
    from backend.server import health_manager
    return health_manager


async def get_blockchain_service(health_manager: ServiceHealthManager = Depends(get_health_manager)) -> Any:
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
                "service_status": str(e)
            }
        )


async def get_outbox_processor(
    health_manager: ServiceHealthManager = Depends(get_health_manager),
) -> Any:
    """Dependency to get outbox processor with availability check."""
    try:
        return health_manager.get_service("outbox_processor")
    except (KeyError, RuntimeError) as e:
        logger.error("Outbox processor not available: %s", e)
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Outbox processor unavailable",
                "message": (
                    "The transaction processing service is not available. "
                    "Please try again later."
                ),
                "service_status": str(e),
            }
        )
