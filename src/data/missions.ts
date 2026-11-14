import { Mission } from '../types/mission';

export const INITIAL_MISSION: Mission = {
  id: 'mission_01_geological_outcrop',
  title: 'Investigate a Martian Geological Outcrop',
  code: 'EXPEDITION-JZ-01',
  solInitiated: 142,
  briefing: 
    'Greetings Astronaut. Your first field EVA assignment is to investigate the Delta Scarp at Hawkes Bay. Orbital CRISM hyperspectral data indicates high concentrations of ancient smectite clays deposited when water flowed through Neretva Vallis into Jezero Crater. Navigate to the scarp, scan the outcrop with your field spectrometer, collect a simulated sediment sample, and safely return to the habitat outpost before life support runs low.',
  objectives: [
    {
      id: 'obj_01_briefing',
      order: 1,
      title: 'Review Expedition Brief & Open Tactical Map',
      description: 'Press [M] to open your Tactical GIS Map and locate the Delta Scarp target coordinates.',
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_02_traverse',
      order: 2,
      title: 'Traverse to Delta Scarp — Hawkes Bay Outcrop',
      description: 'Hike northwest across the crater floor toward the marked waypoint (Coordinates: 18.4230°N, 77.4320°E).',
      targetDiscoveryId: 'poi_delta_scarp',
      targetCoordinates: { lat: 18.4230, lon: 77.4320 },
      targetDistanceThresholdMeters: 25,
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_03_scan',
      order: 3,
      title: 'Scan Outcrop with Raman Spectrometer',
      description: 'Approach within 18 meters of the outcrop and press [F] to activate your scanner tool.',
      targetDiscoveryId: 'poi_delta_scarp',
      completed: false,
      type: 'scan_target'
    },
    {
      id: 'obj_04_sample',
      order: 4,
      title: 'Collect Simulated Sediment Sample',
      description: 'Inside the discovery panel, examine the scientific evidence label and record simulated Sample #MB-01.',
      targetDiscoveryId: 'poi_delta_scarp',
      completed: false,
      type: 'collect_sample'
    },
    {
      id: 'obj_05_return',
      order: 5,
      title: 'Return to Outpost Habitat Safe Zone',
      description: 'Head back to Octavia E. Butler Base (0, 0) to replenish suit oxygen and recharge your battery bank.',
      targetCoordinates: { lat: 18.4447, lon: 77.4508 },
      targetDistanceThresholdMeters: 22,
      completed: false,
      type: 'return_outpost'
    }
  ],
  currentObjectiveIndex: 0,
  completed: false,
  rewards: {
    journalEntryTitle: 'Jezero Delta Front Ground Truth Telemetry',
    unlockedTool: 'Subsurface Georadar Sounder Mk I',
    scientificDataGrant: 'CRISM & SuperCam Core Correlation Data Log'
  },
  evidenceType: 'gameplay_simulation'
};

export const MISSION_02_ROVER_EXPEDITION: Mission = {
  id: 'mission_02_kodiak_expedition',
  title: 'Kodiak Butte Long-Distance Rover Expedition',
  code: 'EXPEDITION-JZ-02',
  solInitiated: 145,
  briefing: 
    'The isolated mesa of Kodiak Butte lies approximately 180 meters south of the base. Walking on foot consumes significant oxygen reserves. Board the Mars Rover parked outside Octavia Base by pressing [E], drive south across the crater floor, survey the dipping foreset delta beds, and collect a simulated stratified sandstone specimen.',
  objectives: [
    {
      id: 'obj_201_board_rover',
      order: 1,
      title: 'Board the Exploration Rover',
      description: 'Approach the rover parked at Octavia Base and press [E] to engage driving controls.',
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_202_drive_kodiak',
      order: 2,
      title: 'Drive to Kodiak Butte Remnant',
      description: 'Pilot the rover south toward Kodiak Butte (Coordinates: 18.3980°N, 77.4120°E).',
      targetDiscoveryId: 'poi_kodiak_butte',
      targetDistanceThresholdMeters: 30,
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_203_scan_kodiak',
      order: 3,
      title: 'Scan Kodiak Gilbert Delta Strata',
      description: 'Dismount [E] and use spectrometer [F] to scan the inclined delta foreset beds.',
      targetDiscoveryId: 'poi_kodiak_butte',
      completed: false,
      type: 'scan_target'
    },
    {
      id: 'obj_204_sample_kodiak',
      order: 4,
      title: 'Collect Kodiak Sandstone Sample',
      description: 'Record simulated Kodiak Stratified Sandstone sample in your discovery dossier.',
      targetDiscoveryId: 'poi_kodiak_butte',
      completed: false,
      type: 'collect_sample'
    },
    {
      id: 'obj_205_return_base',
      order: 5,
      title: 'Drive Rover Back to Octavia Base',
      description: 'Return the rover to the outpost habitat perimeter to park and recharge.',
      targetDistanceThresholdMeters: 25,
      completed: false,
      type: 'return_outpost'
    }
  ],
  currentObjectiveIndex: 0,
  completed: false,
  rewards: {
    journalEntryTitle: 'Gilbert-Type Delta Stratigraphy Survey',
    unlockedTool: 'Long-Range Telemetry Transponder',
    scientificDataGrant: 'MGS MOLA & Mastcam-Z Stratigraphic Cross-Section'
  },
  evidenceType: 'gameplay_simulation'
};

export const MISSION_03_EXPAND_OUTPOST: Mission = {
  id: 'mission_03_expand_outpost',
  title: 'Expand Outpost Infrastructure & Power Grid',
  code: 'CONSTRUCTION-JZ-03',
  solInitiated: 148,
  briefing: 
    'As scientific operations expand, the base requires additional power generation and buffer storage. Press [B] to enter Outpost Build Mode. Place an additional Photovoltaic Tracking Solar Array or Cryo-Battery Storage Module within the base perimeter.',
  objectives: [
    {
      id: 'obj_301_open_build',
      order: 1,
      title: 'Enter Outpost Build Mode',
      description: 'Press [B] on your keyboard or click BUILD on the HUD hotbar.',
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_302_place_structure',
      order: 2,
      title: 'Deploy an Auxiliary Power or Storage Structure',
      description: 'Select a Solar Array or Battery Bank and left-click on the ground to place it.',
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_303_verify_grid',
      order: 3,
      title: 'Verify Base Power Output',
      description: 'Ensure total outpost power generation exceeds 4,800 Watts.',
      completed: false,
      type: 'reach_location'
    }
  ],
  currentObjectiveIndex: 0,
  completed: false,
  rewards: {
    journalEntryTitle: 'Octavia Base Expanded Power Certification',
    unlockedTool: 'Automated Solar Dust Wiper',
    scientificDataGrant: 'Surface Energy Balance & Dust Attenuation Model'
  },
  evidenceType: 'gameplay_simulation'
};

export const ALL_MISSIONS: Mission[] = [
  INITIAL_MISSION,
  MISSION_02_ROVER_EXPEDITION,
  MISSION_03_EXPAND_OUTPOST
];
