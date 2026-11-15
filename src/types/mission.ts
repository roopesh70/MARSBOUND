import { OutpostStructureType } from './outpost';

export type MissionObjectiveType =
  | 'reach_location'
  | 'scan_target'
  | 'collect_sample'
  | 'return_outpost'
  | 'transmit_report'
  | 'analyze_sample'
  | 'unlock_tech'
  | 'radar_sounding'
  | 'deep_core_drill'
  | 'visit_library'
  | 'build_structure'
  | 'observe_sunset'
  | 'cross_region';

export interface MissionObjective {
  id: string;
  order: number;
  title: string;
  description: string;
  targetDiscoveryId?: string;
  targetCoordinates?: { lat: number; lon: number };
  targetDistanceThresholdMeters?: number;
  targetRegionId?: string;
  targetStructureType?: OutpostStructureType;
  targetPowerWatts?: number;
  targetSolHourRange?: [number, number];
  targetTechId?: string;
  targetAnomalyId?: string;
  completed: boolean;
  type: MissionObjectiveType;
}

export type MissionTier =
  | 'TIER 1: FOUNDATION'
  | 'TIER 2: LABORATORY & SUBSURFACE'
  | 'TIER 3: REGIONAL EXPEDITION'
  | 'TIER 4: ASTROBIOLOGY';

export interface MissionRewards {
  journalEntryTitle: string;
  unlockedTool?: string;
  scientificDataGrant: string;
  researchPointsReward: number;
}

export interface Mission {
  id: string;
  title: string;
  code: string;
  solInitiated: number;
  briefing: string;
  tier: MissionTier;
  estimatedDuration: string;
  objectives: MissionObjective[];
  currentObjectiveIndex: number;
  completed: boolean;
  rewards: MissionRewards;
  evidenceType: 'gameplay_simulation' | 'historical_record';
}

