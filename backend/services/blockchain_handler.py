"""
Blockchain Handler for processing outbox entries.
"""

import logging
import random
import time
from typing import Any, Dict, List, TypedDict

try:
    # Absolute imports rooted at 'backend'
    from backend.repository import (
        OutboxType,
        TransactionOutboxRepository,
    )
    from backend.services.blockchain_service import BlockchainService
except ImportError:
    # Fallback to relative imports (works when run from source tree)
    from ..repository import (
        OutboxType,
        TransactionOutboxRepository,
    )
    from .blockchain_service import BlockchainService


logger = logging.getLogger(__name__)


class ErrorItem(TypedDict):
    """Type definition for error items in processing results."""

    entry_id: str
    error: str


class BlockchainHandler:
    """Handles blockchain operations for outbox entries using the modular service."""

    def __init__(
        self,
        outbox_repo: TransactionOutboxRepository,
        blockchain_service: BlockchainService,
    ):
        self.outbox_repo = outbox_repo
        self.blockchain_service = blockchain_service

    # Add this helper alongside other private methods in the class
    def _get_entry_id(self, entry: Any) -> str:
        """Extract entry ID from entry object, handling different attribute names."""
        return getattr(entry, 'outbox_id', getattr(entry, 'id', 'unknown'))
    def process_pending_entries(self, max_entries: int = 50) -> Dict[str, Any]:
        """
        Process pending outbox entries.
        Args:
            max_entries: Maximum number of entries to process
        Returns:
            Processing results summary
        """
        entries = self.outbox_repo.get_pending(limit=max_entries)
        total_processed = 0
        successful = 0
        failed = 0
        errors: List[ErrorItem] = []
        for entry in entries:
            entry_id = self._get_entry_id(entry)
            try:
                self._process_with_retry(entry)
                successful += 1
            except Exception as e:
                logger.error(f"Failed to process entry {entry_id}: {e}")
                failed += 1
                errors.append({"entry_id": entry_id, "error": str(e)})
            total_processed += 1

        results = {
            "total_processed": total_processed,
            "successful": successful,
            "failed": failed,
            "errors": errors,
        }
        logger.info(
            f"Processed {results['total_processed']} entries: "
            f"{results['successful']} successful, {results['failed']} failed"
        )
        return results

    def _process_entry(self, entry: Any) -> None:
        """Process a single outbox entry (sync)."""
        entry_id = self._get_entry_id(entry)
        entry_type = getattr(entry, 'outbox_type', getattr(entry, 'type', None))
        # mark processing (best-effort if repo provides it)
        try:
            mark_proc = getattr(self.outbox_repo, 'mark_processing', None)
            if callable(mark_proc):
                mark_proc(entry_id)
        except Exception:
            pass
        try:
            if entry_type == OutboxType.MINT_NFT:
                self._handle_mint_nft(entry)
            elif entry_type == OutboxType.TRANSFER_NFT:
                self._handle_transfer_nft(entry)
            elif entry_type == OutboxType.MARKETPLACE_LIST:
                self._handle_marketplace_list(entry)
            elif entry_type == OutboxType.MARKETPLACE_PURCHASE:
                self._handle_marketplace_purchase(entry)
            else:
                raise ValueError(f"Unsupported operation type: {entry_type}")
        except Exception as e:
            logger.error(f"Blockchain operation failed for {entry_id}: {e}")
            # Attempts are handled by _process_with_retry
            raise

    # New: retry wrapper with exponential backoff and jitter
    def _process_with_retry(self, entry: Any) -> None:
        entry_id = self._get_entry_id(entry)
        # Pull max attempts from entry if available, else default
        attempts_used = int(getattr(entry, "attempts", 0) or 0)
        max_attempts = int(getattr(entry, "max_attempts", 5) or 5)

        base_delay = 0.5  # seconds
        max_delay = 30.0  # seconds cap
        jitter = 0.2      # +/-20%

        try_num = 0
        while True:
            try:
                if try_num > 0:
                    logger.info(
                        f"Retrying outbox {entry_id} (attempt {attempts_used + try_num + 1}/{max_attempts})"
                    )
                self._process_entry(entry)
                return
            except Exception as e:
                # Update attempts in repo; this is best-effort
                try:
                    self.outbox_repo.increment_attempts(entry_id, str(e))
                except Exception:
                    pass

                if attempts_used + try_num + 1 >= max_attempts:
                    # Exhausted retries: mark failed (best-effort)
                    try:
                        self.outbox_repo.mark_failed(entry_id, str(e))
                    except Exception:
                        pass
                    raise

                # Compute exponential backoff with jitter and sleep synchronously
                delay = min(max_delay, base_delay * (2 ** try_num))
                # apply jitter
                jitter_factor = 1.0 + (random.random() * 2 - 1) * jitter
                delay = max(0.1, delay * jitter_factor)
                logger.warning(
                    f"Outbox {entry_id} failed: {e}. Backing off for {delay:.2f}s before retry"
                )
                time.sleep(delay)
                try_num += 1

    def _handle_mint_nft(self, entry: Any) -> None:
        """Handle NFT minting operation (sync, matches test expectations)."""
        data = entry.request_data
        blockchain = data["blockchain"]
        entry_id = self._get_entry_id(entry)
        logger.info(f"Minting NFT on {blockchain} for entry {entry_id}")
        tx_hash = self.blockchain_service.mint_nft(
            blockchain=blockchain,
            recipient=data["recipient"],
            card_id=data["card_id"],
            **data.get("metadata", {})
        )
        receipt = self.blockchain_service.wait_for_confirmation(blockchain, tx_hash, timeout=180)
        if receipt and receipt.get("status") == 1:
            self.outbox_repo.mark_completed(entry_id, {
                "tx_hash": tx_hash,
                "status": "confirmed",
                "receipt": receipt
            })
        else:
            raise Exception("Transaction failed on blockchain")

    def _handle_transfer_nft(self, entry: Any) -> None:
        """Handle NFT transfer operation (sync, matches test expectations)."""
        data = entry.request_data
        blockchain = data["blockchain"]
        entry_id = self._get_entry_id(entry)
        logger.info(f"Transferring NFT on {blockchain} for entry {entry_id}")
        tx_hash = self.blockchain_service.transfer_nft(
            blockchain=blockchain,
            from_address=data["from_address"],
            to_address=data["to_address"],
            token_id=data["token_id"],
        )
        receipt = self.blockchain_service.wait_for_confirmation(blockchain, tx_hash, timeout=180)
        if receipt and receipt.get("status") == 1:
            self.outbox_repo.mark_completed(entry_id, {
                "tx_hash": tx_hash,
                "status": "confirmed",
                "receipt": receipt
            })
        else:
            raise Exception("Transfer failed on blockchain")

    def _handle_marketplace_list(self, entry: Any) -> None:
        """Handle marketplace listing operation."""
        data = entry.request_data
        # Placeholder for marketplace listing logic
        entry_id = self._get_entry_id(entry)
        logger.info(f"Marketplace listing not yet implemented for entry {entry_id}")
        # For now, simulate success
        result = {
            "operation": "marketplace_list",
            "token_id": data.get("token_id"),
            "price": data.get("price"),
            "status": "listed",
        }
        self.outbox_repo.mark_completed(entry_id, result)

    def _handle_marketplace_purchase(self, entry: Any) -> None:
        """Handle marketplace purchase operation."""
        data = entry.request_data
        # Placeholder for marketplace purchase logic
        entry_id = self._get_entry_id(entry)
        logger.info(f"Marketplace purchase not yet implemented for entry {entry_id}")
        # For now, simulate success
        result = {
            "operation": "marketplace_purchase",
            "token_id": data.get("token_id"),
            "buyer": data.get("buyer_address"),
            "price": data.get("price"),
            "status": "purchased",
        }
        self.outbox_repo.mark_completed(entry_id, result)

    def get_processing_stats(self) -> Dict[str, Any]:
        """Get statistics about outbox processing (sync)."""
        return self.outbox_repo.get_processing_stats()
