"""
Blockchain Handler for processing outbox entries.
"""
import asyncio
import logging
from typing import Any, Dict, List, Optional

from ..repository import (
    TransactionOutboxRepository,
    OutboxEntry,
    OutboxStatus,
    OutboxType,
)
from .blockchain_service import BlockchainService

logger = logging.getLogger(__name__)


class BlockchainHandler:
    """Handles blockchain operations for outbox entries using the modular service."""

    def __init__(
        self,
        outbox_repo: TransactionOutboxRepository,
        blockchain_service: BlockchainService,
    ):
        self.outbox_repo = outbox_repo
        self.blockchain_service = blockchain_service
        
    async def process_pending_entries(self, max_entries: int = 50) -> Dict[str, Any]:
        """
        Process pending outbox entries.

        Args:
            max_entries: Maximum number of entries to process

        Returns:
            Processing results summary
        """
        entries = await self.outbox_repo.get_pending(limit=max_entries)

        total_processed = 0
        successful = 0
        failed = 0
        errors: List[Dict[str, str]] = []
        
        for entry in entries:
            try:
                await self._process_entry(entry)
                successful += 1
            except Exception as e:
                logger.error(f"Failed to process entry {entry.id}: {e}")
                await self.outbox_repo.increment_attempts(entry.id, str(e))
                failed += 1
                errors.append({"entry_id": entry.id, "error": str(e)})
            
            total_processed += 1
        
        results = {
            "total_processed": total_processed,
            "successful": successful,
            "failed": failed,
            "errors": errors
        }

        logger.info(
            f"Processed {results['total_processed']} entries: "
            f"{results['successful']} successful, {results['failed']} failed"
        )

        return results

    async def _process_entry(self, entry: OutboxEntry) -> None:
        """Process a single outbox entry."""
        await self.outbox_repo.mark_processing(entry.id)

        try:
            if entry.type == OutboxType.MINT_NFT:
                await self._handle_mint_nft(entry)
            elif entry.type == OutboxType.TRANSFER_NFT:
                await self._handle_transfer_nft(entry)
            elif entry.type == OutboxType.MARKETPLACE_LIST:
                await self._handle_marketplace_list(entry)
            elif entry.type == OutboxType.MARKETPLACE_PURCHASE:
                await self._handle_marketplace_purchase(entry)
            else:
                raise ValueError(f"Unsupported operation type: {entry.type}")

        except Exception as e:
            logger.error(f"Blockchain operation failed for {entry.id}: {e}")
            await self.outbox_repo.mark_failed(entry.id, str(e))
            raise

    async def _handle_mint_nft(self, entry: OutboxEntry) -> None:
        """Handle NFT minting operation."""
        data = entry.request_data
        blockchain = data["blockchain"]

        logger.info(f"Minting NFT on {blockchain} for entry {entry.id}")

        # Execute blockchain mint operation
        tx_hash, tx_data = await self.blockchain_service.mint_nft(
            blockchain=blockchain,
            recipient=data["wallet_address"],
            card_id=data["card_id"],
            name=data.get("name", "Crisis Unleashed Card"),
            rarity=data.get("rarity", "common"),
            faction=data.get("faction"),
            card_type=data.get("card_type", "character"),
        )

        logger.info(f"Mint transaction submitted: {tx_hash}")

        # Wait for confirmation
        receipt = await self.blockchain_service.wait_for_confirmation(
            blockchain, tx_hash, timeout=180
        )

        if receipt and receipt.get("status") == 1:
            result = {
                "operation": "mint_nft",
                "blockchain": blockchain,
                "tx_hash": tx_hash,
                "block_number": receipt.get("blockNumber"),
                "gas_used": receipt.get("gasUsed"),
                "card_id": data["card_id"],
                "recipient": data["wallet_address"],
            }
            await self.outbox_repo.mark_completed(entry.id, result)
            logger.info(f"NFT mint completed for entry {entry.id}")
        else:
            error_msg = "Transaction failed on blockchain"
            await self.outbox_repo.mark_failed(entry.id, error_msg)
            raise Exception(error_msg)

    async def _handle_transfer_nft(self, entry: OutboxEntry) -> None:
        """Handle NFT transfer operation."""
        data = entry.request_data
        blockchain = data["blockchain"]

        logger.info(f"Transferring NFT on {blockchain} for entry {entry.id}")

        tx_hash, tx_data = await self.blockchain_service.transfer_nft(
            blockchain=blockchain,
            from_address=data["from_address"],
            to_address=data["to_address"],
            token_id=data["token_id"],
        )

        logger.info(f"Transfer transaction submitted: {tx_hash}")

        receipt = await self.blockchain_service.wait_for_confirmation(
            blockchain, tx_hash, timeout=180
        )

        if receipt and receipt.get("status") == 1:
            result = {
                "operation": "transfer_nft",
                "blockchain": blockchain,
                "tx_hash": tx_hash,
                "block_number": receipt.get("blockNumber"),
                "token_id": data["token_id"],
                "from_address": data["from_address"],
                "to_address": data["to_address"],
            }
            await self.outbox_repo.mark_completed(entry.id, result)
            logger.info(f"NFT transfer completed for entry {entry.id}")
        else:
            error_msg = "Transfer failed on blockchain"
            await self.outbox_repo.mark_failed(entry.id, error_msg)
            raise Exception(error_msg)

    async def _handle_marketplace_list(self, entry: OutboxEntry) -> None:
        """Handle marketplace listing operation."""
        data = entry.request_data

        # Placeholder for marketplace listing logic
        logger.info(f"Marketplace listing not yet implemented for entry {entry.id}")

        # For now, simulate success
        result = {
            "operation": "marketplace_list",
            "token_id": data.get("token_id"),
            "price": data.get("price"),
            "status": "listed",
        }

        await self.outbox_repo.mark_completed(entry.id, result)

    async def _handle_marketplace_purchase(self, entry: OutboxEntry) -> None:
        """Handle marketplace purchase operation."""
        data = entry.request_data

        # Placeholder for marketplace purchase logic
        logger.info(f"Marketplace purchase not yet implemented for entry {entry.id}")

        # For now, simulate success
        result = {
            "operation": "marketplace_purchase",
            "token_id": data.get("token_id"),
            "buyer": data.get("buyer_address"),
            "price": data.get("price"),
            "status": "purchased",
        }

        await self.outbox_repo.mark_completed(entry.id, result)

    async def get_processing_stats(self) -> Dict[str, Any]:
        """Get statistics about outbox processing."""
        # This could be enhanced to query the database for actual stats
        health = await self.blockchain_service.health_check()

        return {
            "blockchain_health": health,
            "supported_networks": self.blockchain_service.get_supported_blockchains(),
            "service_status": "operational",
        }