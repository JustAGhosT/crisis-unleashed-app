import { apiClient, apiRequest } from './api';

export interface GameStatus {
  online: boolean;
  playerCount: number;
  serverVersion: string;
  maintenance: boolean;
  nextMaintenanceDate?: string;
}

export interface GameStats {
  totalGames: number;
  activePlayers: number;
  popularFactions: Array<{
    id: string;
    name: string;
    usagePercentage: number;
  }>;
}

/**
 * Fetches the current game server status
 */
export function fetchGameStatus() {
  return apiRequest<GameStatus>(() => 
    apiClient.get('/game/status')
  );
}

/**
 * Fetches game statistics
 */
export function fetchGameStats() {
  return apiRequest<GameStats>(() => 
    apiClient.get('/game/stats')
  );
}

/**
 * Fetches matchmaking status
 */
export function fetchMatchmakingStatus(playerId: string) {
  return apiRequest<{
    inQueue: boolean;
    estimatedWaitTime?: number;
    queuePosition?: number;
  }>(() => 
    apiClient.get(`/matchmaking/status/${playerId}`)
  );
}