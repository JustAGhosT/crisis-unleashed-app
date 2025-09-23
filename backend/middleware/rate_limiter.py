"""
API Rate Limiting Middleware for Crisis Unleashed backend.

This module provides comprehensive rate limiting functionality with multiple
strategies, user-based limits, and configurable policies.
"""

import asyncio
import logging
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple, Any, Callable
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
import threading

logger = logging.getLogger(__name__)


class RateLimitExceeded(HTTPException):
    """Custom exception for rate limit exceeded."""

    def __init__(self, limit: int, window: int, retry_after: int):
        detail = {
            "error": "Rate limit exceeded",
            "limit": limit,
            "window_seconds": window,
            "retry_after_seconds": retry_after
        }
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=detail
        )


class TokenBucket:
    """
    Token bucket algorithm implementation for rate limiting.

    This algorithm allows for burst traffic up to the bucket capacity
    while maintaining a steady rate over time.
    """

    def __init__(self, capacity: int, refill_rate: float):
        """
        Initialize token bucket.

        Args:
            capacity: Maximum number of tokens in bucket
            refill_rate: Tokens added per second
        """
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = float(capacity)
        self.last_refill = time.time()
        self._lock = threading.Lock()

    def consume(self, tokens: int = 1) -> bool:
        """
        Try to consume tokens from bucket.

        Args:
            tokens: Number of tokens to consume

        Returns:
            True if tokens were consumed, False if rate limit exceeded
        """
        with self._lock:
            now = time.time()

            # Refill bucket based on time elapsed
            time_passed = now - self.last_refill
            self.tokens = min(
                self.capacity,
                self.tokens + time_passed * self.refill_rate
            )
            self.last_refill = now

            # Check if we have enough tokens
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True

            return False

    def time_until_available(self, tokens: int = 1) -> float:
        """
        Calculate seconds until the requested tokens will be available.

        Args:
            tokens: Number of tokens needed

        Returns:
            Seconds until tokens available
        """
        with self._lock:
            if self.tokens >= tokens:
                return 0.0

            tokens_needed = tokens - self.tokens
            return tokens_needed / self.refill_rate


class SlidingWindowCounter:
    """
    Sliding window counter for more precise rate limiting.

    Uses a sliding window approach that provides more accurate
    rate limiting than fixed windows.
    """

    def __init__(self, limit: int, window_seconds: int):
        """
        Initialize sliding window counter.

        Args:
            limit: Maximum requests per window
            window_seconds: Window size in seconds
        """
        self.limit = limit
        self.window_seconds = window_seconds
        self.requests = deque()
        self._lock = threading.Lock()

    def is_allowed(self) -> Tuple[bool, int]:
        """
        Check if a request is allowed.

        Returns:
            Tuple of (is_allowed, retry_after_seconds)
        """
        with self._lock:
            now = time.time()
            cutoff_time = now - self.window_seconds

            # Remove old requests outside the window
            while self.requests and self.requests[0] <= cutoff_time:
                self.requests.popleft()

            # Check if we're under the limit
            if len(self.requests) < self.limit:
                self.requests.append(now)
                return True, 0

            # Calculate retry after time
            oldest_request = self.requests[0]
            retry_after = int(oldest_request + self.window_seconds - now + 1)
            return False, max(1, retry_after)

    def get_remaining(self) -> int:
        """Get number of remaining requests in current window."""
        with self._lock:
            return max(0, self.limit - len(self.requests))


