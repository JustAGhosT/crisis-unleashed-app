# Crisis Unleashed Database Schema

## Overview

Crisis Unleashed uses Cosmos DB (MongoDB API) as the primary database for storing game data, user information, and application state. This document outlines the database schema, collections, and important field descriptions.

## Current Database Structure

The application currently uses a minimal database schema with plans for expansion. The MongoDB connection is established in `server.py` using the Motor AsyncIO driver.

### Environment Configuration

The database connection uses these environment variables:

- `COSMOS_CONNECTION_STRING`: Cosmos DB connection string
- `DB_NAME`: Database name

### Schema Design Principles

1. **Single Identifier Strategy**: We use MongoDB's `_id` field as the primary identifier across all collections
   - UUID format for meaningful, self-generated IDs
   - No duplicate ID fields within documents

2. **Consistent Reference Types**: All foreign keys use the same UUID format as the referenced collection's `_id`
   - Enables direct joins and lookups without type conversion
   - Maintains referential integrity across collections

3. **Indexing Strategy**: Optimized indexes for query patterns
   - Non-unique indexes for high-cardinality filtered fields
   - Unique indexes for constraints (username, email, etc.)
   - Compound indexes for common query patterns

### Collections

#### Status Checks

The `status_checks` collection tracks client connections to the server, primarily used for monitoring and debugging.

```javascript
{
  "_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",  // UUID as primary key
  "client_name": "web-client-1",                  // Client identifier
  "timestamp": ISODate("2024-12-19T10:00:00Z")    // When the check was created
}
```

## Planned Database Schema

The following collections are planned for future implementation:

### Users

```javascript
{
  "_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",  // UUID as primary key
  "username": "playerOne",                        // Username (unique)
  "email": "player@example.com",                  // Email address (unique)
  "password_hash": "...",                         // Hashed password
  "wallet_address": "0x...",                      // Blockchain wallet (optional)
  "created_at": ISODate("..."),                   // Account creation time
  "updated_at": ISODate("..."),                   // Last account update
  "faction": "solaris",                           // Preferred faction
  "rank": 1500,                                   // Competitive rank
  "xp": 2500,                                     // Experience points
  "level": 25,                                    // User level from XP
  "avatar_url": "https://...",                    // Profile picture
  "settings": {                                   // User preferences
    "sound_enabled": true,
    "notification_enabled": true,
    "theme": "dark"
  }
}
```

### Cards

Stores card definitions for all cards in the game.

```javascript
{
  "_id": "card-f47ac10b-58cc-4372-a567-0e02b2c3d479",  // UUID as primary key with card- prefix
  "name": "Radiant Guardian",                          // Card name
  "description": "Protects allies...",                 // Description
  "type": "character",                                 // Card type
  "faction": "solaris",                                // Faction
  "rarity": "rare",                                    // Card rarity
  "cost": 4,                                           // Energy cost
  "attack": 3,                                         // Attack value
  "health": 4,                                         // Health value
  "abilities": ["shield", "divine_light"],             // Abilities
  "image_url": "https://...",                          // Card image
  "is_active": true,                                   // Available in current meta
  "created_at": ISODate("..."),                        // Card creation time
  "updated_at": ISODate("...")                         // Card update time
}
```

### UserCards

Tracks which cards each user owns.

```javascript
{
  "_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",  // UUID as primary key
  "user_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",  // User UUID (FK to users._id)
  "card_id": "card-f47ac10b-58cc-4372-a567-0e02b2c3d479",  // Card UUID (FK to cards._id)
  "quantity": 3,                                   // Number of copies
  "acquired_at": ISODate("..."),                   // When acquired
  "is_favorite": false,                            // Marked as favorite
  "nft_id": "nft-f47ac10b-58cc-4372-a567-0e02b2c3d479"  // NFT UUID if minted
}
```### Decks

Stores deck definitions created by users.

