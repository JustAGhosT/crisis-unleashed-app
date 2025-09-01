"""
In-Memory Database Implementation

This module provides the main database class for the in-memory database.
"""

import logging
from typing import Any, Dict

# Import related classes
from .collection import InMemoryCollection

logger = logging.getLogger(__name__)


class InMemoryDB:
    """In-memory database implementation for testing."""

    def __init__(self):
        self.collections = {}
        # Pre-create commonly used collections
        self._pre_create_collections()
        
    def _pre_create_collections(self):
        """Pre-create commonly used collections."""
        common_collections = [
            'outbox', 'users', 'cards', 'transactions', 'status_checks'
        ]
        for name in common_collections:
            self.collections[name] = InMemoryCollection(name)

    def __getattr__(self, name):
        """Allow attribute-style access (db.collection_name)."""
        if name not in self.collections:
            self.collections[name] = InMemoryCollection(name)
        return self.collections[name]
    
    def __getitem__(self, name):
        """Allow dictionary-style access (db['collection_name'])."""
        if name not in self.collections:
            self.collections[name] = InMemoryCollection(name)
        return self.collections[name]
        
    def with_options(self, options):
        """Set database options (no-op in in-memory implementation)."""
        # Ignore options for in-memory DB
        return self


# Alias for compatibility with existing code
InMemoryDatabase = InMemoryDB