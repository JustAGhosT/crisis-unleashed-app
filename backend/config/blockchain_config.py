"""
Blockchain-specific configuration and network definitions.
"""
import os
from typing import Any, Dict, List, Optional, Union, Tuple
from dataclasses import dataclass
from enum import Enum

class NetworkType(str, Enum):
    """Blockchain network types."""
    MAINNET = "mainnet"
    TESTNET = "testnet"
    LOCALHOST = "localhost"

@dataclass
class BlockchainNetwork:
    """Configuration for a blockchain network."""
    name: str
    display_name: str
    chain_id: int
    rpc_url: str
    ws_url: Optional[str]
    explorer_url: str
    native_currency: str
    network_type: NetworkType
    block_time_seconds: Union[int, float]
    confirmation_blocks: int
    max_gas_price_gwei: Optional[int] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "name": self.name,
            "display_name": self.display_name,
            "chain_id": self.chain_id,
            "rpc_url": self.rpc_url,
            "ws_url": self.ws_url,
            "explorer_url": self.explorer_url,
            "native_currency": self.native_currency,
            "network_type": self.network_type.value,
            "block_time_seconds": self.block_time_seconds,
            "confirmation_blocks": self.confirmation_blocks,
            "max_gas_price_gwei": self.max_gas_price_gwei,
        }

