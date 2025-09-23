"""
Faction types and mechanics for Crisis Unleashed backend
"""
from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class EnergyMechanics:
    """Mechanics for energy manipulation faction abilities.

    Manages energy generation efficiency, capacity bonuses, and predictive algorithm capabilities.
    This faction specializes in optimizing energy usage and predicting energy needs.

    Args:
        predictive_algorithms: Enables prediction-based energy optimization and bonuses
        max_energy_bonus: Additional maximum energy capacity beyond base amount
        energy_efficiency_multiplier: Cost reduction multiplier for energy expenditure
    """
    predictive_algorithms: bool
    max_energy_bonus: int
    energy_efficiency_multiplier: float


@dataclass
class StealthMechanics:
    """Mechanics for stealth operations and information warfare capabilities.

    Manages cloaking systems, reconnaissance tools, and detection avoidance.
    This faction specializes in covert operations and intelligence gathering.

    Args:
        cloak_level: Intensity of cloaking effects (0-10 scale)
        info_warfare_tools: Available information warfare toolkit capabilities
        detection_evasion_bonus: Passive bonus to avoid enemy detection systems
    """
    cloak_level: int
    info_warfare_tools: List[str]
    detection_evasion_bonus: float


@dataclass
class MindControlMechanics:
    """Mechanics for neural manipulation and psychological influence.

    Manages telepathic control systems, influence range, and target resistance mechanics.
    This faction specializes in direct mental manipulation and crowd control.

    Args:
        control_range: Maximum effective range for mind control abilities (in battlefield units)
        resist_chance: Base probability that targets successfully resist control attempts (0.0-1.0)
    """
    control_range: int
    resist_chance: float


@dataclass
class TimeManipulationMechanics:
    """Mechanics for temporal distortion and chronological control.

    Manages time rewind capabilities, temporal cost modifications, and chronological advantages.
    This faction specializes in manipulating the flow of time during combat.

    Args:
        rewind_turns: Maximum number of turns that can be reversed or undone
        cost_reduction: Percentage reduction applied to costs when using time manipulation (0.0-1.0)
    """
    rewind_turns: int
    cost_reduction: float


@dataclass
class GrowthMechanics:
    """Mechanics for evolutionary adaptation and organic development.

    Manages biological evolution stages, adaptation rates, and organic growth systems.
    This faction specializes in evolutionary responses and adaptive development.

    Args:
        max_growth_stages: Maximum evolutionary stages units can progress through
        adaptation_speed: Multiplier affecting how quickly adaptation occurs in response to threats
    """
    max_growth_stages: int
    adaptation_speed: float


@dataclass
class SacrificeMechanics:
    """Mechanics for high-risk sacrifice and reward amplification systems.

    Manages resource sacrifice mechanics, risk assessment, and reward multipliers.
    This faction specializes in trading immediate losses for amplified future gains.

    Args:
        risk_reward_multiplier: Multiplier applied to rewards when making sacrifices (typically > 1.0)
        sacrifice_options: Available types of sacrificial actions (e.g., ['units', 'energy', 'territory'])
    """
    risk_reward_multiplier: float
    sacrifice_options: List[str]


@dataclass
class SyntheticDirectiveMechanics:
    """Mechanics for artificial intelligence directives and mechanical assimilation.

    Manages AI-driven assimilation processes, directive adaptability, and self-replication systems.
    This faction specializes in mechanical optimization and autonomous unit reproduction.

    Args:
        self_replication: Enables autonomous unit duplication and mechanical reproduction
        assimilation_rate: Speed at which synthetic units convert or absorb other units (0.0-1.0)
        directive_flexibility: Adaptability of AI directives to changing battlefield conditions (0.0-1.0)
    """
    self_replication: bool
    assimilation_rate: float
    directive_flexibility: float


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
