"""
Network information endpoints for blockchain operations.
"""

import logging
from fastapi import APIRouter
from typing import Dict, Any

from backend.config.blockchain_config import BlockchainConfig
from backend.api.blockchain.validation import get_blockchain_type_from_network

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/networks")
async def get_supported_networks() -> Dict[str, Any]:
    """
    Get information about supported blockchain networks.
    """
    networks = []

    for network_key, network_config in BlockchainConfig.NETWORKS.items():
        blockchain_type = get_blockchain_type_from_network(network_key)

        # Determine address format and example based on blockchain type
        if blockchain_type in ["ethereum", "etherlink"]:
            address_format = "0x prefixed hex (42 characters)"
            address_example = "0x742d35Cc6634C0532925a3b8D454C5f7d74C5b8e"
        elif blockchain_type == "solana":
            address_format = "Base58 encoded (32-44 characters)"
            address_example = "DYgbEjRjJg8CKD7E7YD3Q3fWGH1N1pJvY2h8VK9X3S9m"
        else:
            address_format = "Unknown"
            address_example = "N/A"

        network_info = {
            "name": network_key,  # Use consistent network key
            "display_name": network_config.display_name,
            "chain_id": network_config.chain_id,
            "native_currency": network_config.native_currency,
            "explorer": network_config.explorer_url,
            "network_type": network_config.network_type.value,
            "address_format": address_format,
            "address_example": address_example,
            "supported_operations": BlockchainConfig.get_supported_operations(
                network_key  # Changed from network_config.name to network_key for consistency
            ),
            "status": "available",
        }
        networks.append(network_info)

    return {
        "supported_networks": networks,
        "default_network": "etherlink_mainnet",  # Use consistent network key
        "mainnet_networks": [
            n["name"] for n in networks if n["network_type"] == "mainnet"
        ],
        "testnet_networks": [
            n["name"] for n in networks if n["network_type"] == "testnet"
        ],
    }