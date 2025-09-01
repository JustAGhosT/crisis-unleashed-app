"""
Validation utilities for blockchain operations.

Contains functions for validating wallet addresses, network names,
and other blockchain-related data.
"""

import re
from typing import List

from backend.config.blockchain_config import BlockchainConfig

def get_supported_network_names() -> List[str]:
    """Get list of supported network names from blockchain config."""
    return list(BlockchainConfig.NETWORKS.keys())

def validate_wallet_address_format(
    address: str, network_name: str, field_name: str = "wallet_address"
) -> str:
    """
    Validate wallet address format based on blockchain network.
    Args:
        address: The wallet address to validate
        network_name: The blockchain network name (e.g., 'ethereum_mainnet')
        field_name: Name of the field for error messages
    Returns:
        The validated address
    Raises:
        ValueError: If the address format is invalid
    """
    if network_name not in get_supported_network_names():
        raise ValueError(f"Unsupported network: {network_name}")

    # Use the centralized method from BlockchainConfig
    blockchain_type = BlockchainConfig.get_blockchain_type_from_network(network_name)

    if blockchain_type == "solana":
        # Solana addresses are base58 encoded, typically 32-44 characters
        if not re.match(r"^[1-9A-HJ-NP-Za-km-z]{32,44}$", address):
            raise ValueError(f"Invalid Solana wallet address format for {field_name}")
    elif blockchain_type in ["ethereum", "etherlink"]:
        if not address.startswith("0x") or len(address) != 42:
            raise ValueError(
                f"Invalid Ethereum-style wallet address format for {field_name}"
            )
        if not re.match(r"^0x[a-fA-F0-9]{40}$", address):
            raise ValueError(
                f"Invalid Ethereum-style wallet address format for {field_name}"
            )
    else:
        raise ValueError(
            f"Wallet address validation not implemented for blockchain type: {blockchain_type}"
        )
    return address