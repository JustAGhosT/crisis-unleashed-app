"""
Authentication service class for handling authentication logic.

This module separates authentication concerns from the API endpoints,
following the Single Responsibility Principle.
"""

import logging
import os
import re
import secrets
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Authentication constants
AUTH_CONSTANTS = {
    "BEARER_PREFIX": "Bearer ",
    "SESSION_DURATION_DAYS": 30,
    "EMAIL_REGEX": r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    "DEVELOPMENT_EMAIL": "test@example.com",
    "DEVELOPMENT_PASSWORD": "password",
    "DEFAULT_ROLE": "user"
}

ERROR_MESSAGES = {
    "USERNAME_OR_EMAIL_REQUIRED": "Username or email is required",
    "INVALID_CREDENTIALS": "Invalid username or password",
    "AUTH_SERVICE_ERROR": "Authentication service error",
    "SOCIAL_AUTH_SERVICE_ERROR": "Social authentication service error",
    "INVALID_EMAIL_FORMAT": "Invalid email format provided during social login",
    "UNSUPPORTED_PROVIDER": "Unsupported provider"
}

SUPPORTED_PROVIDERS = {
    "google": {"id": "google", "name": "Google", "type": "oauth"},
    "discord": {"id": "discord", "name": "Discord", "type": "oauth"}
}


class AuthenticationService:
    """Service class for handling authentication operations."""

    @staticmethod
    def sanitize_user_input(input_string: str, max_length: int = 255) -> str:
        """
        Sanitize user input to prevent security issues.

        Args:
            input_string: User input to sanitize
            max_length: Maximum allowed length

        Returns:
            Sanitized string
        """
        if not input_string:
            return ""

        # Strip whitespace and limit length
        sanitized = input_string.strip()[:max_length]

        # Remove null bytes and control characters
        sanitized = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', sanitized)

        # Remove common SQL injection patterns
        sql_patterns = [r'union\s+select', r'drop\s+table', r'delete\s+from',
                       r'insert\s+into', r'update\s+set', r'exec\s*\(']
        for pattern in sql_patterns:
            sanitized = re.sub(pattern, '', sanitized, flags=re.IGNORECASE)

        # Remove script tags and javascript
        sanitized = re.sub(r'<script[^>]*>.*?</script>', '', sanitized, flags=re.IGNORECASE | re.DOTALL)
        sanitized = re.sub(r'javascript:', '', sanitized, flags=re.IGNORECASE)

        # Remove excessive whitespace
        sanitized = re.sub(r'\s+', ' ', sanitized)

        return sanitized.strip()

    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, str]:
        """
        Validate password strength requirements.

        Args:
            password: Password to validate

        Returns:
            Tuple of (is_valid, error_message)
        """
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"

        if len(password) > 128:
            return False, "Password cannot exceed 128 characters"

        # Check for at least one uppercase, lowercase, digit, and special character
        checks = [
            (r'[a-z]', "Password must contain at least one lowercase letter"),
            (r'[A-Z]', "Password must contain at least one uppercase letter"),
            (r'\d', "Password must contain at least one digit"),
            (r'[!@#$%^&*(),.?":{}|<>]', "Password must contain at least one special character")
        ]

        for pattern, message in checks:
            if not re.search(pattern, password):
                return False, message

        return True, "Password meets strength requirements"

    @staticmethod
    def validate_email(email: str) -> bool:
        """
        Validate email format.

        Args:
            email: Email to validate

        Returns:
            True if email is valid, False otherwise
        """
        if not email:
            return False

        normalized_email = email.strip().lower()
        return bool(re.match(AUTH_CONSTANTS["EMAIL_REGEX"], normalized_email))

    @staticmethod
    def normalize_email(email: str) -> Optional[str]:
        """
        Normalize and validate email.

        Args:
            email: Email to normalize

        Returns:
            Normalized email if valid, None otherwise
        """
        if not email:
            return None

        normalized = email.strip().lower()
        if AuthenticationService.validate_email(normalized):
            return normalized

        return None

    @staticmethod
    async def validate_credentials(username: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Validate user credentials and return user data if valid.

        Args:
            username: Username or email
            password: User password

        Returns:
            User data dict if valid, None otherwise
        """
        # For development only
        if (os.getenv("ENVIRONMENT") == "development" and
            username == AUTH_CONSTANTS["DEVELOPMENT_EMAIL"] and
            password == AUTH_CONSTANTS["DEVELOPMENT_PASSWORD"]):
            return {
                "id": "user_123",
                "name": "Test User",
                "email": AUTH_CONSTANTS["DEVELOPMENT_EMAIL"],
                "image": None,
                "username": "test",
                "display_name": "Test User",
                "avatar": None,
                "role": AUTH_CONSTANTS["DEFAULT_ROLE"]
            }
        return None

    @staticmethod
    def generate_secure_token() -> str:
        """
        Generate a cryptographically secure token.

        Returns:
            Secure token string
        """
        return secrets.token_urlsafe(32)

    @staticmethod
    def generate_user_id() -> str:
        """
        Generate a secure user ID.

        Returns:
            Unique user ID
        """
        return f"user_{secrets.token_hex(8)}"

    @staticmethod
    def is_provider_supported(provider: str) -> bool:
        """
        Check if authentication provider is supported.

        Args:
            provider: Provider name

        Returns:
            True if provider is supported
        """
        return provider.lower() in SUPPORTED_PROVIDERS

    @staticmethod
    def get_supported_providers() -> Dict[str, Any]:
        """
        Get all supported authentication providers.

        Returns:
            Dictionary of supported providers
        """
        return {
            "credentials": {
                "id": "credentials",
                "name": "Credentials",
                "type": "credentials"
            },
            **SUPPORTED_PROVIDERS
        }

    @staticmethod
    def create_session_data(user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create session data for authenticated user.

        Args:
            user_data: User information

        Returns:
            Session data compatible with NextAuth
        """
        return {
            "user": user_data,
            "expires": (datetime.now(timezone.utc) +
                       timedelta(days=AUTH_CONSTANTS["SESSION_DURATION_DAYS"])).isoformat()
        }


class SocialAuthService:
    """Service class for handling social authentication."""

    @staticmethod
    def process_social_login(provider: str, provider_id: str, email: Optional[str] = None,
                           name: Optional[str] = None, image: Optional[str] = None) -> Dict[str, Any]:
        """
        Process social login request.

        Args:
            provider: Social provider name
            provider_id: Provider-specific user ID
            email: User email (optional)
            name: User name (optional)
            image: User profile image (optional)

        Returns:
            User data dictionary

        Raises:
            ValueError: If provider is not supported
        """
        if not AuthenticationService.is_provider_supported(provider):
            raise ValueError(f"{ERROR_MESSAGES['UNSUPPORTED_PROVIDER']}: {provider}")

        # Normalize email if provided
        normalized_email = AuthenticationService.normalize_email(email) if email else None

        # Generate secure identifiers
        user_id = AuthenticationService.generate_user_id()
        username = name or f"user_{secrets.token_hex(6)}"

        return {
            "id": user_id,
            "username": AuthenticationService.sanitize_user_input(username),
            "email": normalized_email,
            "avatar": image,
            "role": AUTH_CONSTANTS["DEFAULT_ROLE"]
        }