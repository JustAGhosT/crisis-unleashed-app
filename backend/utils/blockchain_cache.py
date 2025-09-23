"""
Blockchain RPC call caching system for Crisis Unleashed.

This module provides intelligent caching for blockchain operations to reduce
external API calls, improve performance, and handle rate limiting.
"""

import asyncio
import hashlib
import json
import logging
import time
from datetime import datetime, timedelta
from typing import Any, Dict, Optional, Callable, Union, Tuple
from functools import wraps
import threading

logger = logging.getLogger(__name__)


class CacheEntry:
    """Represents a cached entry with TTL and metadata."""

    def __init__(self, value: Any, ttl_seconds: int, cache_time: Optional[float] = None):
        self.value = value
        self.ttl_seconds = ttl_seconds
        self.cache_time = cache_time or time.time()
        self.access_count = 1
        self.last_access = self.cache_time

    def is_expired(self) -> bool:
        """Check if the cache entry has expired."""
        return time.time() - self.cache_time > self.ttl_seconds

    def touch(self) -> None:
        """Update last access time and increment access count."""
        self.last_access = time.time()
        self.access_count += 1

    def age_seconds(self) -> float:
        """Get the age of this cache entry in seconds."""
        return time.time() - self.cache_time


class BlockchainCache:
    """
    Intelligent caching system for blockchain RPC calls.

    Features:
    - TTL-based expiration
    - LRU eviction
    - Operation-specific cache policies
    - Thread-safe operations
    - Cache statistics
    """

    # Default TTL values for different operation types (in seconds)
    DEFAULT_TTL_CONFIG = {
        'block_info': 60,           # Block info changes frequently
        'transaction_status': 30,   # Transaction status can change
        'transaction_receipt': 3600, # Transaction receipts are immutable
        'balance': 120,             # Balance changes moderately
        'nft_owner': 300,          # NFT ownership changes less frequently
        'network_info': 1800,      # Network info is relatively stable
        'gas_price': 30,           # Gas prices fluctuate
        'contract_call': 180,      # Contract calls can vary
        'default': 300             # Default for unlabeled operations
    }

    def __init__(self, max_size: int = 1000, enable_stats: bool = True):
        """
        Initialize the blockchain cache.

        Args:
            max_size: Maximum number of entries to store
            enable_stats: Whether to collect cache statistics
        """
        self.max_size = max_size
        self.enable_stats = enable_stats
        self._cache: Dict[str, CacheEntry] = {}
        self._lock = threading.RLock()
        self._ttl_config = self.DEFAULT_TTL_CONFIG.copy()

        # Statistics
        self._stats = {
            'hits': 0,
            'misses': 0,
            'evictions': 0,
            'expired_cleanups': 0,
            'total_requests': 0
        } if enable_stats else None

        logger.info(f"BlockchainCache initialized with max_size={max_size}")

    def _generate_cache_key(self, operation: str, **params) -> str:
        """
        Generate a deterministic cache key for the operation and parameters.

        Args:
            operation: Type of blockchain operation
            **params: Parameters for the operation

        Returns:
            Unique cache key string
        """
        # Create a normalized parameter string
        param_str = json.dumps(params, sort_keys=True, default=str)
        key_data = f"{operation}:{param_str}"

        # Create a hash to keep keys manageable
        return hashlib.md5(key_data.encode()).hexdigest()

    def _cleanup_expired(self) -> int:
        """
        Remove expired entries from cache.

        Returns:
            Number of entries removed
        """
        with self._lock:
            expired_keys = [
                key for key, entry in self._cache.items()
                if entry.is_expired()
            ]

            for key in expired_keys:
                del self._cache[key]

            if self.enable_stats and expired_keys:
                self._stats['expired_cleanups'] += len(expired_keys)

            return len(expired_keys)

    def _evict_lru(self, target_size: int) -> int:
        """
        Evict least recently used entries to reach target size.

        Args:
            target_size: Target cache size after eviction

        Returns:
            Number of entries evicted
        """
        with self._lock:
            if len(self._cache) <= target_size:
                return 0

            # Sort by last access time (LRU)
            sorted_entries = sorted(
                self._cache.items(),
                key=lambda x: x[1].last_access
            )

            evict_count = len(self._cache) - target_size
            evicted = 0

            for key, _ in sorted_entries[:evict_count]:
                if key in self._cache:
                    del self._cache[key]
                    evicted += 1

            if self.enable_stats:
                self._stats['evictions'] += evicted

            return evicted

    def set_ttl_config(self, operation: str, ttl_seconds: int) -> None:
        """
        Set custom TTL for a specific operation type.

        Args:
            operation: Operation type
            ttl_seconds: TTL in seconds
        """
        with self._lock:
            self._ttl_config[operation] = ttl_seconds
            logger.debug(f"Set TTL for {operation}: {ttl_seconds}s")

    def get(self, operation: str, **params) -> Optional[Any]:
        """
        Get a value from cache.

        Args:
            operation: Type of blockchain operation
            **params: Parameters for the operation

        Returns:
            Cached value or None if not found/expired
        """
        key = self._generate_cache_key(operation, **params)

        with self._lock:
            if self.enable_stats:
                self._stats['total_requests'] += 1

            entry = self._cache.get(key)

            if entry is None:
                if self.enable_stats:
                    self._stats['misses'] += 1
                return None

            if entry.is_expired():
                del self._cache[key]
                if self.enable_stats:
                    self._stats['misses'] += 1
                    self._stats['expired_cleanups'] += 1
                return None

            # Update access information
            entry.touch()

            if self.enable_stats:
                self._stats['hits'] += 1

            logger.debug(f"Cache hit for {operation} (age: {entry.age_seconds():.1f}s)")
            return entry.value

    def set(self, operation: str, value: Any, **params) -> None:
        """
        Store a value in cache.

        Args:
            operation: Type of blockchain operation
            value: Value to cache
            **params: Parameters for the operation
        """
        key = self._generate_cache_key(operation, **params)
        ttl = self._ttl_config.get(operation, self._ttl_config['default'])

        with self._lock:
            # Clean expired entries periodically
            if len(self._cache) > self.max_size * 0.8:
                self._cleanup_expired()

            # Evict LRU entries if we're at capacity
            if len(self._cache) >= self.max_size:
                self._evict_lru(int(self.max_size * 0.8))

            # Store the new entry
            entry = CacheEntry(value, ttl)
            self._cache[key] = entry

            logger.debug(f"Cached {operation} with TTL {ttl}s")

    def invalidate(self, operation: str, **params) -> bool:
        """
        Invalidate a specific cache entry.

        Args:
            operation: Type of blockchain operation
            **params: Parameters for the operation

        Returns:
            True if entry was found and removed
        """
        key = self._generate_cache_key(operation, **params)

        with self._lock:
            if key in self._cache:
                del self._cache[key]
                logger.debug(f"Invalidated cache entry for {operation}")
                return True
            return False

    def clear(self) -> None:
        """Clear all cache entries."""
        with self._lock:
            self._cache.clear()
            if self.enable_stats:
                # Reset stats except total requests which is cumulative
                total_requests = self._stats.get('total_requests', 0)
                self._stats = {
                    'hits': 0,
                    'misses': 0,
                    'evictions': 0,
                    'expired_cleanups': 0,
                    'total_requests': total_requests
                }
            logger.info("Cache cleared")

    def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics.

        Returns:
            Dictionary containing cache statistics
        """
        with self._lock:
            if not self.enable_stats:
                return {'stats_disabled': True}

            total_requests = self._stats['total_requests']
            hit_rate = (self._stats['hits'] / total_requests * 100) if total_requests > 0 else 0

            return {
                'size': len(self._cache),
                'max_size': self.max_size,
                'hit_rate': f"{hit_rate:.2f}%",
                'stats': self._stats.copy(),
                'oldest_entry_age': self._get_oldest_entry_age(),
                'ttl_config': self._ttl_config.copy()
            }

    def _get_oldest_entry_age(self) -> Optional[float]:
        """Get the age of the oldest entry in seconds."""
        if not self._cache:
            return None

        oldest = min(entry.cache_time for entry in self._cache.values())
        return time.time() - oldest


# Global cache instance
_global_cache: Optional[BlockchainCache] = None


def get_blockchain_cache() -> BlockchainCache:
    """
    Get the global blockchain cache instance.

    Returns:
        Global BlockchainCache instance
    """
    global _global_cache
    if _global_cache is None:
        _global_cache = BlockchainCache()
    return _global_cache


def cached_blockchain_operation(operation_type: str, ttl: Optional[int] = None):
    """
    Decorator for caching blockchain operations.

    Args:
        operation_type: Type of operation for cache categorization
        ttl: Custom TTL in seconds (optional)

    Returns:
        Decorated function with caching
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache = get_blockchain_cache()

            # Set custom TTL if provided
            if ttl is not None:
                cache.set_ttl_config(operation_type, ttl)

            # Try to get from cache first
            cached_result = cache.get(operation_type, args=args, kwargs=kwargs)
            if cached_result is not None:
                return cached_result

            # Execute the function and cache result
            result = func(*args, **kwargs)
            cache.set(operation_type, result, args=args, kwargs=kwargs)
            return result

        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            cache = get_blockchain_cache()

            # Set custom TTL if provided
            if ttl is not None:
                cache.set_ttl_config(operation_type, ttl)

            # Try to get from cache first
            cached_result = cache.get(operation_type, args=args, kwargs=kwargs)
            if cached_result is not None:
                return cached_result

            # Execute the async function and cache result
            result = await func(*args, **kwargs)
            cache.set(operation_type, result, args=args, kwargs=kwargs)
            return result

        return async_wrapper if asyncio.iscoroutinefunction(func) else wrapper
    return decorator