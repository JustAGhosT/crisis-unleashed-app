"""
Main blockchain service that coordinates different blockchain providers.
"""

import asyncio
import inspect
import logging
import os
from typing import Any, Dict, Optional, Tuple

from .blockchain import BlockchainProviderFactory, BaseBlockchainProvider

logger = logging.getLogger(__name__)

# Mapping of rarity values to their on-chain representation
RARITY_MAPPING = {"common": 0, "uncommon": 1, "rare": 2, "epic": 3, "legendary": 4}


class BlockchainService:
    """Main service for coordinating blockchain operations across different networks."""

    def __init__(self, network_configs: Optional[Dict[str, Dict[str, Any]]] = None):
        """
        Initialize the blockchain service.

        Args:
            network_configs: Configuration for different blockchain networks
        """
        self.network_configs = network_configs or self._load_default_configs()
        self._providers: Dict[str, BaseBlockchainProvider] = {}
        self._initialized = False

    def _maybe_await(self, value: Any) -> Any:
        """Return result of value, awaiting if it's a coroutine/awaitable."""
        # Prefer asyncio.iscoroutine to satisfy type-checkers
        if asyncio.iscoroutine(value):
            try:
                return asyncio.run(value)
            except RuntimeError:
                loop = asyncio.get_event_loop()
                return loop.run_until_complete(value)
        # Fallback for other awaitables
        if inspect.isawaitable(value):
            try:
                return asyncio.run(value)  # type: ignore[arg-type]
            except RuntimeError:
                loop = asyncio.get_event_loop()
                return loop.run_until_complete(value)  # type: ignore[arg-type]
        return value

    def _load_default_configs(self) -> Dict[str, Dict[str, Any]]:
        """Load default configurations from environment variables."""
        return {
            "ethereum_mainnet": {
                "name": "ethereum_mainnet",
                "rpc_url": os.environ.get(
                    "ETHEREUM_MAINNET_RPC_URL", "https://ethereum.publicnode.com"
                ),
                "nft_contract_address": os.environ.get(
                    "ETHEREUM_MAINNET_NFT_CONTRACT_ADDRESS"
                ),
                "marketplace_contract_address": os.environ.get(
                    "ETHEREUM_MAINNET_MARKETPLACE_CONTRACT_ADDRESS"
                ),
                "chain_id": 1,
            },
            "ethereum_testnet": {
                "name": "ethereum_testnet",
                "rpc_url": os.environ.get(
                    "ETHEREUM_TESTNET_RPC_URL", "https://sepolia.drpc.org"
                ),
                "nft_contract_address": os.environ.get(
                    "ETHEREUM_TESTNET_NFT_CONTRACT_ADDRESS"
                ),
                "marketplace_contract_address": os.environ.get(
                    "ETHEREUM_TESTNET_MARKETPLACE_CONTRACT_ADDRESS"
                ),
                "chain_id": 11155111,
            },
            "etherlink_mainnet": {
                "name": "etherlink_mainnet",
                "rpc_url": os.environ.get(
                    "ETHERLINK_MAINNET_RPC_URL", "https://node.mainnet.etherlink.com"
                ),
                "nft_contract_address": os.environ.get(
                    "ETHERLINK_MAINNET_NFT_CONTRACT_ADDRESS"
                ),
                "marketplace_contract_address": os.environ.get(
                    "ETHERLINK_MAINNET_MARKETPLACE_CONTRACT_ADDRESS"
                ),
                "chain_id": 128123,
            },
            "etherlink_testnet": {
                "name": "etherlink_testnet",
                "rpc_url": os.environ.get(
                    "ETHERLINK_TESTNET_RPC_URL", "https://node.ghostnet.etherlink.com"
                ),
                "nft_contract_address": os.environ.get(
                    "ETHERLINK_TESTNET_NFT_CONTRACT_ADDRESS"
                ),
                "marketplace_contract_address": os.environ.get(
                    "ETHERLINK_TESTNET_MARKETPLACE_CONTRACT_ADDRESS"
                ),
"solana_mainnet": {
                "name": "solana_mainnet", 
                "rpc_url": os.environ.get("SOLANA_MAINNET_RPC_URL", "https://api.mainnet-beta.solana.com"),
                "program_id": os.environ.get("SOLANA_MAINNET_PROGRAM_ID"),
                "chain_id": int(os.environ.get("SOLANA_MAINNET_CHAIN_ID", "101"))
            },
            "solana_testnet": {
                "name": "solana_testnet", 
                "rpc_url": os.environ.get("SOLANA_TESTNET_RPC_URL", "https://api.devnet.solana.com"),
                "program_id": os.environ.get("SOLANA_TESTNET_PROGRAM_ID"),
                "chain_id": int(os.environ.get("SOLANA_TESTNET_CHAIN_ID", "103"))
            }
            },
        }

    def initialize(self) -> Dict[str, bool]:
        """
        Initialize all blockchain providers.

        Returns:
            Dictionary mapping blockchain names to initialization success status
        """
        results: Dict[str, bool] = {}

        for blockchain, config in self.network_configs.items():
            try:
                provider = BlockchainProviderFactory.get_provider(blockchain, config)
                success = self._maybe_await(provider.connect())

                if success:
                    self._providers[blockchain] = provider

                results[blockchain] = success
                logger.info(
                    f"Blockchain {blockchain} initialization: {'success' if success else 'failed'}"
                )

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
        # Allow direct provider access if tests pre-populated _providers
        if not self._initialized and not self._providers:
            raise ValueError("Service not initialized. Call initialize() first or set _providers.")

        if blockchain not in self._providers:
            raise ValueError(
                f"Blockchain {blockchain} not available or not initialized"
            )

        return self._providers[blockchain]

    def mint_nft(
        self, blockchain: str, recipient: str, card_id: str, **metadata: Any
    ) -> str:
        """
        Mint an NFT on the specified blockchain.

        Args:
            blockchain: Target blockchain network
            recipient: Wallet address to receive the NFT
            card_id: Unique card identifier
            **metadata: Additional metadata (name, rarity, faction, etc.)

        Returns:
            Transaction hash string
        """
        provider = self.get_provider(blockchain)

        # Convert rarity to numeric if provided
        if "rarity" in metadata and metadata["rarity"] in RARITY_MAPPING:
            metadata["rarity_value"] = RARITY_MAPPING[metadata["rarity"]]

        return self._maybe_await(provider.mint_nft(recipient=recipient, card_id=card_id, metadata=metadata))

    def transfer_nft(
        self, blockchain: str, from_address: str, to_address: str, token_id: str
    ) -> str:
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
        return self._maybe_await(
            provider.transfer_nft(from_address=from_address, to_address=to_address, token_id=token_id)
        )

    def wait_for_confirmation(
        self, blockchain: str, tx_hash: str, timeout: int = 120
    ) -> Optional[Dict[str, Any]]:
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
        return self._maybe_await(provider.wait_for_confirmation(tx_hash=tx_hash, timeout=timeout))

    def get_transaction_status(
        self, blockchain: str, tx_hash: str
    ) -> Dict[str, Any]:
        """
        Get transaction status.

        Args:
            blockchain: Blockchain network
            tx_hash: Transaction hash

        Returns:
            Transaction status information
        """
        provider = self.get_provider(blockchain)
        return self._maybe_await(provider.get_transaction_status(tx_hash))

    def get_nft_owner(self, blockchain: str, token_id: str) -> Optional[str]:
        """
        Get the owner of an NFT.

        Args:
            blockchain: Blockchain network
            token_id: Token ID to check

        Returns:
            Owner wallet address or None if not found
        """
        provider = self.get_provider(blockchain)
        return self._maybe_await(provider.get_nft_owner(token_id=token_id))

    def get_supported_blockchains(self) -> list[str]:
        """Get list of supported and initialized blockchain networks."""
        return list(self._providers.keys())

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

    def health_check(self) -> bool:
        """Return True if at least one provider is connected and available."""
        if not self._providers:
            return False
        any_connected = False
        for provider in self._providers.values():
            try:
                connected = self._maybe_await(provider.is_connected())
                any_connected = any_connected or bool(connected)
            except Exception:
                # Treat exceptions as disconnected
                continue
        return any_connected

    def is_healthy(self) -> bool:
        """Simple boolean health indicator used by tests."""
        try:
            return bool(self.health_check())
        except Exception:
            return False