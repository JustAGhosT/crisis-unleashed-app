"""
Centralized Configuration Manager

This module provides a unified interface for managing all application configuration,
including environment variables, database settings, blockchain configurations,
and feature flags with validation and type safety.
"""

import os
import logging
from typing import Dict, Any, Optional, TypeVar, Type, Union, List
from functools import lru_cache
from pathlib import Path
from dataclasses import dataclass
from enum import Enum

from pydantic import BaseSettings, Field, validator
from pydantic_settings import SettingsConfigDict

# Import existing configurations
from .settings import Settings
from .database import DatabaseConfig
from .blockchain_config import BlockchainConfig
from .network_config import NetworkConfig

logger = logging.getLogger(__name__)

T = TypeVar('T')

class Environment(str, Enum):
    """Application environment types."""
    DEVELOPMENT = "development"
    TESTING = "testing"
    STAGING = "staging"
    PRODUCTION = "production"

class LogLevel(str, Enum):
    """Logging levels."""
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"

@dataclass
class FeatureFlags:
    """Feature flag configuration."""
    enable_blockchain: bool = True
    enable_telemetry: bool = True
    enable_metrics: bool = True
    enable_caching: bool = True
    enable_rate_limiting: bool = True
    debug_mode: bool = False
    maintenance_mode: bool = False
    experimental_features: bool = False

