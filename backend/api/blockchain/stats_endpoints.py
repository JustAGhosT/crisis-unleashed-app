"""
API endpoints for blockchain operation statistics.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List
from datetime import datetime
import logging

from .schemas import StatusResponse

router = APIRouter(tags=["blockchain_stats"])
logger = logging.getLogger(__name__)

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