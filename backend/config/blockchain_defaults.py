"""
Default blockchain configurations for Crisis Unleashed.

This module provides centralized blockchain network configurations
with proper environment variable handling and validation.
"""

import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class BlockchainConfigManager:
    """Manages blockchain network configurations."""

    # Default RPC endpoints - public/reliable endpoints
    DEFAULT_RPC_ENDPOINTS = {
        "ethereum_mainnet": "https://ethereum.publicnode.com",
        "ethereum_testnet": "https://sepolia.drpc.org",
        "etherlink_mainnet": "https://node.mainnet.etherlink.com",
        "etherlink_testnet": "https://node.ghostnet.etherlink.com",
        "solana_mainnet": "https://api.mainnet-beta.solana.com",
        "solana_testnet": "https://api.devnet.solana.com"
    }

    # Default chain IDs
    DEFAULT_CHAIN_IDS = {
        "ethereum_mainnet": 1,
        "ethereum_testnet": 11155111,
        "etherlink_mainnet": 1337,
        "etherlink_testnet": 128123,
        "solana_mainnet": 101,
        "solana_testnet": 103
    }

    @classmethod
    def _safe_env_int(cls, env_var: str, default: int) -> int:
        """
        Safely convert environment variable to integer with error handling.

        Args:
            env_var: Environment variable name
            default: Default value to use if conversion fails

        Returns:
            Integer value from environment or default
        """
        try:
            value = os.environ.get(env_var, str(default))
            return int(value)
        except (ValueError, TypeError):
            logger.warning(f"Invalid value for environment variable {env_var}. Using default: {default}")
            return default

    @classmethod
    def _get_network_config(cls, network_name: str, provider_type: str) -> Dict[str, Any]:
        """
        Get configuration for a specific network.

        Args:
            network_name: Network identifier (e.g., "ethereum_mainnet")
            provider_type: Provider type ("ethereum", "etherlink", "solana")

        Returns:
            Network configuration dictionary
        """
        base_config = {
            "name": network_name,
            "rpc_url": os.environ.get(
                f"{network_name.upper()}_RPC_URL",
                cls.DEFAULT_RPC_ENDPOINTS.get(network_name)
            ),
            "chain_id": cls._safe_env_int(
                f"{network_name.upper()}_CHAIN_ID",
                cls.DEFAULT_CHAIN_IDS.get(network_name, 1)
            )
        }

        # Add provider-specific configurations
        if provider_type in ["ethereum", "etherlink"]:
            base_config.update({
                "nft_contract_address": os.environ.get(
                    f"{network_name.upper()}_NFT_CONTRACT_ADDRESS"
                ),
                "marketplace_contract_address": os.environ.get(
                    f"{network_name.upper()}_MARKETPLACE_CONTRACT_ADDRESS"
                )
            })
        elif provider_type == "solana":
            base_config.update({
                "program_id": os.environ.get(f"{network_name.upper()}_PROGRAM_ID")
            })

        return base_config

    @classmethod
    def get_all_network_configs(cls) -> Dict[str, Dict[str, Any]]:
        """
        Get all blockchain network configurations.

        Returns:
            Dictionary mapping network names to configurations
        """
        return {
            # Ethereum networks
            "ethereum_mainnet": cls._get_network_config("ethereum_mainnet", "ethereum"),
            "ethereum_testnet": cls._get_network_config("ethereum_testnet", "ethereum"),

            # Etherlink networks
            "etherlink_mainnet": cls._get_network_config("etherlink_mainnet", "etherlink"),
            "etherlink_testnet": cls._get_network_config("etherlink_testnet", "etherlink"),

            # Solana networks
            "solana_mainnet": cls._get_network_config("solana_mainnet", "solana"),
            "solana_testnet": cls._get_network_config("solana_testnet", "solana"),
        }

    @classmethod
    def validate_configuration(cls, config: Dict[str, Any]) -> bool:
        """
        Validate a network configuration.

        Args:
            config: Network configuration to validate

        Returns:
            True if configuration is valid
        """
        required_fields = ["name", "rpc_url", "chain_id"]

        for field in required_fields:
            if field not in config or config[field] is None:
                logger.error(f"Missing required field '{field}' in network configuration")
                return False

        # Validate RPC URL format
        rpc_url = config["rpc_url"]
        if not isinstance(rpc_url, str) or not (rpc_url.startswith("http://") or rpc_url.startswith("https://")):
            logger.error(f"Invalid RPC URL format: {rpc_url}")
            return False

        # Validate chain ID
        chain_id = config["chain_id"]
        if not isinstance(chain_id, int) or chain_id <= 0:
            logger.error(f"Invalid chain ID: {chain_id}")
            return False

        return True

    @classmethod
    def get_provider_type(cls, network_name: str) -> str:
        """
        Get provider type from network name.

        Args:
            network_name: Network name (e.g., "ethereum_mainnet")

        Returns:
            Provider type ("ethereum", "etherlink", "solana")
        """
        if "ethereum" in network_name:
            return "ethereum"
        elif "etherlink" in network_name:
            return "etherlink"
        elif "solana" in network_name:
            return "solana"
        else:
            # Default to ethereum for unknown networks
            logger.warning(f"Unknown network type for {network_name}, defaulting to ethereum")
            return "ethereum"