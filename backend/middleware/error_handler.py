"""
Comprehensive Error Handling Middleware

Provides centralized error handling, logging, and user-friendly error responses
for all API endpoints in the Crisis Unleashed backend.
"""

import logging
import traceback
import uuid
from datetime import datetime
from typing import Dict, Any, Optional, Union
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
import asyncio

logger = logging.getLogger(__name__)


def get_request_context(request: Request) -> Dict[str, Any]:
    """Extract structured context from request for error reporting."""
    context = {
        "method": request.method,
        "url": str(request.url),
        "path": request.url.path,
        "query_params": dict(request.query_params),
        "user_agent": request.headers.get("user-agent"),
        "client_ip": request.client.host if request.client else None,
        "timestamp": datetime.utcnow().isoformat(),
    }

    # Get correlation ID from header or generate one
    correlation_id = request.headers.get("x-correlation-id") or str(uuid.uuid4())
    context["correlation_id"] = correlation_id

    # Add user context if available
    if hasattr(request.state, "user"):
        context["user_id"] = getattr(request.state.user, "id", None)

    return context


class ErrorDetail:
    """Structured error detail for consistent API responses."""

    def __init__(
        self,
        error_type: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
        user_message: Optional[str] = None,
        correlation_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        self.error_type = error_type
        self.message = message
        self.details = details or {}
        self.user_message = user_message or message
        self.correlation_id = correlation_id
        self.context = context or {}

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON response."""
        result = {
            "error_type": self.error_type,
            "message": self.message,
            "user_message": self.user_message,
            "details": self.details,
            "success": False
        }

        if self.correlation_id:
            result["correlation_id"] = self.correlation_id

        # Only include context in development or if explicitly requested
        if self.context.get("include_debug_info"):
            result["debug_context"] = {
                "timestamp": self.context.get("timestamp"),
                "path": self.context.get("path"),
                "method": self.context.get("method")
            }

        return result


class APIErrorHandler:
    """Centralized API error handling with categorized responses."""

    # Error type constants
    VALIDATION_ERROR = "validation_error"
    AUTHENTICATION_ERROR = "authentication_error"
    AUTHORIZATION_ERROR = "authorization_error"
    NOT_FOUND_ERROR = "not_found_error"
    BUSINESS_LOGIC_ERROR = "business_logic_error"
    EXTERNAL_SERVICE_ERROR = "external_service_error"
    DATABASE_ERROR = "database_error"
    INTERNAL_ERROR = "internal_error"

    @staticmethod
    def create_error_response(
        error_detail: ErrorDetail,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    ) -> JSONResponse:
        """Create standardized error response."""
        return JSONResponse(
            status_code=status_code,
            content=error_detail.to_dict()
        )

    @classmethod
    def handle_validation_error(
        cls,
        error: Union[RequestValidationError, ValidationError],
        request: Request
    ) -> JSONResponse:
        """Handle Pydantic validation errors."""
        context = get_request_context(request)

        logger.warning(
            "Validation error",
            extra={
                "correlation_id": context["correlation_id"],
                "path": context["path"],
                "method": context["method"],
                "error": str(error),
                "user_id": context.get("user_id")
            }
        )

        # Extract meaningful error details
        error_details = []
        for err in error.errors():
            error_details.append({
                "field": ".".join(str(loc) for loc in err["loc"]),
                "message": err["msg"],
                "type": err["type"]
            })

        error_detail = ErrorDetail(
            error_type=cls.VALIDATION_ERROR,
            message="Request validation failed",
            user_message="Please check your input data and try again",
            details={"validation_errors": error_details},
            correlation_id=context["correlation_id"],
            context=context
        )

        return cls.create_error_response(error_detail, status.HTTP_422_UNPROCESSABLE_ENTITY)

    @classmethod
    def handle_http_exception(cls, error: HTTPException, request: Request) -> JSONResponse:
        """Handle FastAPI HTTP exceptions."""
        logger.warning(f"HTTP exception for {request.url}: {error.status_code} - {error.detail}")

        # Determine error type based on status code
        if error.status_code == status.HTTP_401_UNAUTHORIZED:
            error_type = cls.AUTHENTICATION_ERROR
            user_message = "Please log in to access this resource"
        elif error.status_code == status.HTTP_403_FORBIDDEN:
            error_type = cls.AUTHORIZATION_ERROR
            user_message = "You don't have permission to access this resource"
        elif error.status_code == status.HTTP_404_NOT_FOUND:
            error_type = cls.NOT_FOUND_ERROR
            user_message = "The requested resource was not found"
        else:
            error_type = cls.BUSINESS_LOGIC_ERROR
            user_message = error.detail if isinstance(error.detail, str) else "An error occurred"

        error_detail = ErrorDetail(
            error_type=error_type,
            message=error.detail if isinstance(error.detail, str) else str(error.detail),
            user_message=user_message,
            details={"status_code": error.status_code}
        )

        return cls.create_error_response(error_detail, error.status_code)

    @classmethod
    def handle_database_error(cls, error: Exception, request: Request) -> JSONResponse:
        """Handle database-related errors."""
        logger.error(f"Database error for {request.url}: {error}", exc_info=True)

        error_detail = ErrorDetail(
            error_type=cls.DATABASE_ERROR,
            message=str(error),
            user_message="A database error occurred. Please try again later",
            details={"error_class": error.__class__.__name__}
        )

        return cls.create_error_response(error_detail, status.HTTP_503_SERVICE_UNAVAILABLE)

    @classmethod
    def handle_external_service_error(cls, error: Exception, request: Request) -> JSONResponse:
        """Handle external service errors (blockchain, etc.)."""
        logger.error(f"External service error for {request.url}: {error}", exc_info=True)

        error_detail = ErrorDetail(
            error_type=cls.EXTERNAL_SERVICE_ERROR,
            message=str(error),
            user_message="An external service is currently unavailable. Please try again later",
            details={"error_class": error.__class__.__name__}
        )

        return cls.create_error_response(error_detail, status.HTTP_502_BAD_GATEWAY)

    @classmethod
    def handle_timeout_error(cls, error: asyncio.TimeoutError, request: Request) -> JSONResponse:
        """Handle timeout errors."""
        logger.error(f"Timeout error for {request.url}: {error}")

        error_detail = ErrorDetail(
            error_type=cls.EXTERNAL_SERVICE_ERROR,
            message="Operation timed out",
            user_message="The operation took too long to complete. Please try again",
            details={"error_type": "timeout"}
        )

        return cls.create_error_response(error_detail, status.HTTP_504_GATEWAY_TIMEOUT)

    @classmethod
    def handle_generic_error(cls, error: Exception, request: Request) -> JSONResponse:
        """Handle unexpected errors."""
        logger.error(f"Unexpected error for {request.url}: {error}", exc_info=True)

        # In development, include more details
        is_development = request.app.state.settings.debug if hasattr(request.app.state, 'settings') else False

        details = {"error_class": error.__class__.__name__}
        if is_development:
            details["traceback"] = traceback.format_exc()

        error_detail = ErrorDetail(
            error_type=cls.INTERNAL_ERROR,
            message=str(error) if is_development else "An internal error occurred",
            user_message="Something went wrong. Please try again or contact support if the problem persists",
            details=details
        )

        return cls.create_error_response(error_detail, status.HTTP_500_INTERNAL_SERVER_ERROR)


async def error_handler_middleware(request: Request, call_next):
    """
    Middleware to catch and handle all unhandled exceptions.

    This middleware provides a safety net for any errors that escape
    the normal exception handling flow.
    """
    try:
        response = await call_next(request)
        return response

    except RequestValidationError as e:
        return APIErrorHandler.handle_validation_error(e, request)

    except ValidationError as e:
        return APIErrorHandler.handle_validation_error(e, request)

    except HTTPException as e:
        return APIErrorHandler.handle_http_exception(e, request)

    except asyncio.TimeoutError as e:
        return APIErrorHandler.handle_timeout_error(e, request)

    # Database-related errors (you might need to import specific database exceptions)
    except Exception as e:
        error_str = str(e).lower()
        if any(keyword in error_str for keyword in ['mongo', 'database', 'connection', 'pymongo']):
            return APIErrorHandler.handle_database_error(e, request)
        elif any(keyword in error_str for keyword in ['blockchain', 'web3', 'rpc', 'contract']):
            return APIErrorHandler.handle_external_service_error(e, request)
        else:
            return APIErrorHandler.handle_generic_error(e, request)