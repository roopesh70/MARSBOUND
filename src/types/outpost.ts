import { MarsRegionId } from './region';

export type OutpostStructureType = 
  | 'habitat_core'
  | 'solar_array'
  | 'battery_bank'
  | 'comm_dish'
  | 'science_lab'
  | 'rover_bay';

export type BuildToolMode = 'construct' | 'dismantle';

export interface OutpostStructure {
  id: string;
  type: OutpostStructureType;
  name: string;
  regionId?: MarsRegionId;
  position: { x: number; y: number; z: number };
  rotationY: number;
  placedAtSol: number;
  powerGenerationWatts: number;
  powerConsumptionWatts: number;
  batteryCapacityWattHours: number;
  providesO2Recharge: boolean;
  providesBatteryRecharge: boolean;
  description: string;
}

export interface OutpostState {
  structures: OutpostStructure[];
  totalPowerGenerationWatts: number;
  totalPowerStorageWattHours: number;
  currentPowerStoredWattHours: number;
  safeZoneRadiusMeters: number;
}
