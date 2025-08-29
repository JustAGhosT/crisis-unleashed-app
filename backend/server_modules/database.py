"""
Database Setup Module

This module provides functionality to set up and configure database connections.
"""

import logging
from typing import Any

logger = logging.getLogger(__name__)

class InMemoryCursor:
    """In-memory cursor implementation for testing."""

    def __init__(self, data):
        self.data = data.copy() if data else []
        self.skip_count = 0
        self.limit_count = None
        self.sort_field = None
        self.sort_direction = 1

    def skip(self, n):
        """Skip n documents."""
        self.skip_count = n
        return self

    def limit(self, n):
        """Limit to n documents."""
        self.limit_count = n
        return self

    def sort(self, *args):
        """Sort documents by field."""
        if len(args) >= 2:
            self.sort_field = args[0]
            self.sort_direction = args[1]
        return self

    def with_options(self, options):
        """Set cursor options."""
        # Not implemented for in-memory cursor
        return self

    async def to_list(self, length):
        """Convert cursor to list."""
        result = self.data

        # Apply sorting if specified
        if self.sort_field:
            reverse = self.sort_direction == -1
            result = sorted(
                result,
                key=lambda x: x.get(self.sort_field, ''),
                reverse=reverse
            )

        # Apply skip and limit
        if self.skip_count:
            result = result[self.skip_count:]

        if self.limit_count is not None:
            result = result[:self.limit_count]

        return result[:length] if length else result

class InMemoryCollection:
    """In-memory collection implementation for testing."""

    def __init__(self, name):
        self.name = name
        self.data = []

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
        self.data.append(document)
        return {"inserted_id": document.get("_id")}

    async def update_one(self, filter, update, **kwargs):
        """Update one document matching filter."""
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
                # Handle direct update
                else:
                    for key, value in update.items():
                        if key != "_id":  # Don't update _id
                            self.data[i][key] = value
                return {"modified_count": 1}

        return {"modified_count": 0}

    async def update_many(self, filter, update, **kwargs):
        """Update many documents matching filter."""
        modified_count = 0
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
                # Handle direct update
                else:
                    for key, value in update.items():
                        if key != "_id":  # Don't update _id
                            self.data[i][key] = value
                modified_count += 1

        return {"modified_count": modified_count}

    async def delete_one(self, filter):
        """Delete one document matching filter."""
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
        original_count = len(self.data)

        # Filter out documents that don't match
        self.data = [
            doc for doc in self.data
            if not all(key in doc and doc[key] == value for key, value in filter.items())
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
                # Handle direct update
                else:
                    for key, value in update.items():
                        if key != "_id":  # Don't update _id
                            self.data[i][key] = value

                # Return based on return_document option
                if kwargs.get("return_document", "before") == "after":
                    return self.data[i]
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

class InMemoryDB:
    """In-memory database implementation for testing."""

    def __init__(self):
        self.collections = {}

    def __getattr__(self, name):
        if name not in self.collections:
            self.collections[name] = InMemoryCollection(name)
        return self.collections[name]

def setup_database(settings: Any) -> Any:
    """
    Set up and configure the database connection.

    Args:
        settings: Application settings

    Returns:
        Database connection
    """
    if settings.use_in_memory_db:
        logger.info("Using in-memory database")
        return InMemoryDB()

    try:
        # Here you would implement your actual database connection
        # For example, with motor for MongoDB:
        #
        # from motor.motor_asyncio import AsyncIOMotorClient
        # client = AsyncIOMotorClient(settings.mongodb_uri)
        # db = client[settings.mongodb_db_name]
        # return db

        # For now, return in-memory DB as placeholder
        logger.warning("Using in-memory database (placeholder for actual DB connection)")
        return InMemoryDB()

    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        logger.warning("Falling back to in-memory database")
        return InMemoryDB()
