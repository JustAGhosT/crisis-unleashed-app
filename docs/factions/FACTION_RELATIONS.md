# Faction Relationships

This document outlines the complex relationships between the six major factions in Crisis Unleashed. Understanding these dynamics is crucial for strategic gameplay and narrative development.

## Core Conflicts

### Solaris Nexus vs. Umbral Eclipse

**Nature**: Ideological War
**Concept Strength**: ★★★★★ (Core to demo experience)
**Mechanics**:

- Solaris cards gain +1/+1 when targeting Umbral units

- Umbral cards cost 1 less when played against Solaris units

- Special dialogue triggers when these factions face each other

### Aeonic Dominion vs. Primordial Genesis

**Nature**: Temporal Paradox
**Concept Strength**: ★★★★☆
**Mechanics**:

- Time manipulation effects are 25% stronger against Primordial units

- Primordial units gain +2 Attack when destroying Time-based effects

### Infernal Core vs. All

**Nature**: Corrupting Influence
**Concept Strength**: ★★★★☆
**Mechanics**:

- Infernal cards have special interactions with all factions

- Each faction has unique dialogue when facing Infernal forces

## Alliance Web

```mermaid
graph TD
    subgraph "Allied Factions"
        SN[Solaris Nexus] <--> AD[Aeonic Dominion]
        UE[Umbral Eclipse] <--> IC[Infernal Core]
        PG[Primordial Genesis] <--> NC[Neuralis Conclave]
    end

    subgraph "Primary Conflicts"
        SN -- "Purge Corruption" --> UE
        AD -- "Temporal Lock" --> PG
        IC -- "Corrupting Touch" --> SN
        %% Option A – connect individually
        NC -- "Neutral Observer" --> SN
        NC -- "Neutral Observer" --> UE
        NC -- "Neutral Observer" --> AD
        NC -- "Neutral Observer" --> PG
        NC -- "Neutral Observer" --> IC
        %% Option B – or declare a collective node
        ALL[All Factions]
        NC -- "Neutral Observer" --> ALL
    end```

## Detailed Faction Relationships

### Solaris Nexus (Cybernetic Order)

**Core Philosophy**: "Perfect order through technological unity"

#### Allied Relations

- **Aeonic Dominion** (65% Cooperation)

  - *Shared Values*: Order, control, long-term planning

  - *Synergy*: Temporal prediction + Divine algorithms

  - *Tension*: Methods (technology vs. cosmic power)

#### Neutral Relations

- **Neuralis Conclave** (50% Neutral)

  - *Shared Values*: Collective consciousness, systematic thinking

  - *Conflict*: Divine authority vs. mental democracy

#### Hostile Relations

- **Infernal Core** (25% Hostility - Primary Enemy)

  - *Fundamental Conflict*: Order vs. Chaos, Creation vs. Destruction

  - *Battlefield Dynamic*: Shields vs. Overwhelming damage

- **Umbral Eclipse** (35% Hostility)

  - *Core Conflict*: Transparency vs. Secrecy, Truth vs. Hidden knowledge

- **Primordial Genesis** (40% Hostility)

  - *Philosophical Divide*: Artificial perfection vs. Natural evolution

[Additional faction relationships truncated for brevity - see individual faction pair pages for complete details]

## Demo Priority Interactions

### 1. Solaris Nexus (Priority: ★★★★★)

- **Allies**: Aeonic Dominion

- **Enemies**: Umbral Eclipse (Primary), Infernal Core

- **Neutral**: Primordial Genesis, Neuralis Conclave

### 2. Umbral Eclipse (Priority: ★★★★★)

- **Allies**: Infernal Core

- **Enemies**: Solaris Nexus (Primary), Aeonic Dominion

- **Neutral**: Primordial Genesis, Neuralis Conclave

## Faction-Specific Mechanics

### Solaris Nexus

- **Holy Fire**: +2 damage against Umbral and Infernal units

- **Divine Shield**: First instance of damage each turn is reduced to 1

### Umbral Eclipse

- **Shadowmeld**: Can't be targeted by abilities the turn it's played

- **Data Theft**: Steal 1 random card from opponent's hand when dealing combat damage

## Narrative Hooks

1. **The Great Schism**: Solaris and Umbral were once united, but split over AI rights
2. **Temporal Wars**: Aeonic agents constantly try to prevent Primordial evolution
3. **Infernal Bargains**: Every faction has members who've made deals with Infernal forces
4. **Neuralis Conclave**: Secretly manipulating all factions toward an unknown goal

## Mechanical Interactions

### Rock-Paper-Scissors Dynamics

#### Primary Triangle

- **Solaris Nexus** > **Infernal Core** > **Aeonic Dominion** > **Solaris Nexus**

  - Order counters Chaos, Chaos disrupts Control, Control predicts Order

#### Secondary Triangle

- **Neuralis Conclave** > **Umbral Eclipse** > **Primordial Genesis** > **Neuralis Conclave**

  - Unity counters Secrets, Secrets exploit Nature, Nature overwhelms Mind

### Synergy Bonuses

- **Allied Factions**: +10% damage when fighting together

- **Neutral Factions**: Standard interactions

- **Hostile Factions**: -5% damage when forced to cooperate

### Cross-Faction Deck Building

- **Allied Pairs**: Can include up to 50% cards from allied faction

- **Neutral Pairs**: Can include up to 25% cards from neutral faction

- **Hostile Pairs**: Can include up to 10% cards from hostile faction (corruption/infiltration theme)

## Narrative Campaign Structure

### Act I: The Fracture

- All factions discover the multiverse crisis

- Initial conflicts establish relationships

- Tutorial campaigns for each faction

### Act II: The Alliance Wars

- Allied factions form coalitions

- Major battles between faction groups

### Act III: The Convergence

- Ultimate threat requires all factions

- Temporary alliances between enemies

- Final resolution of multiverse crisis

## Balance Considerations

- Each faction has 2-3 hard counters in the roster

- No single faction should have more than 60% win rate against any other

- All faction abilities should have clear counterplay options

