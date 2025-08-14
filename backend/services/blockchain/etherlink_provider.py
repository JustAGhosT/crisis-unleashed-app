"""
Etherlink blockchain provider implementation.
"""
import asyncio
import logging
from typing import Any, Dict, Optional, Tuple

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
    
    async def connect(self) -> bool:
        """Connect to Etherlink network."""
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
            
            # Test connection
            connected_any = await asyncio.to_thread(w3.is_connected)
            connected = bool(connected_any)
            
            if connected and self.contract_address:
                # Load contract (ABI would be loaded from file in real implementation)
                self.contract = w3.eth.contract(
                    address=self.contract_address,
                    abi=[]  # Placeholder - would load actual ABI
                )
            
            logger.info(f"Connected to Etherlink at {self.rpc_url}")
            return connected
            
        except Exception as e:
            logger.error(f"Failed to connect to Etherlink: {e}")
            return False
    
    async def is_connected(self) -> bool:
        """Check if connected to Etherlink."""
        if not self.web3:
            return False
        
        try:
            w3 = self.web3
            if w3 is None:
                return False
            result = await asyncio.to_thread(w3.is_connected)
            return bool(result)
        except Exception:
            return False
    
    async def disconnect(self) -> None:
        """Disconnect from Etherlink network."""
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
    
    async def mint_nft(self,
                      recipient: str,
                      card_id: str,
                      metadata: Dict[str, Any]) -> Tuple[str, Dict[str, Any]]:
        """Mint NFT on Etherlink."""
        if not await self.is_connected():
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
        import time
        hash_input = f"{recipient}{card_id}{time.time()}"
        tx_hash = "0x" + hashlib.sha256(hash_input.encode()).hexdigest()
        
        transaction_data = {
            "to": self.contract_address,
            "function": "mint",
            "args": [recipient, card_id, metadata],
            "network": "etherlink"
        }
        
        logger.info(f"Simulated NFT mint on Etherlink: {tx_hash}")
        return tx_hash, transaction_data
    
    async def transfer_nft(self,
                          from_address: str,
                          to_address: str,
                          token_id: str) -> Tuple[str, Dict[str, Any]]:
        """Transfer NFT on Etherlink."""
        if not await self.is_connected():
            raise ConnectionError("Not connected to Etherlink network")
        
        # Simulate transfer
        import hashlib
        import time
        hash_input = f"{from_address}{to_address}{token_id}{time.time()}"
        tx_hash = "0x" + hashlib.sha256(hash_input.encode()).hexdigest()
        
        transaction_data = {
            "to": self.contract_address,
            "function": "transferFrom",
            "args": [from_address, to_address, token_id],
            "network": "etherlink"
        }
        
        logger.info(f"Simulated NFT transfer on Etherlink: {tx_hash}")
        return tx_hash, transaction_data
    
    async def wait_for_confirmation(self,
                                   tx_hash: str,
                                   timeout: int = 120) -> Optional[Dict[str, Any]]:
        """Wait for transaction confirmation on Etherlink."""
        if not await self.is_connected():
            return None
        
        start_time = asyncio.get_event_loop().time()
        
        while (asyncio.get_event_loop().time() - start_time) < timeout:
            try:
                if WEB3_AVAILABLE and self.web3:
                    w3 = self.web3
                    # Guard again for type-checkers
                    if w3 is None:
                        return None
                    receipt = await asyncio.to_thread(
                        w3.eth.get_transaction_receipt, tx_hash
                    )
                    
                    if receipt:
                        return {
                            "blockNumber": receipt.blockNumber,
                            "gasUsed": receipt.gasUsed,
                            "status": receipt.status,
                            "transactionHash": receipt.transactionHash.hex()
                        }
                        
            except TransactionNotFound:
                # Transaction not yet mined
                pass
            except Exception as e:
                logger.error(f"Error checking transaction {tx_hash}: {e}")
                return None
            
            await asyncio.sleep(2)  # Poll every 2 seconds
        
        logger.warning(f"Transaction {tx_hash} not confirmed within {timeout} seconds")
        return None
    
    async def get_transaction_status(self, tx_hash: str) -> Dict[str, Any]:
        """Get transaction status."""
        if not await self.is_connected():
            return {"status": "unknown", "error": "Not connected"}
        
        try:
            # In simulation, return pending status
            return {
                "hash": tx_hash,
                "status": "pending",
                "network": "etherlink",
                "confirmations": 0
            }
        except Exception as e:
            return {"status": "error", "error": str(e)}
    
    async def get_nft_owner(self, token_id: str) -> Optional[str]:
        """Get NFT owner."""
        if not await self.is_connected() or not self.contract:
            return None
        
        try:
            # In real implementation, would call ownerOf function
            # For simulation, return placeholder
            return "0x1234567890123456789012345678901234567890"
        except Exception as e:
            logger.error(f"Error getting NFT owner for token {token_id}: {e}")
            return None
    
    @property
    def supported_operations(self) -> list[str]:
        """Etherlink supported operations."""
        return ["mint_nft", "transfer_nft", "marketplace_list", "marketplace_purchase"]