class BlockchainConfig:
    """Configuration manager for blockchain networks."""

    # Predefined network configurations
    NETWORKS: Dict[str, BlockchainNetwork] = {
        "ethereum_mainnet": BlockchainNetwork(
            name="ethereum_mainnet",
            display_name="Ethereum Mainnet",
            chain_id=int(os.environ.get("ETHEREUM_MAINNET_CHAIN_ID", "1")),
            rpc_url=os.environ.get("ETHEREUM_MAINNET_RPC_URL", "https://ethereum.publicnode.com"),
            ws_url=os.environ.get("ETHEREUM_MAINNET_WS_URL", "wss://ethereum.publicnode.com"),
            explorer_url="https://etherscan.io",
            native_currency="ETH",
            network_type=NetworkType.MAINNET,
            block_time_seconds=15,
            confirmation_blocks=12,
            max_gas_price_gwei=100,
        ),
        "ethereum_testnet": BlockchainNetwork(
            name="ethereum_testnet",
            display_name="Ethereum Sepolia Testnet",
            chain_id=int(os.environ.get("ETHEREUM_TESTNET_CHAIN_ID", "11155111")),
            rpc_url=os.environ.get("ETHEREUM_TESTNET_RPC_URL", "https://sepolia.drpc.org"),
            ws_url=os.environ.get("ETHEREUM_TESTNET_WS_URL", "wss://sepolia.drpc.org"),
            explorer_url="https://sepolia.etherscan.io",
            native_currency="SepoliaETH",
            network_type=NetworkType.TESTNET,
            block_time_seconds=15,
            confirmation_blocks=3,
            max_gas_price_gwei=50,
        ),
        "etherlink_mainnet": BlockchainNetwork(
            name="etherlink_mainnet",
            display_name="Etherlink Mainnet",
            chain_id=int(os.environ.get("ETHERLINK_MAINNET_CHAIN_ID", "128123")),
            rpc_url=os.environ.get("ETHERLINK_MAINNET_RPC_URL", "https://node.mainnet.etherlink.com"),
            ws_url=os.environ.get("ETHERLINK_MAINNET_WS_URL", "wss://node.mainnet.etherlink.com"),
            explorer_url="https://explorer.etherlink.com",
            native_currency="XTZ",
            network_type=NetworkType.MAINNET,
            block_time_seconds=5,
            confirmation_blocks=6,
            max_gas_price_gwei=10,
        ),
        "etherlink_testnet": BlockchainNetwork(
            name="etherlink_testnet",
            display_name="Etherlink Ghostnet Testnet",
            chain_id=int(os.environ.get("ETHERLINK_TESTNET_CHAIN_ID", "42421")),
            rpc_url=os.environ.get("ETHERLINK_TESTNET_RPC_URL", "https://node.ghostnet.etherlink.com"),
            ws_url=os.environ.get("ETHERLINK_TESTNET_WS_URL", "wss://node.ghostnet.etherlink.com"),
            explorer_url="https://testnet.explorer.etherlink.com",
            native_currency="XTZ",
            network_type=NetworkType.TESTNET,
            block_time_seconds=5,
            confirmation_blocks=3,
            max_gas_price_gwei=5,
        ),
        "solana_mainnet": BlockchainNetwork(
            name="solana_mainnet",
            display_name="Solana Mainnet",
            chain_id=int(os.environ.get("SOLANA_MAINNET_CHAIN_ID", "101")),
            rpc_url=os.environ.get("SOLANA_MAINNET_RPC_URL", "https://api.mainnet-beta.solana.com"),
            ws_url=os.environ.get("SOLANA_MAINNET_WS_URL", "wss://api.mainnet-beta.solana.com"),
            explorer_url="https://explorer.solana.com",
            native_currency="SOL",
            network_type=NetworkType.MAINNET,
            block_time_seconds=0.4,     # Solana's ~400ms slot time
            confirmation_blocks=32,     # Solana confirmation depth
            max_gas_price_gwei=None,    # Solana doesn't use gas/gwei
        ),
        "solana_testnet": BlockchainNetwork(
            name="solana_testnet",
            display_name="Solana Devnet",
            chain_id=int(os.environ.get("SOLANA_TESTNET_CHAIN_ID", "103")),
            rpc_url=os.environ.get("SOLANA_TESTNET_RPC_URL", "https://api.devnet.solana.com"),
            ws_url=os.environ.get("SOLANA_TESTNET_WS_URL", "wss://api.devnet.solana.com"),
            explorer_url="https://explorer.solana.com?cluster=devnet",
            native_currency="SOL",
            network_type=NetworkType.TESTNET,
            block_time_seconds=0.4,
            confirmation_blocks=32,
            max_gas_price_gwei=None,
        ),
    }

    @classmethod
    def validate_network_config(cls, config: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """
        Validate a network configuration.
        Returns:
            Tuple of (is_valid, list_of_errors)
        """
        errors: List[str] = []
        required_fields = {
            "name": str,
            "display_name": str,
            "chain_id": int,
            "rpc_url": str,
            "explorer_url": str,
            "native_currency": str,
            "network_type": str,
            "block_time_seconds": (int, float),
            "confirmation_blocks": int,
        }
        # Check required fields presence and types
        for field, expected_type in required_fields.items():
            if field not in config:
                errors.append(f"Missing required field: {field}")
            else:
                # Only call isinstance if expected_type is a type or tuple of types
                # (not just any object)
                if (
                    (isinstance(expected_type, type)) or
                    (
                        isinstance(expected_type, tuple)
                        and all(isinstance(e, type) for e in expected_type)
                    )
                ):
                    if not isinstance(config[field], expected_type):
                        if isinstance(expected_type, tuple):
                            expected_type_name = "/".join(
                                [
                                    t.__name__
                                    for t in expected_type
                                    if hasattr(t, "__name__")
                                ]
                            )
                        else:
                            expected_type_name = getattr(
                                expected_type, "__name__", str(expected_type)
                            )
                        errors.append(
                            (
                                f"Field '{field}' must be of type {expected_type_name}, "
                                f"got {type(config[field]).__name__}"
                            )
                        )
        # Additional validation
        if "chain_id" in config and isinstance(config["chain_id"], int):
            if config["chain_id"] <= 0:
                errors.append("chain_id must be a positive integer")
        if "rpc_url" in config and isinstance(config["rpc_url"], str):
            if not (config["rpc_url"].startswith("http://") or config["rpc_url"].startswith("https://")):
                errors.append("rpc_url must be a valid HTTP/HTTPS URL")
            if (
                "YOUR_PROJECT_ID" in config["rpc_url"]
                or "YOUR_API_KEY" in config["rpc_url"]
            ):
                errors.append(
                    "rpc_url contains placeholder text - please set environment variables"
                )
        if "network_type" in config and isinstance(config["network_type"], str):
            valid_types = [t.value for t in NetworkType]
            if config["network_type"] not in valid_types:
                errors.append(f"network_type must be one of: {valid_types}")
        if "block_time_seconds" in config:
            if (
                not isinstance(config["block_time_seconds"], (int, float))
                or config["block_time_seconds"] <= 0
            ):
                errors.append("block_time_seconds must be a positive number")
        if "confirmation_blocks" in config and isinstance(config["confirmation_blocks"], int):
            if config["confirmation_blocks"] < 1:
                errors.append("confirmation_blocks must be at least 1")
        return len(errors) == 0, errors

    @classmethod
    def validate_all_networks(cls) -> Dict[str, Tuple[bool, List[str]]]:
        """Validate all predefined networks."""
        results: Dict[str, Tuple[bool, List[str]]] = {}
        for network_name, network_config in cls.NETWORKS.items():
            config_dict = network_config.to_dict()
            is_valid, errors = cls.validate_network_config(config_dict)
            results[network_name] = (is_valid, errors)
        return results

    @classmethod
    def get_network(cls, network_name: str) -> Optional[BlockchainNetwork]:
        """Get network configuration by name."""
        return cls.NETWORKS.get(network_name)

    @classmethod
    def list_networks(cls, network_type: Optional[NetworkType] = None) -> List[BlockchainNetwork]:
        """List all networks, optionally filtered by type."""
        networks = list(cls.NETWORKS.values())
        if network_type:
            networks = [n for n in networks if n.network_type == network_type]
        return networks

    @classmethod
    def get_mainnet_networks(cls) -> List[BlockchainNetwork]:
        """Get all mainnet networks."""
        return cls.list_networks(NetworkType.MAINNET)

    @classmethod
    def get_testnet_networks(cls) -> List[BlockchainNetwork]:
        """Get all testnet networks."""
        return cls.list_networks(NetworkType.TESTNET)

    @classmethod
    def create_custom_network(cls, **kwargs: Any) -> BlockchainNetwork:
        """Create a custom network configuration."""
        return BlockchainNetwork(**kwargs)

    @classmethod
    def get_network_by_chain_id(cls, chain_id: int) -> Optional[BlockchainNetwork]:
        """Get network by chain ID."""
        for network in cls.NETWORKS.values():
            if network.chain_id == chain_id:
                return network
        return None

    @classmethod
    def get_supported_operations(cls, network_name: str) -> List[str]:
        """Get supported operations for a network."""
        # Base operations supported by all networks
        base_operations = [
            "mint_nft",
            "transfer_nft",
            "get_balance",
            "get_transaction_status",
        ]
        # Determine blockchain type from network name
        if network_name.startswith("ethereum"):
            blockchain_type = "ethereum"
        elif network_name.startswith("etherlink"):
            blockchain_type = "etherlink"
        elif network_name.startswith("solana"):
            blockchain_type = "solana"
        else:
            # Fallback to the network name itself for backward compatibility
            blockchain_type = network_name
        # Network-specific operations by blockchain type
        network_operations = {
            "ethereum": base_operations
            + [
                "marketplace_list",
                "marketplace_purchase",
                "staking",
                "bridge_to_l2",
            ],
            "etherlink": base_operations
            + [
                "marketplace_list",
                "marketplace_purchase",
                "bridge_to_tezos",
            ],
            "solana": base_operations + ["marketplace_list", "stake_sol", "create_token"],
        }
        return network_operations.get(blockchain_type, base_operations)
