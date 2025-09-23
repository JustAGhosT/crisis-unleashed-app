"""
Comprehensive Security Middleware

Provides rate limiting, input sanitization, security headers,
and other security measures for the Crisis Unleashed API.
"""

import re
import html
import logging
import hashlib
import time
from typing import Dict, Any, Optional, Set, List, Union
from collections import defaultdict, deque
from dataclasses import dataclass, field
from datetime import datetime, timedelta

from fastapi import Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

logger = logging.getLogger(__name__)

@dataclass
class RateLimitRule:
    """Rate limiting rule configuration."""
    requests: int  # Number of requests allowed
    window: int    # Time window in seconds
    burst: int = 0 # Additional burst allowance

@dataclass
class ClientRateLimit:
    """Rate limiting state for a specific client."""
    requests: deque = field(default_factory=deque)
    burst_used: int = 0
    last_request: float = 0

class RateLimiter:
    """
    Advanced rate limiter with support for different rules per endpoint
    and burst allowances.
    """

    def __init__(self):
        self.clients: Dict[str, Dict[str, ClientRateLimit]] = defaultdict(lambda: defaultdict(ClientRateLimit))
        self.rules: Dict[str, RateLimitRule] = {
            # Default rules
            "default": RateLimitRule(requests=100, window=60),  # 100 req/min
            "/api/auth/login": RateLimitRule(requests=5, window=300),  # 5 login attempts per 5min
            "/api/auth/register": RateLimitRule(requests=3, window=3600),  # 3 registrations per hour
            "/api/blockchain/": RateLimitRule(requests=10, window=60),  # 10 blockchain ops per min
            "/api/metrics/": RateLimitRule(requests=20, window=60, burst=5),  # Allow burst for monitoring
        }

    def _get_client_id(self, request: Request) -> str:
        """Generate client identifier from request."""
        # Use IP address as primary identifier
        client_ip = request.client.host if request.client else "unknown"

        # Add user ID if authenticated
        user_id = getattr(request.state, "user_id", None)
        if user_id:
            return f"{client_ip}:{user_id}"

        # Add User-Agent hash for additional uniqueness
        user_agent = request.headers.get("user-agent", "")
        ua_hash = hashlib.md5(user_agent.encode()).hexdigest()[:8]

        return f"{client_ip}:{ua_hash}"

    def _get_rule(self, path: str) -> RateLimitRule:
        """Get rate limiting rule for a specific path."""
        # Check for exact match
        if path in self.rules:
            return self.rules[path]

        # Check for prefix matches
        for rule_path, rule in self.rules.items():
            if rule_path.endswith("/") and path.startswith(rule_path):
                return rule

        return self.rules["default"]

    def _cleanup_old_requests(self, client_limit: ClientRateLimit, window: int):
        """Remove requests older than the time window."""
        current_time = time.time()
        cutoff_time = current_time - window

        while client_limit.requests and client_limit.requests[0] < cutoff_time:
            client_limit.requests.popleft()

    def is_allowed(self, request: Request) -> tuple[bool, Dict[str, Any]]:
        """
        Check if request is allowed based on rate limiting rules.

        Returns:
            Tuple of (is_allowed, rate_limit_info)
        """
        client_id = self._get_client_id(request)
        path = request.url.path
        rule = self._get_rule(path)
        current_time = time.time()

        # Get or create client rate limit state
        client_limit = self.clients[client_id][path]

        # Clean up old requests
        self._cleanup_old_requests(client_limit, rule.window)

        # Check rate limit
        request_count = len(client_limit.requests)
        rate_limit_info = {
            "limit": rule.requests,
            "remaining": max(0, rule.requests - request_count),
            "reset": int(current_time + rule.window),
            "window": rule.window
        }

        # Allow if within normal limits
        if request_count < rule.requests:
            client_limit.requests.append(current_time)
            client_limit.last_request = current_time
            return True, rate_limit_info

        # Check burst allowance
        if rule.burst > 0 and client_limit.burst_used < rule.burst:
            time_since_last = current_time - client_limit.last_request
            # Allow burst if there's been some time gap
            if time_since_last > 1:  # At least 1 second gap
                client_limit.requests.append(current_time)
                client_limit.burst_used += 1
                client_limit.last_request = current_time
                rate_limit_info["burst_used"] = client_limit.burst_used
                rate_limit_info["burst_remaining"] = rule.burst - client_limit.burst_used
                return True, rate_limit_info

        # Rate limit exceeded
        rate_limit_info["remaining"] = 0
        return False, rate_limit_info

    def reset_client_burst(self, client_id: str, path: str):
        """Reset burst usage for a client (called periodically)."""
        if client_id in self.clients and path in self.clients[client_id]:
            self.clients[client_id][path].burst_used = 0

