export interface FeatureFlags {
  useNewFactionUI: boolean;
  useNewDeckBuilder: boolean;
  useNewCardDisplay: boolean;
  useNewNavigation: boolean;
  useNewTheme: boolean;
  enableAdvancedDeckAnalytics: boolean;
  enableCardAnimations: boolean;
  enableMultiplayerChat: boolean;
  enableTournamentMode: boolean;
  enableAIOpponent: boolean;
  [key: string]: boolean; // Allow for dynamic keys
}