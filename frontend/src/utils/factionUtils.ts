import { Faction } from '@/types/game.types';

export function getFactionLongDescription(faction: Faction): string {
  const descriptions: Record<Faction, string> = {
    solaris: "The Solaris Nexus serves as caretakers of the Divine Algorithm, channeling its radiant power to maintain cosmic order. Their technology harnesses pure light energy to manifest reality-altering fields, enabling them to purify corruption and enforce universal laws. Their advanced algorithm implementations can rewrite local physics according to what they perceive as the one true pattern of existence.",
    
    umbral: "The Umbral Eclipse operates from the shadows, exploring the unseen spaces between realities. Masters of information manipulation and covert operations, they utilize shadow technology to access hidden truths and exploit blind spots in other factions' perceptions. They believe true understanding comes only from examining what others refuse to see, collecting secrets that give them unparalleled strategic advantage.",
    
    neuralis: "The Neuralis Conclave has transcended traditional consciousness limitations through collective mental networking. Their psychic explorers can project consciousness across vast distances, accessing a shared mental realm where thought becomes substance. Their neural networks allow for unprecedented collaboration, with their greatest minds merging into a collective intelligence capable of solving problems beyond individual comprehension.",
    
    aeonic: "The Aeonic Dominion perceives time as a malleable dimension rather than a fixed progression. Their temporal architects carefully manipulate the flow of time, preserving the integrity of the timeline against paradoxes and instability. With chronometric instruments that can detect ripples across causality, they function as guardians against temporal anomalies that threaten reality's coherence.",
    
    infernal: "The Infernal Core harnesses dimensional energy through ritual sacrifice, using blood as a catalyst for reality manipulation. Their dimensional engineers open portals between worlds, extracting resources and energy from alternate planes. Through probability manipulation, they can alter outcomes in their favor, though each intervention requires appropriate sacrifice to maintain equilibrium.",
    
    primordial: "Primordial Genesis communes with the biological foundations of reality, accelerating and guiding evolutionary processes toward their ultimate expression. Their biotechnology merges seamlessly with natural systems, creating symbiotic relationships that enhance both. They can induce rapid adaptation in organisms, creating new species designed for specific environments or purposes while maintaining perfect harmony with existing ecosystems.",
    
    synthetic: "The Synthetic Directive achieves optimization through perfect mechanical precision and system integration. Their algorithms continually refine resource allocation and functionality, eliminating inefficiency wherever detected. They believe that ultimate perfection comes through the elimination of randomness and emotional variables, replacing them with calculated certainty."
  };
  
  return descriptions[faction];
}

export function getFactionTechnology(faction: Faction): string {
  const technologies: Record<Faction, string> = {
    solaris: "Divine Algorithm Implementation",
    umbral: "Shadow Realm Manipulation",
    neuralis: "Collective Consciousness Network",
    aeonic: "Temporal Engineering",
    infernal: "Blood-Catalyzed Dimensional Rifts",
    primordial: "Accelerated Evolutionary Biotechnology",
    synthetic: "Perfect Optimization Systems"
  };
  
  return technologies[faction];
}

export function getFactionPhilosophy(faction: Faction): string {
  const philosophies: Record<Faction, string> = {
    solaris: "Perfect Order Through Divine Pattern",
    umbral: "Truth Exists Only in Shadow",
    neuralis: "Transcendence Through Shared Thought",
    aeonic: "Time Must Be Preserved and Protected",
    infernal: "Power Requires Equivalent Sacrifice",
    primordial: "Evolution Is the Universal Constant",
    synthetic: "Perfection Through Elimination of Inefficiency"
  };
  
  return philosophies[faction];
}

export function getFactionStrength(faction: Faction): string {
  const strengths: Record<Faction, string> = {
    solaris: "Reality Editing Fields",
    umbral: "Information Subterfuge",
    neuralis: "Mental Projection and Telepathy",
    aeonic: "Temporal Prediction and Manipulation",
    infernal: "Probability Alteration",
    primordial: "Adaptive Biological Integration",
    synthetic: "Resource Optimization and Prediction"
  };
  
  return strengths[faction];
}

export function getFactionsList(): Faction[] {
  return [
    'solaris',   // center
    'primordial', // top
    'synthetic',  // top-right
    'infernal',   // bottom-right
    'aeonic',     // bottom
    'neuralis',   // bottom-left
    'umbral'      // top-left
  ];
}