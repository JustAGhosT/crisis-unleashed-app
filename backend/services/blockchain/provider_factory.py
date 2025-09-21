"""
Factory for creating blockchain providers.
"""
import asyncio
import logging
import os
import threading
from typing import Any, Dict, Optional

# Absolute imports rooted at 'backend'
from backend.services.blockchain.base_provider import BaseBlockchainProvider
from backend.services.blockchain.ethereum_provider import EthereumProvider
from backend.services.blockchain.etherlink_provider import EtherlinkProvider

logger = logging.getLogger(__name__)


class BlockchainProviderFactory:
    """Factory for creating blockchain providers."""

    _providers = {
        "etherlink": EtherlinkProvider,
        "ethereum": EthereumProvider,
    }

    _instances: Dict[str, BaseBlockchainProvider] = {}
    _pools: Dict[str, list[BaseBlockchainProvider]] = {}
    _lock = threading.Lock()

    @classmethod
    def _get_default_config(cls, blockchain: str) -> Dict[str, Any]:
        """Get default configuration for a blockchain."""
        # Load Ethereum RPC URL from environment variable with fallback
        ethereum_rpc_url = os.environ.get(
            "ETHEREUM_RPC_URL",
            (
                "https://mainnet.infura.io/v3/"
                f"{os.environ.get('INFURA_PROJECT_ID', 'YOUR_PROJECT_ID')}"
            ),
        )

        # Warn if using placeholder values
        if "YOUR_PROJECT_ID" in ethereum_rpc_url:
            logger.warning(
                "Ethereum RPC URL has placeholder. Set ETHEREUM_RPC_URL or INFURA_PROJECT_ID."
            )
            # Consider raising an exception in production environments
            if os.environ.get("ENVIRONMENT") == "production":
                raise ValueError("Invalid Ethereum RPC URL configuration in production")

        configs = {
            "etherlink": {
                "name": "etherlink",
                "rpc_url": os.environ.get(
                    "ETHERLINK_RPC_URL",
                    "https://node.ghostnet.etherlink.com",
                ),
                "chain_id": int(os.environ.get("ETHERLINK_CHAIN_ID", "128123")),
                "nft_contract_address": os.environ.get("ETHERLINK_NFT_CONTRACT_ADDRESS"),
                "marketplace_contract_address": os.environ.get(
                    "ETHERLINK_MARKETPLACE_CONTRACT_ADDRESS"
                ),
            },
            "ethereum": {
                "name": "ethereum",
                "rpc_url": ethereum_rpc_url,
                "chain_id": int(os.environ.get("ETHEREUM_CHAIN_ID", "1")),
                "nft_contract_address": os.environ.get(
                    "ETHEREUM_NFT_CONTRACT_ADDRESS"
                ),
                "marketplace_contract_address": os.environ.get(
                    "ETHEREUM_MARKETPLACE_CONTRACT_ADDRESS"
                ),
            }
        }

        # Extract and validate the selected blockchain config
        config = configs.get(blockchain, {})

        # Log warning if contract addresses are missing
        if config and not config.get("nft_contract_address"):
            logger.warning(
                "NFT contract address not configured for %s", blockchain
            )
        if config and not config.get("marketplace_contract_address"):
            logger.warning(
                "Marketplace contract address not configured for %s", blockchain
            )

        return config

    @classmethod
    def get_provider(
        cls, blockchain: str, network_config: Optional[Dict[str, Any]] = None
    ) -> BaseBlockchainProvider:
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
            raise ValueError(
                f"Unsupported blockchain: {blockchain}. Supported: {supported}"
            )

        # Use singleton pattern for providers
        if blockchain in cls._instances:
            return cls._instances[blockchain]

        # Create new instance
        if not network_config:
            logger.warning(
                (
                    f"Using default configuration for {blockchain} blockchain. "
                    "Consider providing explicit network configuration for production use."
                )
            )
            network_config = cls._get_default_config(blockchain)

        provider_class = cls._providers[blockchain]
        provider = provider_class(network_config)

        cls._instances[blockchain] = provider
        logger.info(f"Created new {blockchain} provider")

        # Build a tiny connection pool (size 2) for reuse
        pool: list[BaseBlockchainProvider] = [provider]
        try:
            extra = provider_class(network_config)
            pool.append(extra)
        except Exception as e:
            logger.warning(
                "Partial initialization of provider pool for %s: %s",
                blockchain,
                e,
            )
        cls._pools[blockchain] = pool

        return provider

    @classmethod
    def create_provider(
        cls, blockchain: str, network_config: Dict[str, Any]
    ) -> BaseBlockchainProvider:
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
            raise ValueError(
                f"Unsupported blockchain: {blockchain}. Supported: {supported}"
            )

        provider_class = cls._providers[blockchain]
        return provider_class(network_config)

    @classmethod
    def register_provider(
        cls, blockchain: str, provider_class: type[BaseBlockchainProvider]
    ) -> None:
        """
        Register a new blockchain provider.

        Args:
            blockchain: Name of the blockchain
            provider_class: Provider class to register

        Raises:
            TypeError: If provider_class is not a subclass of BaseBlockchainProvider
        """
        # Validate that the provider class is a subclass of BaseBlockchainProvider
        if not issubclass(provider_class, BaseBlockchainProvider):
            raise TypeError(
                (
                    f"Provider class {provider_class.__name__} must be a subclass "
                    "of BaseBlockchainProvider"
                )
            )

        # Thread-safe registration
        with cls._lock:
            cls._providers[blockchain] = provider_class
            logger.info(f"Registered {blockchain} provider: {provider_class.__name__}")

    @classmethod
    def get_supported_blockchains(cls) -> list[str]:
        """Get list of supported blockchain networks."""
        return list(cls._providers.keys())



    @classmethod
    async def initialize_all_providers(
        cls, configs: Dict[str, Dict[str, Any]]
    ) -> Dict[str, bool]:
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
                # Offload sync connect to thread to avoid blocking the event loop
                success = await asyncio.to_thread(provider.connect)
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
    async def clear_instances(cls) -> None:
        """
        Clear all cached provider instances with proper cleanup.
        Ensures thread safety and proper resource cleanup.
        """
        # Copy providers under lock, then clear cache
        with cls._lock:
            instances = dict(cls._instances)
            pools = dict(cls._pools)
            cls._instances.clear()
            cls._pools.clear()

        # Disconnect outside the lock to limit contention and avoid blocking the loop
        for blockchain, provider in instances.items():
            try:
                await asyncio.to_thread(provider.disconnect)
                logger.debug(f"Disconnected {blockchain} provider")
            except Exception as e:
                logger.error(
                    "Error disconnecting %s provider: %s", blockchain, e
                )

        # Best-effort disconnect of pooled providers
        for blockchain, pool in pools.items():
            for p in pool:
                try:
                    await asyncio.to_thread(p.disconnect)
                except Exception:
                    pass

        logger.info("Cleared all provider instances with proper cleanup")
