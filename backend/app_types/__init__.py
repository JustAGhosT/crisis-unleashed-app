"""
Type definitions and stubs for Crisis Unleashed backend.
"""

from typing import Any
from .web3_types import TxReceiptDict, TxReceiptType
from ..config.blockchain_config import BlockchainConfig

# Contract ABI type alias
ContractABI = list[dict[str, Any]]

__all__ = ["TxReceiptDict", "TxReceiptType", "BlockchainConfig", "ContractABI"]

__version__ = "1.0.0"
