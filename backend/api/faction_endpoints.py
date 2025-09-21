from fastapi import APIRouter
from typing import List

router = APIRouter()

MOCK_FACTIONS = [
    {
        "id": "solaris",
        "name": "Solaris Nexus",
        "description": "Masters of energy manipulation.",
        "mechanics": {
            "energy_manipulation": {
                "max_energy_bonus": 2,
                "energy_efficiency_multiplier": 1.2,
                "predictive_algorithms": True,
            }
        },
    },
    {
        "id": "umbral",
        "name": "Umbral Syndicate",
        "description": "Stealth and information warfare.",
        "mechanics": {
            "stealth": {
                "cloak_level": 4,
                "info_warfare_tools": ["infiltration", "signal-jamming"],
                "detection_evasion_bonus": 0.35,
            }
        },
    },
    {
        "id": "neuralis",
        "name": "Neuralis Conclave",
        "description": "Experts in mind control.",
        "mechanics": {
            "mind_control": {
                "control_range": 3,
                "resist_chance": 0.2,
            }
        },
    },
    {
        "id": "aeonic",
        "name": "Aeonic Concord",
        "description": "Agents of time manipulation.",
        "mechanics": {
            "time_manipulation": {
                "rewind_turns": 1,
                "cost_reduction": 0.1,
            }
        },
    },
    {
        "id": "primordial",
        "name": "Primordial",
        "description": "Growth and adaptation incarnate.",
        "mechanics": {
            "growth_adaptation": {
                "max_growth_stages": 5,
                "adaptation_speed": 1.3,
            }
        },
    },
    {
        "id": "infernal",
        "name": "Infernal Pact",
        "description": "Sacrifice and risk-reward.",
        "mechanics": {
            "sacrifice_risk_reward": {
                "risk_reward_multiplier": 2.5,
                "sacrifice_options": ["hp", "cards"],
            }
        },
    },
    {
        "id": "synthetic-directive",
        "name": "Synthetic Directive",
        "description": "Masters of assimilation and self-replication.",
        "mechanics": {
            "synthetic_directive": {
                "assimilation_rate": 1.4,
                "directive_flexibility": 0.95,
                "self_replication": True,
            }
        },
    },
]


@router.get("/factions")
async def get_factions() -> List[dict]:
    """
    Get all canonical factions with mechanics.
    """
    return MOCK_FACTIONS
