"""
In-Memory Collection Implementation

This module provides a collection implementation for the in-memory database.
"""

import asyncio
import logging

# Import related classes
from .cursor import InMemoryCursor

logger = logging.getLogger(__name__)


class InMemoryCollection:
    """In-memory collection implementation for testing."""

    def __init__(self, name):
        self.name = name
        self.data = []
        self._id_counter = 1  # For auto-incrementing IDs
        self._lock = asyncio.Lock()  # Add lock for thread safety

    async def find(self, query=None):
        """Find documents matching query."""
        if query is None:
            return InMemoryCursor(self.data)

        # Simple query implementation
        result = []
        for doc in self.data:
            match = True
            for key, value in query.items():
                if key not in doc or doc[key] != value:
                    match = False
                    break
            if match:
                result.append(doc)

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
                    # Handle $set operator
                    if "$set" in update:
                        for key, value in update["$set"].items():
                            self.data[i][key] = value
                        modified_count += 1
                    # Handle $inc operator
                    elif "$inc" in update:
                        for key, value in update["$inc"].items():
                            current = self.data[i].get(key, 0)
                            self.data[i][key] = current + value
                        modified_count += 1
                    # Handle direct update
                    else:
                        for key, value in update.items():
                            if key != "_id":  # Don't update _id
                                self.data[i][key] = value
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
        cursor = await self.find(query)
        result = await cursor.to_list(None)
        return len(result)

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
                    elif "$inc" in update:
                        for key, value in update["$inc"].items():
                            current = self.data[i].get(key, 0)
                            self.data[i][key] = current + value
                    # Handle direct update
                    else:
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
        """Create index (no-op in in-memory implementation)."""
        # Just return the index name for compatibility
        if isinstance(keys, list):
            index_name = "_".join([f"{k[0]}_{k[1]}" for k in keys])
        else:
            index_name = f"{keys}_1"
        return index_name

    async def __aenter__(self):
        """
        Enter the async context manager by acquiring the lock.

        This allows for batch operations where the caller wants to perform
        multiple database operations atomically without releasing the lock
        between operations. Note that this creates a potential for deadlock
        if the same methods are called within the context, so this context
        manager is intended for use with direct data access patterns.
        """
        await self._lock.acquire()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Exit the async context manager by releasing the lock."""
        self._lock.release()
        # Return False to propagate any exceptions
        return False
