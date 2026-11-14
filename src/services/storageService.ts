import { OutpostStructure } from '../types/outpost';
import { Mission } from '../types/mission';

const STORAGE_KEY = 'marsbound_saved_game_state_v1';

export interface SavedGameState {
  version: number;
  discoveredIds: string[];
  collectedSamples: {
    id: string;
    discoveryId: string;
    sampleName: string;
    timestamp: string;
    sol: number;
    notes: string;
  }[];
  mission: Mission;
  structures: OutpostStructure[];
  sol: number;
  suitOxygen: number;
  suitBattery: number;
  playerPosition: { x: number; y: number; z: number };
}

export class StorageService {
  public static load(): SavedGameState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.version === 'number') {
        return parsed as SavedGameState;
      }
      return null;
    } catch {
      console.warn('StorageService: Failed to parse saved state, resetting.');
      return null;
    }
  }

  public static save(state: SavedGameState): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.warn('StorageService: Failed to save game state', e);
      return false;
    }
  }

  public static clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}
