import { Faction } from '@/types/game.types';

export interface VisualElement {
  name: string;
  description: string;
  iconUrl: string;
  cssClass: string;
}

export interface ColorPaletteItem {
  name: string;
  hex: string;
  description: string;
}

export interface TypographyExample {
  name: string;
  description: string;
  cssClass: string;
  example: string;
}

export interface IconographyItem {
  name: string;
  description: string;
  iconUrl: string;
  cssClass: string;
}

export interface VisualTreatment {
  name: string;
  description: string;
  imageUrl: string;
  cssClass: string;
}

export interface DesignExample {
  type: string;
  imageUrl: string;
  description: string;
}

export interface MoodBoardData {
  factionId: Faction;
  tagline: string;
  visualElements: VisualElement[];
  colorPalette: ColorPaletteItem[];
  typography: TypographyExample[];
  iconography: IconographyItem[];
  visualTreatments: VisualTreatment[];
  examples: DesignExample[];
}