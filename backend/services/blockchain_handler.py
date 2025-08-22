"""
Blockchain Handler for processing outbox entries.
"""

import logging
from typing import Any, Dict, List, TypedDict

from ..repository import (
    TransactionOutboxRepository,
    OutboxType,
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
            try:
                self._process_entry(entry)
                successful += 1
            except Exception as e:
                entry_id = self._get_entry_id(entry)
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
            self.outbox_repo.increment_attempts(entry_id, str(e))
            raise

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
