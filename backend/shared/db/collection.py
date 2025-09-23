"""
In-Memory Collection Implementation

This module provides a collection implementation for the in-memory database.
"""

import asyncio
import logging
import time
from typing import Dict, Any, Optional, List

# Import related classes
from .cursor import InMemoryCursor

logger = logging.getLogger(__name__)


class InMemoryCollection:
    """In-memory collection implementation for testing."""

    def __init__(self, name: str, max_cache_size: int = 1000):
        self.name = name
        self.data: List[Dict[str, Any]] = []
        self._id_counter = 1  # For auto-incrementing IDs
        self._lock = asyncio.Lock()  # Add lock for thread safety
        # Operation metrics for monitoring
        self._operation_count = {
            'find': 0, 'find_one': 0, 'insert_one': 0, 'insert_many': 0,
            'update_one': 0, 'update_many': 0, 'delete_one': 0, 'delete_many': 0,
            'count_documents': 0, 'find_one_and_update': 0
        }
        logger.info(f"Initialized InMemoryCollection: {name}")

    def _log_operation(self, operation: str, **kwargs):
        """Log database operation with metrics."""
        self._operation_count[operation] += 1
        logger.debug(
            f"InMemoryCollection.{operation} on '{self.name}' "
            f"(call #{self._operation_count[operation]}) - {kwargs}"
        )

    def get_metrics(self) -> dict:
        """Get collection operation metrics."""
        return {
            'collection_name': self.name,
            'document_count': len(self.data),
            'operation_counts': self._operation_count.copy(),
            'next_id': self._id_counter
        }

    async def find(self, query=None):
        """Find documents matching query."""
        self._log_operation('find', query=query)
        if query is None:
            result = [doc.copy() for doc in self.data]
        else:
            result = []
            for doc in self.data:
                match = True
                for key, value in query.items():
                    if key not in doc or doc[key] != value:
                        match = False
                        break
                if match:
                    result.append(doc.copy())

        # Cache the result
        await self._cache_result(cache_key, result, current_time)
        return InMemoryCursor(result)

    async def find_one(self, query=None):
        """Find one document matching query."""
        cursor = await self.find(query)
        result = await cursor.to_list(1)
        return result[0] if result else None

    async def insert_one(self, document):
        """Insert one document."""
        doc_copy = document.copy()
        # Auto-assign _id if not present
        async with self._lock:
            if '_id' not in doc_copy:
                doc_copy['_id'] = self._id_counter
                self._id_counter += 1

            self.data.append(doc_copy)

        # Invalidate cache after data modification
        await self.invalidate_cache()
        return {"inserted_id": doc_copy.get("_id")}

    async def insert_many(self, documents):
        """Insert many documents."""
        inserted_ids = []
        for doc in documents:
            result = await self.insert_one(doc)
            inserted_ids.append(result["inserted_id"])
        return {"inserted_ids": inserted_ids}

    async def update_one(self, filter, update, **kwargs):
        """Update one document matching filter."""
        async with self._lock:
            for i, doc in enumerate(self.data):
                match = True
                for key, value in filter.items():
                    if key not in doc or doc[key] != value:
                        match = False
                        break

                if match:
                    # Handle $set operator
                    if "$set" in update:
                        for key, value in update["$set"].items():
                            self.data[i][key] = value
                    # Handle $inc operator
                    if "$inc" in update:
                        for key, value in update["$inc"].items():
                            current = self.data[i].get(key, 0)
                            self.data[i][key] = current + value
                    # Handle direct update
                    elif not any(op in update for op in ["$set", "$inc"]):
                        for key, value in update.items():
                            if key != "_id":  # Don't update _id
                                self.data[i][key] = value
                    # Invalidate cache after data modification
                    await self.invalidate_cache()
                    return {
                        "modified_count": 1,
                        "matched_count": 1,
                    }

        return {"modified_count": 0, "matched_count": 0}

    async def update_many(self, filter, update, **kwargs):
        """Update many documents matching filter."""
        modified_count = 0
        matched_count = 0

        async with self._lock:
            for i, doc in enumerate(self.data):
                match = True
                for key, value in filter.items():
                    if key not in doc or doc[key] != value:
                        match = False
                        break

                if match:
                    matched_count += 1
                    updated = False
                    # Handle $set operator
                    if "$set" in update:
                        for key, value in update["$set"].items():
                            self.data[i][key] = value
                        updated = True
                    # Handle $inc operator
                    if "$inc" in update:
                        for key, value in update["$inc"].items():
                            current = self.data[i].get(key, 0)
                            self.data[i][key] = current + value
                        updated = True
                    # Handle direct update only if no operators used
                    if not updated:
                        for key, value in update.items():
                            if key != "_id":  # Don't update _id
                                self.data[i][key] = value
                        updated = True
                    if updated:
                        modified_count += 1

        return {
            "modified_count": modified_count,
            "matched_count": matched_count,
        }

    async def delete_one(self, filter):
        """Delete one document matching filter."""
        async with self._lock:
            for i, doc in enumerate(self.data):
                match = True
                for key, value in filter.items():
                    if key not in doc or doc[key] != value:
                        match = False
                        break

                if match:
                    self.data.pop(i)
                    return {"deleted_count": 1}

        return {"deleted_count": 0}

    async def delete_many(self, filter):
        """Delete many documents matching filter."""
        async with self._lock:
            original_count = len(self.data)
            # Filter out documents that don't match
            self.data = [
                doc for doc in self.data
                if not all(
                    key in doc and doc[key] == value
                    for key, value in filter.items()
                )
            ]
            deleted_count = original_count - len(self.data)

        return {"deleted_count": deleted_count}

    async def count_documents(self, query=None):
        """Count documents matching query."""
        async with self._lock:
            if query is None:
                return len(self.data)

            # Simple query implementation with thread safety
            count = 0
            for doc in self.data:
                match = True
                for key, value in query.items():
                    if key not in doc or doc[key] != value:
                        match = False
                        break
                if match:
                    count += 1
            return count

    async def find_one_and_update(self, filter, update, **kwargs):
        """Find one document and update it."""
        # Import ReturnDocument from pymongo for compatibility
        from pymongo import ReturnDocument

        # Normalize return_document parameter
        return_document = kwargs.get("return_document", ReturnDocument.BEFORE)
        if isinstance(return_document, str):
            if return_document.lower() == "after":
                return_document = ReturnDocument.AFTER
            else:
                return_document = ReturnDocument.BEFORE

        async with self._lock:
            for i, doc in enumerate(self.data):
                match = True
                for key, value in filter.items():
                    if key not in doc or doc[key] != value:
                        match = False
                        break

                if match:
                    # Keep original document for return
                    original = self.data[i].copy()

                    # Handle $set operator
                    if "$set" in update:
                        for key, value in update["$set"].items():
                            self.data[i][key] = value
                    # Handle $inc operator
                    if "$inc" in update:
                        for key, value in update["$inc"].items():
                            current = self.data[i].get(key, 0)
                            self.data[i][key] = current + value
                    # Handle direct update only if no operators used
                    if not any(op in update for op in ["$set", "$inc"]):
                        for key, value in update.items():
                            if key != "_id":  # Don't update _id
                                self.data[i][key] = value

                    # Return based on return_document option
                    if return_document == ReturnDocument.AFTER:
                        return self.data[i].copy()
                    else:
                        return original

        return None

    async def create_index(self, keys, **kwargs):
        """Create index for query optimization in in-memory implementation."""
        # Initialize indexes dict if not exists
        if not hasattr(self, '_indexes'):
            self._indexes = {}

        # Parse index specification
        if isinstance(keys, list):
            index_name = "_".join([f"{k[0]}_{k[1]}" for k in keys])
            index_fields = [k[0] for k in keys]
        elif isinstance(keys, str):
            index_name = f"{keys}_1"
            index_fields = [keys]
        else:
            # Handle dict format like {"field": 1}
            index_fields = list(keys.keys())
            index_name = "_".join([f"{k}_1" for k in index_fields])

        # Create index structure for future optimization
        index_config = {
            'fields': index_fields,
            'unique': kwargs.get('unique', False),
            'sparse': kwargs.get('sparse', False),
            'name': kwargs.get('name', index_name)
        }

        self._indexes[index_name] = index_config
        self._log_operation('create_index', index=index_name, fields=index_fields)

        logger.info(f"Created index '{index_name}' on collection '{self.name}' for fields: {index_fields}")
        return index_name

    def list_indexes(self) -> list:
        """List all indexes on this collection."""
        if not hasattr(self, '_indexes'):
            return []
        return [
            {
                'name': name,
                'key': {field: 1 for field in config['fields']},
                **{k: v for k, v in config.items() if k not in ['fields', 'name']}
            }
            for name, config in self._indexes.items()
        ]

    async def drop_index(self, index_name: str) -> bool:
        """Drop an index by name."""
        if not hasattr(self, '_indexes'):
            return False

        if index_name in self._indexes:
            del self._indexes[index_name]
            logger.info(f"Dropped index '{index_name}' from collection '{self.name}'")
            return True
        return False

    async def __aenter__(self):
        """
        Enter the async context manager by acquiring the lock.

        This allows for batch operations where the caller wants to perform
        multiple database operations atomically without releasing the lock
        between operations. Uses a reentrant approach to prevent deadlocks
        when collection methods are called within the context.
        """
        await self._lock.acquire()
        # Mark that we're in a context to avoid re-acquiring the lock
        self._in_context = True
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Exit the async context manager by releasing the lock."""
        self._in_context = False
        self._lock.release()
        # Return False to propagate any exceptions
        return False

    async def _acquire_lock_if_needed(self):
        """Acquire lock only if not already in context manager."""
        if not getattr(self, '_in_context', False):
            await self._lock.acquire()
            return True
        return False

    def _release_lock_if_acquired(self, was_acquired):
        """Release lock only if we acquired it."""
        if was_acquired:
            self._lock.release()

    async def _cache_result(self, cache_key: str, result: List[Dict[str, Any]], timestamp: float):
        """Cache query result with size management."""
        # Remove oldest entries if cache is full
        if len(self._query_cache) >= self._max_cache_size:
            # Remove oldest 20% of entries
            sorted_items = sorted(self._query_cache.items(), key=lambda x: x[1][1])
            remove_count = len(sorted_items) // 5
            for key, _ in sorted_items[:remove_count]:
                del self._query_cache[key]

        self._query_cache[cache_key] = (result, timestamp)

    async def _cleanup_cache(self):
        """Remove expired cache entries."""
        current_time = time.time()
        expired_keys = [
            key for key, (_, timestamp) in self._query_cache.items()
            if current_time - timestamp > self._cache_ttl
        ]
        for key in expired_keys:
            del self._query_cache[key]

        self._stats['last_cache_cleanup'] = current_time
        logger.debug(f"Cache cleanup: removed {len(expired_keys)} expired entries")

    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics."""
        total_requests = self._stats['cache_hits'] + self._stats['cache_misses']
        hit_rate = self._stats['cache_hits'] / total_requests if total_requests > 0 else 0

        return {
            'cache_hits': self._stats['cache_hits'],
            'cache_misses': self._stats['cache_misses'],
            'hit_rate': hit_rate,
            'total_queries': self._stats['total_queries'],
            'cached_entries': len(self._query_cache),
            'cache_size_limit': self._max_cache_size
        }

    async def invalidate_cache(self):
        """Invalidate all cached query results."""
        self._query_cache.clear()
        logger.debug(f"Cache invalidated for collection: {self.name}")

    async def batch_operations(self):
        """
        Returns an async context manager for performing batch operations.

        Usage:
            async with collection.batch_operations() as batch:
                # All operations within this block are performed atomically
                pass
        """
        return self

    async def clone_data(self):
        """
        Thread-safe method to clone the current data state.

        Returns:
            A deep copy of the current data for safe external access
        """
        import copy
        async with self._lock:
            return copy.deepcopy(self.data)
