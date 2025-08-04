# Stat Balancing Methodology

This document outlines the systematic approach to balancing card and hero statistics in the game, ensuring competitive integrity while maintaining faction identity.

## Table of Contents

1. [Introduction](#introduction)
2. [Fundamental Principles](#fundamental-principles)
3. [Baseline Statistics](#baseline-statistics)
4. [Faction Variance Ranges](#faction-variance-ranges)
5. [Cost-to-Value Formulas](#cost-to-value-formulas)
6. [Effect Valuation](#effect-valuation)
7. [Statistical Testing Methodology](#statistical-testing-methodology)
8. [Balance Adjustment Process](#balance-adjustment-process)
9. [Meta Adaptation Framework](#meta-adaptation-framework)
10. [Specialized Balancing Considerations](#specialized-balancing-considerations)

## Introduction

Statistical balance is the foundation of fair and strategic gameplay. Our balancing methodology uses a combination of mathematical modeling, extensive playtesting, and data analysis to ensure that:

- No single card, hero, or faction dominates the competitive landscape
- Each faction maintains its unique identity and playstyle
- Multiple viable strategies exist within each faction
- New content integrates seamlessly with existing gameplay systems
- The meta can evolve organically while maintaining overall balance

## Fundamental Principles

### Core Balance Pillars

1. **Power Equity**: Similar resources should yield similar overall power
2. **Faction Asymmetry**: Balance through different strengths rather than identical capabilities
3. **Strategic Diversity**: Multiple viable paths to victory
4. **Counterplay Availability**: Every strategy must have potential counters
5. **Skill Expression**: Higher skill should yield better results with the same tools

### Balance vs. Design Goals

Balance decisions always consider three key factors:

- **Mathematical Balance**: Raw statistical efficiency
- **Play Experience**: How the game feels to players
- **Faction Identity**: Preserving the unique nature of each faction

When these factors conflict, we prioritize in this order:

1. Play experience (unfun but balanced is still a failure)
2. Faction identity (factions should maintain their core identity)
3. Mathematical balance (which can be adjusted to serve the above)

## Baseline Statistics

### Unit Statistics Baseline

| Stat | Baseline Value | Standard Deviation | Notes |
|------|----------------|-------------------|-------|
| Attack | 2 | ±1 | Base damage output |
| Health | 3 | ±1 | Base survivability |
| Cost | 3 | ±1 | Resource requirement |
| Movement | 1 | ±0.5 | Mobility range |
| Range | 1 | ±0.5 | Attack reach |

### Hero Statistics Baseline

| Stat | Baseline Value | Standard Deviation | Notes |
|------|----------------|-------------------|-------|
| Attack | 3 | ±1.5 | Hero damage output |
| Health | 5 | ±2 | Hero survivability |
| Energy | 2 | ±1 | Special ability resource |
| Ability Power | 4 | ±2 | Effect magnitude |
| Cooldown | 2 | ±1 | Turns between ability use |

### Action Card Statistics Baseline

| Stat | Baseline Value | Standard Deviation | Notes |
|------|----------------|-------------------|-------|
| Cost | 2 | ±1 | Resource requirement |
| Effect Magnitude | 3 | ±1 | Primary effect strength |
| Duration | 1 | ±1 | Effect persistence (if applicable) |

## Faction Variance Ranges

Each faction has intentional statistical variances that reflect their identity and playstyle:

### Solaris Nexus

- **Attack**: -0.5 from baseline
- **Health**: +1 from baseline
- **Ability Power**: +0.5 from baseline
- **Cost**: Standard
- **Special**: Higher blessing effect magnitude

### Umbral Eclipse

- **Attack**: +0.5 from baseline
- **Health**: -0.5 from baseline
- **Ability Power**: +1 from baseline
- **Cost**: +0.5 from baseline
- **Special**: Corruption effects have extended duration

### Aeonic Dominion

- **Attack**: Standard
- **Health**: Standard
- **Ability Power**: Standard
- **Cost**: -0.5 from baseline
- **Special**: Enhanced delay effects and temporal manipulation

### Primordial Genesis

- **Attack**: Variable (evolution-based)
- **Health**: +1 from baseline
- **Ability Power**: -0.5 for initial effects, scaling up
- **Cost**: Standard
- **Special**: Growth effects have higher scaling potential

### Infernal Core

- **Attack**: +1.5 from baseline
- **Health**: -1 from baseline
- **Ability Power**: +1.5 from baseline
- **Cost**: +1 from baseline
- **Special**: Self-damage effects but higher overall damage output

### Neuralis Conclave

- **Attack**: -0.5 from baseline
- **Health**: Standard
- **Ability Power**: +1 from baseline for control effects
- **Cost**: +0.5 from baseline
- **Special**: Enhanced mind control and prediction effects

### Synthetic Directive

- **Attack**: Standard
- **Health**: +0.5 from baseline
- **Ability Power**: Standard
- **Cost**: -0.5 from baseline for synergy effects
- **Special**: Enhanced upgrade and replication mechanics

## Cost-to-Value Formulas

### Basic Unit Value Formula

The Base Unit Value (BUV) is calculated as:

``` text
BUV = (Attack × 1.0) + (Health × 0.8) + (Movement × 0.7) + (Range × 0.9) + ∑(Ability Values) - Negative Effects
```

### Effect Value Formula

The Effect Value (EV) is calculated as:

``` text
EV = (Magnitude × Effect Coefficient) × (1 + Duration × 0.3) × Target Factor × Condition Factor
```

Where:

- **Effect Coefficient**: Base value of the effect type
- **Target Factor**: Multiplier based on targeting flexibility (self: 0.8, single: 1.0, area: 1.5)
- **Condition Factor**: Multiplier based on activation difficulty (0.7-1.5)

### Cost Assignment Formula

The Energy Cost (EC) is calculated as:

``` text
EC = Total Value ÷ 2.5 (rounded to nearest whole number)
```

With faction modifiers applied afterward.

## Effect Valuation

### Primary Effect Types

| Effect Type | Base Coefficient | Adjustment Factors |
|-------------|-----------------|-------------------|
| Direct Damage | 1.0 | +0.2 for unblockable |
| Healing | 1.2 | -0.3 if self-only |
| Stat Boost | 0.9 per point | +0.3 if permanent |
| Card Draw | 1.5 per card | -0.2 if conditional |
| Resource Gain | 1.8 per point | -0.4 if delayed |
| Unit Creation | 1.0 × unit value | -0.3 if temporary |
| Control Effect | 1.7 | +0.5 if offensive |
| Field Effect | 1.4 | +0.3 × area size |

### Keyword Valuations

| Keyword | Base Value | Scaling Factor |
|---------|------------|---------------|
| Bless | 1.2 | +0.3 per turn duration |
| Corrupt | 1.3 | +0.4 per turn duration |
| Spawn | 1.1 × spawned unit | +0.2 per additional unit |
| Delay | 0.7 | +0.9 when activated |
| Psychic Field | 1.4 | +0.3 per affected unit |
| Mindlink | 1.1 | +0.4 per linked unit |
| Transcend | 2.0 | +1.0 per evolution stage |
| Overload | 1.8 | -0.5 per self-damage point |
| Upgrade | 1.3 | +0.5 if permanent |
| Glitch | 1.5 | -0.4 for unpredictability |

## Statistical Testing Methodology

### Playtesting Frameworks

#### Theoretical Model Testing

- Monte Carlo simulations for probability outcomes
- AI-driven gameplay simulations (minimum 10,000 matches per test)
- Statistical analysis of win rates across all faction matchups

#### Human Playtesting Stages

1. **Designer Testing**: Initial balance verification
2. **Internal Testing**: Structured gameplay with experienced players
3. **Closed Beta**: Limited external testing with data collection
4. **Open Beta**: Large-scale testing with varied skill levels
5. **Live Monitoring**: Ongoing analysis of live play statistics

### Data Collection Points

For each card and hero, we track:

- Usage rate (% of eligible decks)
- Win rate when included
- Win rate when played on different turns
- Synergy rates with other cards
- Counter effectiveness measurements
- Player sentiment metrics

### Statistical Red Flags

We investigate balance issues when a card or hero:

- Exceeds 65% win rate across all matchups
- Appears in >80% of decks for its faction
- Creates non-interactive game states >30% of the time
- Reduces opponent decision tree by >50%
- Consistently ends games before turn 6
- Has <5% representation despite relevant synergies

## Balance Adjustment Process

### Adjustment Cycle

1. **Data Collection**: Gather statistics from all testing sources
2. **Problem Identification**: Isolate specific balance issues
3. **Root Cause Analysis**: Determine underlying mathematical or design causes
4. **Solution Development**: Create multiple adjustment options
5. **Impact Projection**: Model effects of each potential change
6. **Implementation**: Apply the most promising solution
7. **Verification**: Confirm the change achieved desired outcome

### Adjustment Philosophy

We follow these principles when making balance changes:

- **Surgical Precision**: Target specific problems rather than sweeping changes
- **Identity Preservation**: Maintain the core function and feel of cards
- **Gradual Scaling**: Make smaller, iterative changes when possible
- **Compensation Balancing**: Offset nerfs with buffs in other areas
- **Ecosystem Awareness**: Consider ripple effects throughout the meta
- **Readability First**: Prioritize changes that are intuitive to players

### Emergency Intervention Criteria

Immediate balance adjustments are considered when:

- Single strategy win rate exceeds 75% across all skill levels
- Non-interactive combos emerge that win before turn 4
- Critical gameplay bugs create unintended advantages
- Tournament representation shows extreme faction imbalance

## Meta Adaptation Framework

### Meta Evolution Monitoring

We use a dynamic meta model that:

- Tracks deck archetype prevalence over time
- Identifies counter-strategy development
- Measures meta health through diversity metrics
- Predicts emerging problematic combinations

### Planned Meta Shifts

Healthy meta evolution is encouraged through:

- Regular introduction of new counter-mechanics
- Seasonal emphasis on different factions/strategies
- Tournament formats that incentivize diversity
- Subtle balance adjustments that don't invalidate strategies

### Context-Specific Balancing

We maintain separate balance considerations for:

- Casual play
- Ranked competitive play
- Tournament environments
- New player experience

## Specialized Balancing Considerations

### Hero Balancing

Heroes receive additional balancing attention due to their central role:

- Ultimate abilities are valued at 1.5× standard calculations
- Hero progression paths must have equivalent total value
- Each hero must have at least two viable build paths
- Heroes should have clear faction alignment in abilities

### Combo Interaction Balancing

For card combinations and synergies:

- Two-card combos can exceed baseline efficiency by up to 30%
- Three-card combos can exceed baseline efficiency by up to 50%
- Four+ card combos can exceed baseline efficiency by up to 80%
- Any combo exceeding these thresholds receives special review

### New Content Integration

When adding new content:

- All new cards are tested against established meta decks
- Power creep is measured and kept below 5% per release
- Each release maintains the faction identity metrics
- New mechanics undergo extended testing periods

---

This methodology is continuously refined as the game evolves. Balance is not a destination but an ongoing process requiring constant attention, analysis, and adjustment.

Last Updated: 2025-08-01
