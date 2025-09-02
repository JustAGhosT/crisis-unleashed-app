"""
In-Memory Database Implementation

This module provides the main database class for the in-memory database.
"""

import logging
import threading
from typing import Any, Dict

# Import related classes
from .collection import InMemoryCollection

logger = logging.getLogger(__name__)


class InMemoryDB:
    """In-memory database implementation for testing."""

    def __init__(self) -> None:
        # Dedicated store and lock to avoid attribute collisions and ensure thread-safety
        self._collections: Dict[str, InMemoryCollection] = {}
        self._lock = threading.RLock()
        # Pre-create commonly used collections
        self._pre_create_collections()
        
    def _pre_create_collections(self) -> None:
        """Pre-create commonly used collections."""
        common_collections = [
            'outbox', 'users', 'cards', 'transactions', 'status_checks'
        ]
        for name in common_collections:
            self._collections[name] = InMemoryCollection(name)

    def _get_or_create(self, name: str) -> InMemoryCollection:
        """Thread-safe method to get or create a collection by name."""
        with self._lock:
            if name not in self._collections:
                self._collections[name] = InMemoryCollection(name)
            return self._collections[name]

    def __getattr__(self, name: str) -> InMemoryCollection:
        """Allow attribute-style access (db.collection_name). Creates on first access."""
        if name.startswith('_'):
            # Preserve normal attribute semantics for private/dunder names
            raise AttributeError(name)
        return self._get_or_create(name)
    
    def __getitem__(self, name: str) -> InMemoryCollection:
        """Allow dictionary-style access (db['collection_name'])."""
        return self._get_or_create(name)
        
    def with_options(self, options):
        """Set database options (no-op in in-memory implementation)."""
        # Ignore options for in-memory DB
        return self


# Alias for compatibility with existing code
InMemoryDatabase = InMemoryDB