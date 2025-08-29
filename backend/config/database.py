"""
Database configuration and connection utilities.

Provides functions for connecting to MongoDB or fallback to in-memory database
for development environments.
"""

import os
import logging
from typing import Any
from datetime import timezone
from motor.motor_asyncio import AsyncIOMotorClient
from bson.codec_options import CodecOptions
import pymongo

logger = logging.getLogger(__name__)

# In-memory database for development
class InMemoryCollection:
    """In-memory collection implementation."""

    def __init__(self, name):
        self.name = name
        self._data = []
        self._id_counter = 1

    async def insert_one(self, document):
        # Auto-assign _id if not present
        if '_id' not in document:
            document['_id'] = self._id_counter
            self._id_counter += 1

        # Clone to avoid mutation
        doc_copy = document.copy()
        self._data.append(doc_copy)

        # Mimic MongoDB's insert result
        return type('InsertOneResult', (), {'inserted_id': document['_id']})

    async def insert_many(self, documents):
        inserted_ids = []
        for doc in documents:
            # Perform insert; insert_one assigns _id if needed
            await self.insert_one(doc)
            inserted_ids.append(doc.get('_id'))

        # Mimic MongoDB's insert result
        return type('InsertManyResult', (), {'inserted_ids': inserted_ids})

    async def find(self, query=None, sort=None):
        # Return a cursor-like object
        return InMemoryCursor(self._data)

    async def find_one(self, query=None):
        # Simple implementation that ignores the query
        if not self._data:
            return None
        return self._data[0].copy()

    async def find_one_and_update(self, filter, update, **kwargs):
        # Find matching document (simplistic, ignores most of the filter logic)
        for doc in self._data:
            # Match found - perform update
            if update.get('$set'):
                for k, v in update['$set'].items():
                    doc[k] = v
            # Return document based on return_document option
            if kwargs.get('return_document', 'before') == 'after':
                return doc.copy()
            else:
                return doc.copy()  # Should return before state, but this is simplified
        return None

    async def update_one(self, filter, update, **kwargs):
        # Find and update single document (simplistic)
        updated = 0
        for doc in self._data:
            # Match found - perform update and stop
            if update.get('$set'):
                for k, v in update['$set'].items():
                    doc[k] = v
                updated = 1
                break
            if update.get('$inc'):
                for k, v in update['$inc'].items():
                    doc[k] = doc.get(k, 0) + v
                updated = 1
                break

        # Mimic MongoDB's update result
        return type('UpdateResult', (), {'modified_count': updated, 'matched_count': updated})

    async def update_many(self, filter, update, **kwargs):
        # Find and update multiple documents (simplistic)
        updated = 0
        for doc in self._data:
            # Match found - perform update
            if update.get('$set'):
                for k, v in update['$set'].items():
                    doc[k] = v
                updated += 1

        # Mimic MongoDB's update result
        return type('UpdateResult', (), {'modified_count': updated, 'matched_count': updated})

    async def count_documents(self, query=None):
        return len(self._data)

    async def delete_many(self, filter):
        # Simplistic implementation that just clears all data
        count = len(self._data)
        self._data.clear()
        return type('DeleteResult', (), {'deleted_count': count})

    async def delete_one(self, filter):
        # Simplistic implementation that deletes first document
        if self._data:
            self._data.pop(0)
            return type('DeleteResult', (), {'deleted_count': 1})
        return type('DeleteResult', (), {'deleted_count': 0})

    async def create_index(self, keys, **kwargs):
        # No-op for in-memory DB
        return None


class InMemoryCursor:
    """Cursor-like object for in-memory database."""

    def __init__(self, data):
        self._data = data
        self._limit_val = None
        self._sort_field = None
        self._sort_dir = 1

    def sort(self, field, direction=1):
        # Store sort parameters for to_list
        self._sort_field = field
        self._sort_dir = direction
        return self

    def limit(self, n):
        # Simple limit implementation
        self._limit_val = n
        return self

    def skip(self, n):
        # Pretend to skip, but don't actually implement for simplicity
        return self

    async def to_list(self, length=None):
        # Apply any sorting
        result_data = self._data.copy()

        # Apply limit
        limit = min(self._limit_val or float('inf'), len(result_data))
        limit = min(length or float('inf'), limit) if length is not None else limit

        # Return a copy of the data to prevent mutation
        return [doc.copy() for doc in result_data[:int(limit)]]


class InMemoryDatabase:
    """Simple in-memory database for development and testing."""

    def __init__(self):
        self._collections = {}
        # Pre-create commonly used collections
        self._collections['outbox'] = InMemoryCollection('outbox')
        self._collections['users'] = InMemoryCollection('users')
        self._collections['cards'] = InMemoryCollection('cards')
        self._collections['transactions'] = InMemoryCollection('transactions')
        self._collections['status_checks'] = InMemoryCollection('status_checks')

    def __getitem__(self, name):
        if name not in self._collections:
            self._collections[name] = InMemoryCollection(name)
        return self._collections[name]

    def __getattr__(self, name):
        # Allow attribute-style access (db.collection_name)
        return self[name]

    def with_options(self, options):
        # Ignore options for in-memory DB
        return self


def get_database_connection(settings) -> Any:
    """
    Get a database connection based on configuration.

    Returns either a MongoDB client or an in-memory database for development.
    """
    use_in_memory = os.environ.get("USE_IN_MEMORY_DB", "").lower() in ("true", "1", "yes")

    if use_in_memory:
        logger.warning(
            "Using in-memory database for development. "
            "Data will not persist between restarts."
        )
        return InMemoryDatabase()

    try:
        # Try to connect to MongoDB
        client = AsyncIOMotorClient(
            settings.mongo_url,
            tz_aware=True,
            tzinfo=timezone.utc,
            serverSelectionTimeoutMS=5000  # 5 second timeout for faster feedback
        )

        # Perform a synchronous ping using pymongo to validate connectivity from this thread.
        # Motor operations are async and would require awaiting; we avoid that here.
        from pymongo.mongo_client import MongoClient as SyncMongoClient
        sync_client: SyncMongoClient = pymongo.MongoClient(
            settings.mongo_url,
            tz_aware=True,
            serverSelectionTimeoutMS=5000,
        )
        sync_client.admin.command("ping")
        sync_client.close()

        logger.info(f"Connected to MongoDB at {settings.mongo_url}")
        return client[settings.database_name].with_options(
            CodecOptions(tz_aware=True, tzinfo=timezone.utc)
        )
    except Exception as e:
        if os.environ.get("ENVIRONMENT", "development") == "production":
            # In production, we want to fail if MongoDB is not available
            logger.critical(f"Failed to connect to MongoDB: {e}")
            raise

        logger.warning(
            f"Failed to connect to MongoDB: {e}. "
            "Falling back to in-memory database for development."
        )
        return InMemoryDatabase()
