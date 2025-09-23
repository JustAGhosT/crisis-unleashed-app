"""
Test Data Factory for Crisis Unleashed

Provides comprehensive test data generation with realistic game content,
user data, and consistent fixtures for testing all game mechanics.
"""

import random
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Literal
from dataclasses import dataclass, field
from faker import Faker

fake = Faker()

# Game-specific data constants
FACTIONS = [
    "Solaris Nexus", "Umbral Eclipse", "Aeonic Dominion",
    "Primordial Genesis", "Infernal Core", "Neuralis Conclave", "Synthetic Directive"
]

CARD_TYPES = ["hero", "unit", "action", "structure"]
RARITIES = ["common", "uncommon", "rare", "epic", "legendary"]

FACTION_THEMES = {
    "Solaris Nexus": {
        "keywords": ["energy", "prediction", "efficiency", "light", "solar"],
        "mechanics": ["Energy manipulation", "Predictive algorithms", "Efficiency multipliers"]
    },
    "Umbral Eclipse": {
        "keywords": ["shadow", "stealth", "infiltration", "darkness", "hidden"],
        "mechanics": ["Cloaking", "Information warfare", "Shadow tactics"]
    },
    "Aeonic Dominion": {
        "keywords": ["time", "temporal", "chronos", "eternity", "moment"],
        "mechanics": ["Time manipulation", "Turn rewinding", "Cost reduction"]
    },
    "Primordial Genesis": {
        "keywords": ["growth", "nature", "evolution", "adaptation", "organic"],
        "mechanics": ["Staged growth", "Adaptation speed", "Natural selection"]
    },
    "Infernal Core": {
        "keywords": ["sacrifice", "inferno", "risk", "reward", "hellfire"],
        "mechanics": ["Risk/reward multipliers", "Sacrifice options", "Infernal power"]
    },
    "Neuralis Conclave": {
        "keywords": ["mind", "control", "psychic", "neural", "consciousness"],
        "mechanics": ["Mind control", "Control range", "Resistance mechanics"]
    },
    "Synthetic Directive": {
        "keywords": ["mechanical", "assimilate", "synthetic", "machine", "directive"],
        "mechanics": ["Assimilation", "Self-replication", "Mechanical optimization"]
    }
}

@dataclass
class TestUser:
    """Test user data structure."""
    id: str
    username: str
    email: str
    password_hash: str
    role: str = "user"
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    is_active: bool = True
    preferences: Dict[str, Any] = field(default_factory=dict)

@dataclass
class TestCard:
    """Test card data structure."""
    id: str
    name: str
    description: str
    cost: int
    power: Optional[int]
    health: Optional[int]
    type: str
    rarity: str
    faction: str
    abilities: List[str]
    image_url: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)

@dataclass
class TestDeck:
    """Test deck data structure."""
    id: str
    name: str
    description: str
    cards: List[Dict[str, Any]]  # [{"card_id": str, "quantity": int}]
    factions: List[str]
    owner_id: str
    is_public: bool = False
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

@dataclass
class TestGame:
    """Test game data structure."""
    id: str
    players: List[str]  # User IDs
    status: str
    current_turn: int
    game_state: Dict[str, Any]
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

