"""
Network Configuration Service

Centralized management of blockchain network configurations
with environment variable support and validation.
"""

import os
from typing import Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum


class NetworkType(Enum):
    """Supported blockchain network types."""
    ETHEREUM = "ethereum"
    ETHERLINK = "etherlink"
    SOLANA = "solana"


class EnvironmentType(Enum):
    """Network environment types."""
    MAINNET = "mainnet"
    TESTNET = "testnet"


@dataclass
class NetworkConfig:
    """Configuration for a specific blockchain network."""
    name: str
    network_type: NetworkType
    environment: EnvironmentType
    rpc_url: str
    chain_id: int
    nft_contract_address: Optional[str] = None
    marketplace_contract_address: Optional[str] = None
    program_id: Optional[str] = None  # For Solana networks

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary format for compatibility."""
        base_config = {
            "name": self.name,
            "rpc_url": self.rpc_url,
            "chain_id": self.chain_id
        }

        if self.nft_contract_address:
            base_config["nft_contract_address"] = self.nft_contract_address

        if self.marketplace_contract_address:
            base_config["marketplace_contract_address"] = self.marketplace_contract_address

        if self.program_id:
            base_config["program_id"] = self.program_id

        return base_config


class NetworkConfigService:
    """Service for managing blockchain network configurations."""

    # Default RPC URLs for fallback
    DEFAULT_RPCS = {
        NetworkType.ETHEREUM: {
            EnvironmentType.MAINNET: "https://ethereum.publicnode.com",
            EnvironmentType.TESTNET: "https://sepolia.drpc.org"
        },
        NetworkType.ETHERLINK: {
            EnvironmentType.MAINNET: "https://node.mainnet.etherlink.com",
            EnvironmentType.TESTNET: "https://node.ghostnet.etherlink.com"
        },
        NetworkType.SOLANA: {
            EnvironmentType.MAINNET: "https://api.mainnet-beta.solana.com",
            EnvironmentType.TESTNET: "https://api.devnet.solana.com"
        }
    }

    # Default chain IDs
    DEFAULT_CHAIN_IDS = {
        NetworkType.ETHEREUM: {
            EnvironmentType.MAINNET: 1,
            EnvironmentType.TESTNET: 11155111
        },
        NetworkType.ETHERLINK: {
            EnvironmentType.MAINNET: 1337,
            EnvironmentType.TESTNET: 128123
        },
        NetworkType.SOLANA: {
            EnvironmentType.MAINNET: 101,
            EnvironmentType.TESTNET: 103
        }
    }

    @classmethod
    def get_network_config(
        self,
        network_type: NetworkType,
        environment: EnvironmentType
    ) -> NetworkConfig:
        """
        Get configuration for a specific network and environment.

        Args:
            network_type: Type of blockchain network
            environment: Environment (mainnet/testnet)

        Returns:
            NetworkConfig object with all necessary settings
        """
        network_name = f"{network_type.value}_{environment.value}"
        env_prefix = f"{network_type.value.upper()}_{environment.value.upper()}"

        # Get RPC URL from environment or use default
        rpc_url = os.environ.get(
            f"{env_prefix}_RPC_URL",
            self.DEFAULT_RPCS[network_type][environment]
        )

        # Get chain ID from environment or use default
        chain_id = int(os.environ.get(
            f"{env_prefix}_CHAIN_ID",
            str(self.DEFAULT_CHAIN_IDS[network_type][environment])
        ))

        # Network-specific configurations
        config = NetworkConfig(
            name=network_name,
            network_type=network_type,
            environment=environment,
            rpc_url=rpc_url,
            chain_id=chain_id
        )

        # Add contract addresses for EVM networks
        if network_type in [NetworkType.ETHEREUM, NetworkType.ETHERLINK]:
            config.nft_contract_address = os.environ.get(
                f"{env_prefix}_NFT_CONTRACT_ADDRESS"
            )
            config.marketplace_contract_address = os.environ.get(
                f"{env_prefix}_MARKETPLACE_CONTRACT_ADDRESS"
            )

        # Add program ID for Solana networks
        if network_type == NetworkType.SOLANA:
            config.program_id = os.environ.get(f"{env_prefix}_PROGRAM_ID")

        return config

    @classmethod
    def get_all_network_configs(self) -> Dict[str, Dict[str, Any]]:
        """
        Get all network configurations in a format compatible with existing code.

        Returns:
            Dictionary mapping network names to configuration dictionaries
        """
        configs = {}

        for network_type in NetworkType:
            for environment in EnvironmentType:
                try:
                    config = self.get_network_config(network_type, environment)
                    configs[config.name] = config.to_dict()
                except Exception as e:
                    # Log but don't fail if one network config is invalid
                    print(f"Warning: Failed to configure {network_type.value} {environment.value}: {e}")

        return configs

    @classmethod
    def validate_network_config(self, config: NetworkConfig) -> bool:
        """
        Validate a network configuration.

        Args:
            config: NetworkConfig to validate

        Returns:
            True if valid, False otherwise
        """
        # Basic validation
        if not config.name or not config.rpc_url:
            return False

        if config.chain_id <= 0:
            return False

        # Network-specific validation
        if config.network_type == NetworkType.SOLANA and not config.program_id:
            # Solana networks should have a program ID in production
            return False

        return True