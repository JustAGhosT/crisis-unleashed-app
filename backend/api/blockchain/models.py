"""
Pydantic models for blockchain API requests and responses.
"""

from pydantic import BaseModel, Field, field_validator, model_validator
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

    @model_validator(mode="after")
    def _validate_addresses(self) -> "MintRequest":
        if not self.blockchain:
            raise ValueError("blockchain is required")
        self.wallet_address = validate_wallet_address_format(
            self.wallet_address, self.blockchain, "wallet_address"
        )
        return self


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

    @model_validator(mode="after")
    def _validate_addresses(self) -> "TransferRequest":
        """Validate wallet addresses after all fields are populated."""
        if not self.blockchain:
            raise ValueError("blockchain is required")
            
        # Validate from_address
        self.from_address = validate_wallet_address_format(
            self.from_address, self.blockchain, "from_address"
        )
        
        # Validate to_address
        self.to_address = validate_wallet_address_format(
            self.to_address, self.blockchain, "to_address"
        )
        
        return self

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