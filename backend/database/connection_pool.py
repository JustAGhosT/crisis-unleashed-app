"""
Database connection pooling for Crisis Unleashed backend.

This module provides efficient database connection management with pooling,
health monitoring, and automatic reconnection capabilities.
"""

import asyncio
import logging
import time
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional, AsyncGenerator, List
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import pymongo
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
import threading

logger = logging.getLogger(__name__)


class DatabaseConfig:
    """Configuration for database connection pooling."""

    def __init__(
        self,
        uri: str,
        database_name: str,
        min_pool_size: int = 5,
        max_pool_size: int = 20,
        max_idle_time_ms: int = 30000,
        server_selection_timeout_ms: int = 5000,
        socket_timeout_ms: int = 5000,
        connect_timeout_ms: int = 5000,
        heartbeat_frequency_ms: int = 10000,
        retry_writes: bool = True,
        retry_reads: bool = True
    ):
        """
        Initialize database configuration.

        Args:
            uri: MongoDB connection URI
            database_name: Name of the database
            min_pool_size: Minimum connections to maintain
            max_pool_size: Maximum connections allowed
            max_idle_time_ms: Max idle time before closing connection
            server_selection_timeout_ms: Timeout for server selection
            socket_timeout_ms: Socket timeout
            connect_timeout_ms: Connection timeout
            heartbeat_frequency_ms: Heartbeat frequency
            retry_writes: Whether to retry writes
            retry_reads: Whether to retry reads
        """
        self.uri = uri
        self.database_name = database_name
        self.min_pool_size = min_pool_size
        self.max_pool_size = max_pool_size
        self.max_idle_time_ms = max_idle_time_ms
        self.server_selection_timeout_ms = server_selection_timeout_ms
        self.socket_timeout_ms = socket_timeout_ms
        self.connect_timeout_ms = connect_timeout_ms
        self.heartbeat_frequency_ms = heartbeat_frequency_ms
        self.retry_writes = retry_writes
        self.retry_reads = retry_reads

    def to_motor_kwargs(self) -> Dict[str, Any]:
        """Convert config to Motor client kwargs."""
        return {
            "minPoolSize": self.min_pool_size,
            "maxPoolSize": self.max_pool_size,
            "maxIdleTimeMS": self.max_idle_time_ms,
            "serverSelectionTimeoutMS": self.server_selection_timeout_ms,
            "socketTimeoutMS": self.socket_timeout_ms,
            "connectTimeoutMS": self.connect_timeout_ms,
            "heartbeatFrequencyMS": self.heartbeat_frequency_ms,
            "retryWrites": self.retry_writes,
            "retryReads": self.retry_reads,
            "appName": "CrisisUnleashed"
        }


class ConnectionPoolStats:
    """Statistics for database connection pool."""

    def __init__(self):
        self.connections_created = 0
        self.connections_closed = 0
        self.active_connections = 0
        self.failed_connections = 0
        self.reconnect_attempts = 0
        self.successful_operations = 0
        self.failed_operations = 0
        self.start_time = time.time()
        self._lock = threading.Lock()

    def record_connection_created(self):
        with self._lock:
            self.connections_created += 1
            self.active_connections += 1

    def record_connection_closed(self):
        with self._lock:
            self.connections_closed += 1
            self.active_connections = max(0, self.active_connections - 1)

    def record_failed_connection(self):
        with self._lock:
            self.failed_connections += 1

    def record_reconnect_attempt(self):
        with self._lock:
            self.reconnect_attempts += 1

    def record_successful_operation(self):
        with self._lock:
            self.successful_operations += 1

    def record_failed_operation(self):
        with self._lock:
            self.failed_operations += 1

    def get_stats(self) -> Dict[str, Any]:
        with self._lock:
            uptime = time.time() - self.start_time
            success_rate = 0
            if self.successful_operations + self.failed_operations > 0:
                success_rate = self.successful_operations / (
                    self.successful_operations + self.failed_operations
                ) * 100

            return {
                "uptime_seconds": round(uptime, 2),
                "connections_created": self.connections_created,
                "connections_closed": self.connections_closed,
                "active_connections": self.active_connections,
                "failed_connections": self.failed_connections,
                "reconnect_attempts": self.reconnect_attempts,
                "successful_operations": self.successful_operations,
                "failed_operations": self.failed_operations,
                "success_rate_percent": round(success_rate, 2)
            }