```javascript
{
  "_id": "deck-f47ac10b-58cc-4372-a567-0e02b2c3d479",  // UUID as primary key with deck- prefix
  "user_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",   // User UUID (FK to users._id)
  "name": "Solar Domination",                          // Deck name
  "faction": "solaris",                                // Primary faction
  "is_active": true,                                   // Currently active
  "created_at": ISODate("..."),                        // Creation timestamp
  "updated_at": ISODate("..."),                        // Update timestamp
  "cards": [                                           // Cards in deck
    {
      "card_id": "card-f47ac10b-58cc-4372-a567-0e02b2c3d479",  // Card UUID
      "quantity": 2                                   // Number of copies
    },
    {
      "card_id": "card-a47bc10b-58cc-4372-a567-0e02b2c3d123",  // Card UUID
      "quantity": 3                                   // Number of copies
    }
  ]
}
```

### Games

Tracks information about individual game matches.

```javascript
{
  "_id": "game-f47ac10b-58cc-4372-a567-0e02b2c3d479",  // UUID as primary key with game- prefix
  "status": "in_progress",                             // Game status
  "created_at": ISODate("..."),                        // Creation timestamp
  "updated_at": ISODate("..."),                        // Update timestamp
  "completed_at": ISODate("..."),                      // Completion time
  "players": [                                         // Players in game
    {
      "user_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",  // User UUID
      "position": "player1",                           // Position in game
      "faction": "solaris",                            // Faction used
      "deck_id": "deck-f47ac10b-58cc-4372-a567-0e02b2c3d479",  // Deck UUID
      "initial_health": 30                             // Starting health
    },
    {
      "user_id": "a47bc10b-58cc-4372-a567-0e02b2c3d123",  // User UUID
      "position": "player2",                           // Position in game
      "faction": "umbral",                             // Faction used
      "deck_id": "deck-a47bc10b-58cc-4372-a567-0e02b2c3d123",  // Deck UUID
      "initial_health": 30                             // Starting health
    }
  ],
  "winner_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",  // Winning user UUID
  "winner_reason": "health_zero"                        // Win condition
}

### GameState

Stores the current state of active games.

```javascript
{
  "_id": "gamestate-f47ac10b-58cc-4372-a567-0e02b2c3d479",  // UUID as primary key with gamestate- prefix
  "game_id": "game-f47ac10b-58cc-4372-a567-0e02b2c3d479",   // Game UUID (FK to games._id)
  "current_turn": 3,                                        // Current turn
  "active_player": "player1",                               // Active player position
  "last_updated": ISODate("..."),                           // Last update timestamp
  "board_state": {                                          // Complete board state
    "zones": [
      {
        "position": "1-1",                                 // Board position
        "unit": {
          "card_id": "card-f47ac10b-58cc-4372-a567-0e02b2c3d479",  // Card UUID
          "health": 3,                                    // Current health
          "attack": 2,                                    // Current attack
          "effects": ["shield"]                           // Active effects
        }
      }
      // Additional zones...
    ]
  },
  "player1_state": {                                        // Player 1's complete state
    "health": 25,                                          // Current health
    "energy": 4,                                           // Current energy
    "max_energy": 5,                                       // Maximum energy
    "hand": ["card-f47ac10b-58cc-4372-a567-0e02b2c3d479", "card-a47bc10b-58cc-4372-a567-0e02b2c3d123"],  // Card UUIDs in hand
    "deck_count": 21,                                      // Remaining deck size
    "graveyard": ["card-b47bc10b-58cc-4372-a567-0e02b2c3d456"],  // Card UUIDs in graveyard
    "effects": ["armor_3"]                                 // Active effects
  },
  "player2_state": {                                        // Player 2's complete state
    "health": 22,                                          // Current health
    "energy": 5,                                           // Current energy
    "max_energy": 5,                                       // Maximum energy
    "hand_count": 3,                                       // Only count visible to player1 
    "deck_count": 18,                                      // Remaining deck size
    "graveyard": ["card-c47bc10b-58cc-4372-a567-0e02b2c3d789"],  // Card UUIDs in graveyard
    "effects": []                                          // Active effects
  }
}
```

### GameActions

Logs all actions taken during a game.

```javascript
{
  "_id": "action-f47ac10b-58cc-4372-a567-0e02b2c3d479",   // UUID as primary key with action- prefix
  "game_id": "game-f47ac10b-58cc-4372-a567-0e02b2c3d479", // Game UUID (FK to games._id)
  "player_position": "player1",                           // Player position in game
  "user_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",      // User UUID who took action
  "action_type": "play_card",                             // Action type
  "action_data": {                                        // Action details
    "card_id": "card-f47ac10b-58cc-4372-a567-0e02b2c3d479",  // Card UUID played
    "position": "1-2",                                    // Board position
    "targets": ["enemy-hero"]                             // Targets affected
  },
  "turn_number": 3,                                       // Turn when action occurred
  "timestamp": ISODate("...")                             // When action occurred
}

