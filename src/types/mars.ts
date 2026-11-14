export type EvidenceType = 
  | 'observed' 
  | 'derived' 
  | 'modelled' 
  | 'gameplay_simulation' 
  | 'historical_record';

export type DiscoveryCategory =
  | 'geology'
  | 'geography'
  | 'spacecraft'
  | 'atmosphere'
  | 'surface_processes'
  | 'subsurface_science'
  | 'astronomy'
  | 'human_systems';

export interface MarsCoordinates {
  latitude: number; // Decimal degrees North (+ for North)
  longitude: number; // Decimal degrees East (0-360 or -180 to +180 East-positive)
  elevation: number; // Meters relative to MOLA areoid datum
  datum: string;
  crs: string;
}

export interface LocalVector3 {
  x: number;
  y: number;
  z: number;
}

export interface MarsSolTime {
  sol: number;
  hour: number;
  minute: number;
  second: number;
  timeMultiplier: number;
  isPaused: boolean;
}

export interface EnvironmentalConditions {
  surfacePressurePa: number; // ~610 Pa
  temperatureCelsius: number; // -80 to -15 C
  dustOpticalDepthTau: number; // ~0.4
  windSpeedMs: number; // m/s
  windDirectionDegrees: number; // 0-360
  solarIrradianceWm2: number; // ~590 W/m2 top of atmosphere, attenuated by dust
  uvIndex: number;
}

export interface MarsRegionMetadata {
  id: string;
  name: string;
  targetPlanet: 'mars';
  centerCoordinates: MarsCoordinates;
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
  molaDatumElevation: number; // -2530m average for Jezero
  geologicalContext: string;
  perseveranceLandingDate: string;
  primaryMission: string;
  datasetsUsed: string[];
}
