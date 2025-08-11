import pytest
from unittest.mock import MagicMock, patch
from typing import Dict, Any

from backend.services.blockchain.ethereum_provider import EthereumProvider


class TestEthereumProvider:
    
    @pytest.fixture
    def network_config(self):
        """Create a test network configuration."""
        return {
            "network": "test",
            "provider_url": "http://localhost:8545",
            "chain_id": 1337,
            "contract_address": "0x1234567890123456789012345678901234567890",
            "contract_abi": [],
            "private_key": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
        }
    
    @pytest.fixture
    def provider(self, network_config, mock_web3):
        """Create an Ethereum provider instance for testing."""
        with patch('backend.services.blockchain.ethereum_provider.Web3', return_value=mock_web3):
            provider = EthereumProvider(network_config=network_config)
            return provider
    
    def test_connect(self, provider, mock_web3):
        """Test connecting to the Ethereum network."""
        # Arrange
        mock_web3.is_connected.return_value = True
        
        # Act
        result = provider.connect()
        
        # Assert
        assert result is True
        assert provider.is_connected() is True
        mock_web3.is_connected.assert_called_once()
    
    def test_mint_nft(self, provider, mock_web3):
        """Test minting an NFT."""
        # Arrange
        # Mock the transaction flow
        mock_tx_hash = "0xabcdef1234567890"
        mock_contract = mock_web3.eth.contract.return_value
        mock_contract.functions.mint.return_value.build_transaction.return_value = {
            "to": "0x1234567890123456789012345678901234567890",
            "data": "0x1234",
            "gas": 200000,
            "gasPrice": 20000000000,
            "nonce": 1
        }
        mock_web3.eth.send_raw_transaction.return_value = mock_tx_hash
        
        # Act
        result = provider.mint_nft(
            recipient="0x2222222222222222222222222222222222222222",
            card_id="card-123",
            metadata={
                "name": "Test Card",
                "description": "A test card for unit tests",
                "image": "https://example.com/image.png"
            }
        )
        
        # Assert
        assert result == mock_tx_hash
        mock_contract.functions.mint.assert_called_once()
        mock_web3.eth.send_raw_transaction.assert_called_once()
    
    def test_transfer_nft(self, provider, mock_web3):
        """Test transferring an NFT."""
        # Arrange
        # Mock the transaction flow
        mock_tx_hash = "0x9876543210abcdef"
        mock_contract = mock_web3.eth.contract.return_value
        mock_contract.functions.safeTransferFrom.return_value.build_transaction.return_value = {
            "to": "0x1234567890123456789012345678901234567890",
            "data": "0x5678",
            "gas": 200000,
            "gasPrice": 20000000000,
            "nonce": 2
        }
        mock_web3.eth.send_raw_transaction.return_value = mock_tx_hash
        
        # Act
        result = provider.transfer_nft(
            from_address="0x1111111111111111111111111111111111111111",
            to_address="0x2222222222222222222222222222222222222222",
            token_id="token-123"
        )
        
        # Assert
        assert result == mock_tx_hash
        mock_contract.functions.safeTransferFrom.assert_called_once()
        mock_web3.eth.send_raw_transaction.assert_called_once()
    
    def test_get_nft_owner(self, provider, mock_web3):
        """Test getting the owner of an NFT."""
        # Arrange
        mock_owner = "0x3333333333333333333333333333333333333333"
        mock_contract = mock_web3.eth.contract.return_value
        mock_contract.functions.ownerOf.return_value.call.return_value = mock_owner
        
        # Act
        result = provider.get_nft_owner(token_id="token-123")
        
        # Assert
        assert result == mock_owner
        mock_contract.functions.ownerOf.assert_called_once_with("token-123")
    
    def test_wait_for_confirmation(self, provider, mock_web3):
        """Test waiting for transaction confirmation."""
        # Arrange
        mock_receipt = {
            "status": 1,
            "blockNumber": 12345,
            "transactionHash": "0xabcdef1234567890"
        }
        mock_web3.eth.wait_for_transaction_receipt.return_value = mock_receipt
        
        # Act
        result = provider.wait_for_confirmation(tx_hash="0xabcdef1234567890")
        
        # Assert
        assert result == mock_receipt
        mock_web3.eth.wait_for_transaction_receipt.assert_called_once_with(
            "0xabcdef1234567890",
            timeout=120
        )
    
    def test_get_transaction_status(self, provider, mock_web3):
        """Test getting transaction status."""
        # Arrange
        mock_receipt = {
            "status": 1,
            "blockNumber": 12345,
            "transactionHash": "0xabcdef1234567890"
        }
        mock_web3.eth.get_transaction_receipt.return_value = mock_receipt
        
        # Act
        result = provider.get_transaction_status(tx_hash="0xabcdef1234567890")
        
        # Assert
        assert result == "confirmed"
        mock_web3.eth.get_transaction_receipt.assert_called_once_with("0xabcdef1234567890")