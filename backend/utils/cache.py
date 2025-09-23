"""
Comprehensive API Response Caching System

Provides intelligent caching with TTL, cache invalidation,
and memory-efficient storage for API responses.
"""

import asyncio
import json
import logging
import time
import hashlib
from typing import Any, Dict, List, Optional, Union, Callable
from functools import wraps
from dataclasses import dataclass, asdict
from enum import Enum
import weakref

logger = logging.getLogger(__name__)


class CacheStrategy(Enum):
    """Cache strategy options."""
    LRU = "lru"  # Least Recently Used
    LFU = "lfu"  # Least Frequently Used
    TTL = "ttl"  # Time To Live only
    ADAPTIVE = "adaptive"  # Dynamic strategy based on usage


@dataclass
class CacheEntry:
    """Cache entry with metadata."""
    value: Any
    created_at: float
    last_accessed: float
    access_count: int
    ttl: Optional[float]
    tags: List[str]
    size: int

    def is_expired(self) -> bool:
        """Check if cache entry has expired."""
        if self.ttl is None:
            return False
        return time.time() - self.created_at > self.ttl

    def touch(self) -> None:
        """Update last accessed time and increment access count."""
        self.last_accessed = time.time()
        self.access_count += 1


class InMemoryCache:
    """High-performance in-memory cache with intelligent eviction."""

    def __init__(
        self,
        max_size: int = 1000,
        default_ttl: Optional[float] = 3600,  # 1 hour
        strategy: CacheStrategy = CacheStrategy.LRU,
        max_memory_mb: float = 100  # 100MB limit
    ):
        self.max_size = max_size
        self.default_ttl = default_ttl
        self.strategy = strategy
        self.max_memory_bytes = max_memory_mb * 1024 * 1024

        self._cache: Dict[str, CacheEntry] = {}
        self._access_times: Dict[str, float] = {}
        self._size_tracker = 0
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        async with self._lock:
            entry = self._cache.get(key)

            if entry is None:
                return None

            # Check expiration
            if entry.is_expired():
                await self._remove_entry(key)
                return None

            # Update access metadata
            entry.touch()
            self._access_times[key] = time.time()

            logger.debug(f"Cache hit for key: {key}")
            return entry.value

    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[float] = None,
        tags: Optional[List[str]] = None
    ) -> None:
        """Set value in cache."""
        async with self._lock:
            ttl = ttl if ttl is not None else self.default_ttl
            tags = tags or []

            # Calculate size
            try:
                size = len(json.dumps(value, default=str))
            except (TypeError, ValueError):
                size = len(str(value))

            # Check if we need to make room
            await self._ensure_capacity(size)

            # Create cache entry
            entry = CacheEntry(
                value=value,
                created_at=time.time(),
                last_accessed=time.time(),
                access_count=1,
                ttl=ttl,
                tags=tags,
                size=size
            )

            # Remove old entry if exists
            if key in self._cache:
                await self._remove_entry(key)

            # Add new entry
            self._cache[key] = entry
            self._access_times[key] = time.time()
            self._size_tracker += size

            logger.debug(f"Cache set for key: {key}, size: {size} bytes")

    async def delete(self, key: str) -> bool:
        """Delete specific key from cache."""
        async with self._lock:
            if key in self._cache:
                await self._remove_entry(key)
                logger.debug(f"Cache deleted key: {key}")
                return True
            return False

    async def clear(self) -> None:
        """Clear all cache entries."""
        async with self._lock:
            self._cache.clear()
            self._access_times.clear()
            self._size_tracker = 0
            logger.info("Cache cleared")

    async def invalidate_by_tags(self, tags: List[str]) -> int:
        """Invalidate all entries with specified tags."""
        async with self._lock:
            keys_to_remove = []

            for key, entry in self._cache.items():
                if any(tag in entry.tags for tag in tags):
                    keys_to_remove.append(key)

            for key in keys_to_remove:
                await self._remove_entry(key)

            count = len(keys_to_remove)
            logger.info(f"Invalidated {count} cache entries by tags: {tags}")
            return count

    async def cleanup_expired(self) -> int:
        """Remove all expired entries."""
        async with self._lock:
            expired_keys = []

            for key, entry in self._cache.items():
                if entry.is_expired():
                    expired_keys.append(key)

            for key in expired_keys:
                await self._remove_entry(key)

            count = len(expired_keys)
            if count > 0:
                logger.info(f"Cleaned up {count} expired cache entries")
            return count

    async def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        async with self._lock:
            total_entries = len(self._cache)
            expired_count = sum(1 for entry in self._cache.values() if entry.is_expired())

            if total_entries > 0:
                avg_access_count = sum(entry.access_count for entry in self._cache.values()) / total_entries
                avg_age = time.time() - sum(entry.created_at for entry in self._cache.values()) / total_entries
            else:
                avg_access_count = 0
                avg_age = 0

            return {
                "total_entries": total_entries,
                "expired_entries": expired_count,
                "memory_usage_mb": self._size_tracker / (1024 * 1024),
                "memory_limit_mb": self.max_memory_bytes / (1024 * 1024),
                "memory_usage_percent": (self._size_tracker / self.max_memory_bytes) * 100,
                "average_access_count": avg_access_count,
                "average_age_seconds": avg_age,
                "strategy": self.strategy.value
            }

    async def _ensure_capacity(self, new_entry_size: int) -> None:
        """Ensure cache has capacity for new entry."""
        # First, clean up expired entries
        await self.cleanup_expired()

        # Check if we need to evict entries
        while (
            len(self._cache) >= self.max_size or
            self._size_tracker + new_entry_size > self.max_memory_bytes
        ):
            if not self._cache:
                break

            # Find entry to evict based on strategy
            key_to_evict = await self._select_eviction_candidate()
            if key_to_evict:
                await self._remove_entry(key_to_evict)
            else:
                break

    async def _select_eviction_candidate(self) -> Optional[str]:
        """Select key to evict based on strategy."""
        if not self._cache:
            return None

        if self.strategy == CacheStrategy.LRU:
            # Least Recently Used
            return min(self._access_times.keys(), key=lambda k: self._access_times[k])

        elif self.strategy == CacheStrategy.LFU:
            # Least Frequently Used
            return min(self._cache.keys(), key=lambda k: self._cache[k].access_count)

        elif self.strategy == CacheStrategy.TTL:
            # Remove oldest entry
            return min(self._cache.keys(), key=lambda k: self._cache[k].created_at)

        elif self.strategy == CacheStrategy.ADAPTIVE:
            # Adaptive strategy: prioritize based on access frequency and recency
            current_time = time.time()
            scores = {}

            for key, entry in self._cache.items():
                age_score = current_time - entry.created_at
                access_score = 1.0 / (entry.access_count + 1)
                recency_score = current_time - entry.last_accessed

                # Combined score (lower is worse)
                scores[key] = age_score + access_score + recency_score

            return max(scores.keys(), key=lambda k: scores[k])

        # Fallback to LRU
        return min(self._access_times.keys(), key=lambda k: self._access_times[k])

    async def _remove_entry(self, key: str) -> None:
        """Remove entry from cache."""
        if key in self._cache:
            entry = self._cache[key]
            self._size_tracker -= entry.size
            del self._cache[key]

        if key in self._access_times:
            del self._access_times[key]


