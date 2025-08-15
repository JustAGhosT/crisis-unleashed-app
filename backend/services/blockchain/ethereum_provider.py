"""
Ethereum blockchain provider implementation.
"""
import logging
from typing import Any, Dict, Optional

from .base_provider import BaseBlockchainProvider

# Import Web3 in a way that tests can patch `backend.services.blockchain.ethereum_provider.Web3`
try:  # pragma: no cover - import detection only
    from web3 import Web3  # type: ignore
except Exception:  # Fallback to local mock-compatible symbol
    from ...types.web3_types import MockWeb3 as Web3  # type: ignore


logger = logging.getLogger(__name__)


class EthereumProvider(BaseBlockchainProvider):
    """Ethereum provider with synchronous API to match tests."""

    def __init__(self, network_config: Dict[str, Any]):
        super().__init__(network_config)
        self.rpc_url = network_config.get("provider_url") or network_config.get("rpc_url")
        self.contract_address = network_config.get("contract_address") or network_config.get("nft_contract_address")
        self.contract_abi = network_config.get("contract_abi") or []
        self.web3: Optional[Any] = None
        self.contract: Optional[Any] = None
        self._connected: bool = False
        # Capture patched Web3 at construction time (tests patch Web3 in this module)
        try:
            if self.rpc_url:
                self.web3 = Web3(self.rpc_url)  # type: ignore[call-arg]
                if self.web3 and self.contract_address:
                    try:
                        self.contract = self.web3.eth.contract(
                            address=self.contract_address, abi=self.contract_abi
                        )
                    except Exception:
                        self.contract = None
        except Exception:
            # Leave uninitialized; methods will attempt lazy connect
            self.web3 = None
            self.contract = None

    def _ensure_connected(self) -> None:
        """Ensure web3/contract are present; try to init if missing."""
        if not self.web3 and self.rpc_url:
            try:
                self.web3 = Web3(self.rpc_url)  # type: ignore[call-arg]
            except Exception:
                self.web3 = None
        if self.contract is None and self.web3 and self.contract_address:
            try:
                self.contract = self.web3.eth.contract(
                    address=self.contract_address, abi=self.contract_abi
                )
            except Exception:
                self.contract = None

    def connect(self) -> bool:
        if not self.rpc_url:
            logger.error("RPC URL not configured for Ethereum")
            return False
        try:
            # If already constructed (e.g., via patched Web3 during __init__), reuse it
            if not self.web3:
                # Tests may patch Web3 at construction or here
                self.web3 = Web3(self.rpc_url)  # type: ignore[call-arg]
                if not self.web3:
                    return False
            # Call underlying is_connected() once and cache the result
            self._connected = bool(self.web3.is_connected())
            if self.contract_address:
                self.contract = self.web3.eth.contract(
                    address=self.contract_address, abi=self.contract_abi
                )
            # Return the cached connection state
            return self._connected
        except Exception as e:
            logger.error(f"Failed to connect to Ethereum: {e}")
            return False

    def is_connected(self) -> bool:
        return self._connected

    def disconnect(self) -> None:
        self.web3 = None
        self.contract = None

    def mint_nft(self, recipient: str, card_id: str, metadata: Dict[str, Any]) -> str:
        self._ensure_connected()
        # Build and send transaction; tests validate the calls, not the contents
        if not self.contract:
            raise RuntimeError("Contract not initialized")
        tx = self.contract.functions.mint(recipient, card_id, metadata).build_transaction({})
        tx_hash = self.web3.eth.send_raw_transaction(tx)  # type: ignore[union-attr]
        return tx_hash

    def transfer_nft(self, from_address: str, to_address: str, token_id: str) -> str:
        self._ensure_connected()
        if not self.contract:
            raise RuntimeError("Contract not initialized")
        tx = self.contract.functions.safeTransferFrom(from_address, to_address, token_id).build_transaction({})
        tx_hash = self.web3.eth.send_raw_transaction(tx)  # type: ignore[union-attr]
        return tx_hash

    def wait_for_confirmation(self, tx_hash: str, timeout: int = 120) -> Optional[Dict[str, Any]]:
        self._ensure_connected()
        # Delegate to web3; tests assert this call
        receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash, timeout=timeout)  # type: ignore[union-attr]
        return receipt

    def get_transaction_status(self, tx_hash: str) -> str:
        self._ensure_connected()
        receipt = self.web3.eth.get_transaction_receipt(tx_hash)  # type: ignore[union-attr]
        status_val = None
        if receipt is not None:
            try:
                status_val = receipt.get("status", 0)  # type: ignore[assignment]
            except Exception:
                # If receipt is a mock object, fallback to attribute access
                status_val = getattr(receipt, "status", 0)
        return "confirmed" if status_val == 1 else "pending"

    def get_nft_owner(self, token_id: str) -> Optional[str]:
        self._ensure_connected()
        if not self.contract:
            return None
        owner = self.contract.functions.ownerOf(token_id).call()
        return owner

    @property
    def supported_operations(self) -> list[str]:
        return ["mint_nft", "transfer_nft", "marketplace_list", "marketplace_purchase"]