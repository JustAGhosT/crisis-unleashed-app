"""
Transaction Outbox Pattern for blockchain-database consistency.
"""
import logging
import uuid
from typing import Any, Dict, List, Optional, Iterable, cast
from datetime import datetime, timedelta, timezone
from itertools import islice

from .outbox_models import OutboxStatus, OutboxType

logger = logging.getLogger(__name__)


class _OutboxEntryCompat:
    """Lightweight, validated view over an outbox entry document.

    This wrapper enforces the presence of required fields used by tests and
    repository logic while remaining permissive for optional fields.
    """

    # Explicit attribute types for better editor support and safety
    outbox_id: str
    outbox_type: str
    status: str
    request_data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    attempts: int
    max_attempts: int
    result: Optional[Dict[str, Any]]
    last_error: Optional[str]

    def __init__(self, data: Dict[str, Any]):
        if data is None:
            raise ValueError("Outbox entry data must not be None")

        # Required fields – raise early with clear messages if absent
        self.outbox_id = str(self._require(data, "outbox_id"))
        self.outbox_type = str(self._require(data, "outbox_type"))
        self.status = str(self._require(data, "status"))
        self.created_at = cast(datetime, self._require(data, "created_at"))

        # Optional with sane defaults
        self.request_data = cast(Dict[str, Any], data.get("request_data") or {})
        self.updated_at = cast(datetime, data.get("updated_at") or self.created_at)
        self.attempts = int(data.get("attempts", 0))
        self.max_attempts = int(data.get("max_attempts", 5))
        self.result = cast(Optional[Dict[str, Any]], data.get("result"))
        self.last_error = cast(Optional[str], data.get("last_error"))

    @staticmethod
    def _require(d: Dict[str, Any], key: str) -> Any:
        """Fetch a required key or raise a ValueError with context."""
        if key not in d or d[key] is None:
            raise ValueError(f"Outbox entry missing required field: '{key}'")
        return d[key]


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
        now = datetime.now(timezone.utc)
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

        # In PyMongo, limit(0) disables the limit (i.e., returns all). Our API treats 0 as "return none".
        if limit_value == 0:
            return []

        # Prefer DB/cursor-side limiting when available
        limit_method = getattr(result, "limit", None)
        if callable(limit_method) and limit_value > 0:
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
                    "updated_at": datetime.now(timezone.utc),
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
                    "updated_at": datetime.now(timezone.utc),
                }
            },
        )

    def increment_attempts(self, outbox_id: str, error: Optional[str] = None) -> None:
        """Increment attempt counter (sync)."""
        # Build the $set document first to avoid indexed assignment on an unknown type
        set_doc: Dict[str, Any] = {"updated_at": datetime.now(timezone.utc)}
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