class RateLimitConfig:
    """Configuration for rate limiting rules."""

    def __init__(
        self,
        requests_per_minute: int = 100,
        requests_per_hour: int = 1000,
        burst_limit: int = 20,
        authenticated_multiplier: float = 2.0,
        premium_multiplier: float = 5.0
    ):
        """
        Initialize rate limit configuration.

        Args:
            requests_per_minute: Base requests per minute
            requests_per_hour: Base requests per hour
            burst_limit: Maximum burst requests
            authenticated_multiplier: Multiplier for authenticated users
            premium_multiplier: Multiplier for premium users
        """
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self.burst_limit = burst_limit
        self.authenticated_multiplier = authenticated_multiplier
        self.premium_multiplier = premium_multiplier

    def get_limits_for_user(self, user_type: str = "anonymous") -> Dict[str, int]:
        """
        Get rate limits for a specific user type.

        Args:
            user_type: Type of user (anonymous, authenticated, premium)

        Returns:
            Dictionary with limit values
        """
        multiplier = 1.0
        if user_type == "authenticated":
            multiplier = self.authenticated_multiplier
        elif user_type == "premium":
            multiplier = self.premium_multiplier

        return {
            "requests_per_minute": int(self.requests_per_minute * multiplier),
            "requests_per_hour": int(self.requests_per_hour * multiplier),
            "burst_limit": int(self.burst_limit * multiplier)
        }


