import pytest
from unittest.mock import MagicMock, patch
from typing import Dict, Any

from backend.services.blockchain_handler import BlockchainHandler
from backend.repository.outbox_models import OutboxEntry, OutboxType, OutboxStatus


class TestBlockchainHandler:
    
    @pytest.fixture
    def handler(self, mock_outbox_repo, mock_blockchain_service):
        """Create a blockchain handler instance for testing."""
        return BlockchainHandler(
            outbox_repo=mock_outbox_repo,
            blockchain_service=mock_blockchain_service
        )
    
    def test_process_mint_nft(self, handler, sample_outbox_entry, mock_outbox_repo, mock_blockchain_service):
        """Test processing a mint NFT entry."""
        # Arrange
        mock_outbox_repo.get_pending.return_value = [sample_outbox_entry]
        mock_blockchain_service.mint_nft.return_value = "0xabcdef1234567890"
        mock_blockchain_service.wait_for_confirmation.return_value = {"status": 1}
        
        # Act
        handler.process_pending_entries()
        
        # Assert
        mock_blockchain_service.mint_nft.assert_called_once()
        mock_outbox_repo.mark_completed.assert_called_once_with(
            sample_outbox_entry.outbox_id,
            {
                "tx_hash": "0xabcdef1234567890",
                "status": "confirmed",
                "receipt": {"status": 1}
            }
        )
    
    def test_process_transfer_nft(self, handler, mock_outbox_repo, mock_blockchain_service):
        """Test processing a transfer NFT entry."""
        # Arrange
        entry = OutboxEntry.create_new(
            outbox_type=OutboxType.TRANSFER_NFT,
            request_data={
                "blockchain": "ethereum",
                "from_address": "0x1111111111111111111111111111111111111111",
                "to_address": "0x2222222222222222222222222222222222222222",
                "token_id": "token-123"
            }
        )
        
        mock_outbox_repo.get_pending.return_value = [entry]
        mock_blockchain_service.transfer_nft.return_value = "0x9876543210abcdef"
        mock_blockchain_service.wait_for_confirmation.return_value = {"status": 1}
        
        # Act
        handler.process_pending_entries()
        
        # Assert
        mock_blockchain_service.transfer_nft.assert_called_once()
        mock_outbox_repo.mark_completed.assert_called_once_with(
            entry.outbox_id,
            {
                "tx_hash": "0x9876543210abcdef",
                "status": "confirmed",
                "receipt": {"status": 1}
            }
        )
    
    def test_handle_failed_transaction(self, handler, sample_outbox_entry, mock_outbox_repo, mock_blockchain_service):
        """Test handling a failed transaction."""
        # Arrange
        mock_outbox_repo.get_pending.return_value = [sample_outbox_entry]
        mock_blockchain_service.mint_nft.side_effect = Exception("Transaction failed")
        
        # Act
        handler.process_pending_entries()
        
        # Assert
        mock_blockchain_service.mint_nft.assert_called_once()
        mock_outbox_repo.increment_attempts.assert_called_once_with(
            sample_outbox_entry.outbox_id,
            "Transaction failed"
        )
    
    def test_handle_failed_confirmation(self, handler, sample_outbox_entry, mock_outbox_repo, mock_blockchain_service):
        """Test handling a failed transaction confirmation."""
        # Arrange
        mock_outbox_repo.get_pending.return_value = [sample_outbox_entry]
        mock_blockchain_service.mint_nft.return_value = "0xabcdef1234567890"
        mock_blockchain_service.wait_for_confirmation.side_effect = Exception("Confirmation timeout")
        
        # Act
        handler.process_pending_entries()
        
        # Assert
        mock_blockchain_service.mint_nft.assert_called_once()
        mock_outbox_repo.increment_attempts.assert_called_once_with(
            sample_outbox_entry.outbox_id,
            "Confirmation timeout"
        )
    
    def test_get_processing_stats(self, handler, mock_outbox_repo):
        """Test getting processing stats."""
        # Arrange
        mock_outbox_repo.get_processing_stats.return_value = {
            "pending": 5,
            "processing": 2,
            "completed": 10,
            "failed": 1
        }
        
        # Act
        stats = handler.get_processing_stats()
        
        # Assert
        assert stats["pending"] == 5
        assert stats["processing"] == 2
        assert stats["completed"] == 10
        assert stats["failed"] == 1
        mock_outbox_repo.get_processing_stats.assert_called_once()