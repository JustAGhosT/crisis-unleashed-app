"""
Services package for business logic layer.

This package contains service classes that implement the business logic
for Crisis Unleashed. Services coordinate between repositories, external APIs,
and other components to fulfill business requirements.
"""

from .blockchain_handler import BlockchainHandler
from .blockchain_service import BlockchainService
from . import blockchain

__all__ = ["BlockchainHandler", "BlockchainService", "blockchain"]

# Version info
__version__ = "1.0.0"