class RateLimiter:
    """
    Main rate limiter with multiple strategies and user-based limits.
    """

    def __init__(self, config: Optional[RateLimitConfig] = None):
        """
        Initialize rate limiter.

        Args:
            config: Rate limit configuration
        """
        self.config = config or RateLimitConfig()
        self.limiters: Dict[str, Dict[str, Any]] = defaultdict(dict)
        self.cleanup_interval = 300  # 5 minutes
        self.last_cleanup = time.time()
        self._lock = threading.Lock()

        logger.info("RateLimiter initialized")

    def _get_client_id(self, request: Request) -> Tuple[str, str]:
        """
        Extract client identifier and type from request.

        Args:
            request: FastAPI request object

        Returns:
            Tuple of (client_id, user_type)
        """
        # Try to get user from authentication
        user = getattr(request.state, 'user', None)
        if user:
            user_id = user.get('id')
            user_type = user.get('role', 'authenticated')
            if user_type == 'premium' or user.get('subscription') == 'premium':
                user_type = 'premium'
            else:
                user_type = 'authenticated'
            return f"user:{user_id}", user_type

        # Fall back to IP address
        client_ip = self._get_client_ip(request)
        return f"ip:{client_ip}", "anonymous"

    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request."""
        # Check common proxy headers
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip

        # Fall back to direct connection
        if hasattr(request.client, 'host'):
            return request.client.host

        return "unknown"

    def _get_limiters_for_client(self, client_id: str, user_type: str) -> Dict[str, Any]:
        """
        Get or create rate limiters for a client.

        Args:
            client_id: Client identifier
            user_type: Type of user

        Returns:
            Dictionary of rate limiters
        """
        with self._lock:
            if client_id not in self.limiters:
                limits = self.config.get_limits_for_user(user_type)

                # Create token bucket for burst control
                burst_bucket = TokenBucket(
                    capacity=limits["burst_limit"],
                    refill_rate=limits["requests_per_minute"] / 60.0
                )

                # Create sliding window counters
                minute_window = SlidingWindowCounter(
                    limit=limits["requests_per_minute"],
                    window_seconds=60
                )

                hour_window = SlidingWindowCounter(
                    limit=limits["requests_per_hour"],
                    window_seconds=3600
                )

                self.limiters[client_id] = {
                    "burst_bucket": burst_bucket,
                    "minute_window": minute_window,
                    "hour_window": hour_window,
                    "user_type": user_type,
                    "last_access": time.time()
                }

            # Update last access time
            self.limiters[client_id]["last_access"] = time.time()
            return self.limiters[client_id]

    def _cleanup_old_limiters(self) -> None:
        """Remove old unused limiters to prevent memory leaks."""
        if time.time() - self.last_cleanup < self.cleanup_interval:
            return

        with self._lock:
            current_time = time.time()
            cutoff_time = current_time - 7200  # 2 hours

            old_clients = [
                client_id for client_id, limiters in self.limiters.items()
                if limiters.get("last_access", 0) < cutoff_time
            ]

            for client_id in old_clients:
                del self.limiters[client_id]

            self.last_cleanup = current_time

            if old_clients:
                logger.debug(f"Cleaned up {len(old_clients)} old rate limiters")

    async def check_rate_limit(self, request: Request) -> Optional[JSONResponse]:
        """
        Check if request should be rate limited.

        Args:
            request: FastAPI request object

        Returns:
            JSONResponse with 429 status if rate limited, None if allowed
        """
        # Periodic cleanup
        self._cleanup_old_limiters()

        # Get client information
        client_id, user_type = self._get_client_id(request)
        limiters = self._get_limiters_for_client(client_id, user_type)

        # Check burst limit (token bucket)
        if not limiters["burst_bucket"].consume():
            retry_after = int(limiters["burst_bucket"].time_until_available()) + 1
            logger.warning(f"Burst rate limit exceeded for {client_id}")

            raise RateLimitExceeded(
                limit=limiters["burst_bucket"].capacity,
                window=60,
                retry_after=retry_after
            )

        # Check minute window
        minute_allowed, minute_retry = limiters["minute_window"].is_allowed()
        if not minute_allowed:
            logger.warning(f"Per-minute rate limit exceeded for {client_id}")

            raise RateLimitExceeded(
                limit=limiters["minute_window"].limit,
                window=60,
                retry_after=minute_retry
            )

        # Check hour window
        hour_allowed, hour_retry = limiters["hour_window"].is_allowed()
        if not hour_allowed:
            logger.warning(f"Per-hour rate limit exceeded for {client_id}")

            raise RateLimitExceeded(
                limit=limiters["hour_window"].limit,
                window=3600,
                retry_after=hour_retry
            )

        # Add rate limit headers to response state
        if not hasattr(request.state, 'rate_limit_headers'):
            request.state.rate_limit_headers = {}

        request.state.rate_limit_headers.update({
            "X-RateLimit-Limit-Minute": str(limiters["minute_window"].limit),
            "X-RateLimit-Remaining-Minute": str(limiters["minute_window"].get_remaining()),
            "X-RateLimit-Limit-Hour": str(limiters["hour_window"].limit),
            "X-RateLimit-Remaining-Hour": str(limiters["hour_window"].get_remaining())
        })

        return None

    def get_stats(self) -> Dict[str, Any]:
        """Get rate limiter statistics."""
        with self._lock:
            active_clients = len(self.limiters)
            user_type_counts = defaultdict(int)

            for limiters in self.limiters.values():
                user_type_counts[limiters["user_type"]] += 1

            return {
                "active_clients": active_clients,
                "user_type_distribution": dict(user_type_counts),
                "config": {
                    "requests_per_minute": self.config.requests_per_minute,
                    "requests_per_hour": self.config.requests_per_hour,
                    "burst_limit": self.config.burst_limit
                }
            }


# Global rate limiter instance
_global_rate_limiter: Optional[RateLimiter] = None


def get_rate_limiter() -> RateLimiter:
    """Get the global rate limiter instance."""
    global _global_rate_limiter
    if _global_rate_limiter is None:
        _global_rate_limiter = RateLimiter()
    return _global_rate_limiter


def create_rate_limit_middleware(config: Optional[RateLimitConfig] = None):
    """
    Create FastAPI middleware for rate limiting.

    Args:
        config: Rate limit configuration

    Returns:
        Middleware function
    """
    rate_limiter = RateLimiter(config)

    async def rate_limit_middleware(request: Request, call_next: Callable):
        """Rate limiting middleware function."""
        try:
            # Check rate limits
            await rate_limiter.check_rate_limit(request)

            # Process request
            response = await call_next(request)

            # Add rate limit headers if available
            if hasattr(request.state, 'rate_limit_headers'):
                for header, value in request.state.rate_limit_headers.items():
                    response.headers[header] = value

            return response

        except RateLimitExceeded as e:
            # Return rate limit exceeded response
            return JSONResponse(
                status_code=e.status_code,
                content=e.detail,
                headers={
                    "Retry-After": str(e.detail["retry_after_seconds"]),
                    "X-RateLimit-Limit": str(e.detail["limit"]),
                    "X-RateLimit-Window": str(e.detail["window_seconds"])
                }
            )

    return rate_limit_middleware