class TestDataFactory:
    """
    Factory class for generating test data with realistic content.

    Provides methods to create users, cards, decks, games, and other
    game entities with proper relationships and constraints.
    """

    def __init__(self, seed: Optional[int] = None):
        """Initialize factory with optional seed for reproducible tests."""
        if seed is not None:
            fake.seed_instance(seed)
            random.seed(seed)

    def create_user(
        self,
        username: Optional[str] = None,
        email: Optional[str] = None,
        role: str = "user",
        is_active: bool = True,
        **kwargs
    ) -> TestUser:
        """Create a test user with realistic data."""
        user_id = str(uuid.uuid4())

        if not username:
            username = fake.user_name() + str(random.randint(1000, 9999))

        if not email:
            email = fake.email()

        return TestUser(
            id=user_id,
            username=username,
            email=email,
            password_hash=fake.sha256(),
            role=role,
            is_active=is_active,
            preferences={
                "theme": random.choice(["light", "dark", "auto"]),
                "notifications": random.choice([True, False]),
                "preferred_factions": random.sample(FACTIONS, k=random.randint(1, 3))
            },
            **kwargs
        )

    def create_card(
        self,
        card_type: Optional[str] = None,
        faction: Optional[str] = None,
        rarity: Optional[str] = None,
        **kwargs
    ) -> TestCard:
        """Create a test card with thematically appropriate content."""
        card_id = str(uuid.uuid4())

        if not card_type:
            card_type = random.choice(CARD_TYPES)

        if not faction:
            faction = random.choice(FACTIONS)

        if not rarity:
            rarity = random.choice(RARITIES)

        faction_theme = FACTION_THEMES[faction]
        keywords = faction_theme["keywords"]
        mechanics = faction_theme["mechanics"]

        # Generate thematic name
        name_parts = [
            random.choice(keywords).title(),
            random.choice(["Guardian", "Warrior", "Mage", "Scout", "Assassin", "Engineer"])
        ]
        name = " ".join(name_parts)

        # Generate description based on faction theme
        description = f"A {card_type} from {faction} that embodies {random.choice(mechanics).lower()}. "
        description += fake.sentence(nb_words=random.randint(10, 20))

        # Set stats based on card type and rarity
        cost = self._generate_cost(card_type, rarity)
        power, health = self._generate_stats(card_type, rarity)

        # Generate abilities
        abilities = self._generate_abilities(card_type, faction_theme, rarity)

        return TestCard(
            id=card_id,
            name=name,
            description=description,
            cost=cost,
            power=power,
            health=health,
            type=card_type,
            rarity=rarity,
            faction=faction,
            abilities=abilities,
            image_url=f"https://example.com/cards/{card_id}.jpg",
            **kwargs
        )

    def create_deck(
        self,
        owner_id: str,
        card_pool: Optional[List[TestCard]] = None,
        factions: Optional[List[str]] = None,
        is_valid: bool = True,
        **kwargs
    ) -> TestDeck:
        """Create a test deck with valid card composition."""
        deck_id = str(uuid.uuid4())

        if not factions:
            factions = random.sample(FACTIONS, k=random.randint(1, 2))

        if not card_pool:
            # Create a pool of cards from the selected factions
            card_pool = []
            for faction in factions:
                for _ in range(20):  # 20 cards per faction
                    card_pool.append(self.create_card(faction=faction))

        # Build deck with valid constraints
        deck_cards = self._build_valid_deck(card_pool, factions, is_valid)

        deck_name = self._generate_deck_name(factions)
        description = f"A {'/'.join(factions)} deck focusing on {random.choice(['aggression', 'control', 'combo', 'midrange'])} strategies."

        return TestDeck(
            id=deck_id,
            name=deck_name,
            description=description,
            cards=deck_cards,
            factions=factions,
            owner_id=owner_id,
            is_public=random.choice([True, False]),
            **kwargs
        )

    def create_game(
        self,
        player_ids: List[str],
        status: str = "in_progress",
        **kwargs
    ) -> TestGame:
        """Create a test game with realistic game state."""
        game_id = str(uuid.uuid4())

        if len(player_ids) < 2:
            raise ValueError("Game requires at least 2 players")

        # Generate realistic game state
        game_state = {
            "turn_count": random.randint(1, 20),
            "current_player": random.choice(player_ids),
            "phase": random.choice(["draw", "main", "combat", "end"]),
            "players": {
                player_id: {
                    "health": random.randint(15, 30),
                    "energy": random.randint(0, 10),
                    "momentum": random.randint(0, 5),
                    "hand_size": random.randint(3, 7),
                    "board_units": random.randint(0, 6)
                }
                for player_id in player_ids
            },
            "battlefield": {
                "zones": ["frontline", "backline", "neutral"],
                "unit_positions": {}
            }
        }

        return TestGame(
            id=game_id,
            players=player_ids,
            status=status,
            current_turn=game_state["turn_count"],
            game_state=game_state,
            **kwargs
        )

    def _generate_cost(self, card_type: str, rarity: str) -> int:
        """Generate appropriate cost for card type and rarity."""
        base_costs = {
            "hero": (3, 7),
            "unit": (1, 6),
            "action": (0, 4),
            "structure": (2, 5)
        }

        rarity_modifiers = {
            "common": 0,
            "uncommon": 0,
            "rare": 1,
            "epic": 1,
            "legendary": 2
        }

        min_cost, max_cost = base_costs[card_type]
        modifier = rarity_modifiers[rarity]

        return random.randint(min_cost, max_cost) + modifier

    def _generate_stats(self, card_type: str, rarity: str) -> tuple[Optional[int], Optional[int]]:
        """Generate power and health stats for card type and rarity."""
        if card_type not in ["hero", "unit"]:
            return None, None

        rarity_multipliers = {
            "common": 1.0,
            "uncommon": 1.1,
            "rare": 1.3,
            "epic": 1.5,
            "legendary": 1.8
        }

        multiplier = rarity_multipliers[rarity]

        if card_type == "hero":
            base_power = random.randint(4, 8)
            base_health = random.randint(15, 25)
        else:  # unit
            base_power = random.randint(1, 6)
            base_health = random.randint(1, 8)

        power = int(base_power * multiplier)
        health = int(base_health * multiplier)

        return power, health

    def _generate_abilities(self, card_type: str, faction_theme: Dict, rarity: str) -> List[str]:
        """Generate thematic abilities for a card."""
        abilities = []
        mechanics = faction_theme["mechanics"]
        keywords = faction_theme["keywords"]

        # Number of abilities based on rarity
        ability_counts = {
            "common": (0, 1),
            "uncommon": (1, 2),
            "rare": (1, 3),
            "epic": (2, 3),
            "legendary": (2, 4)
        }

        min_abilities, max_abilities = ability_counts[rarity]
        num_abilities = random.randint(min_abilities, max_abilities)

        ability_templates = [
            f"When played, gain {random.randint(1, 3)} {random.choice(keywords)}",
            f"{random.choice(mechanics)}: {fake.sentence(nb_words=6)}",
            f"Passive: {random.choice(['Double', 'Triple', 'Reduce'])} {random.choice(keywords)} effects",
            f"On death: {fake.sentence(nb_words=8)}",
            f"Battle cry: {fake.sentence(nb_words=10)}",
            f"{random.choice(keywords).title()} mastery: {fake.sentence(nb_words=12)}"
        ]

        for _ in range(num_abilities):
            abilities.append(random.choice(ability_templates))

        return abilities

    def _build_valid_deck(
        self,
        card_pool: List[TestCard],
        factions: List[str],
        is_valid: bool = True
    ) -> List[Dict[str, Any]]:
        """Build a deck following game rules."""
        deck_cards = []

        # Filter cards by faction
        available_cards = [card for card in card_pool if card.faction in factions]

        target_size = 50 if is_valid else random.randint(20, 70)  # Valid decks are 30-50 cards

        # Ensure at least one hero
        heroes = [card for card in available_cards if card.type == "hero"]
        if heroes and is_valid:
            hero = random.choice(heroes)
            deck_cards.append({"card_id": hero.id, "quantity": 1})
            available_cards.remove(hero)

        # Add other cards
        while len(deck_cards) < target_size and available_cards:
            card = random.choice(available_cards)

            # Check if card already in deck
            existing = next((dc for dc in deck_cards if dc["card_id"] == card.id), None)

            if existing:
                max_copies = 1 if card.rarity == "legendary" else 3
                if existing["quantity"] < max_copies:
                    existing["quantity"] += 1
            else:
                deck_cards.append({"card_id": card.id, "quantity": 1})

            # Remove card from pool if we can't add more
            if existing and existing["quantity"] >= (1 if card.rarity == "legendary" else 3):
                available_cards.remove(card)

        return deck_cards

    def _generate_deck_name(self, factions: List[str]) -> str:
        """Generate a thematic deck name."""
        if len(factions) == 1:
            faction = factions[0]
            theme_word = random.choice(FACTION_THEMES[faction]["keywords"])
            return f"{theme_word.title()} {random.choice(['Dominance', 'Mastery', 'Control', 'Aggression'])}"
        else:
            return f"{'/'.join(factions)} {random.choice(['Hybrid', 'Fusion', 'Alliance', 'Coalition'])}"

    def create_test_dataset(
        self,
        num_users: int = 10,
        num_cards: int = 100,
        num_decks: int = 30,
        num_games: int = 15
    ) -> Dict[str, List]:
        """Create a comprehensive test dataset with all entities."""

        # Create users
        users = [self.create_user() for _ in range(num_users)]
        user_ids = [user.id for user in users]

        # Create cards
        cards = [self.create_card() for _ in range(num_cards)]

        # Create decks
        decks = []
        for _ in range(num_decks):
            owner_id = random.choice(user_ids)
            deck = self.create_deck(owner_id=owner_id, card_pool=cards)
            decks.append(deck)

        # Create games
        games = []
        for _ in range(num_games):
            player_ids = random.sample(user_ids, k=2)
            game = self.create_game(player_ids=player_ids)
            games.append(game)

        return {
            "users": users,
            "cards": cards,
            "decks": decks,
            "games": games
        }

    def create_blockchain_test_data(self) -> Dict[str, List]:
        """Create test data specifically for blockchain operations."""
        return {
            "transactions": [
                {
                    "id": str(uuid.uuid4()),
                    "type": "mint_card",
                    "card_id": str(uuid.uuid4()),
                    "owner_address": fake.hexify(text="0x" + "^" * 40, upper=False),
                    "transaction_hash": fake.hexify(text="0x" + "^" * 64, upper=False),
                    "block_number": random.randint(1000000, 2000000),
                    "gas_used": random.randint(50000, 200000),
                    "status": random.choice(["pending", "confirmed", "failed"]),
                    "created_at": datetime.utcnow() - timedelta(days=random.randint(0, 30))
                }
                for _ in range(50)
            ],
            "nfts": [
                {
                    "token_id": str(random.randint(1, 10000)),
                    "card_id": str(uuid.uuid4()),
                    "owner_address": fake.hexify(text="0x" + "^" * 40, upper=False),
                    "contract_address": "0x1234567890abcdef1234567890abcdef12345678",
                    "metadata_uri": f"https://api.crisisunleashed.com/metadata/{uuid.uuid4()}",
                    "rarity_encoded": random.randint(0, 4),
                    "minted_at": datetime.utcnow() - timedelta(days=random.randint(0, 100))
                }
                for _ in range(200)
            ]
        }

# Convenience functions for common test scenarios
def create_test_user(**kwargs) -> TestUser:
    """Create a single test user."""
    factory = TestDataFactory()
    return factory.create_user(**kwargs)

def create_test_card(**kwargs) -> TestCard:
    """Create a single test card."""
    factory = TestDataFactory()
    return factory.create_card(**kwargs)

def create_test_deck(owner_id: str, **kwargs) -> TestDeck:
    """Create a single test deck."""
    factory = TestDataFactory()
    return factory.create_deck(owner_id=owner_id, **kwargs)

def create_minimal_dataset() -> Dict[str, List]:
    """Create a minimal dataset for basic testing."""
    factory = TestDataFactory(seed=42)  # Deterministic for consistent tests
    return factory.create_test_dataset(
        num_users=3,
        num_cards=20,
        num_decks=5,
        num_games=2
    )