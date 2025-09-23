"""
Modular error handling system with specialized handlers.
"""

from .base_handler import BaseErrorHandler, BaseErrorDetail, ErrorHandlerRegistry
from .validation_handler import ValidationErrorHandler
from .http_handler import HTTPExceptionHandler
from .database_handler import DatabaseErrorHandler
from .blockchain_handler import BlockchainErrorHandler

__all__ = [
    'BaseErrorHandler',
    'BaseErrorDetail',
    'ErrorHandlerRegistry',
    'ValidationErrorHandler',
    'HTTPExceptionHandler',
    'DatabaseErrorHandler',
    'BlockchainErrorHandler',
]

def create_default_error_registry() -> ErrorHandlerRegistry:
    """Create error registry with default handlers."""
    registry = ErrorHandlerRegistry()

    # Register handlers in order of specificity (most specific first)
    registry.register(ValidationErrorHandler())
    registry.register(HTTPExceptionHandler())
    registry.register(DatabaseErrorHandler())
    registry.register(BlockchainErrorHandler())

    return registry