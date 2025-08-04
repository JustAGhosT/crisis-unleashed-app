# Blockchain Integration for Crisis Unleashed

## Overview

Crisis Unleashed plans to incorporate blockchain technology to provide true digital ownership of cards and assets. This document outlines the technical architecture, implementation plan, and best practices for integrating with Etherlink and other blockchains.

## Blockchain Strategy

### Multi-Chain Approach

Crisis Unleashed will employ a multi-chain strategy to provide users with options:

1. **Etherlink (Primary)** - Ethereum compatibility with Tezos backing
2. **Ethereum** - For broader NFT ecosystem compatibility
3. **Solana** - For lower fees and higher transaction throughput

### NFT Assets

The following game assets will be available as NFTs:

1. **Cards** - Individual game cards with varying rarities
2. **Heroes** - Special character cards with unique abilities
3. **Card Backs** - Cosmetic customizations
4. **Special Edition Items** - Tournament rewards and limited releases

## Technical Architecture

### Smart Contract Structure

#### Core Contracts

1. **CardRegistry.sol**
   - Tracks all card metadata
   - Maps on-chain assets to game data
   - Controls minting permissions

2. **CardOwnership.sol (ERC-721)**
   - Implements NFT standard
   - Handles ownership transfers
   - Manages approvals

3. **CardMarketplace.sol**
   - Facilitates peer-to-peer trading
   - Handles auctions and fixed price sales
   - Manages fees and royalties

4. **TournamentRewards.sol**
   - Distributes tournament prizes
   - Verifies achievements
   - Mints exclusive rewards

#### Sample Contract Implementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CrisisUnleashedCards is ERC721URIStorage, Ownable, ReentrancyGuard {
    // Card data stored on-chain
    struct Card {
        string cardId;       // Game database ID
        string name;
        uint8 rarity;        // 0=Common, 1=Uncommon, 2=Rare, 3=Epic, 4=Legendary
        string faction;      // Faction identifier
        string cardType;     // Character, Action, etc.
        uint256 mintedAt;    // Timestamp
        uint256 edition;     // Edition number within same card type
    }
    
    // Mapping from token ID to Card data
    mapping(uint256 => string) private _tokenCIDs; // CID → token metadata
    
    // Mapping from card ID to count of minted copies
    mapping(string => uint256) public editionCounts;
    
    // Base URI for metadata
    string private _baseURIExtended;
    
    ...
}    // Events
    event CardMinted(uint256 indexed tokenId, address owner, string cardId, uint8 rarity);
    
    constructor() ERC721("Crisis Unleashed Cards", "CUC") {}
    
    // Set the base URI for metadata
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIExtended = baseURI_;
    }
    
    // Override base URI
    function _baseURI() internal view override returns (string memory) {
        return _baseURIExtended;
    }
    
