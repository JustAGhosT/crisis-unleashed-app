"""
Workers package for background processing.
"""

# Absolute imports rooted at 'backend'
from backend.workers.outbox_processor import OutboxProcessor, OutboxMonitor

__all__ = [
    "OutboxProcessor",
    "OutboxMonitor"
]

__version__ = "1.0.0"
