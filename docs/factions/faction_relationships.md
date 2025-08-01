graph TD
    %% Core Conflicts (Red)
    SN[Solaris Nexus] -- "Purge Corruption\n(Strong vs Umbral)" --> UE[Umbral Eclipse]
    UE -- "Shadow Strike\n(Strong vs Aeonic)" --> AD[Aeonic Dominion]
    AD -- "Temporal Lock\n(Strong vs Primordial)" --> PG[Primordial Genesis]
    PG -- "Nature's Wrath\n(Strong vs Infernal)" --> IC[Infernal Core]
    IC -- "Corrupting Touch\n(Strong vs Solaris)" --> SN

    %% Secondary Alliances (Blue)
    SN -- "Temporal Accord" <--> AD
    UE -- "Dark Pact" <--> IC
    AD -- "Ancient Pact" <--> NC[Neuralis Conclave]
    PG -- "Natural Balance" <--> NC
    IC -- "Forbidden Knowledge" <--> NC

    %% Neutral Relationships (Grey)
    NC -. "Neutral Observer" .-> SN & UE & AD & PG & IC

    %% Faction Styling
    classDef solaris fill:#ffcc00,color:black,stroke:#333,stroke-width:2px
    classDef umbral fill:#6600cc,color:white,stroke:#333,stroke-width:2px
    classDef aeonic fill:#00ccff,color:black,stroke:#333,stroke-width:2px
    classDef primordial fill:#33cc33,color:black,stroke:#333,stroke-width:2px
    classDef infernal fill:#cc0000,color:white,stroke:#333,stroke-width:2px
    classDef neuralis fill:#9933ff,color:white,stroke:#333,stroke-width:2px

    class SN solaris
    class UE umbral
    class AD aeonic
    class PG primordial
    class IC infernal
    class NC neuralis

    %% Legend
    subgraph Legend
        direction TB
        Conflict[Conflict]:::infernal
        Alliance[Alliance]:::solaris
        Neutral[Neutral]:::neuralis
    end

