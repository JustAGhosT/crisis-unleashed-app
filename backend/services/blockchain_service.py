"""
Main blockchain service that coordinates different blockchain providers.
"""
import asyncio
import logging
import os
from typing import Any, Dict, Optional, Tuple
from datetime import datetime

from .blockchain import BlockchainProviderFactory, BaseBlockchainProvider

logger = logging.getLogger(__name__)

# Mapping of rarity values to their on-chain representation
RARITY_MAPPING = {
    "common": 0,
    "uncommon": 1, 
    "rare": 2,
    "epic": 3,
    "legendary": 4
}


class BlockchainService:
    """Main service for coordinating blockchain operations across different networks."""

    def __init__(self, network_configs: Optional[Dict[str, Dict[str, Any]]] = None):
        """
        Initialize the blockchain service.
        
        Args:
            network_configs: Configuration for different blockchain networks
        """
        self.network_configs = network_configs or self._load_default_configs()
        self.providers: Dict[str, BaseBlockchainProvider] = {}
        self._initialized = False

    def _load_default_configs(self) -> Dict[str, Dict[str, Any]]:
        """Load default configurations from environment variables."""
        return {
            "ethereum": {
                "name": "ethereum",
                "rpc_url": os.environ.get("ETHEREUM_RPC_URL"),
                "nft_contract_address": os.environ.get("ETHEREUM_NFT_CONTRACT_ADDRESS"),
                "marketplace_contract_address": os.environ.get("ETHEREUM_MARKETPLACE_CONTRACT_ADDRESS"),
                "chain_id": 1
            },
            "etherlink": {
                "name": "etherlink", 
                "rpc_url": os.environ.get("ETHERLINK_RPC_URL"),
                "nft_contract_address": os.environ.get("ETHERLINK_NFT_CONTRACT_ADDRESS"),
                "marketplace_contract_address": os.environ.get("ETHERLINK_MARKETPLACE_CONTRACT_ADDRESS"),
                "chain_id": 128123
            }
        }

    async def initialize(self) -> Dict[str, bool]:
        """
        Initialize all blockchain providers.
        
        Returns:
            Dictionary mapping blockchain names to initialization success status
        """
        results = {}
        
        for blockchain, config in self.network_configs.items():
            try:
                provider = BlockchainProviderFactory.get_provider(blockchain, config)
                success = await provider.connect()
                
                if success:
                    self.providers[blockchain] = provider
                    
                results[blockchain] = success
                logger.info(f"Blockchain {blockchain} initialization: {'success' if success else 'failed'}")
                
            except Exception as e:
                logger.error(f"Failed to initialize {blockchain}: {e}")
                results[blockchain] = False
        
        self._initialized = True
        return results

    def get_provider(self, blockchain: str) -> BaseBlockchainProvider:
        """
        Get a provider for the specified blockchain.
        
        Args:
            blockchain: The blockchain network name
            
        Returns:
            The blockchain provider
            
        Raises:
            ValueError: If blockchain is not supported or not initialized
        """
        if not self._initialized:
            raise ValueError("Service not initialized. Call initialize() first.")
            
        if blockchain not in self.providers:
            raise ValueError(f"Blockchain {blockchain} not available or not initialized")
            
        return self.providers[blockchain]

    async def mint_nft(self,
                      blockchain: str,
                      recipient: str,
                      card_id: str,
                      **metadata) -> Tuple[str, Dict[str, Any]]:
        """
        Mint an NFT on the specified blockchain.
        
        Args:
            blockchain: Target blockchain network
            recipient: Wallet address to receive the NFT
            card_id: Unique card identifier
            **metadata: Additional metadata (name, rarity, faction, etc.)
            
        Returns:
            Tuple of (transaction_hash, transaction_data)
        """
        provider = self.get_provider(blockchain)
        
        # Convert rarity to numeric if provided
        if "rarity" in metadata and metadata["rarity"] in RARITY_MAPPING:
            metadata["rarity_value"] = RARITY_MAPPING[metadata["rarity"]]
        
        return await provider.mint_nft(recipient, card_id, metadata)

    async def transfer_nft(self,
                          blockchain: str,
                          from_address: str,
                          to_address: str,
                          token_id: str) -> Tuple[str, Dict[str, Any]]:
        """
        Transfer an NFT on the specified blockchain.
        
        Args:
            blockchain: Target blockchain network
            from_address: Sender wallet address
            to_address: Recipient wallet address
            token_id: Token ID to transfer
            
        Returns:
            Tuple of (transaction_hash, transaction_data)
        """
        provider = self.get_provider(blockchain)
        return await provider.transfer_nft(from_address, to_address, token_id)

    async def wait_for_confirmation(self,
                                   blockchain: str,
                                   tx_hash: str,
                                   timeout: int = 120) -> Optional[Dict[str, Any]]:
        """
        Wait for transaction confirmation.
        
        Args:
            blockchain: Blockchain network
            tx_hash: Transaction hash
            timeout: Maximum wait time in seconds
            
        Returns:
            Transaction receipt or None if timeout
        """
        provider = self.get_provider(blockchain)
        return await provider.wait_for_confirmation(tx_hash, timeout)

    async def get_transaction_status(self,
                                    blockchain: str,
                                    tx_hash: str) -> Dict[str, Any]:
        """
        Get transaction status.
        
        Args:
            blockchain: Blockchain network
            tx_hash: Transaction hash
            
        Returns:
            Transaction status information
        """
        provider = self.get_provider(blockchain)
        return await provider.get_transaction_status(tx_hash)

    async def get_nft_owner(self,
                           blockchain: str,
                           token_id: str) -> Optional[str]:
        """
        Get the owner of an NFT.
        
        Args:
            blockchain: Blockchain network
            token_id: Token ID to check
            
        Returns:
            Owner wallet address or None if not found
        """
        provider = self.get_provider(blockchain)
        return await provider.get_nft_owner(token_id)

    def get_supported_blockchains(self) -> list[str]:
        """Get list of supported and initialized blockchain networks."""
        return list(self.providers.keys())

    def get_network_info(self, blockchain: str) -> Dict[str, Any]:
        """
        Get network information for a blockchain.
        
        Args:
            blockchain: Blockchain network name
            
        Returns:
            Network information
        """
        provider = self.get_provider(blockchain)
        return provider.get_network_info()

    async def health_check(self) -> Dict[str, Any]:
        """
        Perform health check on all blockchain providers.
        
        Returns:
            Health status for each blockchain
        """
        health_status = {}
        
        for blockchain, provider in self.providers.items():
            try:
                is_connected = await provider.is_connected()
                health_status[blockchain] = {
                    "status": "healthy" if is_connected else "disconnected",
                    "connected": is_connected
                }
            except Exception as e:
                health_status[blockchain] = {
                    "status": "error",
                    "connected": False,
                    "error": str(e)
                }
        
        return health_status
