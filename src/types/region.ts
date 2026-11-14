import { MarsCoordinates, EnvironmentalConditions } from './mars';

export type MarsRegionId = 
  | 'jezero_crater'
  | 'neretva_vallis'
  | 'nili_fossae'
  | 'isidis_planitia'
  | 'syrtis_major';

export interface RegionalEnvironment extends EnvironmentalConditions {
  radiationMsvYear: number;
  stormFrequency: 'low' | 'moderate' | 'high' | 'severe';
  dustRisk: 'low' | 'moderate' | 'high' | 'extreme';
  gravityMs2: number;
}

export interface MarsRegion {
  id: MarsRegionId;
  code: string;
  name: string;
  subtitle: string;
  quadrangle: string; // e.g. "MC-13 Syrtis Major"
  centerCoordinates: MarsCoordinates;
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
  molaDatumElevation: number; // Meters relative to MOLA areoid
  elevationRange: {
    min: number;
    max: number;
  };
  biomeType: 
    | 'paleolake_delta'
    | 'fluvial_canyon'
    | 'tectonic_rift'
    | 'impact_basin'
    | 'volcanic_shield';
  geologicalEra: string; // e.g. "Early Noachian (~3.95 Ga)"
  distanceFromJezeroKm: number;
  bearingFromJezero: string; // e.g. "278° W", "315° NW"
  transitTimeRoverHours: number;
  transitTimeHopperMinutes: number;
  travelDifficulty: 'nominal' | 'moderate' | 'rugged' | 'extreme';
  status: 'active' | 'expedition_ready' | 'survey_pending' | 'orbital_only';
  environmentalProfile: RegionalEnvironment;
  geologicalSummary: string;
  scientificSignificance: string;
  keyGeologicalFeatures: string[];
  keyMissions: string[];
  datasetsUsed: string[];
  discoveryCount: number;
  svgOrbitalCoords: {
    x: number; // percentage in regional map (0-100)
    y: number; // percentage in regional map (0-100)
  };
}

export interface RegionalExpeditionRoute {
  id: string;
  sourceRegionId: MarsRegionId;
  targetRegionId: MarsRegionId;
  name: string;
  distanceKm: number;
  elevationDeltaMeters: number;
  roverTraverseDifficulty: 'low' | 'medium' | 'high' | 'impassable';
  suborbitalFlightViable: boolean;
  requiredRoverBatteryKwh: number;
  requiredOxygenSupplyKg: number;
  hazardWarnings: string[];
}