class DatabaseConnectionPool:
    """
    Database connection pool manager with health monitoring and reconnection.
    """

    def __init__(self, config: DatabaseConfig):
        """
        Initialize database connection pool.

        Args:
            config: Database configuration
        """
        self.config = config
        self.client: Optional[AsyncIOMotorClient] = None
        self.database: Optional[AsyncIOMotorDatabase] = None
        self.stats = ConnectionPoolStats()
        self._lock = asyncio.Lock()
        self._health_check_task: Optional[asyncio.Task] = None
        self._is_healthy = False
        self._last_health_check = 0
        self._health_check_interval = 30  # seconds

        logger.info(f"Database connection pool initialized for {config.database_name}")

    async def connect(self) -> bool:
        """
        Establish database connection with retry logic.

        Returns:
            True if connection successful, False otherwise
        """
        async with self._lock:
            try:
                if self.client:
                    await self.close()

                # Create Motor client with connection pooling
                self.client = AsyncIOMotorClient(
                    self.config.uri,
                    **self.config.to_motor_kwargs()
                )

                # Get database reference
                self.database = self.client[self.config.database_name]

                # Test connection
                await self._test_connection()

                self.stats.record_connection_created()
                self._is_healthy = True

                # Start health monitoring
                if not self._health_check_task or self._health_check_task.done():
                    self._health_check_task = asyncio.create_task(
                        self._health_monitor()
                    )

                logger.info("Database connection established successfully")
                return True

            except Exception as e:
                self.stats.record_failed_connection()
                logger.error(f"Failed to connect to database: {e}")
                return False

    async def close(self) -> None:
        """Close database connection and cleanup resources."""
        async with self._lock:
            # Cancel health check task
            if self._health_check_task and not self._health_check_task.done():
                self._health_check_task.cancel()
                try:
                    await self._health_check_task
                except asyncio.CancelledError:
                    pass

            # Close client connection
            if self.client:
                self.client.close()
                self.stats.record_connection_closed()
                self.client = None
                self.database = None

            self._is_healthy = False
            logger.info("Database connection closed")

    async def _test_connection(self) -> None:
        """Test database connection by performing a simple operation."""
        if not self.database:
            raise ConnectionFailure("Database not initialized")

        # Perform a simple ping operation
        await self.database.command("ping")

    async def _health_monitor(self) -> None:
        """Background task to monitor database connection health."""
        while True:
            try:
                await asyncio.sleep(self._health_check_interval)

                current_time = time.time()
                self._last_health_check = current_time

                # Test connection health
                await self._test_connection()

                if not self._is_healthy:
                    self._is_healthy = True
                    logger.info("Database connection health restored")

            except asyncio.CancelledError:
                logger.info("Health monitor cancelled")
                break
            except Exception as e:
                if self._is_healthy:
                    self._is_healthy = False
                    logger.warning(f"Database connection health check failed: {e}")

                # Attempt to reconnect
                try:
                    self.stats.record_reconnect_attempt()
                    await self.connect()
                except Exception as reconnect_error:
                    logger.error(f"Failed to reconnect to database: {reconnect_error}")

    @asynccontextmanager
    async def get_database(self) -> AsyncGenerator[AsyncIOMotorDatabase, None]:
        """
        Get database connection with automatic retry.

        Yields:
            Database connection
        """
        if not self.database:
            success = await self.connect()
            if not success:
                raise ConnectionFailure("Unable to establish database connection")

        try:
            yield self.database
            self.stats.record_successful_operation()
        except Exception as e:
            self.stats.record_failed_operation()
            logger.error(f"Database operation failed: {e}")

            # If connection error, mark as unhealthy
            if isinstance(e, (ConnectionFailure, ServerSelectionTimeoutError)):
                self._is_healthy = False

            raise

    async def get_collection(self, collection_name: str):
        """
        Get a collection with connection management.

        Args:
            collection_name: Name of the collection

        Returns:
            Collection object
        """
        async with self.get_database() as db:
            return db[collection_name]

    async def execute_with_retry(
        self,
        operation: callable,
        max_retries: int = 3,
        retry_delay: float = 1.0
    ) -> Any:
        """
        Execute database operation with automatic retry.

        Args:
            operation: Database operation to execute
            max_retries: Maximum retry attempts
            retry_delay: Delay between retries in seconds

        Returns:
            Operation result

        Raises:
            Exception: If operation fails after all retries
        """
        last_exception = None

        for attempt in range(max_retries + 1):
            try:
                async with self.get_database() as db:
                    result = await operation(db)
                    return result

            except (ConnectionFailure, ServerSelectionTimeoutError) as e:
                last_exception = e

                if attempt < max_retries:
                    logger.warning(f"Database operation failed, retrying in {retry_delay}s (attempt {attempt + 1}/{max_retries})")
                    await asyncio.sleep(retry_delay)

                    # Try to reconnect
                    await self.connect()
                else:
                    logger.error(f"Database operation failed after {max_retries} retries")

            except Exception as e:
                # Non-connection errors should not be retried
                last_exception = e
                break

        raise last_exception

    def is_healthy(self) -> bool:
        """
        Check if database connection is healthy.

        Returns:
            True if connection is healthy
        """
        return self._is_healthy

    def get_connection_stats(self) -> Dict[str, Any]:
        """
        Get comprehensive connection statistics.

        Returns:
            Dictionary with connection statistics
        """
        base_stats = self.stats.get_stats()

        # Add connection pool specific info
        pool_info = {}
        if self.client and hasattr(self.client, 'topology_description'):
            try:
                topology = self.client.topology_description
                pool_info = {
                    "topology_type": str(topology.topology_type),
                    "server_count": len(topology.server_descriptions()),
                    "max_pool_size": self.config.max_pool_size,
                    "min_pool_size": self.config.min_pool_size
                }
            except Exception:
                pass

        return {
            "is_healthy": self._is_healthy,
            "last_health_check": self._last_health_check,
            "database_name": self.config.database_name,
            **base_stats,
            **pool_info
        }


# Global connection pool instances
_connection_pools: Dict[str, DatabaseConnectionPool] = {}
_pool_lock = threading.Lock()


def get_connection_pool(config: DatabaseConfig) -> DatabaseConnectionPool:
    """
    Get or create a database connection pool.

    Args:
        config: Database configuration

    Returns:
        Database connection pool
    """
    pool_key = f"{config.database_name}:{hash(config.uri)}"

    with _pool_lock:
        if pool_key not in _connection_pools:
            _connection_pools[pool_key] = DatabaseConnectionPool(config)

        return _connection_pools[pool_key]


async def close_all_pools():
    """Close all database connection pools."""
    with _pool_lock:
        tasks = []
        for pool in _connection_pools.values():
            tasks.append(pool.close())

        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

        _connection_pools.clear()
        logger.info("All database connection pools closed")


def get_all_pool_stats() -> Dict[str, Dict[str, Any]]:
    """Get statistics for all connection pools."""
    with _pool_lock:
        return {
            pool_key: pool.get_connection_stats()
            for pool_key, pool in _connection_pools.items()
        }