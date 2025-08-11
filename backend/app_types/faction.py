"""
Faction types and mechanics for Crisis Unleashed backend
"""
from typing import Optional, List, Dict, Any

class EnergyMechanics:
    max_energy_bonus: int
    energy_efficiency_multiplier: float
    predictive_algorithms: bool

class StealthMechanics:
    cloak_level: int
    info_warfare_tools: List[str]
    detection_evasion_bonus: float

class MindControlMechanics:
    control_range: int
    resist_chance: float

class TimeManipulationMechanics:
    rewind_turns: int
    cost_reduction: float

class GrowthMechanics:
    max_growth_stages: int
    adaptation_speed: float

class SacrificeMechanics:
    risk_reward_multiplier: float
    sacrifice_options: List[str]

class SyntheticDirectiveMechanics:
    assimilation_rate: float
    directive_flexibility: float
    self_replication: bool

class FactionMechanics:
    energy_manipulation: Optional[EnergyMechanics]
    stealth: Optional[StealthMechanics]
    mind_control: Optional[MindControlMechanics]
    time_manipulation: Optional[TimeManipulationMechanics]
    growth_adaptation: Optional[GrowthMechanics]
    sacrifice_risk_reward: Optional[SacrificeMechanics]
    synthetic_directive: Optional[SyntheticDirectiveMechanics]

class Faction:
    id: str
    name: str
    description: str
    mechanics: Dict[str, Any] # or FactionMechanics for more structure