class InputSanitizer:
    """
    Comprehensive input sanitization to prevent XSS, SQL injection,
    and other security vulnerabilities.
    """

    # Patterns for detecting potential security threats
    XSS_PATTERNS = [
        re.compile(r'<script[^>]*>.*?</script>', re.IGNORECASE | re.DOTALL),
        re.compile(r'javascript:', re.IGNORECASE),
        re.compile(r'on\w+\s*=', re.IGNORECASE),
        re.compile(r'<\s*iframe[^>]*>', re.IGNORECASE),
        re.compile(r'<\s*object[^>]*>', re.IGNORECASE),
        re.compile(r'<\s*embed[^>]*>', re.IGNORECASE),
        re.compile(r'<\s*applet[^>]*>', re.IGNORECASE),
    ]

    SQL_INJECTION_PATTERNS = [
        re.compile(r'\b(union|select|insert|update|delete|drop|create|alter)\b', re.IGNORECASE),
        re.compile(r'[\'";].*(--)|(\/\*.*\*\/)', re.IGNORECASE),
        re.compile(r'\b(or|and)\s+\d+\s*=\s*\d+', re.IGNORECASE),
    ]

    COMMAND_INJECTION_PATTERNS = [
        re.compile(r'[;&|`$(){}[\]]'),
        re.compile(r'\b(bash|sh|cmd|powershell|eval|exec)\b', re.IGNORECASE),
    ]

    @staticmethod
    def sanitize_string(value: str, allow_html: bool = False) -> str:
        """
        Sanitize string input to prevent XSS and other attacks.

        Args:
            value: The string to sanitize
            allow_html: Whether to allow safe HTML tags

        Returns:
            Sanitized string
        """
        if not isinstance(value, str):
            return str(value)

        # Remove null bytes
        value = value.replace('\x00', '')

        # Check for XSS patterns
        for pattern in InputSanitizer.XSS_PATTERNS:
            if pattern.search(value):
                logger.warning(f"XSS pattern detected: {pattern.pattern}")
                value = pattern.sub('', value)

        # Check for SQL injection patterns
        for pattern in InputSanitizer.SQL_INJECTION_PATTERNS:
            if pattern.search(value):
                logger.warning(f"SQL injection pattern detected: {pattern.pattern}")
                # Don't remove, but log for monitoring

        # Check for command injection
        for pattern in InputSanitizer.COMMAND_INJECTION_PATTERNS:
            if pattern.search(value):
                logger.warning(f"Command injection pattern detected: {pattern.pattern}")

        # HTML escape if not allowing HTML
        if not allow_html:
            value = html.escape(value, quote=True)

        # Limit length to prevent buffer overflow attacks
        if len(value) > 10000:  # 10KB limit
            logger.warning(f"Oversized input truncated: {len(value)} chars")
            value = value[:10000]

        return value.strip()

    @staticmethod
    def sanitize_data(data: Any, allow_html: bool = False) -> Any:
        """
        Recursively sanitize data structure.

        Args:
            data: Data to sanitize
            allow_html: Whether to allow HTML in strings

        Returns:
            Sanitized data
        """
        if isinstance(data, str):
            return InputSanitizer.sanitize_string(data, allow_html)
        elif isinstance(data, dict):
            return {
                key: InputSanitizer.sanitize_data(value, allow_html)
                for key, value in data.items()
                if key not in ['password', 'token', 'secret']  # Skip sensitive fields
            }
        elif isinstance(data, list):
            return [InputSanitizer.sanitize_data(item, allow_html) for item in data]
        elif isinstance(data, tuple):
            return tuple(InputSanitizer.sanitize_data(item, allow_html) for item in data)
        else:
            return data

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add comprehensive security headers to all responses.
    """

    def __init__(self, app: ASGIApp, config: Optional[Dict[str, Any]] = None):
        super().__init__(app)
        self.config = config or {}

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Security headers
        security_headers = {
            # Prevent clickjacking
            "X-Frame-Options": "DENY",

            # XSS protection
            "X-XSS-Protection": "1; mode=block",

            # Prevent MIME type sniffing
            "X-Content-Type-Options": "nosniff",

            # Referrer policy
            "Referrer-Policy": "strict-origin-when-cross-origin",

            # Feature policy
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()",

            # HSTS (only for HTTPS)
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

            # Content Security Policy
            "Content-Security-Policy": (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "connect-src 'self' https: wss: ws:; "
                "font-src 'self' https:; "
                "frame-ancestors 'none';"
            )
        }

        # Add headers to response
        for header, value in security_headers.items():
            response.headers[header] = value

        # Add custom security header with request ID
        if hasattr(request.state, "request_id"):
            response.headers["X-Request-ID"] = request.state.request_id

        return response

class SecurityMiddleware(BaseHTTPMiddleware):
    """
    Comprehensive security middleware that combines rate limiting,
    input sanitization, and security monitoring.
    """

    def __init__(
        self,
        app: ASGIApp,
        enable_rate_limiting: bool = True,
        enable_input_sanitization: bool = True,
        enable_security_monitoring: bool = True,
        config: Optional[Dict[str, Any]] = None
    ):
        super().__init__(app)
        self.enable_rate_limiting = enable_rate_limiting
        self.enable_input_sanitization = enable_input_sanitization
        self.enable_security_monitoring = enable_security_monitoring
        self.config = config or {}

        if self.enable_rate_limiting:
            self.rate_limiter = RateLimiter()

        # Security event tracking
        self.security_events: deque = deque(maxlen=1000)

    def _log_security_event(self, event_type: str, request: Request, details: Dict[str, Any]):
        """Log security event for monitoring."""
        event = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type,
            "client_ip": request.client.host if request.client else "unknown",
            "path": request.url.path,
            "method": request.method,
            "user_agent": request.headers.get("user-agent", ""),
            "details": details
        }

        self.security_events.append(event)
        logger.warning(f"Security event: {event_type}", extra=event)

    async def dispatch(self, request: Request, call_next):
        # Generate request ID for tracking
        request.state.request_id = hashlib.md5(
            f"{time.time()}{request.client.host if request.client else 'unknown'}"
            .encode()
        ).hexdigest()[:16]

        # Rate limiting
        if self.enable_rate_limiting:
            is_allowed, rate_info = self.rate_limiter.is_allowed(request)

            if not is_allowed:
                self._log_security_event("rate_limit_exceeded", request, rate_info)

                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "error": {
                            "message": "Rate limit exceeded",
                            "type": "rate_limit_error",
                            "details": rate_info
                        }
                    },
                    headers={
                        "X-RateLimit-Limit": str(rate_info["limit"]),
                        "X-RateLimit-Remaining": str(rate_info["remaining"]),
                        "X-RateLimit-Reset": str(rate_info["reset"]),
                        "Retry-After": str(rate_info["window"])
                    }
                )

        # Input sanitization (for POST/PUT/PATCH requests)
        if (self.enable_input_sanitization and
            request.method in ["POST", "PUT", "PATCH"] and
            "application/json" in request.headers.get("content-type", "")):

            try:
                # Read body for sanitization
                body = await request.body()
                if body:
                    import json
                    try:
                        data = json.loads(body)
                        sanitized_data = InputSanitizer.sanitize_data(data)

                        # Replace request body with sanitized data
                        request._body = json.dumps(sanitized_data).encode()

                    except json.JSONDecodeError:
                        logger.warning("Failed to parse JSON body for sanitization")

            except Exception as e:
                logger.error(f"Error during input sanitization: {e}")

        # Proceed with request
        try:
            response = await call_next(request)

            # Add rate limit headers to successful responses
            if self.enable_rate_limiting:
                response.headers["X-RateLimit-Limit"] = str(rate_info["limit"])
                response.headers["X-RateLimit-Remaining"] = str(rate_info["remaining"])
                response.headers["X-RateLimit-Reset"] = str(rate_info["reset"])

            return response

        except Exception as e:
            if self.enable_security_monitoring:
                self._log_security_event("request_exception", request, {
                    "exception": str(e),
                    "exception_type": type(e).__name__
                })
            raise

    def get_security_stats(self) -> Dict[str, Any]:
        """Get security statistics for monitoring."""
        recent_events = [
            event for event in self.security_events
            if datetime.fromisoformat(event["timestamp"]) > datetime.utcnow() - timedelta(hours=1)
        ]

        event_types = defaultdict(int)
        for event in recent_events:
            event_types[event["event_type"]] += 1

        return {
            "total_events": len(self.security_events),
            "recent_events_1h": len(recent_events),
            "event_types": dict(event_types),
            "rate_limiting_enabled": self.enable_rate_limiting,
            "input_sanitization_enabled": self.enable_input_sanitization,
            "security_monitoring_enabled": self.enable_security_monitoring
        }