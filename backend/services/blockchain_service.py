"""
Main blockchain service that coordinates different blockchain providers.
"""

import asyncio
import concurrent.futures
import inspect
import logging
import os
from typing import Any, Dict, Optional, Tuple, Callable, Coroutine

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

    def _run_coro_blocking(
        self, coro: Coroutine[Any, Any, Any], timeout: Optional[float] = None
    ) -> Any:
        """Run a coroutine in an isolated event loop within a worker thread.

        This avoids nested asyncio.run() failures and cross-thread loop access.
        Timeout is enforced inside the coroutine via asyncio.wait_for to ensure
        the worker thread exits cleanly on timeout.
        """

        def runner() -> Any:
            if timeout is not None:
                return asyncio.run(asyncio.wait_for(coro, timeout))
            return asyncio.run(coro)

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as ex:
            future = ex.submit(runner)
            # The timeout is already enforced inside runner when provided, so we don't pass it here
            return future.result()

    def _maybe_await(self, value: Any) -> Any:
        """Return result of value, awaiting if it's a coroutine/awaitable."""
        if asyncio.iscoroutine(value):
            return self._run_coro_blocking(value)
        if inspect.isawaitable(value):

            async def _wrap(v: Any):
                return await v

            return self._run_coro_blocking(_wrap(value))
        return value

    def _call_with_timeout(self, func: Callable[[], Any], timeout: float) -> Any:
        """Call a function that may return a value or an awaitable, enforcing a timeout.

        - If the function is async or returns an awaitable, use asyncio.wait_for.
        - If the function is sync, run it in a thread and wait with a timeout.
        """
        if inspect.iscoroutinefunction(func):
            coro = func()
            return self._run_coro_blocking(coro, timeout=timeout)

        # Run sync function in a worker thread with timeout
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(func)
            try:
                result = future.result(timeout=timeout)
            except concurrent.futures.TimeoutError:
                raise TimeoutError()

        # If the sync call returned an awaitable/coroutine, await it with timeout in isolated loop
        if asyncio.iscoroutine(result) or inspect.isawaitable(result):

            async def _wrap(v: Any):
                return await v

            return self._run_coro_blocking(_wrap(result), timeout=timeout)

        return result

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
                "chain_id": 42793,
            },
            "solana_mainnet": {
                "name": "solana_mainnet",
                "rpc_url": os.environ.get(
                    "SOLANA_MAINNET_RPC_URL", "https://api.mainnet-beta.solana.com"
                ),
                "program_id": os.environ.get("SOLANA_MAINNET_PROGRAM_ID"),
                "chain_id": int(os.environ.get("SOLANA_MAINNET_CHAIN_ID", "101")),
            },
            "solana_testnet": {
                "name": "solana_testnet",
                "rpc_url": os.environ.get(
                    "SOLANA_TESTNET_RPC_URL", "https://api.devnet.solana.com"
                ),
                "program_id": os.environ.get("SOLANA_TESTNET_PROGRAM_ID"),
                "chain_id": int(os.environ.get("SOLANA_TESTNET_CHAIN_ID", "103")),
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
        if not self._initialized:
            raise ValueError("Service not initialized. Call initialize() first.")

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

        return self._maybe_await(
            provider.mint_nft(recipient=recipient, card_id=card_id, metadata=metadata)
        )

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
         Returns:
             Transaction hash string
        """
        provider = self.get_provider(blockchain)
        return self._maybe_await(
            provider.transfer_nft(
                from_address=from_address, to_address=to_address, token_id=token_id
            )
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
        return self._maybe_await(
            provider.wait_for_confirmation(tx_hash=tx_hash, timeout=timeout)
        )

    def get_transaction_status(self, blockchain: str, tx_hash: str) -> Dict[str, Any]:
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
        # Default to 2 seconds, allow override via env
        try:
            timeout_s = float(os.environ.get("BLOCKCHAIN_HEALTHCHECK_TIMEOUT", "2.0"))
        except ValueError:
            timeout_s = 2.0
        for provider in self._providers.values():
            try:
                connected = self._call_with_timeout(provider.is_connected, timeout_s)
                any_connected = any_connected or bool(connected)
            except TimeoutError:
                logger.warning(
                    "Provider health check timed out for %s", type(provider).__name__
                )
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
