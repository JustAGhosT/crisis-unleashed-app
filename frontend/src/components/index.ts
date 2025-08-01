// Re-export all components from their respective files
export { default as Battlefield } from '@/features/battlefield/Battlefield';
export { default as CardHand } from '@/features/cards/CardHand';
export { default as GameInterface } from '@/components/game/GameInterface';
export { default as OpponentHand } from '@/features/players/OpponentHand';
export { default as PlayerHUD } from '@/features/players/PlayerHUD';
export { default as TurnManager } from '@/features/battlefield/TurnManager';

// Export types
export type { Card, CardRarity, PlayerId, BattlefieldUnit, Unit, Commander, Structure } from '@/types/game.types';
