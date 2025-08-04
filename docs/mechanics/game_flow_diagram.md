# Crisis Unleashed - Game Flow Diagram

This document provides a visual representation of the game flow in Crisis Unleashed, showing the turn structure, player actions, and how Crisis cards influence gameplay.

## Core Game Flow

```mermaid
flowchart TD
    start[Game Start] --> setup[Setup Phase]
    setup --> p1turn[Player 1 Turn]
    
    %% Turn Structure
    p1turn --> draw1[Draw Phase]
    draw1 --> deploy1[Deployment Phase]
    deploy1 --> action1[Action Phase]
    action1 --> combat1[Combat Phase]
    combat1 --> end1[End Phase]
    
    %% Player 2 Turn
    end1 --> p2turn[Player 2 Turn]
    p2turn --> draw2[Draw Phase]
    draw2 --> deploy2[Deployment Phase]
    deploy2 --> action2[Action Phase]
    action2 --> combat2[Combat Phase]
    combat2 --> end2[End Phase]
    
    %% Round End and Crisis
    end2 --> roundEnd{Round End?}
    roundEnd -- Yes --> crisisReveal[Reveal New Crisis Card]
    crisisReveal --> newRound[New Round]
    newRound --> p1turn
    
    roundEnd -- No --> p1turn
    
    %% Win Conditions
    roundEnd -- Victory Achieved --> checkWin{Win Condition Met?}
    checkWin -- Hero Defeat --> gameEnd[Game End]
    checkWin -- Deck Out --> gameEnd
    checkWin -- Ultimate Victory --> gameEnd
    
    %% Styling
    classDef phase fill:#f9f,stroke:#333,stroke-width:2px
    classDef action fill:#bbf,stroke:#333,stroke-width:1px
    classDef decision fill:#ff9,stroke:#333,stroke-width:2px
    
    class draw1,draw2,deploy1,deploy2,action1,action2,combat1,combat2,end1,end2 phase
    class setup,crisisReveal action
    class roundEnd,checkWin decision
```

## Detailed Phase Breakdown

### Setup Phase

```mermaid
flowchart TD
    setup[Setup Phase] --> shuffle[Shuffle Decks]
    shuffle --> initial[Initial Card Draw]
    initial --> crisis[Reveal First Crisis Card]
    crisis --> resources[Set Starting Resources]
    resources --> ready[Ready to Begin]
    
    classDef step fill:#bbf,stroke:#333,stroke-width:1px
    class setup,shuffle,initial,crisis,resources,ready step
```

### Player Turn Phases

```mermaid
flowchart TD
    begin[Turn Begins] --> drawPhase[Draw Phase]
    
    %% Draw Phase
    drawPhase --> drawChar[Draw Character Card]
    drawChar --> drawAction[Draw Action Card]
    drawAction --> applyEffects1[Apply Draw Effects]
    
    %% Deployment Phase
    applyEffects1 --> deployPhase[Deployment Phase]
    deployPhase --> spendPower[Spend Power]
    spendPower --> placeUnits[Place Units in Lanes]
    placeUnits --> positioning[Optimize Positioning]
    
    %% Action Phase
    positioning --> actionPhase[Action Phase]
    actionPhase --> playAction[Play Action Cards]
    playAction --> activate[Activate Abilities]
    activate --> resolveActions[Resolve Effects]
    
    %% Combat Phase
    resolveActions --> combatPhase[Combat Phase]
    combatPhase --> declareAttacks[Declare Attacks]
    declareAttacks --> resolveSkirmishes[Resolve Lane Battles]
    resolveSkirmishes --> calculateDamage[Calculate Damage]
    calculateDamage --> applyEffects2[Apply Combat Effects]
    
    %% End Phase
    applyEffects2 --> endPhase[End Phase]
    endPhase --> momentum[Tally Momentum]
    momentum --> resetPower[Reset Unused Power]
    resetPower --> cleanup[End of Turn Effects]
    cleanup --> end[Turn Ends]
    
    classDef phase fill:#f9f,stroke:#333,stroke-width:2px
    classDef action fill:#bbf,stroke:#333,stroke-width:1px
    
    class drawPhase,deployPhase,actionPhase,combatPhase,endPhase phase
    class drawChar,drawAction,applyEffects1,spendPower,placeUnits,positioning,playAction,activate,resolveActions,declareAttacks,resolveSkirmishes,calculateDamage,applyEffects2,momentum,resetPower,cleanup action
```

### Crisis Card Influence

```mermaid
flowchart TD
    crisis[Crisis Card Revealed] --> global[Apply Global Effects]
    global --> resources[Modify Resource Generation]
    global --> combat[Alter Combat Rules]
    global --> abilities[Change Ability Interactions]
    global --> victory[Modify Victory Conditions]
    
    resources --> duration{Effect Duration?}
    combat --> duration
    abilities --> duration
    victory --> duration
    
    duration -- One Round --> expire[Effects Expire at Round End]
    duration -- Multiple Rounds --> persist[Effects Persist Until Specified]
    duration -- Permanent --> permanent[Effects Last Until Game End]
    
    classDef effect fill:#bbf,stroke:#333,stroke-width:1px
    classDef decision fill:#ff9,stroke:#333,stroke-width:2px
    
    class crisis,global,resources,combat,abilities,victory effect
    class duration decision
```

