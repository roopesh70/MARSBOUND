export interface SubsurfaceLayer {
  depthStartMeters: number;
  depthEndMeters: number;
  layerName: string;
  formationName: string;
  dielectricPermittivity: number; // Real dielectric constant (epsilon_r: 2.5 to 8.5)
  densityGcm3: number;
  description: string;
  reflectivityDb: number; // Return amplitude in decibels (-45 to -5 dB)
  colorHex: string;
}

export interface SubsurfaceReflectorAnomaly {
  id: string;
  name: string;
  worldPosition: { x: number; z: number };
  radiusMeters: number;
  targetDepthMeters: number;
  dielectricContrast: string;
  geologicalInterpretation: string;
  nasaScienceSignificance: string;
  drillableSampleName: string;
  drillableSampleNotes: string;
  baseResearchPoints: number;
}

export interface RimfaxEchogramSlice {
  distanceTraversedM: number;
  timestamp: number;
  roverX: number;
  roverZ: number;
  dielectricAtDepth: number[]; // 20 depth bins from 0m to -10m (0.5m each)
  reflectivityAtDepth: number[]; // Reflection signal strength dB
  primaryLayerName: string;
  activeAnomaly: SubsurfaceReflectorAnomaly | null;
}

export interface RimfaxRadarTelemetry {
  isActive: boolean;
  frequencyBand: '150-1200 MHz Ultra-Wideband';
  currentDielectricConstant: number;
  currentEstimatedDepthM: number;
  activeStratumName: string;
  activeFormation: string;
  nearbyAnomaly: SubsurfaceReflectorAnomaly | null;
  distanceToAnomalyMeters: number;
  canDeployCoreDrill: boolean;
  totalSubsurfaceCoresExtracted: number;
}
