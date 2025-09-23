"""
Database Setup Module

This module provides functionality to set up and configure database connections.
"""

import logging
from typing import Any

# Import from shared module
from backend.shared.in_memory_db import InMemoryDB

logger = logging.getLogger(__name__)

class DatabaseConfig:
    """Database configuration helper."""

    @staticmethod
    def get_connection_params(settings: Any) -> dict:
        """Extract database connection parameters from settings."""
        return {
            "mongodb_uri": getattr(settings, "mongodb_uri", ""),
            "mongodb_db_name": getattr(settings, "mongodb_db_name", "crisis_unleashed"),
            "connection_timeout": getattr(settings, "db_connection_timeout", 10000),
            "server_selection_timeout": getattr(settings, "db_server_selection_timeout", 5000),
            "max_pool_size": getattr(settings, "db_max_pool_size", 10),
            "min_pool_size": getattr(settings, "db_min_pool_size", 1),
            "max_idle_time": getattr(settings, "db_max_idle_time", 300000),  # 5 minutes
        }

def setup_database(settings: Any) -> Any:
    """
    Set up and configure the database connection with environment-specific optimizations.

    Args:
        settings: Application settings

    Returns:
        Database connection
    """
    env = str(getattr(settings, "env", "development")).lower()
    use_in_memory = bool(getattr(settings, "use_in_memory_db", env in {"development", "test"}))

    if use_in_memory:
        logger.info(f"Using in-memory database for {env} environment")
        return InMemoryDB()

    # Get database configuration
    db_config = DatabaseConfig.get_connection_params(settings)

    try:
        # Production environment requires real database
        if env in {"prod", "production"} and not db_config["mongodb_uri"]:
            raise RuntimeError(
                "Production environment requires real database configuration. "
                "Set MONGODB_URI environment variable."
            )

        # If MongoDB URI is available, use it
        if db_config["mongodb_uri"]:
            logger.info(f"Attempting to connect to MongoDB for {env} environment")
            logger.debug(f"Database config: max_pool_size={db_config['max_pool_size']}, "
                        f"connection_timeout={db_config['connection_timeout']}ms")

            # Here you would implement your actual database connection with pooling:
            #
            # from motor.motor_asyncio import AsyncIOMotorClient
            # client = AsyncIOMotorClient(
            #     db_config["mongodb_uri"],
            #     maxPoolSize=db_config["max_pool_size"],
            #     minPoolSize=db_config["min_pool_size"],
            #     maxIdleTimeMS=db_config["max_idle_time"],
            #     connectTimeoutMS=db_config["connection_timeout"],
            #     serverSelectionTimeoutMS=db_config["server_selection_timeout"]
            # )
            # db = client[db_config["mongodb_db_name"]]
            #
            # # Test connection
            # await client.admin.command('ping')
            # logger.info("Successfully connected to MongoDB")
            # return db

            # For now, fall back to in-memory for non-production
            if env not in {"prod", "production"}:
                logger.warning("MongoDB configuration found but using in-memory database for development")
                return InMemoryDB()

        # For now, return in-memory DB as placeholder (non-prod only)
        if env in {"prod", "production"}:
            raise RuntimeError("Real DB not configured; refusing in-memory fallback in production")

        logger.warning(f"Using in-memory database (placeholder for actual DB connection) in {env}")
        return InMemoryDB()

    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")

        # Only allow fallback in development
        if env in {"prod", "production"}:
            logger.critical("Database connection failed in production - cannot continue")
            raise

        logger.warning("Falling back to in-memory database")
        return InMemoryDB()