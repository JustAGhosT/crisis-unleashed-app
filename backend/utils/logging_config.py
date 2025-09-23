"""
Comprehensive logging configuration for Crisis Unleashed backend.

This module provides structured logging with proper formatting, levels,
and rotation for production environments.
"""

import logging
import logging.handlers
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

# Custom log formatter with context information
class ContextualFormatter(logging.Formatter):
    """Custom formatter that adds contextual information to log records."""

    def format(self, record: logging.LogRecord) -> str:
        # Add timestamp if not present
        if not hasattr(record, 'asctime'):
            record.asctime = datetime.now().isoformat()

        # Add process and thread info for debugging
        record.process_name = os.getenv('PROCESS_NAME', 'backend')
        record.thread_name = getattr(record, 'threadName', 'MainThread')

        # Add request ID if available (from middleware)
        if not hasattr(record, 'request_id'):
            record.request_id = getattr(record, 'request_id', 'N/A')

        # Format the record
        formatted = super().format(record)

        # Add extra context if available
        if hasattr(record, 'extra_context') and record.extra_context:
            formatted += f" | Context: {record.extra_context}"

        return formatted


class LoggingConfig:
    """Centralized logging configuration manager."""

    # Default logging configuration
    DEFAULT_FORMAT = (
        "%(asctime)s | %(process_name)s | %(levelname)-8s | "
        "%(name)s:%(lineno)d | %(funcName)s | %(message)s"
    )

    DETAILED_FORMAT = (
        "%(asctime)s | %(process_name)s | %(thread_name)s | %(levelname)-8s | "
        "%(name)s:%(lineno)d | %(funcName)s | ReqID:%(request_id)s | %(message)s"
    )

    @classmethod
    def setup_logging(
        cls,
        level: str = "INFO",
        enable_file_logging: bool = True,
        log_directory: Optional[str] = None,
        max_bytes: int = 10 * 1024 * 1024,  # 10MB
        backup_count: int = 5,
        enable_structured_logging: bool = False
    ) -> None:
        """
        Setup comprehensive logging configuration.

        Args:
            level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
            enable_file_logging: Whether to enable file logging
            log_directory: Directory for log files
            max_bytes: Maximum size per log file
            backup_count: Number of backup files to keep
            enable_structured_logging: Whether to use structured JSON logging
        """
        # Convert string level to logging constant
        numeric_level = getattr(logging, level.upper(), logging.INFO)

        # Create root logger
        root_logger = logging.getLogger()
        root_logger.setLevel(numeric_level)

        # Clear existing handlers
        root_logger.handlers.clear()

        # Setup console handler
        cls._setup_console_handler(root_logger, numeric_level, enable_structured_logging)

        # Setup file handler if enabled
        if enable_file_logging:
            cls._setup_file_handler(
                root_logger, numeric_level, log_directory, max_bytes, backup_count
            )

        # Setup application-specific loggers
        cls._setup_application_loggers(numeric_level)

        # Log the configuration
        logger = logging.getLogger(__name__)
        logger.info(f"Logging configured: level={level}, file_logging={enable_file_logging}")

    @classmethod
    def _setup_console_handler(
        cls, logger: logging.Logger, level: int, structured: bool
    ) -> None:
        """Setup console logging handler."""
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(level)

        if structured:
            # Use JSON formatter for structured logging
            try:
                import json
                class JSONFormatter(logging.Formatter):
                    def format(self, record):
                        log_entry = {
                            'timestamp': datetime.now().isoformat(),
                            'level': record.levelname,
                            'logger': record.name,
                            'message': record.getMessage(),
                            'module': record.module,
                            'function': record.funcName,
                            'line': record.lineno
                        }
                        if hasattr(record, 'request_id'):
                            log_entry['request_id'] = record.request_id
                        return json.dumps(log_entry)

                formatter = JSONFormatter()
            except ImportError:
                # Fallback to regular formatter if JSON not available
                formatter = ContextualFormatter(cls.DETAILED_FORMAT)
        else:
            formatter = ContextualFormatter(cls.DEFAULT_FORMAT)

        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    @classmethod
    def _setup_file_handler(
        cls,
        logger: logging.Logger,
        level: int,
        log_directory: Optional[str],
        max_bytes: int,
        backup_count: int
    ) -> None:
        """Setup rotating file logging handler."""
        # Determine log directory
        if log_directory is None:
            log_directory = os.getenv('LOG_DIR', './logs')

        # Create log directory if it doesn't exist
        log_path = Path(log_directory)
        log_path.mkdir(parents=True, exist_ok=True)

        # Setup rotating file handler
        log_file = log_path / 'crisis_unleashed.log'
        file_handler = logging.handlers.RotatingFileHandler(
            log_file,
            maxBytes=max_bytes,
            backupCount=backup_count,
            encoding='utf-8'
        )
        file_handler.setLevel(level)

        # Use detailed format for file logs
        formatter = ContextualFormatter(cls.DETAILED_FORMAT)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

        # Setup separate error log file
        error_log_file = log_path / 'crisis_unleashed_errors.log'
        error_handler = logging.handlers.RotatingFileHandler(
            error_log_file,
            maxBytes=max_bytes,
            backupCount=backup_count,
            encoding='utf-8'
        )
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(formatter)
        logger.addHandler(error_handler)

    @classmethod
    def _setup_application_loggers(cls, level: int) -> None:
        """Setup application-specific logger configurations."""

        # Configure third-party library loggers
        third_party_loggers = {
            'uvicorn': logging.WARNING,
            'fastapi': logging.INFO,
            'httpx': logging.WARNING,
            'asyncio': logging.WARNING,
            'web3': logging.WARNING,
            'urllib3': logging.WARNING,
            'motor': logging.INFO,
            'pymongo': logging.WARNING
        }

        for logger_name, logger_level in third_party_loggers.items():
            third_party_logger = logging.getLogger(logger_name)
            third_party_logger.setLevel(logger_level)

        # Configure application loggers
        app_loggers = {
            'backend.services': level,
            'backend.api': level,
            'backend.workers': level,
            'backend.middleware': level,
            'backend.config': level
        }

        for logger_name, logger_level in app_loggers.items():
            app_logger = logging.getLogger(logger_name)
            app_logger.setLevel(logger_level)

    @classmethod
    def get_logger_with_context(cls, name: str, context: Optional[Dict[str, Any]] = None) -> logging.Logger:
        """
        Get a logger with additional context.

        Args:
            name: Logger name
            context: Additional context to include in logs

        Returns:
            Logger with context adapter
        """
        logger = logging.getLogger(name)

        if context:
            return logging.LoggerAdapter(logger, context)

        return logger

    @classmethod
    def configure_for_environment(cls, environment: str = "development") -> None:
        """
        Configure logging based on environment.

        Args:
            environment: Environment name (development, staging, production)
        """
        config_map = {
            'development': {
                'level': 'DEBUG',
                'enable_file_logging': True,
                'enable_structured_logging': False
            },
            'staging': {
                'level': 'INFO',
                'enable_file_logging': True,
                'enable_structured_logging': True
            },
            'production': {
                'level': 'WARNING',
                'enable_file_logging': True,
                'enable_structured_logging': True
            }
        }

        config = config_map.get(environment, config_map['development'])
        cls.setup_logging(**config)


# Context manager for adding request context to logs
class LogContext:
    """Context manager for adding request context to log records."""

    def __init__(self, request_id: str, user_id: Optional[str] = None, **extra_context):
        self.request_id = request_id
        self.user_id = user_id
        self.extra_context = extra_context
        self._old_factory = None

    def __enter__(self):
        # Store the old factory
        self._old_factory = logging.getLogRecordFactory()

        # Create new factory that adds context
        def record_factory(*args, **kwargs):
            record = self._old_factory(*args, **kwargs)
            record.request_id = self.request_id
            if self.user_id:
                record.user_id = self.user_id
            if self.extra_context:
                record.extra_context = self.extra_context
            return record

        # Set the new factory
        logging.setLogRecordFactory(record_factory)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Restore the old factory
        if self._old_factory:
            logging.setLogRecordFactory(self._old_factory)