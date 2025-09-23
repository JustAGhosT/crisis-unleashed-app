"""
Centralized exception handling utilities for Crisis Unleashed backend.

This module provides consistent exception handling patterns and error responses
across the application, following the DRY principle and improving maintainability.
"""

import logging
import traceback
from functools import wraps
from typing import Any, Callable, Dict, Optional, Type, TypeVar, Union
from fastapi import HTTPException

logger = logging.getLogger(__name__)

F = TypeVar('F', bound=Callable[..., Any])


class ServiceError(Exception):
    """Base exception for service-level errors."""

    def __init__(self, message: str, error_code: str = "GENERIC_ERROR", details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.details = details or {}


class BlockchainServiceError(ServiceError):
    """Exception for blockchain service errors."""
    pass


class AuthenticationError(ServiceError):
    """Exception for authentication errors."""
    pass


class ValidationError(ServiceError):
    """Exception for validation errors."""
    pass


class ConfigurationError(ServiceError):
    """Exception for configuration errors."""
    pass


def with_error_handling(
    error_message: str = "Operation failed",
    error_code: str = "OPERATION_FAILED",
    reraise_as: Optional[Type[Exception]] = None,
    log_level: str = "error"
):
    """
    Decorator for consistent error handling across service methods.

    Args:
        error_message: Default error message
        error_code: Error code for categorization
        reraise_as: Exception type to reraise as
        log_level: Logging level for errors

    Returns:
        Decorated function with error handling
    """
    def decorator(func: F) -> F:
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                # Log the error with appropriate level
                log_method = getattr(logger, log_level, logger.error)
                log_method(f"Error in {func.__name__}: {str(e)}")

                # Log full traceback in debug mode
                if logger.isEnabledFor(logging.DEBUG):
                    logger.debug(f"Full traceback: {traceback.format_exc()}")

                # Reraise as specified exception type or original
                if reraise_as:
                    if issubclass(reraise_as, ServiceError):
                        raise reraise_as(
                            message=f"{error_message}: {str(e)}",
                            error_code=error_code,
                            details={"original_error": str(e), "function": func.__name__}
                        )
                    else:
                        raise reraise_as(f"{error_message}: {str(e)}")
                else:
                    raise
        return wrapper
    return decorator


def with_async_error_handling(
    error_message: str = "Async operation failed",
    error_code: str = "ASYNC_OPERATION_FAILED",
    reraise_as: Optional[Type[Exception]] = None,
    log_level: str = "error"
):
    """
    Decorator for consistent async error handling across service methods.

    Args:
        error_message: Default error message
        error_code: Error code for categorization
        reraise_as: Exception type to reraise as
        log_level: Logging level for errors

    Returns:
        Decorated async function with error handling
    """
    def decorator(func: F) -> F:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                # Log the error with appropriate level
                log_method = getattr(logger, log_level, logger.error)
                log_method(f"Error in {func.__name__}: {str(e)}")

                # Log full traceback in debug mode
                if logger.isEnabledFor(logging.DEBUG):
                    logger.debug(f"Full traceback: {traceback.format_exc()}")

                # Reraise as specified exception type or original
                if reraise_as:
                    if issubclass(reraise_as, ServiceError):
                        raise reraise_as(
                            message=f"{error_message}: {str(e)}",
                            error_code=error_code,
                            details={"original_error": str(e), "function": func.__name__}
                        )
                    else:
                        raise reraise_as(f"{error_message}: {str(e)}")
                else:
                    raise
        return wrapper
    return decorator


def handle_service_exceptions(func: F) -> F:
    """
    Decorator specifically for handling service exceptions and converting to HTTP exceptions.

    Args:
        func: Function to decorate

    Returns:
        Decorated function that converts ServiceError to HTTPException
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValidationError as e:
            logger.warning(f"Validation error in {func.__name__}: {e.message}")
            raise HTTPException(status_code=400, detail=e.message)
        except AuthenticationError as e:
            logger.warning(f"Authentication error in {func.__name__}: {e.message}")
            raise HTTPException(status_code=401, detail=e.message)
        except BlockchainServiceError as e:
            logger.error(f"Blockchain service error in {func.__name__}: {e.message}")
            raise HTTPException(status_code=503, detail="Blockchain service unavailable")
        except ConfigurationError as e:
            logger.error(f"Configuration error in {func.__name__}: {e.message}")
            raise HTTPException(status_code=500, detail="Service configuration error")
        except ServiceError as e:
            logger.error(f"Service error in {func.__name__}: {e.message}")
            raise HTTPException(status_code=500, detail=e.message)
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {str(e)}")
            if logger.isEnabledFor(logging.DEBUG):
                logger.debug(f"Full traceback: {traceback.format_exc()}")
            raise HTTPException(status_code=500, detail="Internal server error")
    return wrapper


def handle_async_service_exceptions(func: F) -> F:
    """
    Async decorator for handling service exceptions and converting to HTTP exceptions.

    Args:
        func: Async function to decorate

    Returns:
        Decorated async function that converts ServiceError to HTTPException
    """
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except ValidationError as e:
            logger.warning(f"Validation error in {func.__name__}: {e.message}")
            raise HTTPException(status_code=400, detail=e.message)
        except AuthenticationError as e:
            logger.warning(f"Authentication error in {func.__name__}: {e.message}")
            raise HTTPException(status_code=401, detail=e.message)
        except BlockchainServiceError as e:
            logger.error(f"Blockchain service error in {func.__name__}: {e.message}")
            raise HTTPException(status_code=503, detail="Blockchain service unavailable")
        except ConfigurationError as e:
            logger.error(f"Configuration error in {func.__name__}: {e.message}")
            raise HTTPException(status_code=500, detail="Service configuration error")
        except ServiceError as e:
            logger.error(f"Service error in {func.__name__}: {e.message}")
            raise HTTPException(status_code=500, detail=e.message)
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {str(e)}")
            if logger.isEnabledFor(logging.DEBUG):
                logger.debug(f"Full traceback: {traceback.format_exc()}")
            raise HTTPException(status_code=500, detail="Internal server error")
    return wrapper


class ErrorContext:
    """Context manager for error handling with additional context information."""

    def __init__(self, operation: str, context: Optional[Dict[str, Any]] = None):
        self.operation = operation
        self.context = context or {}

    def __enter__(self):
        return self

    def __exit__(self, exc_type: Optional[Type[Exception]], exc_val: Optional[Exception], exc_tb):
        if exc_val:
            logger.error(f"Error during {self.operation}: {str(exc_val)}")
            if self.context:
                logger.error(f"Context: {self.context}")
            if logger.isEnabledFor(logging.DEBUG):
                logger.debug(f"Full traceback: {traceback.format_exc()}")
        return False  # Don't suppress the exception


def safe_execute(
    func: Callable,
    default_return: Any = None,
    error_message: str = "Operation failed",
    log_errors: bool = True
) -> Any:
    """
    Safely execute a function, returning a default value on error.

    Args:
        func: Function to execute
        default_return: Value to return on error
        error_message: Message to log on error
        log_errors: Whether to log errors

    Returns:
        Function result or default_return on error
    """
    try:
        return func()
    except Exception as e:
        if log_errors:
            logger.error(f"{error_message}: {str(e)}")
        return default_return