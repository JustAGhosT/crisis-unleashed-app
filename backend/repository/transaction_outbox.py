"""
Transaction Outbox Pattern for blockchain-database consistency.
"""

import logging
from typing import Any, Dict, List, Optional
from datetime import datetime
from pymongo import ReturnDocument

from .outbox_models import OutboxEntry, OutboxStatus, OutboxType

logger = logging.getLogger(__name__)


class TransactionOutboxRepository:
    """Repository for managing transaction outbox entries."""

    def __init__(self, db: Any) -> None:
        self.collection = db.transaction_outbox

    async def create_entry(
        self,
        outbox_type: OutboxType,
        request_data: Dict[str, Any],
        max_attempts: int = 5,
        session: Optional[Any] = None,
    ) -> str:
        """Create a new outbox entry."""
        entry = OutboxEntry.create_new(outbox_type, request_data, max_attempts)
        await self.collection.insert_one(entry.to_dict(), session=session)
        logger.info(f"Created outbox entry: {entry.id}")
        return entry.id

    async def get_pending(self, limit: int = 100) -> List[OutboxEntry]:
        """Get entries ready for processing."""
        cursor = self.collection.find(
            {
                "status": {
                    "$in": [
                        OutboxStatus.PENDING.value,
                        OutboxStatus.RETRY.value,
                        OutboxStatus.ERROR.value,
                    ]
                },
                "$expr": {"$lt": ["$attempts", "$max_attempts"]},
            }
        ).limit(limit)

        docs = await cursor.to_list(length=limit)
        return [OutboxEntry.from_dict(doc) for doc in docs]

    async def update_entry(
        self, entry: OutboxEntry, session: Optional[Any] = None
    ) -> Optional[OutboxEntry]:
        """Update an outbox entry."""
        result = await self.collection.find_one_and_update(
            {"_id": entry.id},
            {"$set": entry.to_dict()},
            return_document=ReturnDocument.AFTER,
            session=session,
        )
        return OutboxEntry.from_dict(result) if result else None

    async def get_by_id(self, outbox_id: str) -> Optional[OutboxEntry]:
        """Get entry by ID."""
        doc = await self.collection.find_one({"_id": outbox_id})
        return OutboxEntry.from_dict(doc) if doc else None

    async def get_by_tx_hash(self, tx_hash: str) -> Optional[OutboxEntry]:
        """Get entry by transaction hash."""
        doc = await self.collection.find_one({"result.tx_hash": tx_hash})
        return OutboxEntry.from_dict(doc) if doc else None

    async def mark_processing(self, outbox_id: str) -> Optional[OutboxEntry]:
        """Mark entry as processing."""
