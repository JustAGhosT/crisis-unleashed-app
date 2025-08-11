"""
Service Dependency Middleware

Ensures services are available before processing requests that depend on them.
"""
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Optional, Awaitable, Callable
from starlette.types import ASGIApp
from starlette.responses import Response
import logging

from ..services.health_manager import ServiceHealthManager, CriticalServiceException

logger = logging.getLogger(__name__)


class ServiceDependencyMiddleware(BaseHTTPMiddleware):
    """
    Middleware to check service availability before processing requests.
    
    This middleware ensures that endpoints don't receive requests when
    their required services are unavailable, providing clear error messages.
    """
    
    def __init__(self, app: ASGIApp, health_manager: ServiceHealthManager):
        super().__init__(app)
        self.health_manager = health_manager
        
        # Map of URL patterns to required services
        self.service_requirements = {
            "/api/blockchain/": ["blockchain_service"],
            "/api/blockchain/mint": ["blockchain_service", "outbox_processor"],
            "/api/blockchain/transfer": ["blockchain_service", "outbox_processor"],
            "/api/blockchain/status/": ["outbox_processor"],
            "/api/blockchain/operations": ["outbox_processor"],
            "/api/blockchain/health": ["blockchain_service", "outbox_processor"],
        }
    
    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        """Check service dependencies before processing request."""
        
        # Skip health check endpoints to avoid circular dependencies
        if request.url.path.endswith("/health") or request.url.path == "/api/health":
            return await call_next(request)
        
        # Check if this endpoint requires specific services
        required_services = self._get_required_services(request.url.path)
        
        if required_services:
            try:
                # Check each required service
                for service_name in required_services:
                    await self.health_manager.check_service_availability(
                        service_name, required=True
                    )
            
            except CriticalServiceException as e:
                logger.warning(f"Service dependency check failed for {request.url.path}: {e}")
                
                return JSONResponse(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    content={
                        "error": "Service Unavailable",
                        "detail": f"Required services are not available: {', '.join(required_services)}",
                        "message": "Please try again later or check system status",
                        "required_services": required_services,
                        "path": request.url.path
                    }
                )
        
        # All dependencies satisfied, continue with request
        return await call_next(request)
    
    def _get_required_services(self, path: str) -> list[str]:
        """Get list of services required for the given path."""
        required = set()
        
        for pattern, services in self.service_requirements.items():
            if path.startswith(pattern):
                required.update(services)
        
        return list(required)