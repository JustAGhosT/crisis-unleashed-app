"""
Health Manager Service for Crisis Unleashed Backend

This module provides functionality to monitor the health of all services
and handle service dependencies properly.
"""

import asyncio
import logging
import time
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set

logger = logging.getLogger(__name__)


class ServiceStatus(Enum):
    """Status of a registered service."""

    UNKNOWN = "unknown"
    STARTING = "starting"
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    STOPPED = "stopped"


class CriticalServiceException(Exception):
    """Exception raised when a critical service fails to initialize."""

    pass


class ServiceInfo:
    """Information about a registered service."""

    def __init__(
        self,
        name: str,
        service_instance: Any,
        health_check_func: Optional[Callable] = None,
        is_critical: bool = False,
        dependencies: Optional[List[str]] = None,
    ):
        self.name = name
        self.service_instance = service_instance
        self.health_check_func = health_check_func
        self.is_critical = is_critical
        self.dependencies = dependencies or []
        self.status = ServiceStatus.UNKNOWN
        self.last_error: Optional[str] = None
        self.last_checked_at: Optional[float] = None


class ServiceHealthManager:
    """
    Manages health status of all registered services.

    This class allows registering services, checking their health status,
    and enforcing dependencies between services.
    """

    def __init__(self) -> None:
        self.services: Dict[str, ServiceInfo] = {}
        self._health_task: Optional[asyncio.Task] = None
        self._should_stop = asyncio.Event()
        self._check_interval = 30  # seconds

    def register_service(
        self,
        name: str,
        service_instance: Any,
        health_check_func: Optional[Callable] = None,
        is_critical: bool = False,
        dependencies: Optional[List[str]] = None,
    ) -> None:
        """
        Register a service to be monitored.

        Args:
            name: Name of the service
            service_instance: The service object
            health_check_func: Function to call to check service health
            is_critical: Whether this is a critical service that must be healthy
            dependencies: List of service names this service depends on
        """
        if name in self.services:
            logger.warning(f"Service {name} already registered, replacing")

        self.services[name] = ServiceInfo(
            name=name,
            service_instance=service_instance,
            health_check_func=health_check_func,
            is_critical=is_critical,
            dependencies=dependencies,
        )
        logger.info(f"Registered service: {name} (critical: {is_critical})")

    def get_service(self, service_name: str) -> Any:
        """Get a service instance by name."""
        if service_name not in self.services:
            raise KeyError(f"Service not registered: {service_name}")
        return self.services[service_name].service_instance

    def check_service_availability(
        self, service_name: str, required: bool = True
    ) -> bool:
        """
        Check if a service is available (registered and healthy).

        Args:
            service_name: Name of the service to check
            required: If True, raises an exception when service is not available

        Returns:
            bool: True if service is available

        Raises:
            KeyError: If service is not registered and required=True
        """
        if service_name not in self.services:
            if required:
                raise KeyError(f"Service not registered: {service_name}")
            return False

        service = self.services[service_name]
        is_available = service.status in (ServiceStatus.HEALTHY, ServiceStatus.DEGRADED)

        if required and not is_available:
            raise RuntimeError(
                f"Service {service_name} is not available. "
                f"Current status: {service.status.value}"
            )

        return is_available

    def get_health_status(self) -> Dict[str, Dict[str, Any]]:
        """
        Get health status for all registered services.

        Returns:
            Dict with service name as key and status information as value
        """
        result = {}
        for name, info in self.services.items():
            result[name] = {
                "status": info.status.value,
                "is_critical": info.is_critical,
                "last_error": info.last_error,
                "dependencies": info.dependencies,
            }
        return result

    def _get_dependency_order(self) -> List[str]:
        """
        Calculate the correct order to initialize services based on dependencies.

        Returns:
            List of service names in dependency order

        Raises:
            RuntimeError: If circular dependencies are detected
        """
        # Topological sort to determine initialization order
        visited: Set[str] = set()
        temp_visited: Set[str] = set()
        order: List[str] = []

        def visit(service_name: str) -> None:
            if service_name in temp_visited:
                # Circular dependency detected
                cycle = " -> ".join(list(temp_visited) + [service_name])
                raise RuntimeError(f"Circular dependency detected: {cycle}")

            if service_name not in visited:
                temp_visited.add(service_name)

                # Visit all dependencies first
                if service_name in self.services:
                    for dep in self.services[service_name].dependencies:
                        visit(dep)

                temp_visited.remove(service_name)
                visited.add(service_name)
                order.append(service_name)

        # Visit all services
        for name in self.services:
            if name not in visited:
                visit(name)

        # Reverse to get correct initialization order
        return list(reversed(order))

    async def initialize_services(self, fail_fast: bool = True) -> bool:
        """
        Initialize all registered services in the correct dependency order.

        Args:
            fail_fast: If True, raise exception on first critical service failure

        Returns:
            bool: True if all critical services initialized successfully

        Raises:
            CriticalServiceException: If a critical service fails and fail_fast=True
        """
        logger.info("Initializing services...")

        # Get services in dependency order
        try:
            service_order = self._get_dependency_order()
        except RuntimeError as e:
            logger.error(f"Failed to initialize services: {e}")
            if fail_fast:
                raise CriticalServiceException(f"Service dependency error: {e}")
            return False

        all_success = True

        # Initialize each service
        for name in service_order:
            service = self.services[name]
            logger.info(f"Initializing service: {name}")

            service.status = ServiceStatus.STARTING

            try:
                # Check dependencies first
                for dep_name in service.dependencies:
                    if dep_name not in self.services:
                        raise RuntimeError(f"Dependency not registered: {dep_name}")

                    dep = self.services[dep_name]
                    if dep.status != ServiceStatus.HEALTHY:
                        raise RuntimeError(
                            f"Dependency {dep_name} not healthy. "
                            f"Status: {dep.status.value}"
                        )

                # Initialize the service
                if hasattr(service.service_instance, "initialize"):
                    init_result = service.service_instance.initialize()

                    # Handle both synchronous and asynchronous initialize methods
                    if asyncio.iscoroutine(init_result):
                        await init_result

                # Check health immediately after initialization
                await self._check_service_health(service)

                if service.status != ServiceStatus.HEALTHY:
                    raise RuntimeError(
                        f"Service health check failed after initialization. "
                        f"Status: {service.status.value}"
                    )

                logger.info(f"Service initialized successfully: {name}")

            except Exception as e:
                all_success = False
                logger.error(f"Failed to initialize service {name}: {e}")
                service.status = ServiceStatus.UNHEALTHY
                service.last_error = str(e)

                if service.is_critical and fail_fast:
                    raise CriticalServiceException(
                        f"Critical service {name} failed to initialize: {e}"
                    )

        return all_success

    async def _check_service_health(self, service_info: ServiceInfo) -> ServiceStatus:
        """
        Check health of a specific service.

        Args:
            service_info: The service to check

        Returns:
            Updated service status
        """
        if not service_info.health_check_func:
            # No health check function, assume healthy
            service_info.status = ServiceStatus.HEALTHY
            # Clear any previous error when healthy
            service_info.last_error = None
            service_info.last_checked_at = time.time()
            return service_info.status

        try:
            # Check if the function is a coroutine function and call appropriately
            if asyncio.iscoroutinefunction(service_info.health_check_func):
                health_result = await service_info.health_check_func()
            else:
                health_result = service_info.health_check_func()

            # Update status based on health check result
            if health_result is True:
                service_info.status = ServiceStatus.HEALTHY
                service_info.last_error = None
            elif health_result is False:
                service_info.status = ServiceStatus.UNHEALTHY
                service_info.last_error = (
                    service_info.last_error
                    or "Reported unhealthy by health check"
                )
            elif isinstance(health_result, dict) and "status" in health_result:
                # Support for more detailed health checks (case-insensitive)
                status_str = str(health_result["status"]).lower()
                if status_str == "healthy":
                    service_info.status = ServiceStatus.HEALTHY
                    service_info.last_error = None
                elif status_str == "degraded":
                    service_info.status = ServiceStatus.DEGRADED
                    # Only set last_error if provided
                    if "error" in health_result:
                        service_info.last_error = health_result["error"]
                else:
                    service_info.status = ServiceStatus.UNHEALTHY
                    # Set error if provided, otherwise generic message
                    service_info.last_error = health_result.get(
                        "error",
                        f"Service reported status '{status_str}'",
                    )
            else:
                service_info.status = ServiceStatus.UNHEALTHY
                service_info.last_error = (
                    f"Unexpected health check result: {health_result}"
                )

        except Exception as e:
            logger.warning(f"Health check failed for {service_info.name}: {e}")
            service_info.status = ServiceStatus.UNHEALTHY
            service_info.last_error = str(e)

        # Update the timestamp
        service_info.last_checked_at = time.time()
        return service_info.status

    async def _check_all_services(self) -> Dict[str, ServiceStatus]:
        """
        Check health of all registered services.

        Returns:
            Dict mapping service names to their updated status
        """
        results = {}
        for name, info in self.services.items():
            results[name] = await self._check_service_health(info)
        return results

    async def _health_monitoring_loop(self) -> None:
        """Background task that periodically checks service health."""
        logger.info("Health monitoring started")

        while not self._should_stop.is_set():
            try:
                await self._check_all_services()
            except Exception as e:
                logger.error(f"Error in health monitoring loop: {e}")

            try:
                # Wait for the next check interval or until stop is requested
                await asyncio.wait_for(
                    self._should_stop.wait(), timeout=self._check_interval
                )
            except asyncio.TimeoutError:
                # This is expected when the timeout expires
                pass

        logger.info("Health monitoring stopped")

    async def start_health_monitoring(self) -> None:
        """Start the background health monitoring task."""
        if self._health_task is not None:
            logger.warning("Health monitoring already running")
            return

        self._should_stop.clear()
        self._health_task = asyncio.create_task(self._health_monitoring_loop())

    async def stop(self) -> None:
        """Stop the health monitoring task."""
        if self._health_task is None:
            return

        logger.info("Stopping health monitoring...")
        self._should_stop.set()

        try:
            await asyncio.wait_for(self._health_task, timeout=5.0)
        except asyncio.TimeoutError:
            logger.warning("Health monitoring task did not stop gracefully, cancelling")
            self._health_task.cancel()

        self._health_task = None

        # Mark all services as stopped
        for info in self.services.values():
            info.status = ServiceStatus.STOPPED