using Counters for Counters.Counter;
Counters.Counter private _tokenIds;

    // Mint a new card NFT
    function mintCard(
        address to,
        string memory cardId,
        string memory name,
        uint8 rarity,
        string memory faction,
        string memory cardType
    ) external onlyOwner nonReentrant returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        uint256 edition = editionCounts[cardId] + 1;
        
        // …rest of mint logic…
    }        cards[tokenId] = Card({
            cardId: cardId,
            name: name,
            rarity: rarity,
            faction: faction,
            cardType: cardType,
            mintedAt: block.timestamp,
            edition: edition
        });
        
        editionCounts[cardId] = edition;
        
        _safeMint(to, tokenId);
        emit CardMinted(tokenId, to, cardId, rarity);
        
        return tokenId;
    }
    
    // Get card information
    function getCard(uint256 tokenId) external view returns (Card memory) {
        require(_exists(tokenId), "Card does not exist");
        return cards[tokenId];
    }
}
```

### Backend Integration

The backend service will:

1. **Manage Wallet Connections**
   - Process wallet authentication requests
   - Verify ownership of NFTs
   - Link blockchain wallets to user accounts

2. **Handle Transaction Flow**
   - Create and sign transactions
   - Monitor transaction status
   - Update game state based on blockchain events

3. **Verify Asset Ownership**
   - Check on-chain data for owned NFTs
   - Validate authenticity of assets
   - Sync ownership changes with game database

#### Example Backend Implementation (Pseudocode)

```python
# Backend API Endpoint for Minting a Card
@app.post("/api/blockchain/mint")
async def mint_card(request: MintCardRequest):
    # Validate user owns the card in the game
    user_card = await db.user_cards.find_one({
        "user_id": request.user_id,
        "card_id": request.card_id
    })
    
    if not user_card or user_card.get("quantity", 0) < 1:
        raise HTTPException(status_code=403, detail="You don't own this card")
    
    # Get card details
    card = await db.cards.find_one({"id": request.card_id})
    
    # Connect to blockchain based on user's choice
    if request.blockchain == "etherlink":
        provider = get_etherlink_provider()
    elif request.blockchain == "ethereum":
        provider = get_ethereum_provider()
    elif request.blockchain == "solana":
        provider = get_solana_provider()
    else:
        raise HTTPException(status_code=400, detail="Unsupported blockchain")
    
    # Prepare transaction
    contract = get_nft_contract(request.blockchain)
    
    # Execute transaction
    tx_hash = await contract.mint_card(
        request.wallet_address,
        card["id"],
        card["name"],
        RARITY_MAPPING[card["rarity"]],
        card["faction"],
        card["type"]
    )
    
    # Record transaction in database
    await db.transactions.insert_one({
        "user_id": request.user_id,
        "card_id": request.card_id,
        "blockchain": request.blockchain,
        "transaction_hash": tx_hash,
        "status": "pending",
        "type": "mint",
        "created_at": datetime.utcnow()
    })
    
    # Update user_cards to mark as minted
    await db.user_cards.update_one(
        {"user_id": request.user_id, "card_id": request.card_id},
        {"$inc": {"quantity": -1}}
    )
    
    # Create NFT record
    nft_id = str(uuid.uuid4())
    await db.nft_cards.insert_one({
        "id": nft_id,
        "card_id": request.card_id,
        "user_id": request.user_id,
        "blockchain": request.blockchain,
        "transaction_hash": tx_hash,
        "status": "pending",
        "created_at": datetime.utcnow()
    })
    
    return {
        "transaction_hash": tx_hash,
        "nft_id": nft_id,
        "status": "pending"
    }
```

### Frontend Integration

The frontend UI will:

1. **Provide Wallet Connection**
   - Support multiple wallet options (MetaMask, Coinbase Wallet, etc.)
   - Display connection status
   - Show owned NFTs

2. **Display NFT Cards**
   - Show special visual effects for NFT-owned cards
   - Provide minting interface
   - Display blockchain verification status

3. **Marketplace Interface**
   - Browse available cards
   - Execute buy/sell/trade operations
   - View transaction history

#### Example Wallet Connection Component

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

const injected = new InjectedConnector({ 
  supportedChainIds: [1, 42161, 56, 137] // Ethereum, Arbitrum, BSC, Polygon
});

const WalletConnection: React.FC = () => {
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [balance, setBalance] = useState("");
  
  useEffect(() => {
    const getBalance = async () => {
      if (active && library && account) {
        const balanceWei = await library.getBalance(account);
        setBalance(ethers.utils.formatEther(balanceWei));
      }
    };
    
    if (active) {
      getBalance();
    }
  }, [active, library, account]);
  
  // …
};    };
    
    if (active) {
      getBalance();
    }
  }, [active, library, account]);
  
  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };
  
  const disconnectWallet = () => {
    deactivate();
  };
  
  return (
    <div className="wallet-connection">
      {active ? (
        <div>
          <div className="account-info">
            <div>Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</div>
            <div>Balance: {parseFloat(balance).toFixed(4)} ETH</div>
          </div>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default WalletConnection;
```

## Etherlink Integration

### Etherlink Benefits

Etherlink provides unique advantages as our primary blockchain solution:

1. **Ethereum Compatibility**
   - Use familiar Ethereum tooling and development experience
   - Support for existing Ethereum wallets
   - Standard ERC-721/ERC-1155 contracts

2. **Tezos Foundation**
   - Lower transaction costs compared to Ethereum mainnet
   - Better scalability for gaming operations
   - Environmental sustainability

3. **Cross-Chain Capabilities**
   - Bridge assets between Ethereum and Tezos
   - Access both ecosystems' marketplaces
   - Flexibility for users with different preferences

### Etherlink-Specific Implementation

