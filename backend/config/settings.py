"""
Application settings and configuration management.
"""
import os
import secrets
from functools import lru_cache
from typing import Any, Dict, List, Optional
from pydantic import Field, field_validator
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

    # Database
    mongo_url: str = Field(
        default="mongodb://localhost:27017", description="MongoDB connection URL"
    )
    database_name: str = Field(default="crisis_unleashed", description="Database name")

    # Security - Generate secure random key if not provided
    secret_key: str = Field(
        default_factory=lambda: secrets.token_hex(32),
        description="Secret key for JWT tokens - automatically generated if not provided",
    )
    access_token_expire_minutes: int = Field(
        default=30, description="JWT token expiration time in minutes"
    )

    # Blockchain Networks
    ethereum_mainnet_rpc_url: Optional[str] = Field(
        default=None, description="Ethereum Mainnet RPC URL"
    )
    ethereum_testnet_rpc_url: Optional[str] = Field(
        default=None, description="Ethereum Testnet RPC URL"
    )
    etherlink_mainnet_rpc_url: Optional[str] = Field(
        default=None, description="Etherlink Mainnet RPC URL"
    )
    etherlink_testnet_rpc_url: Optional[str] = Field(
        default=None, description="Etherlink Testnet RPC URL"
    )
    solana_mainnet_rpc_url: Optional[str] = Field(
        default=None, description="Solana Mainnet RPC URL"
    )
    solana_testnet_rpc_url: Optional[str] = Field(
        default=None, description="Solana Testnet RPC URL"
    )

    # Configurable Chain IDs
    ethereum_mainnet_chain_id: int = Field(
        default=1, description="Ethereum Mainnet Chain ID"
    )
    ethereum_testnet_chain_id: int = Field(
        default=11155111, description="Ethereum Testnet Chain ID"
    )
    etherlink_mainnet_chain_id: int = Field(
        default=128123, description="Etherlink Mainnet Chain ID"
    )
    etherlink_testnet_chain_id: int = Field(
        default=42421, description="Etherlink Testnet Chain ID"
    )
    solana_mainnet_chain_id: int = Field(
        default=101, description="Solana Mainnet Chain ID"
    )
    solana_testnet_chain_id: int = Field(
        default=103, description="Solana Testnet Chain ID"
    )

    # Smart Contract Addresses
    ethereum_mainnet_nft_contract: Optional[str] = Field(
        default=None, description="Ethereum Mainnet NFT contract address"
    )
    ethereum_mainnet_marketplace_contract: Optional[str] = Field(
        default=None, description="Ethereum Mainnet marketplace contract address"
    )
    ethereum_testnet_nft_contract: Optional[str] = Field(
        default=None, description="Ethereum Testnet NFT contract address"
    )
    ethereum_testnet_marketplace_contract: Optional[str] = Field(
        default=None, description="Ethereum Testnet marketplace contract address"
    )
    etherlink_mainnet_nft_contract: Optional[str] = Field(
        default=None, description="Etherlink Mainnet NFT contract address"
    )
    etherlink_mainnet_marketplace_contract: Optional[str] = Field(
        default=None, description="Etherlink Mainnet marketplace contract address"
    )
    etherlink_testnet_nft_contract: Optional[str] = Field(
        default=None, description="Etherlink Testnet NFT contract address"
    )
    etherlink_testnet_marketplace_contract: Optional[str] = Field(
        default=None, description="Etherlink Testnet marketplace contract address"
    )
    solana_mainnet_program_id: Optional[str] = Field(
        default=None, description="Solana Mainnet program ID"
    )
    solana_testnet_program_id: Optional[str] = Field(
        default=None, description="Solana Testnet program ID"
    )

    # Outbox Processing
    outbox_processing_interval: int = Field(
        default=30, description="Outbox processing interval in seconds"
    )
    outbox_max_batch_size: int = Field(
        default=10, description="Maximum batch size for outbox processing"
    )
    outbox_max_retries: int = Field(
        default=5, description="Maximum retry attempts for failed operations"
    )

    # Logging
    log_level: str = Field(default="INFO", description="Logging level")
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log format string",
    )

    # CORS
    cors_origins: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:8080",
            "http://127.0.0.1:3000",
        ],
        description="CORS allowed origins - restrictive by default for security",
    )

    # Rate Limiting
    rate_limit_requests: int = Field(
        default=100, description="Rate limit requests per window"
    )
    rate_limit_window: int = Field(
        default=60, description="Rate limit window in seconds"
    )

    # --- Validators ---
    @field_validator("log_level")
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        """Validate and normalize log level."""
        allowed_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in allowed_levels:
            raise ValueError(f"Log level must be one of: {allowed_levels}")
        return v.upper()

    @field_validator("secret_key")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        """Validate secret key security."""
        if v == "__REPLACE_ME_SECURE_RANDOM_HEX__":
            raise ValueError(
                "🔐 SECURITY ERROR: Replace the placeholder SECRET_KEY!\n"
                "Generate a secure key with: openssl rand -hex 32\n"
                "Or in Python: import secrets; secrets.token_hex(32)"
            )
        if len(v) < 32:
            raise ValueError(
                "🔐 SECURITY WARNING: SECRET_KEY should be at least 32 characters long.\n"
                "Generate a secure key with: openssl rand -hex 32"
            )
        weak_patterns = [
            "secret",
            "password",
            "123456",
            "abcdef",
            "test",
            "dev",
            "default",
        ]
        if any(pattern in v.lower() for pattern in weak_patterns):
            raise ValueError(
                "🔐 SECURITY WARNING: SECRET_KEY appears to contain weak patterns.\n"
                "Use a cryptographically secure random key: secrets.token_hex(32)"
            )
        return v

    @field_validator("cors_origins")
    @classmethod
    def validate_cors_origins(cls, v: List[str]) -> List[str]:
        """Validate CORS origins for security."""
        if "*" in v and len(v) > 1:
            raise ValueError(
                "🔐 SECURITY WARNING: Cannot mix '*' wildcard with specific origins in CORS"
            )
        if "*" in v and os.environ.get("ENVIRONMENT", "development") == "production":
            raise ValueError(
                "🔐 SECURITY ERROR: Wildcard '*' CORS origins not allowed in production!\n"
                "Set specific allowed origins for security."
            )
        return v

    @field_validator(
        "ethereum_mainnet_chain_id",
        "ethereum_testnet_chain_id",
        "etherlink_mainnet_chain_id",
        "etherlink_testnet_chain_id",
        "solana_mainnet_chain_id",
        "solana_testnet_chain_id",
    )
    @classmethod
    def validate_chain_ids(cls, v: int) -> int:
        """Validate chain IDs are positive integers."""
        if v <= 0:
            raise ValueError("Chain ID must be a positive integer")
        return v

    def get_blockchain_config(self) -> Dict[str, Dict[str, Any]]:
        """Get blockchain configuration dictionary."""
        config = {
            "ethereum_mainnet": {
                "name": "ethereum_mainnet",
                "rpc_url": self.ethereum_mainnet_rpc_url,
                "nft_contract_address": self.ethereum_mainnet_nft_contract,
                "marketplace_contract_address": self.ethereum_mainnet_marketplace_contract,
                "chain_id": self.ethereum_mainnet_chain_id,
            },
            "ethereum_testnet": {
                "name": "ethereum_testnet",
                "rpc_url": self.ethereum_testnet_rpc_url,
                "nft_contract_address": self.ethereum_testnet_nft_contract,
                "marketplace_contract_address": self.ethereum_testnet_marketplace_contract,
                "chain_id": self.ethereum_testnet_chain_id,
            },
            "etherlink_mainnet": {
                "name": "etherlink_mainnet",
                "rpc_url": self.etherlink_mainnet_rpc_url,
                "nft_contract_address": self.etherlink_mainnet_nft_contract,
                "marketplace_contract_address": self.etherlink_mainnet_marketplace_contract,
                "chain_id": self.etherlink_mainnet_chain_id,
            },
            "etherlink_testnet": {
                "name": "etherlink_testnet",
                "rpc_url": self.etherlink_testnet_rpc_url,
                "nft_contract_address": self.etherlink_testnet_nft_contract,
                "marketplace_contract_address": self.etherlink_testnet_marketplace_contract,
                "chain_id": self.etherlink_testnet_chain_id,
            },
            "solana_mainnet": {
                "name": "solana_mainnet",
                "rpc_url": self.solana_mainnet_rpc_url,
                "program_id": self.solana_mainnet_program_id,
                "chain_id": self.solana_mainnet_chain_id,
            },
            "solana_testnet": {
                "name": "solana_testnet",
                "rpc_url": self.solana_testnet_rpc_url,
                "program_id": self.solana_testnet_program_id,
                "chain_id": self.solana_testnet_chain_id,
            },
        }
        return config

    def get_outbox_config(self) -> Dict[str, Any]:
        """Get outbox processing configuration."""
        return {
            "processing_interval": self.outbox_processing_interval,
            "max_batch_size": self.outbox_max_batch_size,
            "max_retries": self.outbox_max_retries,
        }

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()
