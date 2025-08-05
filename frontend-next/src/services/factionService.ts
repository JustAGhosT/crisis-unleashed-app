import { apiClient, apiRequest } from './api';

export interface Faction {
  id: string;
  name: string;
  description: string;
  color: string;
  logo: string;
  bannerImage?: string;
  mechanics?: string[];
  lore?: string;
  playstyle?: string;
  difficulty?: number;
}

/**
 * Fetches all factions
 */
export function fetchFactions() {
  return apiRequest<Faction[]>(() => 
    apiClient.get('/factions')
  );
}

/**
 * Fetches a faction by its ID
 */
export function fetchFactionById(id: string) {
  return apiRequest<Faction>(() => 
    apiClient.get(`/factions/${id}`)
  );
}

/**
 * Fetches faction statistics
 */
export function fetchFactionStats(factionId: string) {
  return apiRequest<{
    winRate: number;
    pickRate: number;
    popularCards: string[];
    matchups: Record<string, number>;
  }>(() => 
    apiClient.get(`/factions/${factionId}/stats`)
  );
}