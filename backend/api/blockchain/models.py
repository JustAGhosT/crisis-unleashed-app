"""
Pydantic models for blockchain API requests and responses.
"""

from pydantic import BaseModel, Field, field_validator
from pydantic import ValidationInfo
from typing import Dict, Any, Optional
from datetime import datetime

from backend.api.blockchain.validation import (
    get_supported_network_names,
    validate_wallet_address_format
)


class MintRequest(BaseModel):
    """Request model for minting NFTs."""
    user_id: str = Field(..., description="User ID requesting the mint")
    card_id: str = Field(..., description="Card ID to mint as NFT")
    blockchain: str = Field(..., description="Target blockchain network")
    wallet_address: str = Field(..., description="Recipient wallet address")
    metadata: Optional[Dict[str, Any]] = Field(
        default_factory=dict, description="Additional NFT metadata"
    )

    @field_validator("blockchain")
    def validate_blockchain(cls, v: str) -> str:
        allowed = get_supported_network_names()
        if v not in allowed:
            raise ValueError(f"Blockchain network must be one of: {allowed}")
        return v

    @field_validator("wallet_address", mode='after')
    def validate_wallet_address(cls, v: str, info: ValidationInfo) -> str:
        data = info.data or {}
        network_name = data.get("blockchain")
        if not network_name:
            # blockchain field should be validated first, but handle edge case
            raise ValueError("blockchain field must be validated before wallet_address")
        return validate_wallet_address_format(v, network_name, "wallet_address")


class TransferRequest(BaseModel):
    """Request model for transferring NFTs."""
    from_address: str = Field(..., description="Sender wallet address")
    to_address: str = Field(..., description="Recipient wallet address")
    token_id: str = Field(..., description="Token ID to transfer")
    blockchain: str = Field(..., description="Blockchain network")

    @field_validator("blockchain")
    def validate_blockchain(cls, v: str) -> str:
        allowed = get_supported_network_names()
        if v not in allowed:
            raise ValueError(f"Blockchain network must be one of: {allowed}")
        return v

    @field_validator("from_address", "to_address", mode='after')
    def validate_wallet_addresses(cls, v: str, info: ValidationInfo) -> str:
        data = info.data or {}
        network_name = data.get("blockchain")
        if not network_name:
            # Align with MintRequest: fail fast if blockchain isn't available yet
            raise ValueError("blockchain field must be validated before wallet addresses")
        # Provide precise field name in error messages (from_address/to_address)
        field_name = info.field_name if info.field_name else "wallet_address"
        return validate_wallet_address_format(v, network_name, field_name)

    @field_validator("token_id")
    def validate_token_id(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Token ID cannot be empty")
        return v.strip()


class OperationResponse(BaseModel):
    """Response model for blockchain operations."""
    outbox_id: str
    status: str
    message: str
    created_at: datetime
    estimated_completion: Optional[str] = None


class StatusResponse(BaseModel):
    """Response model for operation status."""
    outbox_id: str
    status: str
    blockchain: str
    operation_type: str
    attempts: int
    max_attempts: int
    created_at: datetime
    updated_at: datetime
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
