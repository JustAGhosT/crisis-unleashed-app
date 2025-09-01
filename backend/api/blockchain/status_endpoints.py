"""
API endpoints for blockchain operation status.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List
from datetime import datetime
import logging

from .schemas import StatusResponse

router = APIRouter(tags=["blockchain_status"])
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
    status: str = Query(default=None, description="Filter by status"),
    blockchain: str = Query(default=None, description="Filter by blockchain"),
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
async def retry_operation(outbox_id: str) -> Dict[str, str]:
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