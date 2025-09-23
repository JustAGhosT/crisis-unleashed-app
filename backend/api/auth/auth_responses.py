"""
Authentication response utilities and error handling.

Centralized response formatting for authentication endpoints.
"""

import logging
from typing import Dict, Any, Optional
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from .auth_service import ERROR_MESSAGES

logger = logging.getLogger(__name__)


class AuthResponse(BaseModel):
    """Standard authentication response format."""
    success: bool
    message: str
    user: Optional[Dict[str, Any]] = None
    token: Optional[str] = None


class AuthResponseBuilder:
    """Builder pattern for creating consistent auth responses."""

    @staticmethod
    def success(message: str, user: Optional[Dict[str, Any]] = None,
                token: Optional[str] = None) -> AuthResponse:
        """Create a successful authentication response."""
        return AuthResponse(
            success=True,
            message=message,
            user=user,
            token=token
        )

    @staticmethod
    def failure(message: str) -> AuthResponse:
        """Create a failed authentication response."""
        return AuthResponse(
            success=False,
            message=message
        )

    @staticmethod
    def error(error_key: str) -> AuthResponse:
        """Create an error response using predefined error messages."""
        message = ERROR_MESSAGES.get(error_key, "Authentication error")
        return AuthResponse(
            success=False,
            message=message
        )


class AuthErrorHandler:
    """Centralized error handling for authentication operations."""

    @staticmethod
    def handle_validation_error(error_msg: str, status_code: int = 400) -> HTTPException:
        """Handle validation errors consistently."""
        logger.warning(f"Validation error: {error_msg}")
        return HTTPException(status_code=status_code, detail=error_msg)

    @staticmethod
    def handle_authentication_error(error_msg: str) -> JSONResponse:
        """Handle authentication failures consistently."""
        logger.warning("Authentication failed")  # Avoid logging sensitive data
        return JSONResponse(
            status_code=401,
            content={"error": error_msg}
        )

    @staticmethod
    def handle_server_error(error: Exception) -> HTTPException:
        """Handle server errors consistently."""
        logger.error(f"Server error during authentication: {error}")
        return HTTPException(
            status_code=500,
            detail="Authentication service error"
        )

    @staticmethod
    def handle_social_auth_error(provider: str, error: Exception) -> HTTPException:
        """Handle social authentication errors consistently."""
        logger.error(f"Social auth error for {provider}: {error}")
        return HTTPException(
            status_code=500,
            detail=f"Social authentication error for {provider}"
        )


# Convenience functions for common response patterns
def create_success_response(message: str, user_data: Dict[str, Any],
                          token: str) -> AuthResponse:
    """Create a successful login response."""
    return AuthResponseBuilder.success(message, user_data, token)


def create_login_failure_response() -> AuthResponse:
    """Create a standardized login failure response."""
    return AuthResponseBuilder.error("INVALID_CREDENTIALS")


def create_missing_credentials_response() -> AuthResponse:
    """Create a response for missing credentials."""
    return AuthResponseBuilder.error("USERNAME_OR_EMAIL_REQUIRED")


def create_logout_success_response() -> AuthResponse:
    """Create a successful logout response."""
    return AuthResponseBuilder.success("Logged out successfully")