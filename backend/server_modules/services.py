"""
Service Setup Module

This module provides functionality to set up and start application services.
"""

import logging
from typing import Any, Optional, Tuple

from backend.repository.transaction_outbox import TransactionOutboxRepository
from backend.services.blockchain_service import BlockchainService
from backend.services.blockchain_handler import BlockchainHandler

logger = logging.getLogger(__name__)

def setup_services(
    settings: Any,
    db: Any,
    health_manager: Any
) -> Tuple[Optional[Any], Optional[Any]]:
    """
    Set up and initialize all required services.

    Args:
        settings: Application settings
        db: Database connection
        health_manager: Service health manager

    Returns:
        Tuple containing (blockchain_service, outbox_processor)
    """
    # Initialize blockchain service
    try:
        logger.info("Setting up blockchain service...")
        blockchain_service = BlockchainService(
            network_configs=settings.get_blockchain_config()
        )

        # Register blockchain service with health manager
        health_manager.register_service(
            name="blockchain",
            service_instance=blockchain_service,
            health_check_func=blockchain_service.health_check,
            is_critical=True
        )

        logger.info("Blockchain service setup complete")
    except Exception as e:
        logger.error(f"Failed to set up blockchain service: {e}")
        blockchain_service = None

    # Initialize transaction outbox repository
    try:
        logger.info("Setting up transaction outbox repository...")
        outbox_repo = TransactionOutboxRepository(db)

        # Register outbox repository with health manager
        health_manager.register_service(
            name="outbox_repository",
            service_instance=outbox_repo,
            is_critical=False
        )

        logger.info("Transaction outbox repository setup complete")
    except Exception as e:
        logger.error(f"Failed to set up transaction outbox repository: {e}")
        outbox_repo = None

    # Initialize blockchain handler (outbox processor)
    try:
        if blockchain_service and outbox_repo:
            logger.info("Setting up blockchain handler...")
            outbox_processor = BlockchainHandler(
                outbox_repo=outbox_repo,
                blockchain_service=blockchain_service
            )

            # Register outbox processor with health manager
            health_manager.register_service(
                name="outbox_processor",
                service_instance=outbox_processor,
                dependencies=["blockchain", "outbox_repository"],
                is_critical=False
            )

            logger.info("Blockchain handler setup complete")
        else:
            logger.warning("Skipping blockchain handler setup due to missing dependencies")
            outbox_processor = None
    except Exception as e:
        logger.error(f"Failed to set up blockchain handler: {e}")
        outbox_processor = None

    return blockchain_service, outbox_processor

async def start_services(
    blockchain_service: Optional[Any],
    outbox_processor: Optional[Any],
    health_manager: Any,
    fail_fast: bool = False
):
    """
    Start all services in the correct order.

    Args:
        blockchain_service: Blockchain service instance
        outbox_processor: Outbox processor instance
        health_manager: Service health manager
        fail_fast: Whether to fail immediately on service startup errors

    Raises:
        CriticalServiceException: If a critical service fails to start and fail_fast is True
    """
    logger.info("Starting services...")

    # Initialize services with health manager
    # This will handle dependency order automatically
    await health_manager.initialize_services(fail_fast=fail_fast)

    # Start health monitoring
    await health_manager.start_health_monitoring()

    logger.info("Services started successfully")
