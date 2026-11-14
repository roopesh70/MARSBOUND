export interface MissionObjective {
  id: string;
  order: number;
  title: string;
  description: string;
  targetDiscoveryId?: string;
  targetCoordinates?: { lat: number; lon: number };
  targetDistanceThresholdMeters?: number;
  completed: boolean;
  type: 'reach_location' | 'scan_target' | 'collect_sample' | 'return_outpost' | 'transmit_report';
}

export interface Mission {
  id: string;
  title: string;
  code: string;
  solInitiated: number;
  briefing: string;
  objectives: MissionObjective[];
  currentObjectiveIndex: number;
  completed: boolean;
  rewards: {
    journalEntryTitle: string;
    unlockedTool?: string;
    scientificDataGrant: string;
  };
  evidenceType: 'gameplay_simulation' | 'historical_record';
}
