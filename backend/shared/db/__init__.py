"""
In-Memory Database Package

This package provides an in-memory database implementation primarily for testing
and development environments. It simulates basic MongoDB functionality without
requiring an actual database connection.
"""

# Import main classes for easy access
from .cursor import InMemoryCursor
from .collection import InMemoryCollection
from .database import InMemoryDB, InMemoryDatabase

__all__ = ['InMemoryCursor', 'InMemoryCollection', 'InMemoryDB', 'InMemoryDatabase']