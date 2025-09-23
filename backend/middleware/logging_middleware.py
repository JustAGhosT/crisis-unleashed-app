"""
Request/Response Logging Middleware

Provides comprehensive logging of API requests and responses
for debugging, monitoring, and audit purposes.
"""

import time
import json
import logging
from typing import Dict, Any, Optional
from fastapi import Request, Response
from fastapi.responses import StreamingResponse
import uuid

logger = logging.getLogger(__name__)


class RequestLogger:
    """Enhanced request/response logging with performance metrics."""

    def __init__(
        self,
        log_request_body: bool = True,
        log_response_body: bool = False,
        max_body_size: int = 10000,
        exclude_paths: Optional[list] = None,
        include_headers: bool = False
    ):
        self.log_request_body = log_request_body
        self.log_response_body = log_response_body
        self.max_body_size = max_body_size
        self.exclude_paths = exclude_paths or ['/health', '/metrics', '/docs', '/openapi.json']
        self.include_headers = include_headers

    def should_log_request(self, request: Request) -> bool:
        """Determine if request should be logged."""
        return request.url.path not in self.exclude_paths

    def sanitize_data(self, data: Any) -> Any:
        """Remove sensitive information from logged data."""
        if isinstance(data, dict):
            sanitized = {}
            sensitive_keys = {'password', 'token', 'secret', 'key', 'authorization', 'api_key'}

            for key, value in data.items():
                if key.lower() in sensitive_keys or any(
                    sensitive in key.lower() for sensitive in sensitive_keys
                ):
                    sanitized[key] = "[REDACTED]"
                elif isinstance(value, (dict, list)):
                    sanitized[key] = self.sanitize_data(value)
                else:
                    sanitized[key] = value
            return sanitized

        elif isinstance(data, list):
            return [self.sanitize_data(item) for item in data]

        return data

    def format_request_log(
        self,
        request: Request,
        request_id: str,
        body: Optional[str] = None
    ) -> Dict[str, Any]:
        """Format request information for logging."""
        log_data = {
            "request_id": request_id,
            "event": "request_start",
            "method": request.method,
            "url": str(request.url),
            "path": request.url.path,
            "query_params": dict(request.query_params),
            "client_ip": self.get_client_ip(request),
            "user_agent": request.headers.get("user-agent", ""),
            "timestamp": time.time()
        }

        if self.include_headers:
            # Sanitize headers to remove sensitive information
            headers = dict(request.headers)
            log_data["headers"] = self.sanitize_data(headers)

        if self.log_request_body and body:
            try:
                if len(body) <= self.max_body_size:
                    # Try to parse as JSON for better logging
                    try:
                        parsed_body = json.loads(body)
                        log_data["body"] = self.sanitize_data(parsed_body)
                    except json.JSONDecodeError:
                        log_data["body"] = body[:self.max_body_size]
                else:
                    log_data["body"] = f"[TRUNCATED - Size: {len(body)} bytes]"
            except Exception as e:
                log_data["body"] = f"[ERROR READING BODY: {e}]"

        return log_data

    def format_response_log(
        self,
        request: Request,
        response: Response,
        request_id: str,
        duration: float,
        response_body: Optional[str] = None
    ) -> Dict[str, Any]:
        """Format response information for logging."""
        log_data = {
            "request_id": request_id,
            "event": "request_complete",
            "method": request.method,
            "url": str(request.url),
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": round(duration * 1000, 2),
            "response_size": len(response_body) if response_body else 0,
            "timestamp": time.time()
        }

        if self.log_response_body and response_body:
            try:
                if len(response_body) <= self.max_body_size:
                    try:
                        parsed_body = json.loads(response_body)
                        log_data["response_body"] = parsed_body
                    except json.JSONDecodeError:
                        log_data["response_body"] = response_body[:self.max_body_size]
                else:
                    log_data["response_body"] = f"[TRUNCATED - Size: {len(response_body)} bytes]"
            except Exception as e:
                log_data["response_body"] = f"[ERROR READING RESPONSE: {e}]"

        return log_data

    def get_client_ip(self, request: Request) -> str:
        """Extract client IP considering proxy headers."""
        # Check for common proxy headers
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            # Take the first IP if multiple are present
            return forwarded_for.split(",")[0].strip()

        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip

        # Fallback to client IP
        if hasattr(request, 'client') and request.client:
            return request.client.host

        return "unknown"

    def log_performance_metrics(self, request: Request, duration: float, status_code: int):
        """Log performance metrics for monitoring."""
        metrics_data = {
            "event": "performance_metric",
            "path": request.url.path,
            "method": request.method,
            "duration_ms": round(duration * 1000, 2),
            "status_code": status_code,
            "timestamp": time.time()
        }

        # Log slow requests as warnings
        if duration > 5.0:  # 5 seconds
            logger.warning(f"Slow request detected", extra=metrics_data)
        elif duration > 1.0:  # 1 second
            logger.info(f"Request performance", extra=metrics_data)


async def logging_middleware(request: Request, call_next):
    """
    Middleware for comprehensive request/response logging.

    Logs all incoming requests and outgoing responses with performance metrics,
    while sanitizing sensitive information.
    """
    # Initialize logger
    request_logger = RequestLogger()

    # Skip logging for excluded paths
    if not request_logger.should_log_request(request):
        return await call_next(request)

    # Generate unique request ID
    request_id = str(uuid.uuid4())

    # Add request ID to request state for use in handlers
    if hasattr(request.state, 'request_id'):
        request.state.request_id = request_id

    # Capture request body if needed
    request_body = None
    if request_logger.log_request_body and request.method in ["POST", "PUT", "PATCH"]:
        try:
            body_bytes = await request.body()
            request_body = body_bytes.decode('utf-8') if body_bytes else None
        except Exception as e:
            logger.warning(f"Could not read request body: {e}")

    # Log request
    start_time = time.time()
    request_log = request_logger.format_request_log(request, request_id, request_body)
    logger.info("Incoming request", extra=request_log)

    try:
        # Process request
        response = await call_next(request)
        duration = time.time() - start_time

        # Capture response body if needed (for non-streaming responses)
        response_body = None
        if request_logger.log_response_body and not isinstance(response, StreamingResponse):
            try:
                # This is tricky with FastAPI responses - we'll skip body logging for now
                # to avoid complexity with response reconstruction
                pass
            except Exception as e:
                logger.warning(f"Could not read response body: {e}")

        # Log response
        response_log = request_logger.format_response_log(
            request, response, request_id, duration, response_body
        )

        # Use different log levels based on status code
        if 400 <= response.status_code < 500:
            logger.warning("Client error response", extra=response_log)
        elif response.status_code >= 500:
            logger.error("Server error response", extra=response_log)
        else:
            logger.info("Successful response", extra=response_log)

        # Log performance metrics
        request_logger.log_performance_metrics(request, duration, response.status_code)

        return response

    except Exception as e:
        duration = time.time() - start_time
        error_log = {
            "request_id": request_id,
            "event": "request_error",
            "method": request.method,
            "url": str(request.url),
            "error": str(e),
            "error_type": e.__class__.__name__,
            "duration_ms": round(duration * 1000, 2),
            "timestamp": time.time()
        }
        logger.error("Request processing error", extra=error_log)
        raise  # Re-raise to let error handler middleware handle it