"""
Example usage of the Transaction Outbox pattern for Crisis Unleashed.

This file demonstrates how to use the outbox pattern for blockchain operations
while maintaining consistency between database and blockchain state.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

from ..repository import TransactionOutboxRepository, OutboxType, OutboxStatus
from ..services import BlockchainHandler


async def example_mint_nft():
    """Example: Mint an NFT using the transaction outbox pattern."""
    
    # Setup (normally done in dependency injection)
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.crisis_unleashed
    outbox_repo = TransactionOutboxRepository(db)
    
    # Step 1: Create outbox entry (records intent to mint)
    print("🔄 Creating outbox entry for NFT minting...")
    
    outbox_id = await outbox_repo.create_entry(
        outbox_type=OutboxType.MINT_NFT,
        request_data={
            "user_id": "user-123",
            "card_id": "card-456", 
            "blockchain": "etherlink",
            "wallet_address": "0x1234567890abcdef1234567890abcdef12345678"
        },
        max_attempts=3
    )
    
    print(f"✅ Created outbox entry: {outbox_id}")
    
    # Step 2: Process the entry (normally done by background worker)
    print("🔄 Processing outbox entry...")
    
    # Mark as processing
    await outbox_repo.mark_processing(outbox_id)
    
    # Simulate blockchain operation
    try:
        # In real implementation, this would call actual blockchain service
        print("📡 Executing blockchain transaction...")
        await asyncio.sleep(1)  # Simulate network delay
        
        # Simulate successful blockchain transaction
        tx_hash = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
        result = {
            "tx_hash": tx_hash,
            "block_number": 123456,
            "gas_used": 150000
        }
        
        # Mark as completed
        await outbox_repo.mark_completed(outbox_id, result)
        print(f"✅ NFT minting completed! Transaction: {tx_hash}")
        
    except Exception as e:
        # Mark as failed and increment attempts
        await outbox_repo.increment_attempts(outbox_id, str(e))
        print(f"❌ NFT minting failed: {e}")
    
    # Step 3: Check final status
    entry = await outbox_repo.get_by_id(outbox_id)
    print(f"📊 Final status: {entry.status.value}")
    print(f"📊 Attempts: {entry.attempts}/{entry.max_attempts}")
    print(f"📊 Result: {entry.result}")


if __name__ == "__main__":
    asyncio.run(example_mint_nft())