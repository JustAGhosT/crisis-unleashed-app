# Hero Abilities System

## Hero Card Structure

Each Hero has:

- **Health**: 20-30 points (varies by Hero)
- **Passive Ability**: Always active effect
- **Ultimate Skill**: Powerful ability requiring Momentum
- **Faction Synergy**: Bonus when paired with matching faction units

## Ability Design Guidelines

### Passive Abilities

- Should provide consistent value but not be game-winning alone
- Examples:
  - "Allied Warriors gain +1 Power"
  - "Draw an extra card during your first turn each round"
  - "Your first Action card each turn costs 1 less"

### Ultimate Skills

- Cost: 2-4 Momentum
- Should be impactful but not game-ending
- Examples:
  - **Void Rift** (3 Momentum): Swap two units, then stun them for 1 turn
  - **Inspiring Charge** (2 Momentum): Give +2/+2 to all units in a lane until end of turn
  - **Time Warp** (4 Momentum): Take another turn after this one

## Hero Examples

### The Ironclad (Warrior)

- **Health**: 25
- **Passive**: When you play a Warrior, give it +1/+0
- **Ultimate** (3 Momentum): Deal 3 damage to all enemies in a lane

### The Archmage (Mage)

- **Health**: 20
- **Passive**: Your first spell each turn costs 1 less
- **Ultimate** (4 Momentum): Draw 3 cards, then discard 2 cards

### The Shadowblade (Rogue)

- **Health**: 22
- **Passive**: When this Hero would take damage, 25% chance to prevent 1 damage
- **Ultimate** (2 Momentum): Deal 2 damage to any target, then return this to your hand (costs 1 more Momentum each use)
