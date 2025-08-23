import pytest
from unittest.mock import MagicMock, patch
from typing import Dict, Any, Optional

from backend.repository.outbox_models import OutboxEntry, OutboxType, OutboxStatus
from backend.repository.transaction_outbox import TransactionOutboxRepository
from backend.services.blockchain_service import BlockchainService
from backend.services.blockchain_handler import BlockchainHandler
from backend.app_types.web3_types import MockWeb3, MockContract, MockContractFunctions, MockEth


@pytest.fixture
def mock_outbox_repo():
    """Create a mock transaction outbox repository for testing."""
    repo = MagicMock(spec=TransactionOutboxRepository)
    
    # Setup default behaviors
    repo.get_pending.return_value = []
    repo.get_by_id.return_value = None
    
    return repo


@pytest.fixture
def mock_blockchain_service():
    """Create a mock blockchain service for testing."""
    service = MagicMock(spec=BlockchainService)
    
    # Setup default behaviors
    service.get_supported_blockchains.return_value = ["ethereum", "etherlink"]
    service.is_healthy.return_value = True
    
    return service


@pytest.fixture
def sample_outbox_entry():
    """Create a sample outbox entry for testing."""
    return OutboxEntry.create_new(
        outbox_type=OutboxType.MINT_NFT,
        request_data={
            "blockchain": "ethereum",
            "recipient": "0x1234567890123456789012345678901234567890",
            "card_id": "card-123",
            "metadata": {
                "name": "Test Card",
                "description": "A test card for unit tests",
                "image": "https://example.com/image.png"
            }
        }
    )


@pytest.fixture
def mock_web3():
    """Create a mock Web3 instance for testing."""
    mock_web3 = MockWeb3(provider=MagicMock())
    
    # Configure mock contract
    mock_contract = MockContract(
        address="0x1234567890123456789012345678901234567890",
        abi=[]
    )
    mock_web3.eth.contract.return_value = mock_contract
    
    return mock_web3