### NFTCards

Tracks cards that have been minted as NFTs.

```javascript
{
  "_id": "nft-f47ac10b-58cc-4372-a567-0e02b2c3d479",        // UUID as primary key with nft- prefix
  "card_id": "card-f47ac10b-58cc-4372-a567-0e02b2c3d479",   // Card UUID (FK to cards._id)
  "token_id": "1234",                                       // Blockchain token ID
  "contract_address": "0x1234...",                          // NFT contract address
  "blockchain": "etherlink",                                // Blockchain network
  "transaction_hash": "0xabc...",                           // Mint transaction hash
  "owner_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",       // Owner user UUID (FK to users._id)
  "minted_at": ISODate("..."),                              // When NFT was minted
  "metadata": {                                             // Additional NFT metadata
    "edition": "genesis",                                  // Edition identifier
    "attributes": [                                        // NFT attributes
      {
        "trait_type": "Rarity",                           // Trait type
        "value": "Rare"                                   // Trait value
      },
      {
        "trait_type": "Ability",                          // Trait type
        "value": "Shield"                                 // Trait value
      }
    ]
  }
}
```

### Transactions

Records blockchain transactions.

```javascript
{
  "_id": "tx-f47ac10b-58cc-4372-a567-0e02b2c3d479",         // UUID as primary key with tx- prefix
  "user_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",        // User UUID (FK to users._id)
  "transaction_type": "mint",                               // Transaction type
  "blockchain": "etherlink",                                // Blockchain network
  "transaction_hash": "0xabc...",                           // Transaction hash
  "details": {                                              // Transaction details
    "card_id": "card-f47ac10b-58cc-4372-a567-0e02b2c3d479", // Card UUID
    "token_id": "1234",                                    // Token ID on blockchain
    "gas_used": 150000                                     // Gas consumed
  },
  "status": "completed",                                    // Transaction status
  "created_at": ISODate("..."),                             // Creation timestamp
  "completed_at": ISODate("...")                            // Completion timestamp
}
```

## Indexes

The following indexes will be created to optimize query performance:

### Users Collection

- `username` (unique) - For username lookups and uniqueness constraint
- `email` (unique) - For email lookups and uniqueness constraint
- `wallet_address` (unique, sparse) - For wallet authentication

### Cards Collection

- `faction` - For filtering cards by faction
- `{type: 1, rarity: 1}` (compound) - For filtering by type and rarity
- `is_active` - For filtering active cards

### UserCards Collection

- `{user_id: 1, card_id: 1}` (compound, unique) - For enforcing unique ownership and quick lookups
- `user_id` - For finding all cards owned by a user
- `card_id` - For finding all owners of a specific card
- `nft_id` - For looking up NFT associations

### Decks Collection

- `user_id` - For finding all decks owned by a user
- `faction` - For filtering decks by faction
- `{user_id: 1, is_active: 1}` (compound) - For finding active decks per user

### Games Collection

- `status` - For filtering games by status (in_progress, completed, etc.)
- `players.user_id` - For finding games a player is participating in
- `created_at` - For sorting games by creation time
- `winner_id` - For tracking win records

### GameState Collection

- `game_id` (unique) - For looking up the state of a specific game
- `last_updated` - For sorting by update time and tracking stale states

### GameActions Collection

- `{game_id: 1, timestamp: 1}` (compound) - For chronological action history per game
- `{game_id: 1, turn_number: 1}` (compound) - For actions by turn
- `user_id` - For finding actions by a specific user

### NFTCards Collection

- `{token_id: 1, contract_address: 1, blockchain: 1}` (compound, unique) - For enforcing unique NFTs across chains
- `owner_id` - For finding all NFTs owned by a user
- `card_id` - For finding NFTs for a specific card

### Transactions Collection

- `user_id` - For finding transactions by user
- `transaction_hash` (unique) - For uniqueness and lookup by hash
- `status` - For monitoring transaction states
- `created_at` - For chronological ordering

The following indexes will be created to optimize query performance:

