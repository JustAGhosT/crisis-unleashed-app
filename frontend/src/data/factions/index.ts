import { Faction } from '@/types/game.types';
import { MoodBoardData } from '../types/MoodBoardTypes';
import { solarisMoodBoardData } from './solarisMoodBoardData';
import { umbralMoodBoardData } from './umbralMoodBoardData';

// Import other faction data as they're created
// import { neuralisMoodBoardData } from './neuralisMoodBoardData';
// import { aeonicMoodBoardData } from './aeonicMoodBoardData';
// etc.

// Create a map of all mood board data
export const moodBoardData: Record<Faction, MoodBoardData> = {
  solaris: solarisMoodBoardData,
  umbral: umbralMoodBoardData,
  synthetic: {
    factionId: 'synthetic',
    tagline: "Optimization & Mechanical Perfection",
    visualElements: [],
    colorPalette: [],
    typography: [],
    iconography: [],
    visualTreatments: [],
    examples: []
  },
  neuralis: {
    factionId: 'neuralis',
    tagline: "Mind & Consciousness Exploration",
    visualElements: [],
    colorPalette: [],
    typography: [],
    iconography: [],
    visualTreatments: [],
    examples: []
  },
  aeonic: {
    factionId: 'aeonic',
    tagline: "Time Manipulation & Temporal Mastery",
    visualElements: [],
    colorPalette: [],
    typography: [],
    iconography: [],
    visualTreatments: [],
    examples: []
  },
  infernal: {
    factionId: 'infernal',
    tagline: "Dimensional Power & Blood Sacrifice",
    visualElements: [],
    colorPalette: [],
    typography: [],
    iconography: [],
    visualTreatments: [],
    examples: []
  },
  primordial: {
    factionId: 'primordial',
    tagline: "Evolutionary Growth & Biological Harmony",
    visualElements: [],
    colorPalette: [],
    typography: [],
    iconography: [],
    visualTreatments: [],
    examples: []
  }
};

// Helper function to get mood board data by faction
export const getMoodBoardData = (faction: Faction): MoodBoardData => {
  return moodBoardData[faction];
};