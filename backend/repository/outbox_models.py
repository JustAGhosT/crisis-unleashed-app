"""
Data models and enums for the transaction outbox pattern.
"""
import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional


class OutboxStatus(str, Enum):
    """Status enum for transaction outbox entries."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    ERROR = "error"
    RETRY = "retry"
    MANUAL_REVIEW = "manual_review"


class OutboxType(str, Enum):
    """Type enum for different operation types."""
    MINT_NFT = "mint_nft"
    TRANSFER_NFT = "transfer_nft"
    MARKETPLACE_LIST = "marketplace_list"
    MARKETPLACE_PURCHASE = "marketplace_purchase"
    TOURNAMENT_REWARD = "tournament_reward"


class OutboxEntry:
    """Type-safe data class for outbox entries."""
    
    def __init__(self, 
                 outbox_id: str,
                 outbox_type: OutboxType,
                 status: OutboxStatus,
                 request_data: Dict[str, Any],
                 created_at: datetime,
                 updated_at: datetime,
                 attempts: int = 0,
                 max_attempts: int = 5,
                 last_attempt: Optional[datetime] = None,
                 last_error: Optional[str] = None,
                 result: Optional[Dict[str, Any]] = None,
                 processed_at: Optional[datetime] = None):
        self.id = outbox_id
        self.type = outbox_type
        self.status = status
        self.request_data = request_data
        self.created_at = created_at
        self.updated_at = updated_at
        self.attempts = attempts
        self.max_attempts = max_attempts
        self.last_attempt = last_attempt
        self.last_error = last_error
        self.result = result
        self.processed_at = processed_at

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for MongoDB storage."""
        return {
            "_id": self.id,
            "type": self.type.value,
            "status": self.status.value,
            "request_data": self.request_data,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "attempts": self.attempts,
            "max_attempts": self.max_attempts,
            "last_attempt": self.last_attempt,
            "last_error": self.last_error,
            "result": self.result,
            "processed_at": self.processed_at
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "OutboxEntry":
        """Create OutboxEntry from MongoDB document."""
        return cls(
            outbox_id=data["_id"],
            outbox_type=OutboxType(data["type"]),
            status=OutboxStatus(data["status"]),
            request_data=data["request_data"],
            created_at=data["created_at"],
            updated_at=data["updated_at"],
            attempts=data.get("attempts", 0),
            max_attempts=data.get("max_attempts", 5),
            last_attempt=data.get("last_attempt"),
            last_error=data.get("last_error"),
            result=data.get("result"),
            processed_at=data.get("processed_at")
        )

    @classmethod
    def create_new(cls,
                   outbox_type: OutboxType,
                   request_data: Dict[str, Any],
                   max_attempts: int = 5) -> "OutboxEntry":
        """Create a new outbox entry."""
        current_time = datetime.utcnow()
        return cls(
            outbox_id=str(uuid.uuid4()),
            outbox_type=outbox_type,
            status=OutboxStatus.PENDING,
            request_data=request_data,
            created_at=current_time,
            updated_at=current_time,
            max_attempts=max_attempts
        )

    def is_ready_for_processing(self) -> bool:
        """Check if entry is ready for processing."""
        return (
            self.status in [OutboxStatus.PENDING, OutboxStatus.RETRY, OutboxStatus.ERROR] and
            self.attempts < self.max_attempts
        )

    def should_manual_review(self) -> bool:
        """Check if entry should be marked for manual review."""
        return self.attempts >= self.max_attempts

    def update_status(self, 
                     new_status: OutboxStatus,
                     result: Optional[Dict[str, Any]] = None,
                     error: Optional[str] = None) -> None:
        """Update the status and related fields."""
        self.status = new_status
        self.updated_at = datetime.utcnow()
        
        if result is not None:
            self.result = result
        
        if error is not None:
            self.last_error = error
            self.last_attempt = datetime.utcnow()
        
        if new_status in [OutboxStatus.COMPLETED, OutboxStatus.FAILED]:
            self.processed_at = datetime.utcnow()

    def increment_attempts(self, error: Optional[str] = None) -> None:
        """Increment attempt counter and update related fields."""
        self.attempts += 1
        self.updated_at = datetime.utcnow()
        self.last_attempt = datetime.utcnow()
        
        if error is not None:
            self.last_error = error
        
        if self.should_manual_review():
            self.status = OutboxStatus.MANUAL_REVIEW