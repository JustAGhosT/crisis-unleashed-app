"""
Faction types and mechanics for Crisis Unleashed backend
"""
from dataclasses import dataclass, field
from typing import Optional, List


@dataclass
class EnergyMechanics:
    max_energy_bonus: int = 0
    energy_efficiency_multiplier: float = 1.0
    predictive_algorithms: bool = False


@dataclass
class StealthMechanics:
    cloak_level: int = 0
    info_warfare_tools: List[str] = field(default_factory=list)
    detection_evasion_bonus: float = 0.0


@dataclass
class MindControlMechanics:
    control_range: int = 0
    resist_chance: float = 0.0


@dataclass
class TimeManipulationMechanics:
    rewind_turns: int = 0
    cost_reduction: float = 0.0


@dataclass
class GrowthMechanics:
    max_growth_stages: int = 1
    adaptation_speed: float = 1.0


@dataclass
class SacrificeMechanics:
    risk_reward_multiplier: float = 1.0
    sacrifice_options: List[str] = field(default_factory=list)


@dataclass
class SyntheticDirectiveMechanics:
    assimilation_rate: float = 0.0
    directive_flexibility: float = 0.0
    self_replication: bool = False


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