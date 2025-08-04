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
