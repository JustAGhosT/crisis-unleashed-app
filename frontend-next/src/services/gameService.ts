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

export interface MatchmakingStatus {
  inQueue: boolean;
  estimatedWaitTime?: number;
  queuePosition?: number;
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
 * @param playerId The ID of the player to check status for
 * @returns Promise with the player's matchmaking status
 * @throws Error if playerId is empty or invalid
 */
export function fetchMatchmakingStatus(playerId: string): Promise<MatchmakingStatus> {
  const safeId = encodeURIComponent(playerId.trim());
  if (!safeId) {
    return Promise.reject(new Error('playerId is required'));
  }
  
  return apiRequest<MatchmakingStatus>(() => 
    apiClient.get(`/matchmaking/status/${safeId}`)
  );
}