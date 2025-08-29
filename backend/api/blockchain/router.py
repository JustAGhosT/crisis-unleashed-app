"""
Blockchain API Router

This module provides the FastAPI router for blockchain-related endpoints.
"""

from fastapi import APIRouter
from typing import Dict, Any

from backend.api.blockchain.models import (
    OperationResponse,
    StatusResponse
)
from backend.api.blockchain.operations import mint_card, transfer_nft, retry_operation
from backend.api.blockchain.networks import get_supported_networks
from backend.api.blockchain.status import (
    get_operation_status,
    get_operations_stats,
    list_operations,
    get_failed_operations
)
from backend.api.blockchain.health import get_blockchain_health

# Create router with /blockchain prefix
router = APIRouter(prefix="/blockchain", tags=["blockchain"])

# Health endpoint
router.add_api_route(
    "/health",
    get_blockchain_health,
    methods=["GET"],
    response_model=Dict[str, Any],
    summary="Get blockchain service health status"
)

# Network information endpoints
router.add_api_route(
    "/networks",
    get_supported_networks,
    methods=["GET"],
    response_model=Dict[str, Any],
    summary="Get supported blockchain networks"
)

# Transaction operations
router.add_api_route(
    "/mint",
    mint_card,
    methods=["POST"],
    response_model=OperationResponse,
    summary="Mint a new NFT card"
)

router.add_api_route(
    "/transfer",
    transfer_nft,
    methods=["POST"],
    response_model=OperationResponse,
    summary="Transfer an NFT to another wallet"
)

# Status and monitoring endpoints
router.add_api_route(
    "/operations/status/{outbox_id}",
    get_operation_status,
    methods=["GET"],
    response_model=StatusResponse,
    summary="Get status of a specific blockchain operation"
)

router.add_api_route(
    "/operations/stats",
    get_operations_stats,
    methods=["GET"],
    response_model=Dict[str, Any],
    summary="Get statistics about blockchain operations"
)

router.add_api_route(
    "/operations",
    list_operations,
    methods=["GET"],
    response_model=Dict[str, Any],
    summary="List blockchain operations with filtering options"
)

router.add_api_route(
    "/operations/failed",
    get_failed_operations,
    methods=["GET"],
    response_model=Dict[str, Any],
    summary="Get failed blockchain operations"
)

# Retry functionality
router.add_api_route(
    "/operations/retry/{outbox_id}",
    retry_operation,
    methods=["POST"],
    response_model=Dict[str, Any],
    summary="Retry a failed blockchain operation"
)
