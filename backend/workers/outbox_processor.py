"""
Background worker for processing transaction outbox entries.

This worker runs continuously to process pending blockchain operations,
ensuring eventual consistency between database and blockchain state.
"""
import asyncio
import logging
from typing import Any, Dict
from datetime import datetime, timezone

# Absolute imports rooted at 'backend'
from backend.repository import TransactionOutboxRepository
from backend.services.blockchain_handler import BlockchainHandler
from backend.services.blockchain_service import BlockchainService

logger = logging.getLogger(__name__)


class OutboxProcessor:
    """Background processor for transaction outbox entries."""

    def __init__(
        self,
        db: Any,
        blockchain_service: BlockchainService,
        processing_interval: int = 30,
        max_entries_per_batch: int = 10,
    ):
        """
        Initialize the outbox processor.

        Args:
            db: Database connection
            blockchain_service: Initialized blockchain service
            processing_interval: Seconds between processing cycles
            max_entries_per_batch: Maximum entries to process per cycle
        """
        self.outbox_repo = TransactionOutboxRepository(db)
        self.blockchain_handler = BlockchainHandler(self.outbox_repo, blockchain_service)
        self.processing_interval = processing_interval
        self.max_entries_per_batch = max_entries_per_batch
        self.is_running = False
        self._task: asyncio.Task[None] | None = None

    async def start(self) -> None:
        """Start the background processor."""
        if self.is_running:
            logger.warning("Outbox processor is already running")
            return

        self.is_running = True
        self._task = asyncio.create_task(self._processing_loop())
        logger.info("Outbox processor started")

    async def stop(self) -> None:
        """Stop the background processor."""
        if not self.is_running:
            return

        self.is_running = False

        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass

        logger.info("Outbox processor stopped")

    async def _processing_loop(self) -> None:
        """Main processing loop."""
        logger.info(f"Starting outbox processing loop (interval: {self.processing_interval}s)")

        while self.is_running:
            try:
                await self._process_batch()
                await asyncio.sleep(self.processing_interval)
            except asyncio.CancelledError:
                logger.info("Processing loop cancelled")
                break
            except Exception as e:
                logger.error(f"Error in processing loop: {e}")
                # Sleep longer on errors to avoid spam
                await asyncio.sleep(self.processing_interval * 2)

    async def _process_batch(self) -> None:
        """Process a batch of pending entries."""
        try:
            # BlockchainHandler exposes a synchronous API; offload to a thread
            results = await asyncio.to_thread(
                self.blockchain_handler.process_pending_entries,
                max_entries=self.max_entries_per_batch,
            )

            if results["total_processed"] > 0:
                logger.info(
                    f"Processed batch: {results['total_processed']} total, "
                    f"{results['successful']} successful, {results['failed']} failed"
                )

                # Log any errors
                for error in results["errors"]:
                    logger.warning(
                        f"Entry {error['entry_id']} failed: {error['error']}"
                    )

        except Exception as e:
            logger.error(f"Error processing outbox batch: {e}")

    async def get_health_status(self) -> Dict[str, Any]:
        """Get processor health status."""
        stats = self.blockchain_handler.get_processing_stats()

        return {
            "is_running": self.is_running,
            "processing_interval": self.processing_interval,
            "max_batch_size": self.max_entries_per_batch,
            "last_check": datetime.now(timezone.utc).isoformat(),
            **stats,
        }

class OutboxMonitor:
    """Monitor for outbox entries and system health."""

    def __init__(self, outbox_repo: TransactionOutboxRepository):
        self.outbox_repo = outbox_repo

    def get_queue_status(self) -> Dict[str, Any]:
        """Get current queue status."""
        # Use the sync get_processing_stats method for efficient counting
        status_counts = self.outbox_repo.get_processing_stats()

        return {
            "status_counts": status_counts,
            "total_entries": sum(status_counts.values()),
            "needs_attention": status_counts.get("manual_review", 0) > 0,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
