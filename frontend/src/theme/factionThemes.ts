import { Faction } from "@/types/game.types";

export interface FactionTheme {
  id: Faction;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    highlight: string;
    energy: string;
    health: string;
  };
  gradient: string;
  glow: string;
  cardTheme: {
    background: string;
    border: string;
    highlight: string;
    text: string;
  };
  buttonTheme: {
    primary: string;
    hover: string;
    text: string;
  };
}

export const factionThemes: Record<Faction, FactionTheme> = {
  'solaris': {
    id: 'solaris',
    name: 'Solaris Nexus',
    colors: {
      primary: '#FFD700',
      secondary: '#FF8C00',
      accent: '#FF4500',
      background: '#0A0A1A',
      text: '#FFFFFF',
      highlight: '#FFD700',
      energy: '#FFD700',
      health: '#FF6B6B',
    },
    gradient: 'linear-gradient(135deg, #0A0A1A 0%, #1A1A3A 100%)',
    glow: '0 0 15px rgba(255, 215, 0, 0.7)',
    cardTheme: {
      background: 'rgba(10, 10, 26, 0.8)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      highlight: 'rgba(255, 215, 0, 0.1)',
      text: '#FFFFFF',
    },
    buttonTheme: {
      primary: 'rgba(255, 215, 0, 0.9)',
      hover: 'rgba(255, 140, 0, 0.9)',
      text: '#0A0A1A',
    },
  },
  'umbral': {
    id: 'umbral',
    name: 'Umbral Eclipse',
    colors: {
      primary: '#9B59B6',
      secondary: '#8E44AD',
      accent: '#6C3483',
      background: '#0A0A0A',
      text: '#F5F5F5',
      highlight: '#BB8FCE',
      energy: '#9B59B6',
      health: '#E74C3C',
    },
    gradient: 'linear-gradient(135deg, #0A0A0A 0%, #1A0A1A 100%)',
    glow: '0 0 15px rgba(155, 89, 182, 0.7)',
    cardTheme: {
      background: 'rgba(20, 10, 30, 0.85)',
      border: '1px solid rgba(155, 89, 182, 0.4)',
      highlight: 'rgba(155, 89, 182, 0.15)',
      text: '#F5F5F5',
    },
    buttonTheme: {
      primary: 'rgba(142, 68, 173, 0.9)',
      hover: 'rgba(126, 56, 153, 0.9)',
      text: '#FFFFFF',
    },
  },
  'neuralis': {
    id: 'neuralis',
    name: 'Neuralis Conclave',
    colors: {
      primary: '#00CED1',
      secondary: '#20B2AA',
      accent: '#008B8B',
      background: '#001A1A',
      text: '#E0FFFF',
      highlight: '#00FFFF',
      energy: '#00CED1',
      health: '#FF7F50',
    },
    gradient: 'linear-gradient(135deg, #001A1A 0%, #003333 100%)',
    glow: '0 0 15px rgba(0, 206, 209, 0.7)',
    cardTheme: {
      background: 'rgba(0, 20, 20, 0.85)',
      border: '1px solid rgba(0, 206, 209, 0.4)',
      highlight: 'rgba(0, 206, 209, 0.15)',
      text: '#E0FFFF',
    },
    buttonTheme: {
      primary: 'rgba(32, 178, 170, 0.9)',
      hover: 'rgba(0, 139, 139, 0.9)',
      text: '#001A1A',
    },
  },
  'aeonic': {
    id: 'aeonic',
    name: 'Aeonic Dominion',
    colors: {
      primary: '#9370DB',
      secondary: '#8A2BE2',
      accent: '#4B0082',
      background: '#0A0A1A',
      text: '#F0F0FF',
      highlight: '#B19CD9',
      energy: '#9370DB',
      health: '#FF69B4',
    },
    gradient: 'linear-gradient(135deg, #0A0A1A 0%, #1A0A2A 100%)',
    glow: '0 0 15px rgba(147, 112, 219, 0.7)',
    cardTheme: {
      background: 'rgba(15, 10, 30, 0.85)',
      border: '1px solid rgba(147, 112, 219, 0.4)',
      highlight: 'rgba(147, 112, 219, 0.15)',
      text: '#F0F0FF',
    },
    buttonTheme: {
      primary: 'rgba(138, 43, 226, 0.9)',
      hover: 'rgba(123, 38, 201, 0.9)',
      text: '#FFFFFF',
    },
  },
  'infernal': {
    id: 'infernal',
    name: 'Infernal Core',
    colors: {
      primary: '#FF4500',
      secondary: '#DC143C',
      accent: '#8B0000',
      background: '#1A0A0A',
      text: '#FFE4E1',
      highlight: '#FF7F50',
      energy: '#FF4500',
      health: '#DC143C',
    },
    gradient: 'linear-gradient(135deg, #1A0A0A 0%, #3A0A0A 100%)',
    glow: '0 0 15px rgba(255, 69, 0, 0.7)',
    cardTheme: {
      background: 'rgba(30, 10, 10, 0.85)',
      border: '1px solid rgba(255, 69, 0, 0.4)',
      highlight: 'rgba(255, 69, 0, 0.15)',
      text: '#FFE4E1',
    },
    buttonTheme: {
      primary: 'rgba(220, 20, 60, 0.9)',
      hover: 'rgba(200, 0, 40, 0.9)',
      text: '#FFFFFF',
    },
  },
  'primordial': {
    id: 'primordial',
    name: 'Primordial Genesis',
    colors: {
      primary: '#32CD32',
      secondary: '#228B22',
      accent: '#006400',
      background: '#0A1A0A',
      text: '#F0FFF0',
      highlight: '#98FB98',
      energy: '#32CD32',
      health: '#2E8B57',
    },
    gradient: 'linear-gradient(135deg, #0A1A0A 0%, #0A2A0A 100%)',
    glow: '0 0 15px rgba(50, 205, 50, 0.7)',
    cardTheme: {
      background: 'rgba(10, 30, 10, 0.85)',
      border: '1px solid rgba(50, 205, 50, 0.4)',
      highlight: 'rgba(50, 205, 50, 0.15)',
      text: '#F0FFF0',
    },
    buttonTheme: {
      primary: 'rgba(34, 139, 34, 0.9)',
      hover: 'rgba(0, 100, 0, 0.9)',
      text: '#FFFFFF',
    },
  },
};

export const defaultTheme = factionThemes.solaris;

export const getFactionTheme = (faction: Faction): FactionTheme => {
  return factionThemes[faction] || defaultTheme;
};
