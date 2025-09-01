"""
Workers package for background processing.
"""

# Try absolute import first (works when installed as a package)
try:
    # Absolute imports rooted at 'backend'
    from backend.workers.outbox_processor import OutboxProcessor, OutboxMonitor
except ImportError:
    # Fallback to relative import (works when run from source tree)
    from .outbox_processor import OutboxProcessor, OutboxMonitor

__all__ = [
    "OutboxProcessor",
    "OutboxMonitor"
]

__version__ = "1.0.0"