class ConfigurationManager(BaseSettings):
    """
    Centralized configuration manager that consolidates all app settings.

    This class provides a single source of truth for all configuration values,
    with proper validation, type checking, and environment-based overrides.
    """

    model_config = SettingsConfigDict(
        env_file=[".env.local", ".env"],
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # Core application settings
    app_name: str = Field(default="Crisis Unleashed", description="Application name")
    app_version: str = Field(default="1.0.0", description="Application version")
    environment: Environment = Field(default=Environment.DEVELOPMENT, description="Runtime environment")
    debug: bool = Field(default=False, description="Debug mode flag")

    # Server configuration
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8010, ge=1, le=65535, description="Server port")
    workers: int = Field(default=1, ge=1, le=8, description="Number of worker processes")

    # Security settings
    secret_key: str = Field(..., min_length=32, description="Application secret key")
    allowed_hosts: List[str] = Field(default=["localhost", "127.0.0.1"], description="Allowed hosts")
    cors_origins: List[str] = Field(default=["http://localhost:3000"], description="CORS allowed origins")

    # Logging configuration
    log_level: LogLevel = Field(default=LogLevel.INFO, description="Logging level")
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log message format"
    )
    log_file: Optional[str] = Field(default=None, description="Log file path")

    # Database settings (delegated to existing config)
    database_url: str = Field(..., description="Database connection URL")
    database_name: str = Field(default="crisis_unleashed", description="Database name")

    # Redis/Cache settings
    redis_url: Optional[str] = Field(default=None, description="Redis connection URL")
    cache_ttl: int = Field(default=3600, ge=0, description="Default cache TTL in seconds")

    # Feature flags
    enable_blockchain: bool = Field(default=True, description="Enable blockchain functionality")
    enable_telemetry: bool = Field(default=True, description="Enable telemetry collection")
    enable_metrics: bool = Field(default=True, description="Enable metrics endpoints")
    enable_caching: bool = Field(default=True, description="Enable response caching")
    enable_rate_limiting: bool = Field(default=True, description="Enable rate limiting")
    maintenance_mode: bool = Field(default=False, description="Maintenance mode flag")

    # Performance settings
    max_request_size: int = Field(default=16777216, ge=1, description="Max request size in bytes")  # 16MB
    request_timeout: float = Field(default=30.0, ge=0.1, description="Request timeout in seconds")
    connection_timeout: float = Field(default=5.0, ge=0.1, description="Connection timeout in seconds")

    # External service URLs
    frontend_url: str = Field(default="http://localhost:3000", description="Frontend application URL")
    api_base_url: str = Field(default="http://localhost:8010", description="API base URL")

    @validator('environment', pre=True)
    def validate_environment(cls, v):
        """Validate and normalize environment value."""
        if isinstance(v, str):
            return Environment(v.lower())
        return v

    @validator('secret_key')
    def validate_secret_key(cls, v):
        """Ensure secret key is sufficiently strong."""
        if len(v) < 32:
            raise ValueError("Secret key must be at least 32 characters long")
        return v

    @validator('cors_origins', pre=True)
    def validate_cors_origins(cls, v):
        """Parse CORS origins from environment variable."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    def get_feature_flags(self) -> FeatureFlags:
        """Get consolidated feature flags."""
        return FeatureFlags(
            enable_blockchain=self.enable_blockchain,
            enable_telemetry=self.enable_telemetry,
            enable_metrics=self.enable_metrics,
            enable_caching=self.enable_caching,
            enable_rate_limiting=self.enable_rate_limiting,
            debug_mode=self.debug,
            maintenance_mode=self.maintenance_mode,
            experimental_features=self.environment == Environment.DEVELOPMENT
        )

    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.environment == Environment.DEVELOPMENT

    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.environment == Environment.PRODUCTION

    def is_testing(self) -> bool:
        """Check if running in testing environment."""
        return self.environment == Environment.TESTING

    def get_database_config(self) -> DatabaseConfig:
        """Get database configuration."""
        # This would integrate with existing database config
        # For now, create a minimal config based on our settings
        return DatabaseConfig(
            url=self.database_url,
            name=self.database_name,
            timeout=self.connection_timeout
        )

    def get_logging_config(self) -> Dict[str, Any]:
        """Get logging configuration dictionary."""
        config = {
            'version': 1,
            'disable_existing_loggers': False,
            'formatters': {
                'standard': {
                    'format': self.log_format
                },
            },
            'handlers': {
                'console': {
                    'class': 'logging.StreamHandler',
                    'formatter': 'standard',
                    'level': self.log_level.value
                },
            },
            'loggers': {
                '': {
                    'handlers': ['console'],
                    'level': self.log_level.value,
                    'propagate': False
                },
                'uvicorn': {
                    'handlers': ['console'],
                    'level': 'INFO',
                    'propagate': False
                }
            }
        }

        # Add file handler if log file is specified
        if self.log_file:
            config['handlers']['file'] = {
                'class': 'logging.handlers.RotatingFileHandler',
                'filename': self.log_file,
                'formatter': 'standard',
                'level': self.log_level.value,
                'maxBytes': 10485760,  # 10MB
                'backupCount': 5
            }
            config['loggers']['']['handlers'].append('file')

        return config

    def validate_configuration(self) -> List[str]:
        """Validate the current configuration and return any warnings."""
        warnings = []

        # Check for development settings in production
        if self.is_production():
            if self.debug:
                warnings.append("Debug mode should not be enabled in production")
            if self.log_level == LogLevel.DEBUG:
                warnings.append("Debug logging should not be used in production")
            if "localhost" in self.cors_origins:
                warnings.append("Localhost CORS origin should not be allowed in production")

        # Check security settings
        if self.secret_key.startswith("dev-") or self.secret_key == "changeme":
            warnings.append("Secret key appears to be a development placeholder")

        # Check performance settings
        if self.request_timeout > 60:
            warnings.append("Request timeout is very high, consider reducing it")

        # Check required services
        if self.enable_blockchain and not hasattr(self, 'blockchain_config'):
            warnings.append("Blockchain is enabled but blockchain configuration is missing")

        if self.enable_caching and not self.redis_url:
            warnings.append("Caching is enabled but Redis URL is not configured")

        return warnings

    def to_dict(self) -> Dict[str, Any]:
        """Export configuration as dictionary (excluding sensitive values)."""
        data = self.model_dump()

        # Redact sensitive information
        sensitive_keys = ['secret_key', 'database_url', 'redis_url']
        for key in sensitive_keys:
            if key in data:
                data[key] = "[REDACTED]"

        return data

# Global configuration instance
_config_instance: Optional[ConfigurationManager] = None

@lru_cache(maxsize=1)
def get_config_manager() -> ConfigurationManager:
    """
    Get singleton configuration manager instance.

    Returns:
        ConfigurationManager: The global configuration manager instance
    """
    global _config_instance

    if _config_instance is None:
        try:
            _config_instance = ConfigurationManager()

            # Validate configuration on first load
            warnings = _config_instance.validate_configuration()
            if warnings:
                logger.warning("Configuration warnings detected:")
                for warning in warnings:
                    logger.warning(f"  - {warning}")

            logger.info(f"Configuration loaded for environment: {_config_instance.environment}")

        except Exception as e:
            logger.error(f"Failed to initialize configuration: {e}")
            raise

    return _config_instance

def reload_config() -> ConfigurationManager:
    """
    Reload configuration from environment.

    Returns:
        ConfigurationManager: The reloaded configuration manager instance
    """
    global _config_instance
    _config_instance = None
    get_config_manager.cache_clear()
    return get_config_manager()

def get_setting(key: str, default: Any = None) -> Any:
    """
    Get a specific configuration setting.

    Args:
        key: The configuration key to retrieve
        default: Default value if key is not found

    Returns:
        The configuration value or default
    """
    config = get_config_manager()
    return getattr(config, key, default)

def is_feature_enabled(feature: str) -> bool:
    """
    Check if a feature flag is enabled.

    Args:
        feature: The feature flag name

    Returns:
        bool: True if the feature is enabled
    """
    config = get_config_manager()
    feature_flags = config.get_feature_flags()
    return getattr(feature_flags, f"enable_{feature}", False)

# Convenience functions for backward compatibility
def get_settings() -> ConfigurationManager:
    """Backward compatibility function."""
    return get_config_manager()