```javascript
// Etherlink provider setup
import { ethers } from 'ethers';

const getEtherlinkProvider = () => {
  // Etherlink RPC endpoints
  const mainnetRpc = 'https://mainnet.etherlink.com';
  const testnetRpc = 'https://testnet.etherlink.com';
  
  // Use testnet for development
  const rpcUrl = process.env.NODE_ENV === 'production' ? mainnetRpc : testnetRpc;
  
  return new ethers.providers.JsonRpcProvider(rpcUrl);
};

// Contract deployment to Etherlink
const deployToEtherlink = async (signer) => {
  const factory = new ethers.ContractFactory(
    CrisisUnleashedCards.abi,
    CrisisUnleashedCards.bytecode,
    signer
  );
  
  const contract = await factory.deploy();
  await contract.deployed();
  
  console.log(`Contract deployed to Etherlink at address: ${contract.address}`);
  return contract;
};
```

## Gas Optimization Strategies

To minimize transaction costs, we'll implement:

1. **Batch Transactions**
   - Combine multiple operations in a single transaction
   - Reduce per-transaction overhead

2. **Lazy Minting**
   - Create on-chain assets only when needed
   - Use signatures to verify ownership until minting

3. **Off-Chain Metadata**
   - Store large data (images, animations) on IPFS
   - Keep on-chain data minimal and focused

4. **State Channel Integration**
   - Process repeated transactions off-chain
   - Settle final state on-chain

## Security Considerations

### Smart Contract Security

1. **Auditing Process**
   - Multiple independent contract audits
   - Bug bounty program for security researchers
   - Formal verification for critical functions

2. **Security Patterns**
   - Re-entrancy protection
   - Integer overflow checks
   - Access control via role-based permissions
   - Emergency pause functionality

3. **Wallet Security**
   - Client-side signing only
   - Never store private keys
   - Secure connection methods

### Example Security Implementation

```solidity
// Access control with roles
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CrisisUnleashedRoles is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }
    
    // Modifier to restrict function access to specific roles
    modifier onlyRole(bytes32 role) {
        require(hasRole(role, msg.sender), "Caller doesn't have required role");
        _;
    }
    
    // Functions that can only be called by minters
    function mintCard(...) external onlyRole(MINTER_ROLE) {
        // Implementation
    }
    
    // Functions that can only be called by admins
    function setBaseURI(...) external onlyRole(ADMIN_ROLE) {
        // Implementation
    }
}
```

## Implementation Roadmap

### Phase 1: Foundation (Month 1-2)

1. **Contract Development**
   - Develop and test core NFT contracts
   - Create test environment on Etherlink testnet
   - Implement wallet connection on frontend

2. **Asset Management**
   - Set up IPFS integration for metadata
   - Create metadata schema for cards
   - Develop asset verification system

### Phase 2: Core Functionality (Month 3-4)

1. **Minting System**
   - Implement card minting API
   - Create minting UI in game client
   - Set up transaction monitoring service

2. **NFT Display**
   - Add NFT visual indicators in game
   - Show ownership status
   - Implement NFT card inspection view

### Phase 3: Marketplace (Month 5-6)

1. **Trading Platform**
   - Develop marketplace contracts
   - Create trading UI
   - Implement offer/counteroffer system

2. **Transaction Management**
   - Build transaction history view
   - Create notification system for transactions
   - Implement fee structure

### Phase 4: Advanced Features (Month 7+)

1. **Tournament Integration**
   - Implement verifiable tournament results
   - Create exclusive NFT rewards
   - Develop leaderboard with blockchain verification

2. **Cross-Chain Operations**
   - Add support for Ethereum mainnet
   - Implement Solana integration
   - Create asset bridge when needed

## Monitoring and Analytics

To ensure optimal performance and track blockchain interactions:

1. **Transaction Monitoring**
   - Track pending transaction status
   - Alert on failed transactions
   - Monitor gas prices for optimal timing

2. **User Analytics**
   - Track NFT ownership distribution
   - Monitor marketplace activity
   - Analyze mint/trade patterns

3. **System Health**
   - Monitor blockchain node connection status
   - Track API performance metrics
   - Alert on synchronization issues

## Future Considerations

As blockchain technology evolves, we plan to explore:

1. **Layer 2 Solutions**
   - Integration with zkRollups for scaling
   - Optimistic rollups for lower costs
   - Dedicated gaming sidechains

2. **Governance Token**
   - Community governance for game decisions
   - Staking rewards for tournament participation
   - DAO structure for community-driven development

3. **Interoperability**
   - Cross-game NFT functionality
   - Integration with NFT aggregators
   - Metaverse presence for assets
