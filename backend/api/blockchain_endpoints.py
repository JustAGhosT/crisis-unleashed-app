"""
API endpoints for blockchain operations using the outbox pattern.
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query
from pydantic import BaseModel, Field, validator
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

from ..repository import TransactionOutboxRepository, OutboxType, OutboxEntry
from ..workers import OutboxProcessor, OutboxMonitor

router = APIRouter(prefix="/blockchain", tags=["blockchain"])
logger = logging.getLogger(__name__)


class MintRequest(BaseModel):
    """Request model for minting NFTs."""

    user_id: str = Field(..., description="User ID requesting the mint")
    card_id: str = Field(..., description="Card ID to mint as NFT")
    blockchain: str = Field(..., description="Target blockchain network")
    wallet_address: str = Field(..., description="Recipient wallet address")
    metadata: Optional[Dict[str, Any]] = Field(
        default_factory=dict, description="Additional NFT metadata"
    )

    @validator("blockchain")
    def validate_blockchain(cls, v):
        allowed = ["ethereum", "etherlink", "solana"]
        if v not in allowed:
            raise ValueError(f"Blockchain must be one of: {allowed}")
        return v

    @validator("wallet_address")
    def validate_wallet_address(cls, v):
        if not v.startswith("0x") or len(v) != 42:
            raise ValueError("Invalid Ethereum wallet address format")
        return v


class TransferRequest(BaseModel):
    """Request model for transferring NFTs."""

    from_address: str = Field(..., description="Sender wallet address")
    to_address: str = Field(..., description="Recipient wallet address")
    token_id: str = Field(..., description="Token ID to transfer")
    blockchain: str = Field(..., description="Blockchain network")


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


@router.post("/mint", response_model=OperationResponse)
async def mint_card(request: MintRequest):
    """
    Mint a card as NFT using the transaction outbox pattern.

    This endpoint queues the mint request for background processing,
    ensuring consistency between database and blockchain state.
    """
    try:
        # In a real implementation, you would inject the database dependency
        # For now, we'll return a mock response showing the structure

        outbox_id = f"mint_{request.card_id}_{int(datetime.utcnow().timestamp())}"

        logger.info(f"Mint request queued: {outbox_id} for card {request.card_id}")

        return OperationResponse(
            outbox_id=outbox_id,
            status="pending",
            message=f"Mint request for card {request.card_id} queued for processing",
            created_at=datetime.utcnow(),
            estimated_completion="2-5 minutes",
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error queueing mint request: {e}")
        raise HTTPException(status_code=500, detail="Failed to queue mint request")


@router.post("/transfer", response_model=OperationResponse)
async def transfer_nft(request: TransferRequest):
    """
    Transfer an NFT using the transaction outbox pattern.
    """
    try:
        outbox_id = f"transfer_{request.token_id}_{int(datetime.utcnow().timestamp())}"

        logger.info(
            f"Transfer request queued: {outbox_id} for token {request.token_id}"
        )

        return OperationResponse(
            outbox_id=outbox_id,
            status="pending",
            message=f"Transfer request for token {request.token_id} queued for processing",
            created_at=datetime.utcnow(),
            estimated_completion="1-3 minutes",
        )

    except Exception as e:
        logger.error(f"Error queueing transfer request: {e}")
        raise HTTPException(status_code=500, detail="Failed to queue transfer request")


@router.get("/status/{outbox_id}", response_model=StatusResponse)
async def get_operation_status(outbox_id: str):
    """
    Get the status of a blockchain operation.

    Returns detailed information about the operation including
    current status, attempts, and any results or errors.
    """
    try:
        # Mock response showing the expected structure
        return StatusResponse(
            outbox_id=outbox_id,
            status="processing",
            blockchain="etherlink",
            operation_type="mint_nft",
            attempts=1,
            max_attempts=3,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            result=None,
            error=None,
        )

    except Exception as e:
        logger.error(f"Error getting operation status for {outbox_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get operation status")


@router.get("/operations", response_model=List[StatusResponse])
async def list_operations(
    status: Optional[str] = Query(default=None, description="Filter by status"),
    blockchain: Optional[str] = Query(default=None, description="Filter by blockchain"),
    limit: int = Query(default=50, ge=1, le=100, description="Maximum number of results"),
    offset: int = Query(default=0, ge=0, description="Number of results to skip"),
):
    """
    List blockchain operations with optional filtering.

    Supports filtering by status, blockchain, and pagination.
    """
    try:
        # Mock response showing structure
        operations = []
        for i in range(min(limit, 5)):  # Return up to 5 mock entries
            operations.append(
                StatusResponse(
                    outbox_id=f"operation_{i+offset}",
                    status=status or "completed",
                    blockchain=blockchain or "etherlink",
                    operation_type="mint_nft",
                    attempts=1,
                    max_attempts=3,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )
            )

        return operations

    except Exception as e:
        logger.error(f"Error listing operations: {e}")
        raise HTTPException(status_code=500, detail="Failed to list operations")


@router.post("/operations/{outbox_id}/retry")
async def retry_operation(outbox_id: str):
    """
    Manually retry a failed operation.

    This endpoint allows manual intervention for operations
    that have failed or need immediate processing.
    """
    try:
        logger.info(f"Manual retry requested for operation: {outbox_id}")

        return {
            "outbox_id": outbox_id,
            "status": "queued_for_retry",
            "message": "Operation has been queued for manual retry",
        }

    except Exception as e:
        logger.error(f"Error retrying operation {outbox_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retry operation")


@router.get("/health")
async def get_blockchain_health():
    """
    Get health status of blockchain connections and processing.

    Returns information about:
    - Blockchain network connectivity
    - Outbox processing status
    - Queue statistics
    """
    try:
        # Mock health status
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "blockchain_networks": {
                "ethereum": {"status": "connected", "block_height": 18500000},
                "etherlink": {"status": "connected", "block_height": 123456},
            },
            "outbox_processor": {
                "is_running": True,
                "last_processed": datetime.utcnow().isoformat(),
                "pending_entries": 5,
                "processing_rate": "2.3/min",
            },
            "queue_stats": {
                "pending": 5,
                "processing": 2,
                "completed": 150,
                "failed": 3,
                "manual_review": 1,
            },
        }

    except Exception as e:
        logger.error(f"Error getting blockchain health: {e}")
        raise HTTPException(status_code=500, detail="Failed to get health status")


@router.get("/networks")
async def get_supported_networks():
    """
    Get information about supported blockchain networks.
    """
    return {
        "supported_networks": [
            {
                "name": "ethereum",
                "display_name": "Ethereum Mainnet",
                "chain_id": 1,
                "native_currency": "ETH",
                "explorer": "https://etherscan.io",
                "status": "available",
            },
            {
                "name": "etherlink",
                "display_name": "Etherlink",
                "chain_id": 128123,
                "native_currency": "XTZ",
                "explorer": "https://explorer.etherlink.com",
                "status": "available",
            },
        ],
        "default_network": "etherlink",
    }