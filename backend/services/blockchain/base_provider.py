"""
Base blockchain provider interface.
"""
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class BaseBlockchainProvider(ABC):
    """Abstract base class for blockchain providers."""

    def __init__(self, network_config: Dict[str, Any]):
        """Initialize with network configuration."""
        self.network_config = network_config
        self.network_name = network_config.get("name", "unknown")

    @abstractmethod
    def connect(self) -> bool:
        """
        Connect to the blockchain network.

        Returns:
            True if connection successful, False otherwise
        """
        pass

    @abstractmethod
    def is_connected(self) -> bool:
        """Check if connected to the network."""
        pass

    @abstractmethod
    def disconnect(self) -> None:
        """
        Disconnect from the blockchain network.
        Cleanup resources and close connections.
        """
        pass

    @abstractmethod
    def mint_nft(self,
                      recipient: str,
                      card_id: str,
                      metadata: Dict[str, Any]) -> str:
        """
        Mint an NFT.

        Args:
            recipient: Wallet address to mint to
            card_id: Unique card identifier
            metadata: NFT metadata

        Returns:
            Transaction hash string
        """
        pass

    @abstractmethod
    def transfer_nft(self,
                          from_address: str,
                          to_address: str,
                          token_id: str) -> str:
        """
        Transfer an NFT.

        Args:
            from_address: Sender wallet address
            to_address: Recipient wallet address
            token_id: Token ID to transfer

        Returns:
            Tuple of (transaction_hash, transaction_data)
        """
        pass

    @abstractmethod
    def wait_for_confirmation(self,
                                   tx_hash: str,
                                   timeout: int = 120) -> Optional[Dict[str, Any]]:
        """
        Wait for transaction confirmation.

        Args:
            tx_hash: Transaction hash to wait for
            timeout: Maximum time to wait in seconds

        Returns:
            Transaction receipt or None if timeout
        """
        pass

    @abstractmethod
    def get_transaction_status(self, tx_hash: str) -> str:
        """
        Get transaction status.

        Args:
            tx_hash: Transaction hash

        Returns:
            Transaction status string, e.g. 'confirmed' or 'pending'
        """
        pass

    @abstractmethod
    def get_nft_owner(self, token_id: str) -> Optional[str]:
        """
        Get the owner of an NFT.

        Args:
            token_id: Token ID to check

        Returns:
            Owner wallet address or None if not found
        """
        pass

    @property
    def supported_operations(self) -> list[str]:
        """Return list of supported operations."""
        return ["mint_nft", "transfer_nft"]

    def get_network_info(self) -> Dict[str, Any]:
        """Get network information."""
        return {
            "name": self.network_name,
            "config": self.network_config,
            "supported_operations": self.supported_operations
        }
