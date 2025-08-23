"""
Example usage of the Transaction Outbox pattern for Crisis Unleashed.

This file demonstrates a synchronous, dependency-free example using an
in-memory collection so it can run without MongoDB/motor.
"""
from __future__ import annotations

from typing import Any, Dict, Iterable, Optional
from time import sleep

from ..repository import TransactionOutboxRepository, OutboxType


class InMemoryCollection:
    """Minimal in-memory collection compatible with TransactionOutboxRepository."""

    def __init__(self) -> None:
        self._docs: list[Dict[str, Any]] = []

    # Write ops
    def insert_one(self, doc: Dict[str, Any]) -> None:
        self._docs.append(dict(doc))

    def update_one(self, filt: Dict[str, Any], update: Dict[str, Any]) -> None:
        for i, d in enumerate(self._docs):
            if all(d.get(k) == v for k, v in filt.items()):
                # Create a shallow copy to avoid in-place mutations
                updated_doc = dict(d)
                # Apply $set
                for k, v in update.get("$set", {}).items():
                    updated_doc[k] = v
                # Apply $inc
                for k, v in update.get("$inc", {}).items():
                    current = updated_doc.get(k, 0)
                    try:
                        updated_doc[k] = int(current) + int(v)
                    except (ValueError, TypeError):
                        # If current value is not numeric, set to the increment value
                        updated_doc[k] = int(v)
                # Replace the original with the updated copy
                self._docs[i] = updated_doc
                break

    # Reads
    def find_one(self, filt: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for d in self._docs:
            if all(d.get(k) == v for k, v in filt.items()):
                return dict(d)
        return None

    def find(self, filt: Dict[str, Any]) -> Iterable[Dict[str, Any]]:
        return [dict(d) for d in self._docs if all(d.get(k) == v for k, v in filt.items())]

    def count_documents(self, filt: Dict[str, Any]) -> int:
        return sum(1 for _ in self.find(filt))


class InMemoryDb:
    def __init__(self) -> None:
        self.outbox = InMemoryCollection()


def example_mint_nft() -> None:
    """Example: Mint an NFT using the transaction outbox pattern (sync)."""
    # Setup (normally done in dependency injection)
    db = InMemoryDb()
    outbox_repo = TransactionOutboxRepository(db)

    # Step 1: Create outbox entry (records intent to mint)
    print("🔄 Creating outbox entry for NFT minting...")
    entry = outbox_repo.create_entry(
        outbox_type=OutboxType.MINT_NFT,
        request_data={
            "user_id": "user-123",
            "card_id": "card-456",
            "blockchain": "etherlink",
            "recipient": "0x1234567890abcdef1234567890abcdef12345678",
            "metadata": {"rarity": "legendary"},
        },
        max_attempts=3,
    )
    outbox_id = entry.outbox_id
    if not isinstance(outbox_id, str):
        raise RuntimeError("Outbox entry missing string outbox_id")
    print(f"✅ Created outbox entry: {outbox_id}")

    # Step 2: Process the entry (normally done by background worker)
    print("🔄 Processing outbox entry...")
    # Mark as processing if available in repo (not required by tests)
    mark_proc = getattr(outbox_repo, "mark_processing", None)
    if callable(mark_proc):
        # Let exceptions surface during development/testing instead of masking them
        mark_proc(outbox_id)

    # Simulate blockchain operation
    try:
        print("📡 Executing blockchain transaction...")
        sleep(0.2)  # Simulate network delay

        # Simulate successful blockchain transaction
        tx_hash = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
        result = {
            "tx_hash": tx_hash,
            "block_number": 123456,
            "gas_used": 150000,
            "status": "confirmed",
        }

        # Mark as completed
        outbox_repo.mark_completed(outbox_id, result)
        print(f"✅ NFT minting completed! Transaction: {tx_hash}")

    except Exception as e:
        # Mark as failed and increment attempts, then re-raise to avoid hiding critical errors
        outbox_repo.increment_attempts(outbox_id, str(e))
        print(f"❌ NFT minting failed: {e}")
        raise

    # Step 3: Check final status
    final = outbox_repo.get_by_id(outbox_id)
    if final is None:
        print("📊 Final status: not found")
        return
    print(f"📊 Final status: {final.status}")
    print(f"📊 Attempts: {final.attempts}/{final.max_attempts}")
    print(f"📊 Result: {final.result}")


if __name__ == "__main__":
    example_mint_nft()