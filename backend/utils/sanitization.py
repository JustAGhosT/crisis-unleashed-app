"""
Input Sanitization Utilities

Comprehensive input sanitization and validation utilities
for preventing XSS, SQL injection, and other security vulnerabilities.
"""

import re
import html
import json
import logging
from typing import Any, Dict, List, Optional, Union
from urllib.parse import quote, unquote
import bleach

logger = logging.getLogger(__name__)


class InputSanitizer:
    """Comprehensive input sanitization and validation."""

    # Common XSS patterns
    XSS_PATTERNS = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'vbscript:',
        r'onload=',
        r'onerror=',
        r'onclick=',
        r'onmouseover=',
        r'<iframe',
        r'<object',
        r'<embed',
        r'<applet',
    ]

    # SQL injection patterns
    SQL_INJECTION_PATTERNS = [
        r"'.*?(-{2}|;|\|\|)",
        r'".*?(-{2}|;|\|\|)',
        r'(union|select|insert|delete|update|drop|create|alter)[\s\+]+',
        r'(exec|execute|sp_|xp_)[\s\+]*\(',
        r'(script|javascript|vbscript)[\s\+]*:',
    ]

    # Command injection patterns
    COMMAND_INJECTION_PATTERNS = [
        r'[;&|`]',
        r'\$\(',
        r'`[^`]*`',
        r'\|\s*\w',
        r'&&\s*\w',
        r';\s*\w',
    ]

    @classmethod
    def sanitize_string(
        cls,
        value: str,
        max_length: Optional[int] = None,
        allow_html: bool = False,
        allowed_tags: Optional[List[str]] = None
    ) -> str:
        """
        Sanitize string input with comprehensive security checks.

        Args:
            value: Input string to sanitize
            max_length: Maximum allowed length
            allow_html: Whether to allow HTML (will be cleaned with bleach)
            allowed_tags: HTML tags to allow if allow_html is True

        Returns:
            Sanitized string
        """
        if not isinstance(value, str):
            value = str(value)

        # Trim whitespace
        value = value.strip()

        # Check length
        if max_length and len(value) > max_length:
            value = value[:max_length]
            logger.warning(f"String truncated to {max_length} characters")

        # HTML handling
        if allow_html:
            # Use bleach to sanitize HTML
            if allowed_tags is None:
                allowed_tags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li']

            value = bleach.clean(
                value,
                tags=allowed_tags,
                attributes={},
                strip=True
            )
        else:
            # Escape HTML entities
            value = html.escape(value, quote=False)

        # Check for XSS patterns
        if cls.contains_xss_patterns(value):
            logger.warning(f"Potential XSS detected and sanitized: {value[:50]}...")
            # Additional sanitization for detected patterns
            for pattern in cls.XSS_PATTERNS:
                value = re.sub(pattern, '', value, flags=re.IGNORECASE | re.DOTALL)

        return value

    @classmethod
    def sanitize_dict(
        cls,
        data: Dict[str, Any],
        string_rules: Optional[Dict[str, Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Recursively sanitize dictionary data.

        Args:
            data: Dictionary to sanitize
            string_rules: Field-specific sanitization rules

        Returns:
            Sanitized dictionary
        """
        if not isinstance(data, dict):
            return data

        string_rules = string_rules or {}
        sanitized = {}

        for key, value in data.items():
            # Sanitize the key itself
            clean_key = cls.sanitize_string(key, max_length=100)

            if isinstance(value, str):
                # Apply field-specific rules if available
                rules = string_rules.get(key, {})
                sanitized[clean_key] = cls.sanitize_string(value, **rules)

            elif isinstance(value, dict):
                sanitized[clean_key] = cls.sanitize_dict(value, string_rules)

            elif isinstance(value, list):
                sanitized[clean_key] = cls.sanitize_list(value, string_rules)

            else:
                # Keep other types as-is but log unusual types
                if not isinstance(value, (int, float, bool, type(None))):
                    logger.info(f"Unusual data type in sanitization: {type(value)} for key {key}")
                sanitized[clean_key] = value

        return sanitized

    @classmethod
    def sanitize_list(
        cls,
        data: List[Any],
        string_rules: Optional[Dict[str, Dict[str, Any]]] = None
    ) -> List[Any]:
        """
        Sanitize list data recursively.

        Args:
            data: List to sanitize
            string_rules: Field-specific sanitization rules

        Returns:
            Sanitized list
        """
        if not isinstance(data, list):
            return data

        sanitized = []
        for item in data:
            if isinstance(item, str):
                sanitized.append(cls.sanitize_string(item))
            elif isinstance(item, dict):
                sanitized.append(cls.sanitize_dict(item, string_rules))
            elif isinstance(item, list):
                sanitized.append(cls.sanitize_list(item, string_rules))
            else:
                sanitized.append(item)

        return sanitized

    @classmethod
    def contains_xss_patterns(cls, value: str) -> bool:
        """Check if string contains potential XSS patterns."""
        value_lower = value.lower()
        for pattern in cls.XSS_PATTERNS:
            if re.search(pattern, value_lower, re.IGNORECASE | re.DOTALL):
                return True
        return False

    @classmethod
    def contains_sql_injection_patterns(cls, value: str) -> bool:
        """Check if string contains potential SQL injection patterns."""
        value_lower = value.lower()
        for pattern in cls.SQL_INJECTION_PATTERNS:
            if re.search(pattern, value_lower, re.IGNORECASE):
                return True
        return False

    @classmethod
    def contains_command_injection_patterns(cls, value: str) -> bool:
        """Check if string contains potential command injection patterns."""
        for pattern in cls.COMMAND_INJECTION_PATTERNS:
            if re.search(pattern, value):
                return True
        return False

    @classmethod
    def validate_and_sanitize_input(
        cls,
        data: Any,
        field_rules: Optional[Dict[str, Dict[str, Any]]] = None,
        strict_mode: bool = False
    ) -> Any:
        """
        Comprehensive input validation and sanitization.

        Args:
            data: Input data to validate and sanitize
            field_rules: Field-specific validation rules
            strict_mode: If True, reject input with suspicious patterns

        Returns:
            Sanitized data

        Raises:
            ValueError: If strict_mode is True and suspicious patterns are found
        """
        if data is None:
            return data

        if isinstance(data, str):
            # Check for malicious patterns in strict mode
            if strict_mode:
                if cls.contains_sql_injection_patterns(data):
                    raise ValueError("Input contains potential SQL injection patterns")
                if cls.contains_command_injection_patterns(data):
                    raise ValueError("Input contains potential command injection patterns")
                if cls.contains_xss_patterns(data):
                    raise ValueError("Input contains potential XSS patterns")

            return cls.sanitize_string(data)

        elif isinstance(data, dict):
            return cls.sanitize_dict(data, field_rules)

        elif isinstance(data, list):
            return cls.sanitize_list(data, field_rules)

        else:
            return data


class URLSanitizer:
    """URL-specific sanitization utilities."""

    ALLOWED_SCHEMES = ['http', 'https']
    BLOCKED_DOMAINS = ['localhost', '127.0.0.1', '0.0.0.0', '10.', '192.168.', '172.16.']

    @classmethod
    def sanitize_url(cls, url: str, allow_local: bool = False) -> Optional[str]:
        """
        Sanitize and validate URLs to prevent SSRF attacks.

        Args:
            url: URL to sanitize
            allow_local: Whether to allow local/internal URLs

        Returns:
            Sanitized URL or None if invalid
        """
        if not url or not isinstance(url, str):
            return None

        # Remove whitespace
        url = url.strip()

        # Check for obvious malicious patterns
        if any(pattern in url.lower() for pattern in ['javascript:', 'data:', 'file:', 'ftp:']):
            logger.warning(f"Blocked potentially malicious URL scheme: {url[:50]}")
            return None

        # Basic URL validation
        if not re.match(r'^https?://', url):
            logger.warning(f"URL missing valid scheme: {url[:50]}")
            return None

        # Check for local addresses if not allowed
        if not allow_local:
            for blocked in cls.BLOCKED_DOMAINS:
                if blocked in url.lower():
                    logger.warning(f"Blocked local URL: {url[:50]}")
                    return None

        # URL encode to prevent injection
        try:
            # Parse and reconstruct to normalize
            from urllib.parse import urlparse, urlunparse
            parsed = urlparse(url)

            # Validate scheme
            if parsed.scheme.lower() not in cls.ALLOWED_SCHEMES:
                return None

            # Reconstruct URL
            return urlunparse(parsed)

        except Exception as e:
            logger.warning(f"URL parsing failed: {e}")
            return None


class FilenameSanitizer:
    """Filename sanitization for safe file operations."""

    DANGEROUS_EXTENSIONS = [
        '.exe', '.bat', '.cmd', '.com', '.pif', '.scr',
        '.vbs', '.js', '.jar', '.ps1', '.sh', '.php'
    ]

    RESERVED_NAMES = [
        'CON', 'PRN', 'AUX', 'NUL',
        'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
        'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
    ]

    @classmethod
    def sanitize_filename(cls, filename: str, max_length: int = 255) -> str:
        """
        Sanitize filename for safe file system operations.

        Args:
            filename: Original filename
            max_length: Maximum allowed filename length

        Returns:
            Sanitized filename
        """
        if not filename:
            return "unnamed_file"

        # Remove directory traversal attempts
        filename = filename.replace('../', '').replace('..\\', '')
        filename = re.sub(r'[<>:"/\\|?*]', '_', filename)

        # Remove control characters
        filename = ''.join(c for c in filename if ord(c) >= 32)

        # Check for reserved names
        name_part = filename.split('.')[0].upper()
        if name_part in cls.RESERVED_NAMES:
            filename = f"safe_{filename}"

        # Check for dangerous extensions
        for ext in cls.DANGEROUS_EXTENSIONS:
            if filename.lower().endswith(ext):
                filename = filename + '.txt'  # Make it safe
                logger.warning(f"Dangerous file extension detected and neutralized: {ext}")

        # Trim length
        if len(filename) > max_length:
            name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
            name = name[:max_length - len(ext) - 1]
            filename = f"{name}.{ext}" if ext else name

        return filename or "safe_file"