"""
Blockchain operation endpoints for minting, transferring, and retrying.
"""

import logging
from datetime import datetime, timezone
import uuid
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict

from backend.api.blockchain.models import (
    MintRequest,
    TransferRequest,
    OperationResponse
)
from backend.api.blockchain.dependencies import (
    get_blockchain_service,
    get_outbox_processor
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/mint", response_model=OperationResponse, status_code=202)
async def mint_card(
    request: MintRequest,
    blockchain_service=Depends(get_blockchain_service),
    outbox_processor=Depends(get_outbox_processor)
) -> OperationResponse:
    """
    Mint a card as NFT using the transaction outbox pattern.

    This endpoint queues the mint request for background processing,
    ensuring consistency between database and blockchain state.
    """
    try:
        # TODO: replace mock with real outbox call
        created_at = datetime.now(timezone.utc)
        outbox_id = f"mint_{request.card_id}_{uuid.uuid4().hex}"
        payload = (
            request.model_dump(exclude_none=True)
            if hasattr(request, "model_dump")
            else request.dict(exclude_none=True)
        )
        # NOTE: verify method name/asyncness in outbox processor (enqueue/publish/etc.)
        outbox_processor.enqueue("mint", outbox_id, payload)
        
        logger.info("Mint request queued: %s for card %s", outbox_id, request.card_id)
        
        return OperationResponse(
            outbox_id=outbox_id,
            status="pending",
            message=f"Mint request for card {request.card_id} queued for processing",
            created_at=created_at,
            estimated_completion="2-5 minutes",
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        logger.exception("Error queueing mint request")
        raise HTTPException(status_code=500, detail="Failed to queue mint request")


@router.post("/transfer", response_model=OperationResponse, status_code=202)
async def transfer_nft(
    request: TransferRequest,
    blockchain_service=Depends(get_blockchain_service),
    outbox_processor=Depends(get_outbox_processor)
) -> OperationResponse:
    """
    Transfer an NFT using the transaction outbox pattern.
    """
    try:
        created_at = datetime.now(timezone.utc)
        outbox_id = f"transfer_{request.token_id}_{uuid.uuid4().hex}"
        payload = (
            request.model_dump(exclude_none=True)
            if hasattr(request, "model_dump")
            else request.dict(exclude_none=True)
        )
        outbox_processor.enqueue("transfer", outbox_id, payload)
        
        logger.info("Transfer request queued: %s for token %s", outbox_id, request.token_id)
        
        return OperationResponse(
            outbox_id=outbox_id,
            status="pending",
            message=f"Transfer request for token {request.token_id} queued for processing",
            created_at=created_at,
            estimated_completion="1-3 minutes",
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        logger.exception("Error queueing transfer request")
        raise HTTPException(status_code=500, detail="Failed to queue transfer request")


@router.post("/operations/{outbox_id}/retry", response_model=Dict[str, str], status_code=202)
async def retry_operation(
    outbox_id: str,
    outbox_processor=Depends(get_outbox_processor)
) -> Dict[str, str]:
    """
    Manually retry a failed operation.

    This endpoint allows manual intervention for operations
    that have failed or need immediate processing.
    """
    try:
        # Validate outbox_id format or existence
        if not outbox_id or not outbox_processor.exists(outbox_id):
            raise HTTPException(status_code=404, detail="Operation not found")
            
        logger.info("Manual retry requested for operation: %s", outbox_id)
        # NOTE: verify method name/asyncness
        outbox_processor.retry(outbox_id)

        return {
            "outbox_id": outbox_id,
            "status": "queued_for_retry",
            "message": "Operation has been queued for manual retry",
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception:
        logger.exception("Error retrying operation %s", outbox_id)
        raise HTTPException(status_code=500, detail="Failed to retry operation")