import pytest
from unittest.mock import patch

from backend.services.blockchain.etherlink_provider import EtherlinkProvider


class TestEtherlinkProvider:
    
    @pytest.fixture
    def network_config(self):
        return {
            "network": "test",
            "rpc_url": "http://localhost:8546",
            "nft_contract_address": "0x1234567890123456789012345678901234567890",
        }

    @pytest.fixture
    def provider(self, network_config, mock_web3):
        with patch("backend.services.blockchain.etherlink_provider.WEB3_AVAILABLE", True), \
             patch("backend.services.blockchain.etherlink_provider.new_web3", return_value=mock_web3):
            p = EtherlinkProvider(network_config=network_config)
            yield p

    def test_connect(self, provider, mock_web3):
        mock_web3.is_connected.return_value = True
        assert provider.connect() is True
        assert provider.is_connected() is True
        mock_web3.is_connected.assert_called()

    def test_is_connected_reflects_live_state(self, provider, mock_web3):
        mock_web3.is_connected.return_value = True
        assert provider.connect() is True
        assert provider.is_connected() is True
        mock_web3.is_connected.return_value = False
        assert provider.is_connected() is False

    def test_disconnect(self, provider, mock_web3):
        mock_web3.is_connected.return_value = True
        assert provider.connect() is True
        provider.disconnect()
        assert provider.is_connected() is False

    def test_mint_nft_simulated(self, provider, mock_web3):
        mock_web3.is_connected.return_value = True
        assert provider.connect() is True
        tx_hash = provider.mint_nft(
            recipient="0x2222222222222222222222222222222222222222",
            card_id="card-123",
            metadata={"name": "Test"},
        )
        assert isinstance(tx_hash, str)
        assert tx_hash.startswith("0x")

    def test_transfer_nft_simulated(self, provider, mock_web3):
        mock_web3.is_connected.return_value = True
        assert provider.connect() is True
        tx_hash = provider.transfer_nft(
            from_address="0x1111111111111111111111111111111111111111",
            to_address="0x2222222222222222222222222222222222222222",
            token_id="token-123",
        )
        assert isinstance(tx_hash, str)
        assert tx_hash.startswith("0x")

    def test_get_nft_owner_placeholder(self, provider, mock_web3):
        mock_web3.is_connected.return_value = True
        assert provider.connect() is True
        owner = provider.get_nft_owner(token_id="token-123")
        assert owner == "0x1234567890123456789012345678901234567890"

    def test_get_transaction_status(self, provider, mock_web3):
        mock_web3.is_connected.return_value = True
        assert provider.connect() is True
        status = provider.get_transaction_status(tx_hash="0xabc")
        assert status in ("pending", "confirmed", "unknown", "error")
        assert status == "pending"
