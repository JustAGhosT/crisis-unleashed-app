"""
Faction types and mechanics for Crisis Unleashed backend
"""
from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class EnergyMechanics:
    """Mechanics related to energy generation and efficiency.

    - max_energy_bonus: Additional maximum energy capacity.
    - energy_efficiency_multiplier: Multiplier applied to energy costs.
    - predictive_algorithms: When True, unlocks prediction-based bonuses.
    """

    max_energy_bonus: int = 0
    energy_efficiency_multiplier: float = 1.0
    predictive_algorithms: bool


@dataclass
class StealthMechanics:
    """Mechanics for stealth and information warfare.

    - cloak_level: Strength of cloaking effects.
    - info_warfare_tools: Toolkit names available to the faction.
    - detection_evasion_bonus: Flat bonus to evasion checks.
    """

    cloak_level: int = 0
    info_warfare_tools: List[str] = field(default_factory=list)
    detection_evasion_bonus: float = 0.0


@dataclass
class MindControlMechanics:
    """Mechanics for mind control influence and resistance.

    - control_range: Maximum range for control effects.
    - resist_chance: Base chance targets resist control.
    """

    control_range: int = 0
    resist_chance: float = 0.0


@dataclass
class TimeManipulationMechanics:
    """Mechanics for time-based manipulation.

    - rewind_turns: Number of turns that can be rewound.
    - cost_reduction: Reduction applied to time-shifted costs.
    """

    rewind_turns: int = 0
    cost_reduction: float = 0.0


@dataclass
class GrowthMechanics:
    """Mechanics for growth and adaptation.

    - max_growth_stages: Maximum growth steps.
    - adaptation_speed: Speed multiplier for adaptations.
    """

    max_growth_stages: int = 1
    adaptation_speed: float = 1.0


@dataclass
class SacrificeMechanics:
    """Mechanics for risk/reward sacrifice systems.

    - risk_reward_multiplier: Scales rewards for sacrifices.
    - sacrifice_options: Allowed sacrifice actions.
    """

    risk_reward_multiplier: float = 1.0
    sacrifice_options: List[str] = field(default_factory=list)


@dataclass
class SyntheticDirectiveMechanics:
    """Mechanics for synthetic directives and assimilation.

    - assimilation_rate: Rate synthetic units absorb others.
    - directive_flexibility: Flexibility of directive changes.
    - self_replication: When True, enables replication behavior.
    """

    assimilation_rate: float = 0.0
    directive_flexibility: float = 0.0
    self_replication: bool


@dataclass
class FactionMechanics:
    energy_manipulation: Optional[EnergyMechanics] = None
    stealth: Optional[StealthMechanics] = None
    mind_control: Optional[MindControlMechanics] = None
    time_manipulation: Optional[TimeManipulationMechanics] = None
    growth_adaptation: Optional[GrowthMechanics] = None
    sacrifice_risk_reward: Optional[SacrificeMechanics] = None
    synthetic_directive: Optional[SyntheticDirectiveMechanics] = None


@dataclass
class Faction:
    id: str
    name: str
    description: str
    mechanics: FactionMechanics = field(default_factory=FactionMechanics)
