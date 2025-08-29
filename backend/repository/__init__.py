"""
Repository package for data access layer.

This package contains repositories and data models for the Crisis Unleashed backend.
It follows the Repository pattern to abstract database operations and provides
consistent data access across the application.
"""

from .outbox_models import OutboxEntry, OutboxStatus, OutboxType
from .transaction_outbox import TransactionOutboxRepository

__all__ = [
    "OutboxEntry",
    "OutboxStatus",
    "OutboxType",
    "TransactionOutboxRepository"
]

# Version info
__version__ = "1.0.0"
