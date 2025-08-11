import pytest
from unittest.mock import MagicMock, patch
from typing import Dict, Any

from backend.services.blockchain_service import BlockchainService
from backend.services.blockchain.provider_factory import BlockchainProviderFactory


class TestBlockchainService:
    
    @pytest.fixture
    def service(self):
        """Create a blockchain service instance for testing."""
        # Mock the provider factory
        with patch('backend.services.blockchain_service.BlockchainProviderFactory') as mock_factory:
            # Configure the factory to return a mock provider
            mock_provider = MagicMock()
            mock_provider.is_connected.return_value = True
            mock_provider.supported_operations.return_value = ["mint_nft", "transfer_nft"]
            
            mock_factory.get_provider.return_value = mock_provider
            mock_factory.get_supported_blockchains.return_value = ["ethereum", "etherlink"]
            
            # Create the service with test configs
            test_configs = {
                "ethereum": {
                    "network": "test",
                    "provider_url": "http://localhost:8545",
                    "chain_id": 1337,
                    "contract_address": "0x1234567890123456789012345678901234567890"
                },
                "etherlink": {
                    "network": "test",
                    "provider_url": "http://localhost:8546",
                    "chain_id": 1338,
                    "contract_address": "0x0987654321098765432109876543210987654321"
                }
            }
            
            service = BlockchainService(network_configs=test_configs)
            
            # Replace the internal provider with our mock
            service._providers = {
                "ethereum": mock_provider,
                "etherlink": mock_provider
            }
            
            return service
    
    def test_initialize(self, service):
        """Test that the service initializes correctly."""
        # Act
        service.initialize()
        
        # Assert
        assert service.is_healthy() is True
        assert set(service.get_supported_blockchains()) == {"ethereum", "etherlink"}
    
    def test_get_provider(self, service):
        """Test getting a provider for a specific blockchain."""
        # Act
        provider = service.get_provider("ethereum")
        
        # Assert
        assert provider is not None
        assert provider.is_connected() is True
    
    def test_mint_nft(self, service):
        """Test minting an NFT."""
        # Arrange
        mock_provider = service._providers["ethereum"]
        mock_provider.mint_nft.return_value = "0xabcdef1234567890"
        
        # Act
        tx_hash = service.mint_nft(
            blockchain="ethereum",
            recipient="0x1234567890123456789012345678901234567890",
            card_id="card-123",
            name="Test Card",
            description="A test card"
        )
        
        # Assert
        assert tx_hash == "0xabcdef1234567890"
        mock_provider.mint_nft.assert_called_once_with(
            recipient="0x1234567890123456789012345678901234567890",
            card_id="card-123",
            metadata={
                "name": "Test Card",
                "description": "A test card"
            }
        )
    
    def test_transfer_nft(self, service):
        """Test transferring an NFT."""
        # Arrange
        mock_provider = service._providers["ethereum"]
        mock_provider.transfer_nft.return_value = "0x9876543210abcdef"
        
        # Act
        tx_hash = service.transfer_nft(
            blockchain="ethereum",
            from_address="0x1111111111111111111111111111111111111111",
            to_address="0x2222222222222222222222222222222222222222",
            token_id="token-123"
        )
        
        # Assert
        assert tx_hash == "0x9876543210abcdef"
        mock_provider.transfer_nft.assert_called_once_with(
            from_address="0x1111111111111111111111111111111111111111",
            to_address="0x2222222222222222222222222222222222222222",
            token_id="token-123"
        )
    
    def test_get_nft_owner(self, service):
        """Test getting the owner of an NFT."""
        # Arrange
        mock_provider = service._providers["ethereum"]
        mock_provider.get_nft_owner.return_value = "0x3333333333333333333333333333333333333333"
        
        # Act
        owner = service.get_nft_owner(
            blockchain="ethereum",
            token_id="token-123"
        )
        
        # Assert
        assert owner == "0x3333333333333333333333333333333333333333"
        mock_provider.get_nft_owner.assert_called_once_with(token_id="token-123")
    
    def test_wait_for_confirmation(self, service):
        """Test waiting for transaction confirmation."""
        # Arrange
        mock_provider = service._providers["ethereum"]
        mock_provider.wait_for_confirmation.return_value = {
            "status": 1,
            "blockNumber": 12345
        }
        
        # Act
        receipt = service.wait_for_confirmation(
            blockchain="ethereum",
            tx_hash="0xabcdef1234567890",
            timeout=60
        )
        
        # Assert
        assert receipt["status"] == 1
        assert receipt["blockNumber"] == 12345
        mock_provider.wait_for_confirmation.assert_called_once_with(
            tx_hash="0xabcdef1234567890",
            timeout=60
        )
    
    def test_health_check(self, service):
        """Test the health check functionality."""
        # Arrange
        mock_provider = service._providers["ethereum"]
        mock_provider.is_connected.return_value = True
        
        # Act
        result = service.health_check()
        
        # Assert
        assert result is True
        
        # Test with a failed provider
        mock_provider.is_connected.return_value = False
        result = service.health_check()
        assert result is False