### Idx - Users

- `username` (unique)
- `email` (unique)
- `wallet_address` (unique, sparse)

### Idx - Cards

- `faction` (for filtering by faction)
- `type, rarity` (for filtering by type and rarity)

### Idx - UserCards

- `user_id, card_id` (for quick lookups)

### Decks

- `user_id` (for finding user's decks)

### Idx - Games

- `status` (for filtering active games)
- `players.user_id` (for finding player's games)

### Idx - GameState

- `game_id` (unique)

### Idx - GameActions

- `game_id, timestamp` (for chronological action history)

### Idx - NFTCards

- `token_id, contract_address, blockchain` (unique)
- `owner_id` (for finding user's NFTs)

### Idx - Transactions

- `user_id` (for finding user's transactions)
- `transaction_hash` (unique)
- `status` (for monitoring pending transactions)## Data Migration Strategy

As the application evolves, database migrations will be managed through:

1. **Version-controlled migration scripts**
   - Stored in the codebase under `/backend/migrations`
   - Sequential naming convention (001_initial_schema.js, 002_add_user_profiles.js)
   - Each script contains both up (apply) and down (rollback) functions

2. **Schema versioning**
   - Metadata collection to track applied migrations
   - Document versioning for schema evolution of existing records
   - Schema validation rules in Cosmos DB

3. **Migration safety practices**
   - Point-in-time backups before migrations
   - Canary deployments for schema changes
   - Blue/green deployments for zero-downtime migrations

4. **Data consistency**
   - Two-phase migrations for backward compatibility
   - Feature flags for incremental rollout
   - Validation of migrated data

## Implementation Details

### MongoDB API Compatibility

Using Cosmos DB with MongoDB API provides:

- Compatibility with existing MongoDB drivers and tools
- Global distribution capabilities
- Elastic scalability with serverless options
- Cost optimization with auto-scale

### Driver Configuration

```python
# Example driver configuration in server.py
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

# Get connection string from environment
connection_string = os.environ["COSMOS_CONNECTION_STRING"]
db_name = os.environ["DB_NAME"]

# Configure client with appropriate options
client = AsyncIOMotorClient(
    connection_string,
    retryWrites=True,  # Enable retryable writes
    maxPoolSize=10,    # Connection pool size
    maxIdleTimeMS=30000,  # Max idle time
    serverSelectionTimeoutMS=5000  # Server selection timeout
)

# Get database reference
db = client[db_name]

# Example index creation
async def ensure_indexes():
    # Users collection
    await db.users.create_index("username", unique=True)
    await db.users.create_index("email", unique=True)
    
    # Cards collection
    await db.cards.create_index("faction")
    await db.cards.create_index([("type", 1), ("rarity", 1)])
    
    # Games collection
    await db.games.create_index("status")
    await db.games.create_index("players.user_id")
```

### Data Access Patterns

The application will use repository patterns to abstract database operations:

```python
class UserRepository:
    def __init__(self, db):
        self.collection = db.users
    
    async def find_by_id(self, user_id):
        return await self.collection.find_one({"_id": user_id})
    
    async def find_by_username(self, username):
        return await self.collection.find_one({"username": username})
    
    async def create(self, user_data):
        # Ensure _id is set as UUID
        if "_id" not in user_data:
            user_data["_id"] = str(uuid.uuid4())
        
        try:
            result = await self.collection.insert_one(user_data)
            return await self.find_by_id(user_data["_id"])
        except DuplicateKeyError as e:
            # Handle unique constraint violation
            if "username" in str(e):
                raise ValueError("Username already exists")
            elif "email" in str(e):
                raise ValueError("Email already exists")
            raise
    
    async def update(self, user_id, update_data):
        result = await self.collection.find_one_and_update(
            {"_id": user_id},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER
        )
        return result
```

## Performance Considerations

- **Indexing Strategy**: All query patterns will have supporting indexes
- **Document Size**: Keep documents under 2MB for optimal performance
- **Connection Pooling**: Properly configured for application scaling
- **Query Optimization**: Use projection to limit fields returned
- **Bulk Operations**: Use bulkWrite for batch operations
- **Composite Indexes**: For multi-field filtering and sorting operations
- **Time-to-Live (TTL)**: For automatic expiration of temporary data
