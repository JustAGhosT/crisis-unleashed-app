"""
Configuration management for Crisis Unleashed backend.
"""

from .settings import Settings, get_settings
from .blockchain_config import BlockchainConfig

__all__ = [
    "Settings",
    "get_settings", 
    "BlockchainConfig"
]

__version__ = "1.0.0"