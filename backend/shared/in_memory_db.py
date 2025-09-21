"""
In-Memory Database Implementation

This module provides an in-memory database implementation primarily for testing
and development environments. It simulates basic MongoDB functionality without
requiring an actual database connection.

Note: This file is maintained for backward compatibility.
The actual implementation has been split into the 'db' package.
"""

# Import all classes from the new modular structure
from .db import (
    InMemoryCursor,
    InMemoryCollection,
    InMemoryDB,
    InMemoryDatabase,
)

# Export all classes
__all__ = ['InMemoryCursor', 'InMemoryCollection', 'InMemoryDB', 'InMemoryDatabase']