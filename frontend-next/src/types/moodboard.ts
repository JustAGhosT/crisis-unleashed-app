import { type FactionKey } from "../lib/theme/faction-theme";

export type VisualElement = {
  name: string;
  description: string;
  iconUrl?: string;
  cssClass: string;
};

export type ColorPaletteItem = {
  name: string;
  hex: string;
  description: string;
};

export type TypographyExample = {
  name: string;
  description: string;
  cssClass: string;
  example: string;
};

export type IconographyItem = {
  name: string;
  description: string;
  iconUrl?: string;
  cssClass: string;
};

export type VisualTreatment = {
  name: string;
  description: string;
  imageUrl?: string;
  cssClass: string;
};

export type DesignExample = {
  type: string;
  imageUrl: string;
  description: string;
};

export type MoodBoardData = {
  factionId: FactionKey;
  tagline: string;
  visualElements: VisualElement[];
  colorPalette: ColorPaletteItem[];
  typography: TypographyExample[];
  iconography: IconographyItem[];
  visualTreatments: VisualTreatment[];
  examples: DesignExample[];
};
