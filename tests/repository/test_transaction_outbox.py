import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime, timedelta
from typing import Dict, Any

from backend.repository.outbox_models import OutboxEntry, OutboxType, OutboxStatus
from backend.repository.transaction_outbox import TransactionOutboxRepository


class TestTransactionOutboxRepository:
    
    @pytest.fixture
    def db_mock(self):
        """Create a mock database connection."""
        db = MagicMock()
        
        # Mock the collection
        collection = MagicMock()
        db.outbox = collection
        
        return db
    
    @pytest.fixture
    def repo(self, db_mock):
        """Create a repository instance for testing."""
        return TransactionOutboxRepository(db=db_mock)
    
    @pytest.fixture
    def sample_entry_dict(self):
        """Create a sample outbox entry dict for testing."""
        return {
            "outbox_id": "test-id-123",
            "outbox_type": OutboxType.MINT_NFT.value,
            "status": OutboxStatus.PENDING.value,
            "request_data": {
                "blockchain": "ethereum",
                "recipient": "0x1234567890123456789012345678901234567890",
                "card_id": "card-123",
                "metadata": {
                    "name": "Test Card",
                    "description": "A test card for unit tests"
                }
            },
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "attempts": 0,
            "max_attempts": 5
        }
    
    def test_create_entry(self, repo, db_mock):
        """Test creating a new outbox entry."""
        # Arrange
        request_data = {
            "blockchain": "ethereum",
            "recipient": "0x1234567890123456789012345678901234567890",
            "card_id": "card-123",
            "metadata": {
                "name": "Test Card",
                "description": "A test card for unit tests"
            }
        }
        
        # Mock the insert_one method
        db_mock.outbox.insert_one.return_value = MagicMock(inserted_id="test-id-123")
        
        # Act
        entry = repo.create_entry(
            outbox_type=OutboxType.MINT_NFT,
            request_data=request_data
        )
        
        # Assert
        assert entry.outbox_id is not None
        assert entry.outbox_type == OutboxType.MINT_NFT
        assert entry.status == OutboxStatus.PENDING
        assert entry.request_data == request_data
        db_mock.outbox.insert_one.assert_called_once()
    
    def test_get_by_id(self, repo, db_mock, sample_entry_dict):
        """Test getting an entry by ID."""
        # Arrange
        db_mock.outbox.find_one.return_value = sample_entry_dict
        
        # Act
        entry = repo.get_by_id("test-id-123")
        
        # Assert
        assert entry is not None
        assert entry.outbox_id == "test-id-123"
        assert entry.outbox_type == OutboxType.MINT_NFT
        assert entry.status == OutboxStatus.PENDING
        db_mock.outbox.find_one.assert_called_once_with({"outbox_id": "test-id-123"})
    
    def test_get_pending(self, repo, db_mock, sample_entry_dict):
        """Test getting pending entries."""
        # Arrange
        db_mock.outbox.find.return_value = [sample_entry_dict]
        
        # Act
        entries = repo.get_pending(limit=10)
        
        # Assert
        assert len(entries) == 1
        assert entries[0].outbox_id == "test-id-123"
        assert entries[0].status == OutboxStatus.PENDING
        db_mock.outbox.find.assert_called_once()
    
    def test_mark_completed(self, repo, db_mock):
        """Test marking an entry as completed."""
        # Arrange
        result = {
            "tx_hash": "0xabcdef1234567890",
            "status": "confirmed"
        }
        
        # Act
        repo.mark_completed("test-id-123", result)
        
        # Assert
        db_mock.outbox.update_one.assert_called_once()
        call_args = db_mock.outbox.update_one.call_args[0]
        assert call_args[0] == {"outbox_id": "test-id-123"}
        assert call_args[1]["$set"]["status"] == OutboxStatus.COMPLETED.value
        assert call_args[1]["$set"]["result"] == result
    
    def test_mark_failed(self, repo, db_mock):
        """Test marking an entry as failed."""
        # Act
        repo.mark_failed("test-id-123", "Transaction failed")
        
        # Assert
        db_mock.outbox.update_one.assert_called_once()
        call_args = db_mock.outbox.update_one.call_args[0]
        assert call_args[0] == {"outbox_id": "test-id-123"}
        assert call_args[1]["$set"]["status"] == OutboxStatus.FAILED.value
        assert call_args[1]["$set"]["last_error"] == "Transaction failed"
    
    def test_increment_attempts(self, repo, db_mock):
        """Test incrementing attempt count."""
        # Act
        repo.increment_attempts("test-id-123", "Temporary error")
        
        # Assert
        db_mock.outbox.update_one.assert_called_once()
        call_args = db_mock.outbox.update_one.call_args[0]
        assert call_args[0] == {"outbox_id": "test-id-123"}
        assert call_args[1]["$inc"]["attempts"] == 1
        assert call_args[1]["$set"]["last_error"] == "Temporary error"
    
    def test_get_processing_stats(self, repo, db_mock):
        """Test getting processing stats."""
        # Arrange
        db_mock.outbox.count_documents.side_effect = [5, 2, 10, 1]
        
        # Act
        stats = repo.get_processing_stats()
        
        # Assert
        assert stats["pending"] == 5
        assert stats["processing"] == 2
        assert stats["completed"] == 10
        assert stats["failed"] == 1
        assert db_mock.outbox.count_documents.call_count == 4