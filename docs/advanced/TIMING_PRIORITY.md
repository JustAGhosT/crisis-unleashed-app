# Timing & Priority System

## Priority Order

1. **Start of Turn/Phase Triggers**
   - Turn start effects
   - Card draw
   - Power generation

2. **Fast Effects (Play Order)**
   - Active player's effects first, then opponent's
   - Within each player's effects, controller chooses order

3. **Combat Damage**
   - First Strike/Quick Attack damage
   - Regular combat damage
   - Last Strike damage (if applicable)

4. **End of Turn/Phase Triggers**
   - "End of turn" effects
   - Cleanup (discard to hand size, remove temporary effects)

## Stack System

1. When a card or ability is played, it goes on the stack
2. Players get priority to respond (starting with the active player)
3. When both players pass priority, the top item resolves
4. After resolution, players get priority again

## Example Sequence

```text
Player A plays "Fireball" (3 damage to target unit)
  -> Priority passes to Player B
  -> Player B plays "Counterspell"
     -> Priority passes to Player A
     -> Player A passes
     -> "Counterspell" resolves, countering "Fireball"
  -> Stack is now empty
```

## Simultaneous Triggers

- If multiple effects would trigger at the same time:
  1. The active player's effects go on the stack first
  2. Then the non-active player's effects
  3. Each player chooses the order of their own effects

## Response Windows

- After any action, the opponent gets a chance to respond
- Effects that say "when" or "whenever" create response windows
- Players must pass priority with an empty stack to move to the next phase
