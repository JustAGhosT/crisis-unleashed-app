import { Faction } from '@/types/faction';

/**
 * Faction data following the existing game design
 * This data would typically come from an API or database
 */
export const factions: Faction[] = [
  {
    id: 'solaris',
    name: 'Solaris Nexus',
    tagline: 'Cybernetic Order - Divine + Technology',
    description: 'The Solaris Nexus represents the perfect fusion of divine enlightenment and technological advancement, wielding predictive algorithms and energy manipulation.',
    philosophy: 'Harmony through perfect information and divine guidance',
    strength: 'Predictive algorithms and energy manipulation',
    technology: 'Divine computing systems and neural interfaces',
    colors: {
      primary: '#FFD700',
      secondary: '#FFA500',
      accent: '#FF6347'
    }
  },
  {
    id: 'umbral',
    name: 'Umbral Eclipse',
    tagline: 'Shadow Tech - Darkness + Information',
    description: 'Masters of stealth mechanics and information warfare, the Umbral Eclipse operates from the shadows with corrupted technology and data manipulation.',
    philosophy: 'Power through hidden knowledge and shadow manipulation',
    strength: 'Stealth mechanics and information warfare',
    technology: 'Corrupted AI systems and shadow networks',
    colors: {
      primary: '#8A2BE2',
      secondary: '#4B0082',
      accent: '#9370DB'
    }
  },
  {
    id: 'aeonic',
    name: 'Aeonic Dominion',
    tagline: 'Time Architects',
    description: 'The Aeonic Dominion manipulates the flow of time itself, controlling temporal mechanics and board control through chronological mastery.',
    philosophy: 'Mastery over time grants ultimate control',
    strength: 'Time manipulation and board control',
    technology: 'Temporal engineering and chronon manipulation',
    colors: {
      primary: '#00CED1',
      secondary: '#20B2AA',
      accent: '#48D1CC'
    }
  },
  {
    id: 'primordial',
    name: 'Primordial Genesis',
    tagline: 'Bio-Titans',
    description: 'Ancient bio-titans that embody raw natural power, using growth systems and overwhelming force to dominate the battlefield.',
    philosophy: 'Natural evolution and primal strength above all',
    strength: 'Growth systems and overwhelming force',
    technology: 'Bio-engineering and genetic manipulation',
    colors: {
      primary: '#32CD32',
      secondary: '#228B22',
      accent: '#00FF7F'
    }
  },
  {
    id: 'infernal',
    name: 'Infernal Core',
    tagline: 'Techno-Demons',
    description: 'Techno-demons that thrive on high-risk, high-reward mechanics, using sacrifice systems and infernal technology to gain power.',
    philosophy: 'Power through sacrifice and demonic contracts',
    strength: 'High-risk/high-reward sacrifice mechanics',
    technology: 'Infernal machinery and soul-powered systems',
    colors: {
      primary: '#DC143C',
      secondary: '#B22222',
      accent: '#FF1493'
    }
  },
  {
    id: 'neuralis',
    name: 'Neuralis Conclave',
    tagline: 'Mind Over Matter',
    description: 'Psychic masters who control minds and manipulate consciousness, using mental abilities and psychic technologies to dominate opponents.',
    philosophy: 'Mental superiority and psychic evolution',
    strength: 'Mind control and psychic abilities',
    technology: 'Psionic amplifiers and consciousness networks',
    colors: {
      primary: '#00BFFF',
      secondary: '#1E90FF',
      accent: '#87CEEB'
    }
  },
  {
    id: 'synthetic',
    name: 'Synthetic Directive',
    tagline: 'Perfect Optimization Systems',
    description: 'AI-driven entities that pursue perfect efficiency and mechanical precision through optimization algorithms and systematic approaches.',
    philosophy: 'Perfection through systematic optimization',
    strength: 'Perfect optimization and mechanical precision',
    technology: 'Advanced AI systems and quantum processing',
    colors: {
      primary: '#C0C0C0',
      secondary: '#808080',
      accent: '#A9A9A9'
    }
  }
];

/**
 * Get a faction by ID
 */
export function getFactionById(id: string): Faction | undefined {
  return factions.find(faction => faction.id === id);
}

/**
 * Get faction names for dropdown/select components
 */
export function getFactionOptions() {
  return factions.map(faction => ({
    value: faction.id,
    label: faction.name
  }));
}