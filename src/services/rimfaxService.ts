import { SubsurfaceLayer, SubsurfaceReflectorAnomaly, RimfaxEchogramSlice, RimfaxRadarTelemetry } from '../types/rimfax';
import { REGIONAL_STRATIGRAPHY, SUBSURFACE_ANOMALIES } from '../data/rimfaxData';

export class RimfaxRadarService {
  private static instance: RimfaxRadarService;
  private slices: RimfaxEchogramSlice[] = [];
  private maxSlices = 100;
  private totalDistanceTraversed = 0;
  private lastPosition: { x: number; z: number } | null = null;
  private pingAccumulator = 0;
  private drilledAnomalyIds: string[] = [];

  public static getInstance(): RimfaxRadarService {
    if (!RimfaxRadarService.instance) {
      RimfaxRadarService.instance = new RimfaxRadarService();
    }
    return RimfaxRadarService.instance;
  }

  /**
   * Determine the geological stratigraphy based on rover coordinates
   */
  public getActiveStratigraphy(x: number, z: number): SubsurfaceLayer[] {
    // If inside Neretva Vallis breach (northwest canyon gorge)
    if (x < -180 && z < -120) {
      return REGIONAL_STRATIGRAPHY.neretva_vallis_gorge;
    }
    // If on the Western Delta fan (west of x = -40)
    if (x < -40) {
      return REGIONAL_STRATIGRAPHY.jezero_delta_fan;
    }
    // Default Jezero Crater Floor
    return REGIONAL_STRATIGRAPHY.jezero_crater_floor;
  }

  /**
   * Check for nearby anomalous reflector zones
   */
  public getNearbyAnomaly(x: number, z: number): { anomaly: SubsurfaceReflectorAnomaly | null; distance: number } {
    let nearest: SubsurfaceReflectorAnomaly | null = null;
    let minDistance = Infinity;

    for (const anom of SUBSURFACE_ANOMALIES) {
      const dist = Math.hypot(x - anom.worldPosition.x, z - anom.worldPosition.z);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = anom;
      }
    }

    if (nearest && minDistance <= nearest.radiusMeters) {
      return { anomaly: nearest, distance: Math.round(minDistance * 10) / 10 };
    }

    return { anomaly: null, distance: Math.round(minDistance * 10) / 10 };
  }

  /**
   * Updates radar state as rover moves, generating new echogram slices every ~1.5 meters of traverse
   */
  public update(roverPos: { x: number; z: number }, speedKmh: number, _deltaSec: number): {
    newSliceGenerated: boolean;
    activeAnomalyDetected: boolean;
  } {
    if (!this.lastPosition) {
      this.lastPosition = { ...roverPos };
      return { newSliceGenerated: false, activeAnomalyDetected: false };
    }

    const distStep = Math.hypot(roverPos.x - this.lastPosition.x, roverPos.z - this.lastPosition.z);
    this.lastPosition = { ...roverPos };

    if (distStep > 0.05) {
      this.totalDistanceTraversed += distStep;
      this.pingAccumulator += distStep;
    }

    // Generate a new vertical radar sounding slice every ~1.4 meters of travel
    let newSlice = false;
    let anomalyDetected = false;

    if (this.pingAccumulator >= 1.4 || (this.slices.length === 0 && speedKmh > 0)) {
      this.pingAccumulator = 0;
      newSlice = true;

      const layers = this.getActiveStratigraphy(roverPos.x, roverPos.z);
      const { anomaly } = this.getNearbyAnomaly(roverPos.x, roverPos.z);
      if (anomaly) anomalyDetected = true;

      // 20 depth bins (0m to -10m in 0.5m increments)
      const dielectricAtDepth: number[] = [];
      const reflectivityAtDepth: number[] = [];

      for (let i = 0; i < 20; i++) {
        const depth = i * 0.5; // 0.0, 0.5, 1.0 ... 9.5
        const layer = layers.find((l) => depth >= l.depthStartMeters && depth < l.depthEndMeters) || layers[layers.length - 1];

        let dielectric = layer.dielectricPermittivity;
        let reflectivity = layer.reflectivityDb;

        // Introduce authentic slight geological noise
        dielectric += (Math.sin(roverPos.x * 0.2 + depth) * 0.3) + (Math.random() * 0.2 - 0.1);
        reflectivity += (Math.cos(roverPos.z * 0.2 + depth) * 2.0) + (Math.random() * 2.0 - 1.0);

        // If passing over an anomaly at target depth, create hyperbolic reflection spike
        if (anomaly && Math.abs(depth - anomaly.targetDepthMeters) <= 1.0) {
          reflectivity += 18.0; // High amplitude radar bounce
          dielectric = anomaly.id.includes('ice') ? 3.1 : anomaly.id.includes('lava') ? 1.4 : 7.8;
        }

        dielectricAtDepth.push(Math.round(dielectric * 10) / 10);
        reflectivityAtDepth.push(Math.round(reflectivity));
      }

      const slice: RimfaxEchogramSlice = {
        distanceTraversedM: Math.round(this.totalDistanceTraversed * 10) / 10,
        timestamp: Date.now(),
        roverX: roverPos.x,
        roverZ: roverPos.z,
        dielectricAtDepth,
        reflectivityAtDepth,
        primaryLayerName: layers[1]?.layerName || layers[0].layerName,
        activeAnomaly: anomaly
      };

      this.slices.push(slice);
      if (this.slices.length > this.maxSlices) {
        this.slices.shift();
      }
    }

    return { newSliceGenerated: newSlice, activeAnomalyDetected: anomalyDetected };
  }

  /**
   * Get current telemetry snapshot for HUD
   */
  public getTelemetry(roverPos: { x: number; z: number }): RimfaxRadarTelemetry {
    const layers = this.getActiveStratigraphy(roverPos.x, roverPos.z);
    const { anomaly, distance } = this.getNearbyAnomaly(roverPos.x, roverPos.z);
    const latestSlice = this.slices[this.slices.length - 1];

    const currentDielectric = latestSlice
      ? latestSlice.dielectricAtDepth[6] // sample around -3m
      : layers[1]?.dielectricPermittivity || 5.2;

    const canDrill = (anomaly !== null && distance <= 18) || (roverPos.x < -180 && roverPos.z < -120);

    return {
      isActive: true,
      frequencyBand: '150-1200 MHz Ultra-Wideband',
      currentDielectricConstant: currentDielectric,
      currentEstimatedDepthM: 10.0,
      activeStratumName: layers[1]?.layerName || 'Volcanic Basalt Stratum',
      activeFormation: layers[1]?.formationName || 'Jezero Floor Unit',
      nearbyAnomaly: anomaly,
      distanceToAnomalyMeters: distance,
      canDeployCoreDrill: canDrill,
      totalSubsurfaceCoresExtracted: this.drilledAnomalyIds.length
    };
  }

  public getSlices(): RimfaxEchogramSlice[] {
    return this.slices;
  }

  public recordDrilledAnomaly(id: string): void {
    if (!this.drilledAnomalyIds.includes(id)) {
      this.drilledAnomalyIds.push(id);
    }
  }

  public isAnomalyDrilled(id: string): boolean {
    return this.drilledAnomalyIds.includes(id);
  }
}

export const rimfaxService = RimfaxRadarService.getInstance();
