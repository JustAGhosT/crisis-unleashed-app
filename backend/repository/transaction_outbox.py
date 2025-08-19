"""
Transaction Outbox Pattern for blockchain-database consistency.
"""
import logging
import uuid
from typing import Any, Dict, List, Optional, Iterable, cast
from datetime import datetime, timedelta
from itertools import islice

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
            "outbox_id": str(uuid.uuid4()),  # guaranteed unique id
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
        # Only fetch pending entries up to the specified limit.
        # Prefer DB-side limit to avoid loading entire collection, but remain compatible with tests
        # where find() may be mocked to return a list (no .limit()).
        result = self.collection.find({"status": OutboxStatus.PENDING.value})
        limit_value = max(0, int(limit))

        # Prefer DB/cursor-side limiting when available
        limit_method = getattr(result, "limit", None)
        if callable(limit_method):
            docs = limit_method(limit_value)
            iterable_docs = cast(Iterable[Dict[str, Any]], docs)
            return [_OutboxEntryCompat(doc) for doc in iterable_docs]

        # If tests return list/tuple, slice directly
        if isinstance(result, (list, tuple)):
            return [_OutboxEntryCompat(doc) for doc in result[:limit_value]]

        # If it's any other iterable, stream via islice to avoid materializing
        if hasattr(result, "__iter__"):
            iterable_docs = cast(Iterable[Dict[str, Any]], result)
            return [_OutboxEntryCompat(doc) for doc in islice(iterable_docs, 0, limit_value)]

        # Unsupported type: fail fast with a clear message for test authors
        raise TypeError(
            "collection.find(...) returned an unsupported type. Expected a cursor with .limit(), "
            "a list/tuple, or an iterable."
        )

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
        # Build the $set document first to avoid indexed assignment on an unknown type
        set_doc: Dict[str, Any] = {"updated_at": datetime.now()}
        if error is not None:
            set_doc["last_error"] = error
        update: Dict[str, Any] = {"$inc": {"attempts": 1}, "$set": set_doc}
        self.collection.update_one({"outbox_id": outbox_id}, update)

    def get_processing_stats(self) -> Dict[str, int]:
        """Get processing statistics (sync)."""
        return {
            "pending": int(self.collection.count_documents({"status": OutboxStatus.PENDING.value})),
            "processing": int(self.collection.count_documents({"status": OutboxStatus.PROCESSING.value})),
            "completed": int(self.collection.count_documents({"status": OutboxStatus.COMPLETED.value})),
            "failed": int(self.collection.count_documents({"status": OutboxStatus.FAILED.value})),
        }