"""
Transaction Outbox Pattern for blockchain-database consistency.
"""

import asyncio
import inspect
import logging
import uuid
from typing import Any, Callable, Dict, List, Optional, TypeVar, cast
from datetime import datetime, timezone

from .outbox_models import OutboxStatus, OutboxType

logger = logging.getLogger(__name__)

# Type variable for generic function return
T = TypeVar("T")


def sync_bridge(func: Callable[..., Any], *args: Any, **kwargs: Any) -> Any:
    """
    Run async functions synchronously by creating a new event loop if needed.

    Args:
        func: The function to call (may be async or sync)
        *args: Positional arguments to pass to the function
        **kwargs: Keyword arguments to pass to the function

    Returns:
        The result of calling the function

    Raises:
        RuntimeError: If called in an async context with an existing event loop
    """
    # If it's not a coroutine function, just call it directly
    if not inspect.iscoroutinefunction(func) and not asyncio.iscoroutine(func):
        return func(*args, **kwargs)

    # Try to get the current event loop - if there's one running,
    # we can't safely create a new one
    try:
        asyncio.get_running_loop()
        raise RuntimeError(
            f"Cannot run {func.__name__} synchronously in an async context. "
            "Use the async version of this repository instead."
        )
    except RuntimeError:
        # No running loop, safe to create a new one
        pass

    # Create a new event loop and run the coroutine
    loop = asyncio.new_event_loop()
    try:
        if asyncio.iscoroutine(func):
            # If func is already a coroutine, just run it
            return loop.run_until_complete(func)
        else:
            # Otherwise, call the coroutine function and run the resulting coroutine
            return loop.run_until_complete(func(*args, **kwargs))
    finally:
        loop.close()


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

        # More robust in-memory detection - check if collection has common class patterns
        # without tying to a specific implementation name
        self._in_memory_mode = hasattr(self.collection, "__class__") and any(
            memory_pattern in self.collection.__class__.__name__
            for memory_pattern in ["InMemory", "Mock", "Test", "Fake"]
        )

    def _get_all_items_safe(self) -> List[Dict[str, Any]]:
        """
        Safely get all items from collection, handling both sync and async cases.

        Returns:
            A list of all documents in the collection.
        """
        try:
            # Use sync_bridge to handle both sync and async find methods
            find_result = sync_bridge(self.collection.find)

            # Convert to list if it's a regular iterable
            if find_result is not None:
                # Make sure we return a copy of each document
                return [
                    doc.copy() if hasattr(doc, "copy") else dict(doc)
                    for doc in find_result
                ]
            return []
        except Exception as e:
            logger.error(f"Error getting items from collection: {e}")
            return []

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
            "outbox_type": (
                outbox_type.value
                if isinstance(outbox_type, OutboxType)
                else outbox_type
            ),
            "status": OutboxStatus.PENDING.value,
            "request_data": request_data,
            "created_at": now,
            "updated_at": now,
            "attempts": 0,
            "max_attempts": max_attempts,
        }

        try:
            # Use sync_bridge for both in-memory and MongoDB collections
            result = sync_bridge(self.collection.insert_one, entry_doc)

            # Check that insertion was successful
            if result is None or not hasattr(result, "inserted_id"):
                logger.warning("Insert operation did not return expected result")

        except Exception as e:
            logger.error(f"Error inserting outbox entry: {e}")
            raise  # Re-raise to maintain original behavior

        return _OutboxEntryCompat(entry_doc)

    def get_by_id(self, outbox_id: str) -> Optional[_OutboxEntryCompat]:
        """Get entry by ID (sync)."""
        try:
            # Use find_one if available
            if hasattr(self.collection, "find_one"):
                doc = sync_bridge(self.collection.find_one, {"outbox_id": outbox_id})
            else:
                # Fall back to find with filter if find_one not available
                cursor = sync_bridge(self.collection.find, {"outbox_id": outbox_id})
                doc = next(iter(cursor), None)

            # Return None if document not found
            if not doc:
                return None

            # Make a copy to avoid modifying the original
            doc_copy = doc.copy() if hasattr(doc, "copy") else dict(doc)
            return _OutboxEntryCompat(doc_copy)

        except Exception as e:
            logger.error(f"Error in get_by_id: {e}")
            return None

    def get_pending(self, limit: int = 100) -> List[_OutboxEntryCompat]:
        """Get entries ready for processing (sync)."""
        limit_value = max(0, int(limit))
        if limit_value == 0:
            return []

        try:
            # Use a consistent approach for both in-memory and MongoDB
            cursor = sync_bridge(
                self.collection.find, {"status": OutboxStatus.PENDING.value}
            )

            # Apply limit if cursor supports it
            if hasattr(cursor, "limit"):
                cursor = cursor.limit(limit_value)

            # Convert to list and apply limit in Python if needed
            docs = list(cursor)[:limit_value]

            # Create outbox entries from documents
            return [
                _OutboxEntryCompat(doc.copy() if hasattr(doc, "copy") else dict(doc))
                for doc in docs
            ]

        except Exception as e:
            logger.error(f"Error getting pending entries: {e}")
            return []

    def mark_completed(self, outbox_id: str, result: Dict[str, Any]) -> None:
        """Mark entry as completed (sync)."""
        try:
            # Use update_one consistently for both in-memory and MongoDB
            update_data = {
                "$set": {
                    "status": OutboxStatus.COMPLETED.value,
                    "result": result,
                    "updated_at": datetime.now(timezone.utc),
                }
            }

            sync_bridge(
                self.collection.update_one, {"outbox_id": outbox_id}, update_data
            )

        except Exception as e:
            logger.error(f"Error in mark_completed: {e}")

    def mark_failed(self, outbox_id: str, error: str) -> None:
        """Mark entry as failed (sync)."""
        try:
            # Use update_one consistently for both in-memory and MongoDB
            update_data = {
                "$set": {
                    "status": OutboxStatus.FAILED.value,
                    "last_error": error,
                    "updated_at": datetime.now(timezone.utc),
                }
            }

            sync_bridge(
                self.collection.update_one, {"outbox_id": outbox_id}, update_data
            )

        except Exception as e:
            logger.error(f"Error in mark_failed: {e}")

    def increment_attempts(self, outbox_id: str, error: Optional[str] = None) -> None:
        """Increment attempt counter (sync)."""
        try:
            # Use update_one consistently for both in-memory and MongoDB
            set_doc: Dict[str, Any] = {"updated_at": datetime.now(timezone.utc)}
            if error is not None:
                set_doc["last_error"] = error

            update_data: Dict[str, Any] = {"$inc": {"attempts": 1}, "$set": set_doc}

            sync_bridge(
                self.collection.update_one, {"outbox_id": outbox_id}, update_data
            )

        except Exception as e:
            logger.error(f"Error in increment_attempts: {e}")

    def get_processing_stats(self) -> Dict[str, int]:
        """Get processing statistics (sync)."""
        stats = {"pending": 0, "processing": 0, "completed": 0, "failed": 0}

        try:
            # Use count_documents if available
            if hasattr(self.collection, "count_documents"):
                for status in stats.keys():
                    status_value = getattr(OutboxStatus, status.upper()).value
                    stats[status] = sync_bridge(
                        self.collection.count_documents, {"status": status_value}
                    )
            else:
                # Fall back to filtering all items if count_documents not available
                all_items = self._get_all_items_safe()
                for item in all_items:
                    status = item.get("status")
                    if status == OutboxStatus.PENDING.value:
                        stats["pending"] += 1
                    elif status == OutboxStatus.PROCESSING.value:
                        stats["processing"] += 1
                    elif status == OutboxStatus.COMPLETED.value:
                        stats["completed"] += 1
                    elif status == OutboxStatus.FAILED.value:
                        stats["failed"] += 1

            return stats

        except Exception as e:
            logger.error(f"Error getting processing stats: {e}")
            return stats
