"""
Database Setup Module

This module provides functionality to set up and configure database connections.
"""

import logging
from typing import Any

# Import from shared module
from backend.shared.in_memory_db import InMemoryDB

logger = logging.getLogger(__name__)

def setup_database(settings: Any) -> Any:
    """
    Set up and configure the database connection.

    Args:
        settings: Application settings

    Returns:
        Database connection
    """
    if bool(getattr(settings, "use_in_memory_db", True)):
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

        # For now, return in-memory DB as placeholder (non-prod only)
        env = str(getattr(settings, "env", "")).lower()
        if env in {"prod", "production"}:
            raise RuntimeError("Real DB not configured; refusing in-memory fallback in production")
        logger.warning("Using in-memory database (placeholder for actual DB connection)")
        return InMemoryDB()

    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        logger.warning("Falling back to in-memory database")
        return InMemoryDB()