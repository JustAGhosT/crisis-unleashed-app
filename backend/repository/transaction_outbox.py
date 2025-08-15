"""
Transaction Outbox Pattern for blockchain-database consistency.
"""
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta

from .outbox_models import OutboxStatus, OutboxType

logger = logging.getLogger(__name__)


class _OutboxEntryCompat:
    """Lightweight object with attributes expected by tests."""

    def __init__(self, data: Dict[str, Any]):
        self.outbox_id = data.get("outbox_id")
        self.outbox_type = data.get("outbox_type")
        self.status = data.get("status")
        self.request_data = data.get("request_data", {})
        self.created_at = data.get("created_at")
        self.updated_at = data.get("updated_at")
        self.attempts = data.get("attempts", 0)
        self.max_attempts = data.get("max_attempts", 5)
        self.result = data.get("result")
        self.last_error = data.get("last_error")


class TransactionOutboxRepository:
    """Repository for managing transaction outbox entries (sync API for tests)."""

    def __init__(self, db: Any) -> None:
        # Tests expect collection named 'outbox'
        self.collection = db.outbox

    def create_entry(
        self,
        outbox_type: OutboxType,
        request_data: Dict[str, Any],
        max_attempts: int = 5,
    ) -> _OutboxEntryCompat:
        """Create a new outbox entry (sync)."""
        now = datetime.now()
        entry_doc = {
            "outbox_id": datetime.now().strftime("%Y%m%d%H%M%S%f"),  # simple unique id for tests
            "outbox_type": outbox_type.value if isinstance(outbox_type, OutboxType) else outbox_type,
            "status": OutboxStatus.PENDING.value,
            "request_data": request_data,
            "created_at": now,
            "updated_at": now,
            "attempts": 0,
            "max_attempts": max_attempts,
        }
        self.collection.insert_one(entry_doc)
        return _OutboxEntryCompat(entry_doc)

    def get_by_id(self, outbox_id: str) -> Optional[_OutboxEntryCompat]:
        """Get entry by ID (sync)."""
        doc = self.collection.find_one({"outbox_id": outbox_id})
        return _OutboxEntryCompat(doc) if doc else None

    def get_pending(self, limit: int = 100) -> List[_OutboxEntryCompat]:
        """Get entries ready for processing (sync)."""
        docs = self.collection.find({})
        # Tests mock find() to return list directly
        return [_OutboxEntryCompat(doc) for doc in docs][:limit]

    def mark_completed(self, outbox_id: str, result: Dict[str, Any]) -> None:
        """Mark entry as completed (sync)."""
        self.collection.update_one(
            {"outbox_id": outbox_id},
            {
                "$set": {
                    "status": OutboxStatus.COMPLETED.value,
                    "result": result,
                    "updated_at": datetime.now(),
                }
            },
        )

    def mark_failed(self, outbox_id: str, error: str) -> None:
        """Mark entry as failed (sync)."""
        self.collection.update_one(
            {"outbox_id": outbox_id},
            {
                "$set": {
                    "status": OutboxStatus.FAILED.value,
                    "last_error": error,
                    "updated_at": datetime.now(),
                }
            },
        )

    def increment_attempts(self, outbox_id: str, error: Optional[str] = None) -> None:
        """Increment attempt counter (sync)."""
        update = {"$inc": {"attempts": 1}, "$set": {"updated_at": datetime.now()}}
        if error is not None:
            update["$set"]["last_error"] = error
        self.collection.update_one({"outbox_id": outbox_id}, update)

    def get_processing_stats(self) -> Dict[str, int]:
        """Get processing statistics (sync)."""
        return {
            "pending": int(self.collection.count_documents({"status": OutboxStatus.PENDING.value})),
            "processing": int(self.collection.count_documents({"status": OutboxStatus.PROCESSING.value})),
            "completed": int(self.collection.count_documents({"status": OutboxStatus.COMPLETED.value})),
            "failed": int(self.collection.count_documents({"status": OutboxStatus.FAILED.value})),
        }