-       entry = await self.get_by_id(outbox_id)
-       if entry:
-           entry.update_status(OutboxStatus.PROCESSING)
-           return await self.update_entry(entry)
-       return None
+       result = await self.collection.find_one_and_update(
+           {
+               "_id": outbox_id,
+               "status": {"$in": [
+                   OutboxStatus.PENDING.value,
+                   OutboxStatus.RETRY.value,
+                   OutboxStatus.ERROR.value
+               ]}
+           },
+           {
+               "$set": {
+                   "status": OutboxStatus.PROCESSING.value,
+                   "updated_at": datetime.utcnow()
+               }
+           },
+           return_document=ReturnDocument.AFTER
+       )
+       return OutboxEntry.from_dict(result) if result else None

    async def mark_completed(
        self, outbox_id: str, result: Dict[str, Any]
    ) -> Optional[OutboxEntry]:
        """Mark entry as completed."""
        entry = await self.get_by_id(outbox_id)
        if entry:
            entry.update_status(OutboxStatus.COMPLETED, result=result)
            return await self.update_entry(entry)
        return None

    async def mark_failed(self, outbox_id: str, error: str) -> Optional[OutboxEntry]:
        """Mark entry as failed."""
        entry = await self.get_by_id(outbox_id)
        if entry:
            entry.update_status(OutboxStatus.FAILED, error=error)
            return await self.update_entry(entry)
        return None

    async def increment_attempts(
        self, outbox_id: str, error: Optional[str] = None
    ) -> Optional[OutboxEntry]:
        """Increment attempt counter."""
        entry = await self.get_by_id(outbox_id)
        if entry:
            entry.increment_attempts(error)
            return await self.update_entry(entry)
        return None

    async def get_entries_by_status(
        self, status: OutboxStatus, limit: int = 100, offset: int = 0
    ) -> List[OutboxEntry]:
        """Get entries by status with pagination."""
        cursor = self.collection.find(
            {"status": status.value}
        ).skip(offset).limit(limit).sort("created_at", -1)
        
        docs = await cursor.to_list(length=limit)
        return [OutboxEntry.from_dict(doc) for doc in docs]

    async def get_entries_by_type(
        self, outbox_type: OutboxType, limit: int = 100, offset: int = 0
    ) -> List[OutboxEntry]:
        """Get entries by type with pagination."""
        cursor = self.collection.find(
            {"type": outbox_type.value}
        ).skip(offset).limit(limit).sort("created_at", -1)
        
        docs = await cursor.to_list(length=limit)
        return [OutboxEntry.from_dict(doc) for doc in docs]

    async def get_failed_entries(self, limit: int = 100) -> List[OutboxEntry]:
        """Get entries that have failed or need manual review."""
        cursor = self.collection.find(
            {
                "$or": [
                    {"status": OutboxStatus.FAILED.value},
                    {"status": OutboxStatus.MANUAL_REVIEW.value},
                    {
                        "$and": [
                            {"status": OutboxStatus.ERROR.value},
                            {"$expr": {"$gte": ["$attempts", "$max_attempts"]}}
                        ]
                    }
                ]
            }
        ).limit(limit).sort("updated_at", -1)
        
        docs = await cursor.to_list(length=limit)
        return [OutboxEntry.from_dict(doc) for doc in docs]

    async def get_entries_by_blockchain(
        self, blockchain: str, limit: int = 100, offset: int = 0
    ) -> List[OutboxEntry]:
        """Get entries for a specific blockchain."""
        cursor = self.collection.find(
            {"request_data.blockchain": blockchain}
        ).skip(offset).limit(limit).sort("created_at", -1)
        
        docs = await cursor.to_list(length=limit)
        return [OutboxEntry.from_dict(doc) for doc in docs]

    async def count_entries_by_status(self, status: OutboxStatus) -> int:
        """Count entries by status."""
        return await self.collection.count_documents({"status": status.value})

    async def get_processing_stats(self) -> Dict[str, int]:
        """Get processing statistics."""
        pipeline = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            }
        ]
        
        cursor = self.collection.aggregate(pipeline)
        results = await cursor.to_list(length=None)
        
        stats = {status.value: 0 for status in OutboxStatus}
        for result in results:
            stats[result["_id"]] = result["count"]
        
        return stats

    async def cleanup_completed_entries(self, days_old: int = 30) -> int:
        """Clean up old completed entries."""
        from datetime import datetime, timedelta
        
        cutoff_date = datetime.utcnow() - timedelta(days=days_old)
        
        result = await self.collection.delete_many({
            "status": OutboxStatus.COMPLETED.value,
            "processed_at": {"$lt": cutoff_date}
        })
        
        logger.info(f"Cleaned up {result.deleted_count} completed entries older than {days_old} days")
        return result.deleted_count

    async def retry_entry(self, outbox_id: str) -> Optional[OutboxEntry]:
        """Reset an entry for retry."""
        entry = await self.get_by_id(outbox_id)
        if entry and entry.status in [OutboxStatus.FAILED, OutboxStatus.ERROR]:
            entry.update_status(OutboxStatus.RETRY)
            entry.attempts = 0  # Reset attempts for manual retry
            entry.last_error = None
            return await self.update_entry(entry)
        return None