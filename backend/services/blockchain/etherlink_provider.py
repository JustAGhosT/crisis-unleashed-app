"""
Etherlink blockchain provider implementation.
"""
import logging
from typing import Any, Dict, Optional
import time

from .base_provider import BaseBlockchainProvider
from .web3_compat import (
    WEB3_AVAILABLE,
    TransactionNotFound,
    TimeExhausted,
    new_web3,
)

logger = logging.getLogger(__name__)


class EtherlinkProvider(BaseBlockchainProvider):
    """Etherlink blockchain provider."""
    
    def __init__(self, network_config: Dict[str, Any]):
        """Initialize Etherlink provider."""
        super().__init__(network_config)
        self.rpc_url = network_config.get("rpc_url")
        self.contract_address = network_config.get("nft_contract_address")
        self.web3: Optional[Any] = None
        self.contract: Optional[Any] = None
        
        if not WEB3_AVAILABLE:
            logger.error("web3 library not available. Install with: pip install web3")
    
    def connect(self) -> bool:
        """Connect to Etherlink network (synchronous)."""
        if not WEB3_AVAILABLE:
            logger.error("Cannot connect: web3 library not installed")
            return False
            
        if not self.rpc_url:
            logger.error("RPC URL not configured for Etherlink")
            return False
        
        try:
            # Create web3 via compatibility factory
            w3 = new_web3(self.rpc_url)
            if w3 is None:
                logger.error("Web3 initialization failed for Etherlink")
                return False
            self.web3 = w3

            # Test connection synchronously
            connected = bool(w3.is_connected())

            if connected and self.contract_address:
                # Load contract (ABI would be loaded from file in real implementation)
                self.contract = w3.eth.contract(
                    address=self.contract_address,
                    abi=[]  # Placeholder - would load actual ABI
                )

            if connected:
                logger.info(f"Connected to Etherlink at {self.rpc_url}")
            else:
                logger.warning(f"Connection test to Etherlink failed at {self.rpc_url}")
            return connected

        except Exception as e:
            logger.error(f"Failed to connect to Etherlink: {e}")
            return False
    
    def is_connected(self) -> bool:
        """Check if connected to Etherlink (synchronous)."""
        if not self.web3:
            return False
        
        try:
            w3 = self.web3
            if w3 is None:
                return False
            return bool(w3.is_connected())
        except Exception:
            return False
    
    def disconnect(self) -> None:
        """Disconnect from Etherlink network (synchronous)."""
        try:
            if self.web3:
                # Close any underlying connections if using session-based provider
                provider = getattr(self.web3, "provider", None)
                session = getattr(provider, "session", None)
                if session and hasattr(session, "close"):
                    session.close()
                # Clean up references
                self.web3 = None
                self.contract = None
                logger.info("Disconnected from Etherlink network")
            else:
                logger.debug("Already disconnected from Etherlink network")
        except Exception as e:
            logger.error(f"Error disconnecting from Etherlink: {e}")
    
    def mint_nft(self,
                      recipient: str,
                      card_id: str,
                      metadata: Dict[str, Any]) -> str:
        """Mint NFT on Etherlink (simulation; returns tx hash string)."""
        if not self.is_connected():
            raise ConnectionError("Not connected to Etherlink network")
        
        if not self.contract:
            raise ValueError("NFT contract not loaded")
        
        # In a real implementation, you would:
        # 1. Build the transaction
        # 2. Sign it with a private key
        # 3. Send it to the network
        # For now, we'll simulate with a placeholder
        
        # Simulate transaction hash
        import hashlib
        hash_input = f"{recipient}{card_id}{time.time()}"
        tx_hash = "0x" + hashlib.sha256(hash_input.encode()).hexdigest()
        
        logger.info(f"Simulated NFT mint on Etherlink: {tx_hash}")
        return tx_hash
    
    def transfer_nft(self,
                          from_address: str,
                          to_address: str,
                          token_id: str) -> str:
        """Transfer NFT on Etherlink (simulation; returns tx hash string)."""
        if not self.is_connected():
            raise ConnectionError("Not connected to Etherlink network")
        
        # Simulate transfer
        import hashlib
        hash_input = f"{from_address}{to_address}{token_id}{time.time()}"
        tx_hash = "0x" + hashlib.sha256(hash_input.encode()).hexdigest()
        
        logger.info(f"Simulated NFT transfer on Etherlink: {tx_hash}")
        return tx_hash
    
    def wait_for_confirmation(self,
                                   tx_hash: str,
                                   timeout: int = 120) -> Optional[Dict[str, Any]]:
        """Wait for transaction confirmation on Etherlink (synchronous)."""
        if not self.is_connected():
            return None

        start_time = time.time()

        while (time.time() - start_time) < timeout:
            try:
                if WEB3_AVAILABLE and self.web3:
                    w3 = self.web3
                    if w3 is None:
                        return None
                    receipt = w3.eth.get_transaction_receipt(tx_hash)

                    if receipt:
                        # Normalize transaction hash to string safely
                        txh = getattr(receipt, "transactionHash", None)
                        # Handle common representations: bytes, hex str, or None
                        if isinstance(txh, (bytes, bytearray)):
                            txh_str = txh.hex()
                        elif isinstance(txh, str):
                            txh_str = txh
                        else:
                            # Fallback: use provided tx_hash or stringified value
                            txh_str = tx_hash if txh is None else str(txh)

                        return {
                            "blockNumber": receipt.blockNumber,
                            "gasUsed": receipt.gasUsed,
                            "status": receipt.status,
                            "transactionHash": txh_str,
                        }

            except TransactionNotFound:
                # Transaction not yet mined
                pass
            except Exception as e:
                logger.error(f"Error checking transaction {tx_hash}: {e}")
                return None

            time.sleep(2)  # Poll every 2 seconds

        logger.warning(f"Transaction {tx_hash} not confirmed within {timeout} seconds")
        return None
    
    def get_transaction_status(self, tx_hash: str) -> str:
        """Get transaction status (synchronous)."""
        if not self.is_connected():
            return "unknown"

        try:
            if WEB3_AVAILABLE and self.web3:
                w3 = self.web3
                if w3 is None:
                    return "unknown"
                receipt = w3.eth.get_transaction_receipt(tx_hash)
                if receipt is None:
                    return "pending"
                # Try dict-like access first, then attributes
                try:
                    status_val = receipt.get("status")  # type: ignore[assignment]
                    block_number = receipt.get("blockNumber")
                except Exception:
                    status_val = getattr(receipt, "status", None)
                    block_number = getattr(receipt, "blockNumber", None)

                if status_val == 1:
                    return "confirmed"
                if status_val == 0:
                    return "failed"
                if block_number is None:
                    return "pending"
                return "unknown"

            # Simulation mode: make behavior explicit
            return "pending_simulated"
        except TransactionNotFound:
            return "pending"
        except Exception as e:
            logger.error(f"Error getting transaction status for {tx_hash}: {e}")
            return "error"
    
    def get_nft_owner(self, token_id: str) -> Optional[str]:
        """Get NFT owner (synchronous)."""
        if not self.is_connected() or not self.contract:
            return None

        try:
            # In real implementation, would call ownerOf function; here return placeholder
            return "0x1234567890123456789012345678901234567890"
        except Exception as e:
            logger.error(f"Error getting NFT owner for token {token_id}: {e}")
            return None
    
    @property
    def supported_operations(self) -> list[str]:
        """Etherlink supported operations."""
        return ["mint_nft", "transfer_nft", "marketplace_list", "marketplace_purchase"]