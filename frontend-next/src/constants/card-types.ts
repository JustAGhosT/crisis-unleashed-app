export const CardType = {
  All: 'all',
  Hero: 'hero',
  Unit: 'unit',
  Action: 'action',
  Structure: 'structure',
} as const;

export type CardTypeValue = typeof CardType[keyof typeof CardType];

export const CardTab = {
  All: 'all',
  Heroes: 'heroes',
  Units: 'units',
  Actions: 'actions',
  Structures: 'structures',
  Favorites: 'favorites',
} as const;

export type CardTabValue = typeof CardTab[keyof typeof CardTab];

// Mapping from tab value to card type value (null when not applicable)
export const CardTabToType: Record<CardTabValue, CardTypeValue | null> = {
  [CardTab.All]: CardType.All,
  [CardTab.Heroes]: CardType.Hero,
  [CardTab.Units]: CardType.Unit,
  [CardTab.Actions]: CardType.Action,
  [CardTab.Structures]: CardType.Structure,
  [CardTab.Favorites]: null,
};
