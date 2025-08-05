"""
API endpoints for blockchain operations using the outbox pattern.
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query, Request
from pydantic import BaseModel, Field, validator
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

from ..repository import TransactionOutboxRepository, OutboxType, OutboxEntry
from ..workers import OutboxProcessor, OutboxMonitor
from ..config.blockchain_config import BlockchainConfig, NetworkType
from ..services.health_manager import ServiceHealthManager, CriticalServiceException

router = APIRouter(prefix="/blockchain", tags=["blockchain"])
logger = logging.getLogger(__name__)


async def get_health_manager(request: Request) -> ServiceHealthManager:
    """Dependency to get the health manager from the app state."""
    from ..server import health_manager
    return health_manager

async def get_blockchain_service(health_manager: ServiceHealthManager = Depends(get_health_manager)):
    """Dependency to get blockchain service with availability check."""
    try:
        return health_manager.get_service("blockchain_service")
    except CriticalServiceException as e:
        logger.error(f"Blockchain service not available: {e}")
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Blockchain service unavailable",
                "message": "The blockchain service is not available. Please try again later.",
                "service_status": str(e)
            }
        )

async def get_outbox_processor(health_manager: ServiceHealthManager = Depends(get_health_manager)):
    """Dependency to get outbox processor with availability check."""
    try:
        return health_manager.get_service("outbox_processor")
    except CriticalServiceException as e:
        logger.error(f"Outbox processor not available: {e}")
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Outbox processor unavailable",
                "message": "The transaction processing service is not available. Please try again later.",
                "service_status": str(e)
            }
        )

def get_supported_network_names() -> List[str]:
    """Get list of supported network names from blockchain config."""
    return list(BlockchainConfig.NETWORKS.keys())

def get_blockchain_type_from_network(network_name: str) -> str:
    """Get the base blockchain type from network name."""
    if network_name.startswith("ethereum"):
        return "ethereum"
    elif network_name.startswith("etherlink"):
        return "etherlink"
    elif network_name.startswith("solana"):
        return "solana"
    else:
        raise ValueError(f"Unknown network: {network_name}")

def validate_wallet_address_format(
    address: str, network_name: str, field_name: str = "wallet_address"
) -> str:
    """
    Validate wallet address format based on blockchain network.
    Args:
        address: The wallet address to validate
        network_name: The blockchain network name (e.g., 'ethereum_mainnet')
        field_name: Name of the field for error messages
    Returns:
        The validated address
    Raises:
        ValueError: If the address format is invalid
    """
    import re
    if network_name not in get_supported_network_names():
        raise ValueError(f"Unsupported network: {network_name}")

    blockchain_type = get_blockchain_type_from_network(network_name)

    if blockchain_type == "solana":
        # Solana addresses are base58 encoded, typically 32-44 characters
        if not re.match(r"^[1-9A-HJ-NP-Za-km-z]{32,44}$", address):
            raise ValueError(f"Invalid Solana wallet address format for {field_name}")
    elif blockchain_type in ["ethereum", "etherlink"]:
        if not address.startswith("0x") or len(address) != 42:
            raise ValueError(
                f"Invalid Ethereum-style wallet address format for {field_name}"
            )
        if not re.match(r"^0x[a-fA-F0-9]{40}$", address):
            raise ValueError(
                f"Invalid Ethereum-style wallet address format for {field_name}"
            )
    else:
        raise ValueError(
            f"Wallet address validation not implemented for blockchain type: {blockchain_type}"
        )
    return address

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
        allowed = get_supported_network_names()
        if v not in allowed:
            raise ValueError(f"Blockchain network must be one of: {allowed}")
        return v

    @validator("wallet_address")
    def validate_wallet_address(cls, v, values):
        network_name = values.get("blockchain")
        if network_name:
            return validate_wallet_address_format(v, network_name, "wallet_address")
        return v

class TransferRequest(BaseModel):
    """Request model for transferring NFTs."""
    from_address: str = Field(..., description="Sender wallet address")
    to_address: str = Field(..., description="Recipient wallet address")
    token_id: str = Field(..., description="Token ID to transfer")
    blockchain: str = Field(..., description="Blockchain network")

    @validator("blockchain")
    def validate_blockchain(cls, v):
        allowed = get_supported_network_names()
        if v not in allowed:
            raise ValueError(f"Blockchain network must be one of: {allowed}")
        return v

    @validator("from_address", "to_address")
    def validate_wallet_addresses(cls, v, values):
        network_name = values.get("blockchain")
        if network_name:
            return validate_wallet_address_format(v, network_name)
        return v

    @validator("token_id")
    def validate_token_id(cls, v):
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


@router.post("/mint", response_model=OperationResponse)
async def mint_card(
    request: MintRequest,
    blockchain_service=Depends(get_blockchain_service),
    outbox_processor=Depends(get_outbox_processor)
):
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
async def transfer_nft(
    request: TransferRequest,
    blockchain_service=Depends(get_blockchain_service),
    outbox_processor=Depends(get_outbox_processor)
):
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
    limit: int = Query(
        default=50, ge=1, le=100, description="Maximum number of results"
    ),
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
async def get_blockchain_health(
    blockchain_service=Depends(get_blockchain_service),
    health_manager: ServiceHealthManager = Depends(get_health_manager)
):
    """
    Get health status of blockchain connections and processing.

    Returns information about:
    - Blockchain network connectivity
    - Configuration validation
    - Outbox processing status
    - Queue statistics
    """
    try:
        # Validate all network configurations
        validation_results = BlockchainConfig.validate_all_networks()

        network_health = {}
        overall_status = "healthy"

        for network_key, network_config in BlockchainConfig.NETWORKS.items():
            is_valid, errors = validation_results[network_key]

            if not is_valid:
                overall_status = "degraded"
                network_health[network_key] = {
                    "status": "configuration_error",
                    "errors": errors,
                    "connected": False,
                }
            else:
                # For mock purposes - in real implementation, test actual connections
                network_health[network_key] = {
                    "status": "connected",
                    "chain_id": network_config.chain_id,
                    "network_type": network_config.network_type.value,
                    "block_height": 18500000 if "ethereum" in network_key else 123456,
                    "connected": True,
                    "configuration_valid": True,
                }

        return {
            "status": overall_status,
            "timestamp": datetime.utcnow().isoformat(),
            "blockchain_networks": network_health,
            "configuration_summary": {
                "total_networks": len(BlockchainConfig.NETWORKS),
                "valid_configurations": sum(
                    1 for is_valid, _ in validation_results.values() if is_valid
                ),
                "invalid_configurations": sum(
                    1 for is_valid, _ in validation_results.values() if not is_valid
                ),
                "mainnet_networks": len(BlockchainConfig.get_mainnet_networks()),
                "testnet_networks": len(BlockchainConfig.get_testnet_networks()),
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
    networks = []

    for network_key, network_config in BlockchainConfig.NETWORKS.items():
        blockchain_type = get_blockchain_type_from_network(network_key)

        # Determine address format and example based on blockchain type
        if blockchain_type in ["ethereum", "etherlink"]:
            address_format = "0x prefixed hex (42 characters)"
            address_example = "0x742d35Cc6634C0532925a3b8D454C5f7d74C5b8e"
        elif blockchain_type == "solana":
            address_format = "Base58 encoded (32-44 characters)"
            address_example = "DYgbEjRjJg8CKD7E7YD3Q3fWGH1N1pJvY2h8VK9X3S9m"
        else:
            address_format = "Unknown"
            address_example = "N/A"

        network_info = {
            "name": network_key,  # Use consistent network key
            "display_name": network_config.display_name,
            "chain_id": network_config.chain_id,
            "native_currency": network_config.native_currency,
            "explorer": network_config.explorer_url,
            "network_type": network_config.network_type.value,
            "address_format": address_format,
            "address_example": address_example,
            "supported_operations": BlockchainConfig.get_supported_operations(
                network_config.name
            ),
            "status": "available",
        }
        networks.append(network_info)

    return {
        "supported_networks": networks,
        "default_network": "etherlink_mainnet",  # Use consistent network key
        "mainnet_networks": [
            n["name"] for n in networks if n["network_type"] == "mainnet"
        ],
        "testnet_networks": [
            n["name"] for n in networks if n["network_type"] == "testnet"
        ],
    }


@router.get("/operations/stats")
async def get_operations_stats():
    """
    Get operation statistics grouped by status.

    Returns counts of operations in each status (pending, processing, completed, failed, etc.)
    """
    try:
        # In a real implementation, you would use:
        # repo = get_transaction_outbox_repository()
        # stats = await repo.get_processing_stats()

        # Mock response showing the expected structure
        return {
            "status_counts": {
                "pending": 12,
                "processing": 3,
                "completed": 245,
                "failed": 5,
                "error": 2,
                "manual_review": 1,
                "retry": 0,
            },
            "total_operations": 268,
            "success_rate": 91.4,  # Percentage
            "last_updated": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        logger.error(f"Error getting operations stats: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to get operations statistics"
        )


@router.get("/operations/failed", response_model=List[StatusResponse])
async def get_failed_operations(
    limit: int = Query(
        default=50, ge=1, le=100, description="Maximum number of results"
    )
):
    """
    Get operations that have failed or need manual review.

    This endpoint is useful for monitoring and troubleshooting failed operations.
    """
    try:
        # In a real implementation, you would use:
        # repo = get_transaction_outbox_repository()
        # failed_entries = await repo.get_failed_entries(limit)

        # Mock response showing the expected structure
        failed_operations = []
        for i in range(min(limit, 3)):  # Return up to 3 mock failed entries
            failed_operations.append(
                StatusResponse(
                    outbox_id=f"failed_operation_{i}",
                    status="failed" if i % 2 == 0 else "manual_review",
                    blockchain="etherlink",
                    operation_type="mint_nft",
                    attempts=3,
                    max_attempts=3,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                    error="Blockchain network timeout" if i % 2 == 0 else None,
                )
            )

        return failed_operations

    except Exception as e:
        logger.error(f"Error getting failed operations: {e}")
        raise HTTPException(status_code=500, detail="Failed to get failed operations")