"""
Type definitions for web3 when not available.
This helps mypy understand the types even when web3 is not installed.
"""
from typing import Any, Dict, Optional, Union
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
    """Mock Web3 class for type checking when web3 is not available."""
    
    class HTTPProvider:
        def __init__(self, endpoint_uri: str) -> None:
            self.endpoint_uri = endpoint_uri
    
    def __init__(self, provider: Any) -> None:
        self.provider = provider
    
    def is_connected(self) -> bool:
        return False
    
    @property
    def eth(self) -> Any:
        return MockEth()


class MockEth:
    """Mock Eth class for web3.eth operations."""
    
    def contract(self, address: str, abi: list[Any]) -> "MockContract":
        return MockContract(address, abi)
    
    def get_transaction_receipt(self, tx_hash: str) -> Optional[Dict[str, Any]]:
        return None
    
    def get_transaction_count(self, address: str) -> int:
        return 0
    
    @property
    def gas_price(self) -> int:
        return 20000000000  # 20 gwei


class MockContract:
    """Mock Contract class for type checking."""
    
    def __init__(self, address: str, abi: list[Any]) -> None:
        self._address = address
        self.abi = abi
    
    @property
    def functions(self) -> Any:
        return MockContractFunctions()
    
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