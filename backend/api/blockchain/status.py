"""
Status and health check endpoints for blockchain operations.
"""

import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any, Optional

from backend.api.blockchain.models import StatusResponse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/status/{outbox_id}", response_model=StatusResponse)
async def get_operation_status(outbox_id: str) -> StatusResponse:
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
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
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
) -> List[StatusResponse]:
    """
    List blockchain operations with optional filtering.

    Supports filtering by status, blockchain, and pagination.
    """
    try:
        # Mock response showing structure
        operations = []
        for i in range(limit):  # Honor the limit parameter fully
            operations.append(
                StatusResponse(
                    outbox_id=f"operation_{i+offset}",
                    status=status or "completed",
                    blockchain=blockchain or "etherlink",
                    operation_type="mint_nft",
                    attempts=1,
                    max_attempts=3,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                )
            )

        return operations

    except Exception as e:
        logger.error(f"Error listing operations: {e}")
        raise HTTPException(status_code=500, detail="Failed to list operations")


@router.get("/operations/stats")
async def get_operations_stats() -> Dict[str, Any]:
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
            "last_updated": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
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
) -> List[StatusResponse]:
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
        for i in range(limit):  # Honor the limit parameter fully
            failed_operations.append(
                StatusResponse(
                    outbox_id=f"failed_operation_{i}",
                    status="failed" if i % 2 == 0 else "manual_review",
                    blockchain="etherlink",
                    operation_type="mint_nft",
                    attempts=3,
                    max_attempts=3,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                    error="Blockchain network timeout" if i % 2 == 0 else None,
                )
            )

        return failed_operations

    except Exception as e:
        logger.error(f"Error getting failed operations: {e}")
        raise HTTPException(status_code=500, detail="Failed to get failed operations")