## Win Condition Flowchart

```mermaid
flowchart TD
    checkWin[Check Win Conditions] --> heroHP{Hero HP = 0?}
    heroHP -- Yes --> defeat[Hero Defeat Victory]
    
    heroHP -- No --> deckOut{Deck Empty?}
    deckOut -- Yes --> exhaustion[Deck Exhaustion Victory]
    
    deckOut -- No --> ultimate{Ultimate Activated?}
    ultimate -- Yes --> ultimateVictory[Ultimate Victory]
    
    ultimate -- No --> continue[Continue Game]
    
    defeat --> matchWin{Match Victory?}
    exhaustion --> matchWin
    ultimateVictory --> matchWin
    
    matchWin -- Need More Wins --> newRound[Next Round]
    matchWin -- Match Won --> gameEnd[Game End]
    
    classDef condition fill:#ff9,stroke:#333,stroke-width:2px
    classDef outcome fill:#9f9,stroke:#333,stroke-width:1px
    
    class heroHP,deckOut,ultimate,matchWin condition
    class defeat,exhaustion,ultimateVictory,continue,newRound,gameEnd outcome
```

## Battlefield Layout and Movement

```mermaid
graph TD
    subgraph "Player 2 Side"
    P2F1[Front Lane 1] --- P2F2[Front Lane 2] --- P2F3[Front Lane 3]
    P2M1[Mid Lane 1] --- P2M2[Mid Lane 2] --- P2M3[Mid Lane 3]
    P2B1[Back Lane 1] --- P2B2[Back Lane 2] --- P2B3[Back Lane 3]
    
    P2F1 --- P2M1
    P2F2 --- P2M2
    P2F3 --- P2M3
    
    P2M1 --- P2B1
    P2M2 --- P2B2
    P2M3 --- P2B3
    end
    
    subgraph "Neutral Zone"
    Crisis[Current Crisis Card]
    end
    
    subgraph "Player 1 Side"
    P1F1[Front Lane 1] --- P1F2[Front Lane 2] --- P1F3[Front Lane 3]
    P1M1[Mid Lane 1] --- P1M2[Mid Lane 2] --- P1M3[Mid Lane 3]
    P1B1[Back Lane 1] --- P1B2[Back Lane 2] --- P1B3[Back Lane 3]
    
    P1F1 --- P1M1
    P1F2 --- P1M2
    P1F3 --- P1M3
    
    P1M1 --- P1B1
    P1M2 --- P1B2
    P1M3 --- P1B3
    end
    
    P2B1 -.- P1F1
    P2B2 -.- P1F2
    P2B3 -.- P1F3
    
    classDef front fill:#f99,stroke:#333
    classDef mid fill:#ff9,stroke:#333
    classDef back fill:#9f9,stroke:#333
    classDef neutral fill:#99f,stroke:#333
    
    class P1F1,P1F2,P1F3,P2F1,P2F2,P2F3 front
    class P1M1,P1M2,P1M3,P2M1,P2M2,P2M3 mid
    class P1B1,P1B2,P1B3,P2B1,P2B2,P2B3 back
    class Crisis neutral
```

## Resource Management

```mermaid
flowchart TD
    turn[Turn Start] --> generatePower[Generate Power]
    generatePower --> spendPower[Spend Power]
    
    spendPower --> playCards[Play Cards]
    spendPower --> activateAbilities[Activate Abilities]
    
    playCards --> powerLeft{Power Left?}
    activateAbilities --> powerLeft
    
    powerLeft -- Yes --> continue[Continue Turn]
    powerLeft -- No --> endPower[End Power Spending]
    
    continue --> spendPower
    
    %% Momentum Generation
    endPower --> combatPhase[Combat Phase]
    combatPhase --> winSkirmish[Win Skirmishes]
    winSkirmish --> gainMomentum[Gain Momentum]
    
    gainMomentum --> useMomentum[Use Momentum]
    useMomentum --> heroSkill[Activate Hero Skills]
    useMomentum --> emergencyDraw[Emergency Card Draw]
    
    classDef resource fill:#bbf,stroke:#333,stroke-width:1px
    classDef action fill:#9f9,stroke:#333,stroke-width:1px
    classDef decision fill:#ff9,stroke:#333,stroke-width:2px
    
    class generatePower,spendPower,gainMomentum,useMomentum resource
    class playCards,activateAbilities,endPower,combatPhase,winSkirmish,heroSkill,emergencyDraw action
    class powerLeft decision
```

## How to Use This Document

These diagrams can be integrated into your documentation in several ways:

1. **Include in the Game Rules documentation** to provide visual explanations of turn structure
2. **Reference in Tutorial Design** to help new players understand game flow
3. **Use in Digital Implementation** to guide UI development
4. **Include in Quick Start Guide** for new players

The diagrams use Mermaid.js syntax, which is compatible with GitHub Markdown and many documentation platforms. To render these diagrams:

- In GitHub: The diagrams will render automatically in GitHub markdown
- In documentation sites: Ensure Mermaid.js support is enabled
- For print: Export the rendered diagrams as images

## Implementation Notes

To ensure these diagrams stay current with game rules:

1. Update this document whenever turn structure or crisis card mechanics change
2. Ensure all referenced mechanics match the current rule definitions
3. Consider creating specialized diagrams for complex interactions

---

*Last Updated: 2025-08-01*