# Global cache instance
_global_cache = InMemoryCache()


def cache_response(
    ttl: Optional[float] = None,
    key_prefix: str = "",
    tags: Optional[List[str]] = None,
    include_args: bool = True,
    include_kwargs: bool = True,
    exclude_args: Optional[List[str]] = None
):
    """
    Decorator for caching function responses.

    Args:
        ttl: Time to live in seconds
        key_prefix: Prefix for cache keys
        tags: Tags for cache invalidation
        include_args: Whether to include function args in cache key
        include_kwargs: Whether to include function kwargs in cache key
        exclude_args: List of argument names to exclude from cache key
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = _generate_cache_key(
                func, args, kwargs, key_prefix, include_args, include_kwargs, exclude_args
            )

            # Try to get from cache
            cached_value = await _global_cache.get(cache_key)
            if cached_value is not None:
                logger.debug(f"Cache hit for function: {func.__name__}")
                return cached_value

            # Execute function
            if asyncio.iscoroutinefunction(func):
                result = await func(*args, **kwargs)
            else:
                result = func(*args, **kwargs)

            # Cache result
            await _global_cache.set(cache_key, result, ttl=ttl, tags=tags)
            logger.debug(f"Cache miss for function: {func.__name__}, cached result")

            return result

        return wrapper
    return decorator


def _generate_cache_key(
    func: Callable,
    args: tuple,
    kwargs: dict,
    prefix: str,
    include_args: bool,
    include_kwargs: bool,
    exclude_args: Optional[List[str]]
) -> str:
    """Generate cache key for function call."""
    key_parts = [prefix, func.__module__, func.__name__]

    if include_args and args:
        args_str = json.dumps(args, sort_keys=True, default=str)
        key_parts.append(f"args:{args_str}")

    if include_kwargs and kwargs:
        exclude_args = exclude_args or []
        filtered_kwargs = {k: v for k, v in kwargs.items() if k not in exclude_args}
        if filtered_kwargs:
            kwargs_str = json.dumps(filtered_kwargs, sort_keys=True, default=str)
            key_parts.append(f"kwargs:{kwargs_str}")

    key = ":".join(key_parts)

    # Hash long keys to avoid memory issues
    if len(key) > 250:
        key = hashlib.md5(key.encode()).hexdigest()

    return key


# Utility functions for manual cache management
async def get_cache_stats() -> Dict[str, Any]:
    """Get global cache statistics."""
    return await _global_cache.get_stats()


async def clear_cache() -> None:
    """Clear global cache."""
    await _global_cache.clear()


async def invalidate_cache_by_tags(tags: List[str]) -> int:
    """Invalidate cache entries by tags."""
    return await _global_cache.invalidate_by_tags(tags)


async def cleanup_expired_cache() -> int:
    """Clean up expired cache entries."""
    return await _global_cache.cleanup_expired()