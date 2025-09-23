"""
Application lifecycle management.

Handles startup and shutdown procedures with proper error handling and logging.
"""

import logging
import os
from contextlib import asynccontextmanager
from typing import Any, List

from fastapi import FastAPI

logger = logging.getLogger(__name__)


class StartupError(RuntimeError):
    """Raised when a critical service fails during startup."""
    pass


class LifecycleManager:
    """Manages application lifecycle events with proper error handling."""

    def __init__(self, health_manager: Any, blockchain_service: Any,
                 outbox_processor: Any, db: Any):
        self.health_manager = health_manager
        self.blockchain_service = blockchain_service
        self.outbox_processor = outbox_processor
        self.db = db

    async def startup(self, fail_fast: bool = True) -> None:
        """
        Handle application startup.

        Args:
            fail_fast: Whether to fail immediately on service errors
        """
        logger.info("Starting Crisis Unleashed Backend...")

        try:
            # Import here to avoid circular imports
            from backend.server_modules.services import start_services

            # Start all services
            await start_services(
                blockchain_service=self.blockchain_service,
                outbox_processor=self.outbox_processor,
                health_manager=self.health_manager,
                fail_fast=fail_fast,
            )

            logger.info("🚀 Crisis Unleashed Backend started successfully!")

        except Exception as e:
            self._handle_startup_error(e, fail_fast)

    def _handle_startup_error(self, error: Exception, fail_fast: bool) -> None:
        """Handle startup errors consistently."""
        # Import here to avoid circular imports
        from backend.services.health_manager import CriticalServiceException

        if isinstance(error, CriticalServiceException):
            # Critical service failed - this should fail startup in production
            logger.critical("=" * 60)
            logger.critical("💥 CRITICAL SERVICE INITIALIZATION FAILURE")
            logger.critical("=" * 60)
            logger.critical(f"Error: {error}")
            logger.critical(
                "Application cannot continue without critical services."
            )
            logger.critical(
                "Check your configuration and external service connectivity."
            )
            logger.critical("=" * 60)

            if fail_fast:
                raise StartupError(f"Critical service initialization failed: {error}")

        else:
            # Unexpected initialization error
            logger.critical(f"💥 Unexpected error during service initialization: {error}")

            if fail_fast:
                logger.critical("Failing fast due to unexpected initialization error")
                raise StartupError(
                    f"Unexpected error during service initialization: {error}"
                )
            else:
                logger.warning("Continuing startup despite initialization error (development mode)")

    async def shutdown(self) -> None:
        """Handle application shutdown with comprehensive error tracking."""
        logger.info("Shutting down Crisis Unleashed Backend...")

        # Store exceptions to report all at once if multiple failures occur
        shutdown_exceptions = []

        # Define shutdown sequence with proper dependencies
        shutdown_tasks = [
            ("health manager", self._stop_health_manager),
            ("outbox processor", self._stop_outbox_processor),
            ("database", self._close_database),
        ]

        # Execute shutdown tasks in sequence
        for service_name, shutdown_func in shutdown_tasks:
            try:
                await shutdown_func()
                logger.info(f"{service_name.title()} stopped successfully")
            except Exception as e:
                error_msg = f"Error stopping {service_name}: {e}"
                shutdown_exceptions.append(error_msg)
                logger.error(error_msg)

        # Log summary
        if shutdown_exceptions:
            logger.warning(f"Shutdown completed with {len(shutdown_exceptions)} errors")
            for error in shutdown_exceptions:
                logger.warning(f"  - {error}")
        else:
            logger.info("Shutdown completed successfully")

    async def _stop_health_manager(self) -> None:
        """Stop health monitoring service."""
        if self.health_manager:
            await self.health_manager.stop()

    async def _stop_outbox_processor(self) -> None:
        """Stop outbox processor service."""
        if self.outbox_processor:
            await self.outbox_processor.stop()

    async def _close_database(self) -> None:
        """Close database connection."""
        if not self.db:
            return

        if hasattr(self.db, 'close'):
            # Check if it's not an in-memory database
            is_in_memory = (
                hasattr(self.db, 'outbox')
                and hasattr(self.db.outbox, '__class__')
                and 'InMemoryCollection' in self.db.outbox.__class__.__name__
            )
            if not is_in_memory:
                await self.db.close()
                logger.debug("Database connection closed")
            else:
                logger.debug("In-memory database detected, skipping close()")
        else:
            logger.debug("Database object has no close() method, skipping")


def create_lifespan_handler(health_manager: Any, blockchain_service: Any,
                          outbox_processor: Any, db: Any):
    """
    Create a lifespan context manager for the FastAPI application.

    Args:
        health_manager: Health monitoring service
        blockchain_service: Blockchain service
        outbox_processor: Transaction outbox processor
        db: Database connection

    Returns:
        Async context manager for application lifespan
    """
    lifecycle_manager = LifecycleManager(
        health_manager, blockchain_service, outbox_processor, db
    )

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        """Lifespan context manager for startup and shutdown events."""
        # Determine if we should fail fast based on environment
        environment = os.environ.get("ENVIRONMENT", "development")
        fail_fast = environment != "development"

        # Startup
        await lifecycle_manager.startup(fail_fast=fail_fast)

        yield

        # Shutdown
        await lifecycle_manager.shutdown()

    return lifespan