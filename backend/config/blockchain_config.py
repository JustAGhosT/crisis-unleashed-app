"""
Blockchain-specific configuration and network definitions.
"""
from typing import Any, Dict, List
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
    ws_url: str | None
    explorer_url: str
    native_currency: str
    network_type: NetworkType
    block_time_seconds: int
    confirmation_blocks: int
    max_gas_price_gwei: int | None = None
    
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
            "max_gas_price_gwei": self.max_gas_price_gwei
        }


class BlockchainConfig:
    """Configuration manager for blockchain networks."""
    
    # Predefined network configurations
    NETWORKS = {
        "ethereum_mainnet": BlockchainNetwork(
            name="ethereum",
            display_name="Ethereum Mainnet",
            chain_id=1,
            rpc_url="https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
            ws_url="wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID",
            explorer_url="https://etherscan.io",
            native_currency="ETH",
            network_type=NetworkType.MAINNET,
            block_time_seconds=15,
            confirmation_blocks=12,
            max_gas_price_gwei=100
        ),
        
        "ethereum_goerli": BlockchainNetwork(
            name="ethereum_goerli",
            display_name="Ethereum Goerli Testnet",
            chain_id=5,
            rpc_url="https://goerli.infura.io/v3/YOUR_PROJECT_ID",
            ws_url="wss://goerli.infura.io/ws/v3/YOUR_PROJECT_ID",
            explorer_url="https://goerli.etherscan.io",
            native_currency="GoerliETH",
            network_type=NetworkType.TESTNET,
            block_time_seconds=15,
            confirmation_blocks=3,
            max_gas_price_gwei=50
        ),
        
        "etherlink_mainnet": BlockchainNetwork(
            name="etherlink",
            display_name="Etherlink Mainnet",
            chain_id=128123,
            rpc_url="https://node.mainnet.etherlink.com",
            ws_url="wss://node.mainnet.etherlink.com",
            explorer_url="https://explorer.etherlink.com",
            native_currency="XTZ",
            network_type=NetworkType.MAINNET,
            block_time_seconds=5,
            confirmation_blocks=6,
            max_gas_price_gwei=10
        ),
        
        "etherlink_testnet": BlockchainNetwork(
            name="etherlink_testnet",
            display_name="Etherlink Testnet",
            chain_id=42421,
            rpc_url="https://node.ghostnet.etherlink.com",
            ws_url="wss://node.ghostnet.etherlink.com",
            explorer_url="https://testnet.explorer.etherlink.com",
            native_currency="XTZ",
            network_type=NetworkType.TESTNET,
            block_time_seconds=5,
            confirmation_blocks=3,
            max_gas_price_gwei=5
        )
    }
    
    @classmethod
    def get_network(cls, network_name: str) -> BlockchainNetwork | None:
        """Get network configuration by name."""
        return cls.NETWORKS.get(network_name)
    
    @classmethod
    def list_networks(cls, network_type: NetworkType | None = None) -> List[BlockchainNetwork]:
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
    def create_custom_network(cls, **kwargs) -> BlockchainNetwork:
        """Create a custom network configuration."""
        return BlockchainNetwork(**kwargs)
    
    @classmethod
    def get_network_by_chain_id(cls, chain_id: int) -> BlockchainNetwork | None:
        """Get network by chain ID."""
        for network in cls.NETWORKS.values():
            if network.chain_id == chain_id:
                return network
        return None
    
    @classmethod
    def validate_network_config(cls, config: Dict[str, Any]) -> bool:
        """Validate a network configuration."""
        required_fields = [
            "name", "chain_id", "rpc_url", "explorer_url", 
            "native_currency", "block_time_seconds", "confirmation_blocks"
        ]
        
        return all(field in config for field in required_fields)
    
    @classmethod
    def get_supported_operations(cls, network_name: str) -> List[str]:
        """Get supported operations for a network."""
        # Base operations supported by all networks
        base_operations = ["mint_nft", "transfer_nft", "get_balance"]
        
        # Network-specific operations
        network_operations = {
            "ethereum": base_operations + ["marketplace_list", "marketplace_purchase", "staking"],
            "etherlink": base_operations + ["marketplace_list", "marketplace_purchase", "bridge_to_tezos"],
        }
        
        return network_operations.get(network_name, base_operations)