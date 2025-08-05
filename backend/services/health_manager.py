"""
Service Health Management for Critical Services

Provides health checking, dependency validation, and fail-fast behavior
for critical application services like blockchain and outbox processing.
"""
import logging
from typing import Any, Dict, List, Optional, Callable
from datetime import datetime, timedelta
import asyncio
from enum import Enum

logger = logging.getLogger(__name__)


class ServiceStatus(str, Enum):
    """Service status enumeration."""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"
    INITIALIZING = "initializing"


class ServiceInfo:
    """Information about a service and its health status."""
    def __init__(
        self,
        name: str,
        service_instance: Any,
        health_check_func: Optional[Callable] = None,
        is_critical: bool = False,
        dependencies: Optional[List[str]] = None
    ):
        self.name = name
        self.service_instance = service_instance
        self.health_check_func = health_check_func
        self.is_critical = is_critical
        self.dependencies = dependencies or []
        self.status: ServiceStatus = ServiceStatus.UNKNOWN
        self.last_check: Optional[datetime] = None
        self.last_error: Optional[str] = None
        self.initialization_time: Optional[timedelta] = None


class CriticalServiceException(Exception):
    """Exception raised when critical services fail to initialize or become unhealthy."""
    pass


class ServiceHealthManager:
    """
    Manages the health and lifecycle of application services.
    
    Features:
    - Fail-fast initialization for critical services
    - Continuous health monitoring
    - Dependency validation
    - Service availability checks for requests
    """
    def __init__(self):
        self.services: Dict[str, ServiceInfo] = {}
        self.health_check_interval = 30  # seconds
        self._health_check_task: Optional[asyncio.Task] = None
        self._is_monitoring = False

    def register_service(self, 
                        name: str, 
                        service_instance: Any,
                        health_check_func: Optional[Callable] = None,
                        is_critical: bool = False,
                        dependencies: Optional[List[str]] = None) -> None:
        """
        Register a service for health monitoring.
        Args:
            name: Unique service name
            service_instance: The service instance
            health_check_func: Function to call for health checks
            is_critical: Whether service failure should fail the application
            dependencies: List of service names this service depends on
        """
        self.services[name] = ServiceInfo(
            name=name,
            service_instance=service_instance,
            health_check_func=health_check_func,
            is_critical=is_critical,
            dependencies=dependencies
        )
        logger.info(f"Registered service: {name} (critical: {is_critical})")

    async def initialize_services(self, fail_fast: bool = True) -> Dict[str, List[str]]:
        """
        Initialize all registered services with proper dependency ordering.
        Args:
            fail_fast: Whether to raise an exception for critical service failures
        Returns:
            Dictionary with initialization results
        Raises:
            CriticalServiceException: If critical services fail and fail_fast is True
        """
        results: Dict[str, List[str]] = {
            "successful": [],
            "failed": [],
            "critical_failures": []
        }

        # Sort services by dependencies (simple topological sort)
        ordered_services = self._get_dependency_order()
        for service_name in ordered_services:
            service_info = self.services[service_name]
            try:
                logger.info(f"Initializing service: {service_name}")
                service_info.status = ServiceStatus.INITIALIZING
                start_time = datetime.utcnow()

                # Check if service has an initialize method
                if hasattr(service_info.service_instance, 'initialize'):
                    init_result = await service_info.service_instance.initialize()

                    # For blockchain service, check if any networks initialized successfully
                    if service_name == "blockchain_service" and isinstance(init_result, dict):
                        successful_networks = [k for k, v in init_result.items() if v]
                        if not successful_networks and service_info.is_critical:
                            raise CriticalServiceException(
                                f"No blockchain networks initialized successfully: {init_result}"
                            )
                        logger.info(f"Blockchain networks initialized: {successful_networks}")

                # Perform initial health check
                await self._check_service_health(service_info)

                if service_info.status == ServiceStatus.UNHEALTHY and service_info.is_critical:
                    raise CriticalServiceException(f"Critical service {service_name} failed health check")

                service_info.initialization_time = datetime.utcnow() - start_time
                service_info.status = ServiceStatus.HEALTHY
                results["successful"].append(service_name)

                logger.info(f"Successfully initialized {service_name} in {service_info.initialization_time}")
            except Exception as e:
                service_info.status = ServiceStatus.UNHEALTHY
                service_info.last_error = str(e)
                results["failed"].append(service_name)
                error_msg = f"Failed to initialize service {service_name}: {e}"
                logger.error(error_msg)
                if service_info.is_critical:
                    results["critical_failures"].append(service_name)
                    if fail_fast:
                        raise CriticalServiceException(
                            f"Critical service initialization failed: {service_name}. {error_msg}"
                        ) from e
                    else:
                        logger.critical(f"Critical service {service_name} failed but continuing startup")
        # Start health monitoring if initialization was successful
        if not results["critical_failures"]:
            await self.start_health_monitoring()
        return results

    async def check_service_availability(self, service_name: str, required: bool = True) -> bool:
        """
        Check if a service is available for use.
        Args:
            service_name: Name of the service to check
            required: Whether to raise an exception if unavailable
        Returns:
            True if service is available
        Raises:
            CriticalServiceException: If service is required but unavailable
        """
        if service_name not in self.services:
            if required:
                raise CriticalServiceException(f"Service {service_name} not registered")
            return False

        service_info = self.services[service_name]
        if service_info.status not in [ServiceStatus.HEALTHY, ServiceStatus.DEGRADED]:
            error_msg = f"Service {service_name} is not available (status: {service_info.status})"
            if service_info.last_error:
                error_msg += f". Last error: {service_info.last_error}"
            if required:
                raise CriticalServiceException(error_msg)
            return False
        return True

    def get_service(self, service_name: str) -> Any:
        """
        Get a service instance with availability check.
        Args:
            service_name: Name of the service
        Returns:
            The service instance
        Raises:
            CriticalServiceException: If service is not available
        """
        # check_service_availability is async, so it shouldn't be used synchronously here.
        # Correct approach - move check to async context or rework signature for usage pattern.
        # For now we forcefully block. (best: refactor elsewhere to async usage)
        loop = asyncio.get_event_loop()
        available = loop.run_until_complete(self.check_service_availability(service_name, required=True))
        if not available:
            raise CriticalServiceException(f"Service {service_name} is not available")
        return self.services[service_name].service_instance

    async def get_health_status(self) -> Dict[str, Any]:
        """Get overall health status of all services."""
        overall_status = ServiceStatus.HEALTHY
        service_statuses = {}
        critical_issues = []
        for name, service_info in self.services.items():
            service_statuses[name] = {
                "status": service_info.status.value,
                "is_critical": service_info.is_critical,
                "last_check": service_info.last_check.isoformat() if service_info.last_check else None,
                "last_error": service_info.last_error,
                "initialization_time": str(service_info.initialization_time) if service_info.initialization_time else None,
                "dependencies": service_info.dependencies
            }
            if service_info.status == ServiceStatus.UNHEALTHY:
                if service_info.is_critical:
                    overall_status = ServiceStatus.UNHEALTHY
                    critical_issues.append(name)
                elif overall_status == ServiceStatus.HEALTHY:
                    overall_status = ServiceStatus.DEGRADED
        return {
            "overall_status": overall_status.value,
            "services": service_statuses,
            "critical_issues": critical_issues,
            "monitoring_enabled": self._is_monitoring,
            "last_health_check": datetime.utcnow().isoformat()
        }

    async def start_health_monitoring(self) -> None:
        """Start background health monitoring."""
        if self._is_monitoring:
            logger.warning("Health monitoring already started")
            return
        self._is_monitoring = True
        self._health_check_task = asyncio.create_task(self._health_monitoring_loop())
        logger.info("Health monitoring started")

    async def stop_health_monitoring(self) -> None:
        """Stop background health monitoring."""
        if not self._is_monitoring:
            return
        self._is_monitoring = False
        if self._health_check_task:
            self._health_check_task.cancel()
            try:
                await self._health_check_task
            except asyncio.CancelledError:
                pass
        logger.info("Health monitoring stopped")

    async def _health_monitoring_loop(self) -> None:
        """Background health monitoring loop."""
        logger.info(f"Starting health monitoring loop (interval: {self.health_check_interval}s)")
        while self._is_monitoring:
            try:
                await self._check_all_services()
                await asyncio.sleep(self.health_check_interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in health monitoring loop: {e}")
                await asyncio.sleep(self.health_check_interval)

    async def _check_all_services(self) -> None:
        """Check health of all registered services."""
        for service_info in self.services.values():
            try:
                await self._check_service_health(service_info)
            except Exception as e:
                logger.error(f"Error checking health of {service_info.name}: {e}")
                service_info.status = ServiceStatus.UNHEALTHY
                service_info.last_error = str(e)

    async def _check_service_health(self, service_info: ServiceInfo) -> None:
        """Check health of a single service."""
        try:
            service_info.last_check = datetime.utcnow()
            if service_info.health_check_func:
                if asyncio.iscoroutinefunction(service_info.health_check_func):
                    health_result = await service_info.health_check_func()
                else:
                    health_result = service_info.health_check_func()
                # Interpret health check result
                if isinstance(health_result, dict):
                    # Assume healthy if no explicit status
                    status = health_result.get("status", "healthy")
                    if status in ["healthy", "ok", "up"]:
                        service_info.status = ServiceStatus.HEALTHY
                    elif status in ["degraded", "warning"]:
                        service_info.status = ServiceStatus.DEGRADED
                    else:
                        service_info.status = ServiceStatus.UNHEALTHY
                elif isinstance(health_result, bool):
                    service_info.status = ServiceStatus.HEALTHY if health_result else ServiceStatus.UNHEALTHY
                else:
                    service_info.status = ServiceStatus.HEALTHY
                service_info.last_error = None
            else:
                # No health check function, assume healthy if service exists
                if service_info.service_instance is not None:
                    service_info.status = ServiceStatus.HEALTHY
                else:
                    service_info.status = ServiceStatus.UNHEALTHY
                    service_info.last_error = "Service instance is None"
        except Exception as e:
            service_info.status = ServiceStatus.UNHEALTHY
            service_info.last_error = str(e)
            raise

    def _get_dependency_order(self) -> List[str]:
        """Get services in dependency order (simple topological sort)."""
        ordered = []
        visited = set()
        def visit(service_name: str):
            if service_name in visited:
                return
            service_info = self.services.get(service_name)
            if not service_info:
                return
            # Visit dependencies first
            for dep in service_info.dependencies:
                visit(dep)
            visited.add(service_name)
            ordered.append(service_name)
        # Start with services that have no dependencies
        for service_name in self.services:
            visit(service_name)
        return ordered