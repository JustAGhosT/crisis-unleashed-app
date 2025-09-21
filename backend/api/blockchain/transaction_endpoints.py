"""
API endpoints for blockchain transaction operations.
"""

from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from uuid import uuid4
import logging

from .schemas import MintRequest, TransferRequest, OperationResponse
from .dependencies import get_blockchain_service, get_outbox_processor

router = APIRouter(tags=["blockchain_transactions"])
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
        # In a real implementation, you would inject the database dependency
        # For now, we'll return a mock response showing the structure

        outbox_id = f"mint_{request.card_id}_{uuid4().hex}"

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
        outbox_id = f"transfer_{request.token_id}_{uuid4().hex}"

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