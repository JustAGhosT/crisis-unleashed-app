"""
Base error handler with common functionality.
Provides foundation for specialized error handlers.
"""

import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


class BaseErrorDetail:
    """Enhanced error detail with correlation tracking."""

    def __init__(
        self,
        error_type: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
        user_message: Optional[str] = None,
        correlation_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
        severity: str = "error"
    ):
        self.error_type = error_type
        self.message = message
        self.details = details or {}
        self.user_message = user_message or message
        self.correlation_id = correlation_id
        self.context = context or {}
        self.severity = severity

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON response."""
        result = {
            "error_type": self.error_type,
            "message": self.message,
            "user_message": self.user_message,
            "details": self.details,
            "success": False,
            "severity": self.severity
        }

        if self.correlation_id:
            result["correlation_id"] = self.correlation_id

        # Include debug context based on environment
        include_debug = (
            self.context.get("include_debug_info") or
            self.context.get("environment") == "development"
        )

        if include_debug and self.context:
            result["debug_context"] = {
                "timestamp": self.context.get("timestamp"),
                "path": self.context.get("path"),
                "method": self.context.get("method"),
                "client_ip": self.context.get("client_ip"),
                "user_agent": self.context.get("user_agent")
            }

        return result


class BaseErrorHandler(ABC):
    """Abstract base class for specialized error handlers."""

    # Error severity levels
    SEVERITY_INFO = "info"
    SEVERITY_WARNING = "warning"
    SEVERITY_ERROR = "error"
    SEVERITY_CRITICAL = "critical"

    @abstractmethod
    def can_handle(self, error: Exception) -> bool:
        """Check if this handler can process the given error type."""
        pass

    @abstractmethod
    def handle(self, error: Exception, request: Request, context: Dict[str, Any]) -> JSONResponse:
        """Handle the error and return appropriate JSON response."""
        pass

    def create_error_response(
        self,
        error_detail: BaseErrorDetail,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    ) -> JSONResponse:
        """Create standardized error response."""
        return JSONResponse(
            status_code=status_code,
            content=error_detail.to_dict()
        )

    def log_error(
        self,
        error: Exception,
        context: Dict[str, Any],
        level: int = logging.ERROR,
        extra_info: Optional[Dict[str, Any]] = None
    ) -> None:
        """Log error with structured context."""
        log_data = {
            "correlation_id": context.get("correlation_id"),
            "path": context.get("path"),
            "method": context.get("method"),
            "error_type": type(error).__name__,
            "error_message": str(error),
            "user_id": context.get("user_id")
        }

        if extra_info:
            log_data.update(extra_info)

        logger.log(level, f"Error handled: {type(error).__name__}", extra=log_data)

    def extract_error_details(self, error: Exception) -> Dict[str, Any]:
        """Extract relevant details from an error for logging/response."""
        details = {
            "error_class": error.__class__.__name__,
            "error_module": error.__class__.__module__
        }

        # Include common error attributes if present
        if hasattr(error, 'code'):
            details['error_code'] = error.code

        if hasattr(error, 'status_code'):
            details['status_code'] = error.status_code

        if hasattr(error, 'detail'):
            details['detail'] = error.detail

        return details

    def sanitize_error_message(self, message: str, include_details: bool = False) -> str:
        """Sanitize error message for user consumption."""
        if not include_details:
            # Generic messages for production
            return {
                "database": "A database error occurred. Please try again.",
                "network": "A network error occurred. Please try again.",
                "validation": "The provided data is invalid.",
                "authentication": "Authentication failed.",
                "authorization": "You don't have permission to access this resource.",
                "not_found": "The requested resource was not found.",
                "timeout": "The operation timed out. Please try again."
            }.get(self._categorize_error_message(message),
                  "An error occurred. Please try again or contact support.")

        # Return original message for development/debugging
        return message

    def _categorize_error_message(self, message: str) -> str:
        """Categorize error message for sanitization."""
        message_lower = message.lower()

        if any(keyword in message_lower for keyword in ['database', 'mongo', 'sql', 'connection']):
            return "database"
        elif any(keyword in message_lower for keyword in ['network', 'timeout', 'connection']):
            return "network"
        elif any(keyword in message_lower for keyword in ['validation', 'invalid', 'required']):
            return "validation"
        elif any(keyword in message_lower for keyword in ['unauthorized', 'login', 'token']):
            return "authentication"
        elif any(keyword in message_lower for keyword in ['forbidden', 'permission', 'access']):
            return "authorization"
        elif 'not found' in message_lower:
            return "not_found"
        elif 'timeout' in message_lower:
            return "timeout"

        return "generic"


class ErrorHandlerRegistry:
    """Registry for managing multiple error handlers."""

    def __init__(self):
        self._handlers: list[BaseErrorHandler] = []

    def register(self, handler: BaseErrorHandler) -> None:
        """Register an error handler."""
        self._handlers.append(handler)
        logger.debug(f"Registered error handler: {handler.__class__.__name__}")

    def handle_error(self, error: Exception, request: Request, context: Dict[str, Any]) -> Optional[JSONResponse]:
        """Find appropriate handler and process error."""
        for handler in self._handlers:
            if handler.can_handle(error):
                try:
                    return handler.handle(error, request, context)
                except Exception as handler_error:
                    logger.error(
                        f"Error handler {handler.__class__.__name__} failed: {handler_error}",
                        extra={"original_error": str(error), "correlation_id": context.get("correlation_id")}
                    )
                    continue

        # No handler found
        return None

    def get_registered_handlers(self) -> list[str]:
        """Get list of registered handler class names."""
        return [handler.__class__.__name__ for handler in self._handlers]