# Combat Resolution System

## Game Tiers

### Tier 1: Basic (Levels 1-4)

- **Grid**: 3 lanes × 1 row
- **Focus**: Core mechanics
- **Units**: Basic melee and ranged units
- **Rules**:
  - All units attack the opposing unit in their lane
  - No positioning requirements
  - Simplified keywords (Attack, Health, Taunt)
- **Unlock**: Available from start

### Tier 2: Intermediate (Levels 5-9)

- **Grid**: 3 lanes × 2 rows (Front/Back)
- **New Features**:
  - Front row: Melee units, can block
  - Back row: Ranged/Support, can't be attacked while front row stands
- **New Keywords**:
  - **Ranged**: Can attack from back row
  - **Taunt**: Must be attacked first in lane
- **Unlock**: Reach Level 5

### Tier 3: Advanced (Level 10+)

- **Grid**: 3 lanes × 3 rows (Front/Mid/Back)
- **New Features**:
  - Mid-row: Skirmishers, can attack front or mid
  - Back-row: Artillery, can attack mid or back
- **New Keywords**:
  - **Flank**: Can attack adjacent lanes
  - **Snipe**: Can target back row
- **Unlock**: Reach Level 10, complete "Tactical Mastery" challenge

## Combat Flow

### Tier 1 (Basic)

1. **Combat Phase**
   - Units deal damage to opposite unit
   - Excess damage is lost

### Tiers 2 & 3 (Intermediate/Advanced)

1. **Combat Phase Begins**
   - All combat happens simultaneously
   - Effects that trigger "before combat" resolve first

2. **Damage Calculation**
   - Units deal damage equal to their Power
   - Damage is dealt to the unit directly opposite in the lane
   - If no unit is opposite, damage goes to the player's Hero

3. **Lane Resolution**
   - Compare total Power on each side of the lane
   - The side with higher total Power wins the lane
   - Lane winner gains 1 Momentum

## Combat Keywords

- **Quick Attack**: Deals damage before regular combat
- **Toughness X**: Reduces incoming damage by X
- **Overwhelm**: Excess damage is dealt to the opposing Hero
- **Lifesteal**: Heals your Hero for damage dealt

## Example Combats

### Tier 1 Example

```plaintext
Player A's Lane:

- Warrior (3/2)

Player B's Lane:

- Rogue (2/1)

Resolution:

- Warrior deals 3 to Rogue (destroyed)
- Rogue deals 2 to Warrior (3/2 → 1/2)
- Player A wins lane

```

### Tier 2 Example

```plaintext
Player A's Lane:
[Front] Tank (1/4) [Taunt]
[Back]  Archer (2/1) [Ranged]

Player B's Lane:
[Front] Warrior (3/2)
[Back]  Healer (1/2)

Resolution:

1. Warrior must attack Tank (due to Taunt)
2. Warrior (3) vs Tank (1/4 → 1/1)
3. Archer (2) can shoot over Tank, hits Healer (destroyed)
4. Lane Power Calculation:
   - Player A: Tank (1) + Archer (2) = 3 total power
   - Player B: Warrior (3) + Healer (0, destroyed) = 3 total power
5. Tiebreaker Check:
   - Both sides have 3 power
   - Both have front-row presence (Tank and Warrior)
   - No other tiebreaker conditions apply
6. Result: Lane is a draw (no lane advantage gained)
```

**Tiebreaker Rules:**

1. Compare total power in lane (sum of all unit attack values)
2. If equal, check for front-row presence (units with Taunt or highest health)
3. If still equal, lane is a draw (no advantage gained)

### Tier 3 Example

```plaintext
Player A's Lane:
[Front] Knight (2/3) [Taunt]
[Mid]   Ranger (2/2) [Flank]
[Back]  Cannon (3/1) [Snipe]

Player B's Lane:
[Front] Brute (3/3)
[Mid]   Mage (2/2)
[Back]  Healer (1/3)

Resolution:

1. Cannon snipes Healer (destroyed)
2. Ranger flanks to hit adjacent lane
3. Knight blocks Brute
4. Player A wins with superior positioning

```
