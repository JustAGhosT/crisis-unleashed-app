"""
Type definitions for web3 when not available.
This helps mypy understand the types even when web3 is not installed.
"""
from typing import Any, Dict, Optional, Union
from unittest.mock import MagicMock
from typing_extensions import TypedDict


class TxReceiptDict(TypedDict, total=False):
    """Type definition for transaction receipt."""
    blockNumber: int
    gasUsed: int
    status: int
    transactionHash: str
    blockHash: str
    transactionIndex: int
    cumulativeGasUsed: int
    logs: list[Any]


# Type aliases for when web3 is not available
Web3Type = Any
ContractType = Any
TxReceiptType = Union[TxReceiptDict, Any]
TransactionNotFoundType = type[Exception]
TimeExhaustedType = type[Exception]


class MockWeb3:
    """Mock Web3 with MagicMock-backed methods for unit tests."""

    class HTTPProvider:
        def __init__(self, endpoint_uri: str) -> None:
            self.endpoint_uri = endpoint_uri

    def __init__(self, provider: Any) -> None:
        self.provider = provider
        # Allow tests to override return_value
        self.is_connected = MagicMock(return_value=False)
        # Expose eth as a MagicMock so tests can set return_value on members directly
        self.eth = MagicMock()
        # Sensible defaults for commonly used methods
        self.eth.contract = MagicMock()
        self.eth.get_transaction_receipt = MagicMock(return_value=None)
        self.eth.wait_for_transaction_receipt = MagicMock(return_value=None)
        self.eth.send_raw_transaction = MagicMock()
        self.eth.get_transaction_count = MagicMock(return_value=0)


class MockEth:
    """Mock Eth with MagicMocks for contract and tx methods."""

    def __init__(self) -> None:
        # Tests set .return_value on these
        self.contract = MagicMock()
        self.get_transaction_receipt = MagicMock(return_value=None)
        self.wait_for_transaction_receipt = MagicMock(return_value=None)
        self.send_raw_transaction = MagicMock()
        self.get_transaction_count = MagicMock(return_value=0)
        self._gas_price = 20000000000

    @property
    def gas_price(self) -> int:
        return self._gas_price


class MockContract:
    """Mock Contract exposing a MagicMock functions attribute."""

    def __init__(self, address: str, abi: list[Any]) -> None:
        self._address = address
        self.abi = abi
        # Allow call chaining: functions.mint(...).build_transaction.return_value = {...}
        self.functions = MagicMock()

    @property
    def address(self) -> str:
        return self._address


class MockContractFunctions:
    """Mock contract functions for method calls."""
    
    def __getattr__(self, name: str) -> Any:
        def mock_function(*args: Any, **kwargs: Any) -> "MockTransactionBuilder":
            return MockTransactionBuilder()
        return mock_function


class MockTransactionBuilder:
    """Mock transaction builder for contract function calls."""
    
    def build_transaction(self, tx_params: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "to": tx_params.get("to"),
            "from": tx_params.get("from"),
            "gas": tx_params.get("gas", 21000),
            "gasPrice": tx_params.get("gasPrice", 20000000000),
            "nonce": tx_params.get("nonce", 0),
            "value": tx_params.get("value", 0),
            "data": "0x"
        }


class MockTransactionNotFound(Exception):
    """Mock TransactionNotFound exception."""
    pass


class MockTimeExhausted(Exception):
    """Mock TimeExhausted exception."""
    pass