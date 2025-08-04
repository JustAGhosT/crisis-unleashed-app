"""
Factory for creating blockchain providers.
"""
import logging
from typing import Any, Dict, Optional

from .base_provider import BaseBlockchainProvider
from .etherlink_provider import EtherlinkProvider
from .ethereum_provider import EthereumProvider

logger = logging.getLogger(__name__)


class BlockchainProviderFactory:
    """Factory for creating blockchain providers."""
    
    _providers = {
        "etherlink": EtherlinkProvider,
        "ethereum": EthereumProvider,
    }
    
    _instances: Dict[str, BaseBlockchainProvider] = {}
    
    @classmethod
    def get_provider(cls, 
                    blockchain: str, 
                    network_config: Optional[Dict[str, Any]] = None) -> BaseBlockchainProvider:
        """
        Get or create a blockchain provider instance.
        
        Args:
            blockchain: Name of the blockchain network
            network_config: Configuration for the network
            
        Returns:
            Blockchain provider instance
            
        Raises:
            ValueError: If blockchain is not supported
        """
        if blockchain not in cls._providers:
            supported = ", ".join(cls._providers.keys())
            raise ValueError(f"Unsupported blockchain: {blockchain}. Supported: {supported}")
        
        # Use singleton pattern for providers
        if blockchain in cls._instances:
            return cls._instances[blockchain]
        
        # Create new instance
        if not network_config:
            network_config = cls._get_default_config(blockchain)
        
        provider_class = cls._providers[blockchain]
        provider = provider_class(network_config)
        
        cls._instances[blockchain] = provider
        logger.info(f"Created new {blockchain} provider")
        
        return provider
    
    @classmethod
    def create_provider(cls,
                       blockchain: str,
                       network_config: Dict[str, Any]) -> BaseBlockchainProvider:
        """
        Create a new provider instance (bypassing singleton).
        
        Args:
            blockchain: Name of the blockchain network
            network_config: Configuration for the network
            
        Returns:
            New blockchain provider instance
        """
        if blockchain not in cls._providers:
            supported = ", ".join(cls._providers.keys())
            raise ValueError(f"Unsupported blockchain: {blockchain}. Supported: {supported}")
        
        provider_class = cls._providers[blockchain]
        return provider_class(network_config)
    
    @classmethod
    def register_provider(cls, 
                         blockchain: str, 
                         provider_class: type[BaseBlockchainProvider]) -> None:
        """
        Register a new blockchain provider.
        
        Args:
            blockchain: Name of the blockchain
            provider_class: Provider class to register
        """
        cls._providers[blockchain] = provider_class
        logger.info(f"Registered {blockchain} provider: {provider_class.__name__}")
    
    @classmethod
    def get_supported_blockchains(cls) -> list[str]:
        """Get list of supported blockchain networks."""
        return list(cls._providers.keys())
    
    @classmethod
    def _get_default_config(cls, blockchain: str) -> Dict[str, Any]:
        """Get default configuration for a blockchain."""
        configs = {
            "etherlink": {
                "name": "etherlink",
                "rpc_url": "https://node.ghostnet.etherlink.com",
                "chain_id": 128123,
                "nft_contract_address": None,
                "marketplace_contract_address": None
            },
            "ethereum": {
                "name": "ethereum", 
                "rpc_url": "https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
                "chain_id": 1,
                "nft_contract_address": None,
                "marketplace_contract_address": None
            }
        }
        
        return configs.get(blockchain, {})
    
    @classmethod
    async def initialize_all_providers(cls, 
                                     configs: Dict[str, Dict[str, Any]]) -> Dict[str, bool]:
        """
        Initialize all providers with their configurations.
        
        Args:
            configs: Dictionary mapping blockchain names to their configs
            
        Returns:
            Dictionary mapping blockchain names to connection success status
        """
        results = {}
        
        for blockchain, config in configs.items():
            try:
                provider = cls.get_provider(blockchain, config)
                success = await provider.connect()
                results[blockchain] = success
                
                if success:
                    logger.info(f"Successfully initialized {blockchain} provider")
                else:
                    logger.error(f"Failed to initialize {blockchain} provider")
                    
            except Exception as e:
                logger.error(f"Error initializing {blockchain} provider: {e}")
                results[blockchain] = False
        
        return results
    
    @classmethod
    def clear_instances(cls) -> None:
        """Clear all cached provider instances."""
        cls._instances.clear()
        logger.info("Cleared all provider instances")