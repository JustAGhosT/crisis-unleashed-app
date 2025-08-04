"""
Application settings and configuration management.
"""
import os
from functools import lru_cache
from typing import Any, Dict, List, Optional

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # Application
    app_name: str = "Crisis Unleashed Backend"
    app_version: str = "1.0.0"
    debug: bool = Field(default=False, description="Enable debug mode")
    
    # Server
    host: str = Field(default="0.0.0.0", description="Host address")
    port: int = Field(default=8000, description="Port number")
    
    # Database - Using more flexible defaults for development
    mongo_url: str = Field(
        default="mongodb://localhost:27017", 
        description="MongoDB connection URL"
    )
    database_name: str = Field(
        default="crisis_unleashed", 
        description="Database name"
    )
    
    # Security - Generate a default for development (should be overridden in production)
    secret_key: str = Field(
        default="dev-secret-key-change-in-production-please-use-a-secure-random-string",
        description="Secret key for JWT tokens"
    )
    access_token_expire_minutes: int = Field(default=30, description="JWT token expiration time in minutes")
    
    # Blockchain Networks
    ethereum_rpc_url: Optional[str] = Field(default=None, description="Ethereum RPC URL")
    etherlink_rpc_url: Optional[str] = Field(default=None, description="Etherlink RPC URL")
    solana_rpc_url: Optional[str] = Field(default=None, description="Solana RPC URL")
    
    # Smart Contract Addresses
    ethereum_nft_contract: Optional[str] = Field(default=None, description="Ethereum NFT contract address")
    ethereum_marketplace_contract: Optional[str] = Field(default=None, description="Ethereum marketplace contract address")
    etherlink_nft_contract: Optional[str] = Field(default=None, description="Etherlink NFT contract address")
    etherlink_marketplace_contract: Optional[str] = Field(default=None, description="Etherlink marketplace contract address")
    
    # Outbox Processing
    outbox_processing_interval: int = Field(default=30, description="Outbox processing interval in seconds")
    outbox_max_batch_size: int = Field(default=10, description="Maximum batch size for outbox processing")
    outbox_max_retries: int = Field(default=5, description="Maximum retry attempts for failed operations")
    
    # Logging  
    log_level: str = Field(default="INFO", description="Logging level")
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log format string"
    )
    
    # CORS
    cors_origins: List[str] = Field(default=["*"], description="CORS allowed origins")
    
    # Rate Limiting
    rate_limit_requests: int = Field(default=100, description="Rate limit requests per window")
    rate_limit_window: int = Field(default=60, description="Rate limit window in seconds")
    
    def model_post_init(self, __context: Any) -> None:
        """Post-initialization processing for validation."""
        # Validate log_level
        allowed_levels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
        if self.log_level.upper() not in allowed_levels:
            raise ValueError(f'Log level must be one of: {allowed_levels}')
        
        # Ensure log_level is uppercase
        object.__setattr__(self, 'log_level', self.log_level.upper())
    
    def get_blockchain_config(self) -> Dict[str, Dict[str, Any]]:
        """Get blockchain configuration dictionary."""
        return {
            "ethereum": {
                "name": "ethereum",
                "rpc_url": self.ethereum_rpc_url,
                "nft_contract_address": self.ethereum_nft_contract,
                "marketplace_contract_address": self.ethereum_marketplace_contract,
                "chain_id": 1
            },
            "etherlink": {
                "name": "etherlink",
                "rpc_url": self.etherlink_rpc_url,
                "nft_contract_address": self.etherlink_nft_contract,
                "marketplace_contract_address": self.etherlink_marketplace_contract,
                "chain_id": 128123
            }
        }
    
    def get_outbox_config(self) -> Dict[str, Any]:
        """Get outbox processing configuration."""
        return {
            "processing_interval": self.outbox_processing_interval,
            "max_batch_size": self.outbox_max_batch_size,
            "max_retries": self.outbox_max_retries
        }
    
    # Model configuration for Pydantic v2
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8", 
        "case_sensitive": False,
        "extra": "ignore",
        "validate_default": True
    }


@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()