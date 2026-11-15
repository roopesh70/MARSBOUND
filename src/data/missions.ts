import { Mission } from '../types/mission';

export const MISSION_01_GEOLOGICAL_OUTCROP: Mission = {
  id: 'mission_01_geological_outcrop',
  title: 'Delta Scarp Reconnaissance & Geological Sampling',
  code: 'EXPEDITION-JZ-01',
  solInitiated: 142,
  tier: 'TIER 1: FOUNDATION',
  estimatedDuration: '15-20 Min EVA',
  briefing:
    'Greetings Astronaut. Your first field EVA assignment is to investigate the Delta Scarp at Hawkes Bay. Orbital CRISM hyperspectral data indicates high concentrations of ancient smectite clays deposited when water flowed through Neretva Vallis into Jezero Crater. Navigate to the scarp, scan the outcrop with your field spectrometer, collect simulated sediment sample #MB-01, and safely return to the habitat outpost before life support runs low.',
  objectives: [
    {
      id: 'obj_101_map',
      order: 1,
      title: 'Review Expedition Brief & Open Tactical Map',
      description: 'Press [M] to open your Tactical GIS Map and locate the Delta Scarp target coordinates.',
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_102_traverse',
      order: 2,
      title: 'Traverse to Delta Scarp — Hawkes Bay Outcrop',
      description: 'Hike northwest across the crater floor toward the marked waypoint (Coordinates: 18.4230°N, 77.4320°E).',
      targetDiscoveryId: 'poi_delta_scarp',
      targetCoordinates: { lat: 18.4230, lon: 77.4320 },
      targetDistanceThresholdMeters: 35,
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_103_scan',
      order: 3,
      title: 'Scan Outcrop with Raman Spectrometer',
      description: 'Approach within 18 meters of the outcrop and press [F] to activate your scanner tool.',
      targetDiscoveryId: 'poi_delta_scarp',
      completed: false,
      type: 'scan_target'
    },
    {
      id: 'obj_104_sample',
      order: 4,
      title: 'Collect Simulated Sediment Sample #MB-01',
      description: 'Inside the discovery panel, examine the scientific evidence label and record simulated Sample #MB-01.',
      targetDiscoveryId: 'poi_delta_scarp',
      completed: false,
      type: 'collect_sample'
    },
    {
      id: 'obj_105_return',
      order: 5,
      title: 'Return to Outpost Habitat Safe Zone',
      description: 'Head back to Octavia E. Butler Base (0, 0) to replenish suit oxygen and recharge your battery bank.',
      targetCoordinates: { lat: 18.4447, lon: 77.4508 },
      targetDistanceThresholdMeters: 25,
      completed: false,
      type: 'return_outpost'
    }
  ],
  currentObjectiveIndex: 0,
  completed: false,
  rewards: {
    journalEntryTitle: 'Jezero Delta Front Ground Truth Telemetry',
    unlockedTool: 'Subsurface Georadar Sounder Mk I',
    scientificDataGrant: 'CRISM & SuperCam Core Correlation Data Log',
    researchPointsReward: 350
  },
  evidenceType: 'gameplay_simulation'
};

export const MISSION_02_LABORATORY_ASSAY: Mission = {
  id: 'mission_02_laboratory_assay',
  title: 'CheMin & PIXL Geochemical Spectrometry',
  code: 'EXPEDITION-JZ-02',
  solInitiated: 144,
  tier: 'TIER 2: LABORATORY & SUBSURFACE',
  estimatedDuration: '10-15 Min Assay',
  briefing:
    'Field samples remain unverified without laboratory mineralogical analysis. Enter the Octavia Field Science & Geochemistry Laboratory adjacent to base. Run a coupled Powder X-Ray Diffraction (CheMin) and Micro-XRF (PIXL) assay on your collected Delta mudstone to identify crystal lattices and elemental abundances. Use the earned Research Points to unlock a critical engineering upgrade in the Technology Tree.',
  objectives: [
    {
      id: 'obj_201_enter_lab',
      order: 1,
      title: 'Enter Field Science & Geochemistry Laboratory',
      description: 'Press [K] on your keyboard, or approach the Science Lab habitat module and press [E] to enter the cleanroom.',
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_202_run_assay',
      order: 2,
      title: 'Execute CheMin / PIXL Spectroscopic Assay',
      description: 'Select an unanalyzed sample from your collection tray and initiate the coupled XRD/XRF beam analysis.',
      completed: false,
      type: 'analyze_sample'
    },
    {
      id: 'obj_203_earn_rp',
      order: 3,
      title: 'Synthesize Crystallography Data & Research Points',
      description: 'Confirm mineral phase matches (smectite, quartz, olivine) to deposit Research Points (RP) into the expedition pool.',
      completed: false,
      type: 'analyze_sample'
    },
    {
      id: 'obj_204_unlock_tech',
      order: 4,
      title: 'Unlock an Engineering Upgrade in Tech Tree',
      description: 'Switch to the Technology Tree tab inside the lab and invest your RP to research an engineering upgrade (e.g. Rover Transmission or O2 Scrubber).',
      completed: false,
      type: 'unlock_tech'
    }
  ],
  currentObjectiveIndex: 0,
  completed: false,
  rewards: {
    journalEntryTitle: 'X-Ray Diffraction Mineralogy & Crystal Lattice Models',
    unlockedTool: 'Micro-XRF High-Sensitivity Probe',
    scientificDataGrant: 'PIXL / CheMin Quantitative Mineral Abundance Tables',
    researchPointsReward: 500
  },
  evidenceType: 'gameplay_simulation'
};

export const MISSION_03_RIMFAX_SUBSURFACE: Mission = {
  id: 'mission_03_rimfax_subsurface',
  title: 'RIMFAX Subsurface Tomography & Deep Core Drilling',
  code: 'EXPEDITION-JZ-03',
  solInitiated: 146,
  tier: 'TIER 2: LABORATORY & SUBSURFACE',
  estimatedDuration: '25-30 Min Rover Traverse',
  briefing:
    'Visible surface outcrops only reveal a fraction of Jezero’s history. Board the Mars Exploration Rover [E], which is equipped with the RIMFAX Ground-Penetrating Radar antenna. Survey the crater floor by monitoring the real-time radargram [U]. When your antenna detects an anomalous dielectric reflector—such as the buried Paleochannel or Glacial Ice Lens—deploy the robotic arm deep-core drill [G] to extract pristine subsurface stratigraphy.',
  objectives: [
    {
      id: 'obj_301_board_rover',
      order: 1,
      title: 'Board the Exploration Rover',
      description: 'Approach the Mars Rover parked outside Octavia Base and press [E] to engage driving controls.',
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_302_inspect_radar',
      order: 2,
      title: 'Engage RIMFAX Radar & Open Echogram [U]',
      description: 'Press [U] or inspect the cockpit HUD to activate 15-200 MHz ground-penetrating radar soundings.',
      completed: false,
      type: 'radar_sounding'
    },
    {
      id: 'obj_303_locate_anomaly',
      order: 3,
      title: 'Locate a Subsurface Dielectric Anomaly',
      description: 'Drive the rover until the RIMFAX echogram detects strong anomalous hyperbolic reflections (e.g. Paleochannel or Ice Lens).',
      completed: false,
      type: 'radar_sounding'
    },
    {
      id: 'obj_304_deploy_drill',
      order: 4,
      title: 'Deploy Robotic Arm Deep Core Drill [G]',
      description: 'Halt the rover above the radar anomaly and press [G] to deploy the rotary percussive coring drill.',
      completed: false,
      type: 'deep_core_drill'
    },
    {
      id: 'obj_305_store_subsurface_core',
      order: 5,
      title: 'Secure Deep-Core Stratigraphy Sample',
      description: 'Extract and hermetically seal the subsurface regolith core into the rover carousel for laboratory analysis.',
      completed: false,
      type: 'collect_sample'
    }
  ],
  currentObjectiveIndex: 0,
  completed: false,
  rewards: {
    journalEntryTitle: 'Jezero Subsurface Stratigraphy & Paleochannel Tomography',
    unlockedTool: 'Deep-Core Diamond Coring Bit',
    scientificDataGrant: 'RIMFAX 15-200 MHz Dielectric Tomogram Profile',
    researchPointsReward: 750
  },
  evidenceType: 'gameplay_simulation'
};

export const MISSION_04_EXPAND_OUTPOST: Mission = {
  id: 'mission_04_expand_outpost',
  title: 'Expand Outpost Infrastructure & Power Grid',
  code: 'CONSTRUCTION-JZ-04',
  solInitiated: 148,
  tier: 'TIER 1: FOUNDATION',
  estimatedDuration: '15-20 Min Base Building',
  briefing:
    'As scientific expeditions and rover charging demands escalate, Octavia Base requires higher sustained electrical power and cryo-storage capacity. Press [B] to enter Outpost Build Mode. Place an additional Photovoltaic Tracking Solar Array and a Cryo-Battery Storage Module within the base perimeter to ensure continuous life support through the freezing Martian night.',
  objectives: [
    {
      id: 'obj_401_open_build',
      order: 1,
      title: 'Enter Outpost Build Mode [B]',
      description: 'Press [B] on your keyboard or click the BUILD button on the cockpit hotbar.',
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_402_place_solar',
      order: 2,
      title: 'Deploy Photovoltaic Tracking Solar Array',
      description: 'Select Solar Array [1], rotate to align with prevailing sunlight, and left-click on the ground to construct.',
      targetStructureType: 'solar_array',
      completed: false,
      type: 'build_structure'
    },
    {
      id: 'obj_403_place_battery',
      order: 3,
      title: 'Deploy Cryo-Battery Storage Module',
      description: 'Select Battery Bank [2] and place it adjacent to habitat modules to expand electrical storage capacity.',
      targetStructureType: 'battery_bank',
      completed: false,
      type: 'build_structure'
    },
    {
      id: 'obj_404_verify_grid',
      order: 4,
      title: 'Verify Base Power Output (≥ 4,800 Watts)',
      description: 'Ensure total outpost power generation reaches or exceeds 4,800 Watts to stabilize base life support.',
      targetPowerWatts: 4800,
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_405_maintain_buffer',
      order: 5,
      title: 'Confirm Diurnal Habitat Life Support Buffer',
      description: 'Step into the habitat safe zone to confirm oxygen and battery replenishment systems are operating at peak efficiency.',
      completed: false,
      type: 'return_outpost'
    }
  ],
  currentObjectiveIndex: 0,
  completed: false,
  rewards: {
    journalEntryTitle: 'Octavia Base Expanded Power Certification',
    unlockedTool: 'Automated Dust Mitigating Solar Array',
    scientificDataGrant: 'Surface Energy Balance & Dust Attenuation Model',
    researchPointsReward: 450
  },
  evidenceType: 'gameplay_simulation'
};

export const MISSION_05_NERETVA_EXPEDITION: Mission = {
  id: 'mission_05_neretva_expedition',
  title: 'The Great Inflow Breach — Neretva Vallis Megaflood',
  code: 'EXPEDITION-JZ-05',
  solInitiated: 151,
  tier: 'TIER 3: REGIONAL EXPEDITION',
  estimatedDuration: '30-40 Min Long Traverse',
  briefing:
    'Over 3.7 billion years ago, a catastrophic megaflood breached the northwestern rim of Jezero Crater, gouging a 100-meter deep bedrock canyon known as Neretva Vallis. Pilot your rover past Kodiak Butte and traverse through the western delta breach into Neretva Vallis. Survey the colossal megaflood boulders, observe the ancient Noachian crustal bedrock, and collect an inflow conglomerate sample.',
  objectives: [
    {
      id: 'obj_501_pass_kodiak',
      order: 1,
      title: 'Pilot Rover West Past Kodiak Butte',
      description: 'Hike or drive the rover west across the crater floor towards the ancient delta remnant at Kodiak Butte.',
      targetDiscoveryId: 'poi_kodiak_butte',
      targetDistanceThresholdMeters: 55,
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_502_cross_breach',
      order: 2,
      title: 'Cross Inflow Breach into Neretva Vallis',
      description: 'Drive past (-195, -140) through the mountain gorge until HUD telemetry displays NERETVA VALLIS (INFLOW GORGE).',
      targetRegionId: 'neretva_vallis',
      completed: false,
      type: 'cross_region'
    },
    {
      id: 'obj_503_scan_canyon',
      order: 3,
      title: 'Scan Ancient Neretva Canyon Wall Bedrock',
      description: 'Approach within 25 meters of Neretva Canyon Wall (Coordinates: 18.5200°N, 77.2900°E) and trigger spectrometer [F].',
      targetDiscoveryId: 'poi_neretva_canyon',
      completed: false,
      type: 'scan_target'
    },
    {
      id: 'obj_504_sample_crust',
      order: 4,
      title: 'Collect Ancient Noachian Crustal Fragment',
      description: 'Extract and log the ancient anorthositic crustal fragment sample from the canyon floor.',
      targetDiscoveryId: 'poi_neretva_canyon',
      completed: false,
      type: 'collect_sample'
    },
    {
      id: 'obj_505_return_safe',
      order: 5,
      title: 'Return Rover Safely to Octavia Base Depot',
      description: 'Navigate back through the gorge and park at Octavia E. Butler Base before rover batteries deplete.',
      targetDistanceThresholdMeters: 28,
      completed: false,
      type: 'return_outpost'
    }
  ],
  currentObjectiveIndex: 0,
  completed: false,
  rewards: {
    journalEntryTitle: 'Neretva Vallis Megaflood Hydrodynamics & Canyon Strata',
    unlockedTool: 'High-Torque Planetary Hub Transmission',
    scientificDataGrant: 'HiRISE Stereo DTM & CTX Regional Fluvial Map',
    researchPointsReward: 1000
  },
  evidenceType: 'gameplay_simulation'
};

export const MISSION_06_CHEYAVA_ASTROBIOLOGY: Mission = {
  id: 'mission_06_cheyava_astrobiology',
  title: 'Astrobiology & Cheyava Falls Reduction Halos',
  code: 'EXPEDITION-JZ-06',
  solInitiated: 155,
  tier: 'TIER 4: ASTROBIOLOGY',
  estimatedDuration: '30-45 Min Astrobiology Campaign',
  briefing:
    'In July 2024, NASA announced the discovery of "leopard spots" at Cheyava Falls in Bright Angel Valley—the most compelling biosignature candidate ever identified on Mars. First, visit the NASA Archival Library [L] to cross-examine historical rover records. Next, navigate northwest to Cheyava Falls, perform a micro-spectroscopic scan of the iron-phosphate reaction rims, collect the spotted mudstone core, and observe the forward Mie scattering Martian Blue Sunset at twilight (18:15 LMST).',
  objectives: [
    {
      id: 'obj_601_visit_library',
      order: 1,
      title: 'Access NASA Archival Library [L]',
      description: 'Press [L] or visit the NASA Archival Library building to review the Astrobiology & Biosignature candidate dossier.',
      completed: false,
      type: 'visit_library'
    },
    {
      id: 'obj_602_navigate_cheyava',
      order: 2,
      title: 'Navigate to Cheyava Falls in Bright Angel Valley',
      description: 'Traverse northwest to the Cheyava Falls outcrop (Coordinates: 18.4720°N, 77.3820°E).',
      targetDiscoveryId: 'poi_cheyava_falls',
      targetDistanceThresholdMeters: 40,
      completed: false,
      type: 'reach_location'
    },
    {
      id: 'obj_603_scan_leopard_spots',
      order: 3,
      title: 'Scan Leopard Spots Halos with Micro-Spectrometer',
      description: 'Activate scanner [F] within 20m of Cheyava Falls to map vivianite (iron phosphate) and organic carbon signatures.',
      targetDiscoveryId: 'poi_cheyava_falls',
      completed: false,
      type: 'scan_target'
    },
    {
      id: 'obj_604_collect_cheyava_sample',
      order: 4,
      title: 'Extract Cheyava Falls Organic Spotted Core Sample',
      description: 'Log the Cheyava Falls Spotted Mudstone Core in your expedition dossier.',
      targetDiscoveryId: 'poi_cheyava_falls',
      completed: false,
      type: 'collect_sample'
    },
    {
      id: 'obj_605_observe_blue_sunset',
      order: 5,
      title: 'Witness Martian Blue Sunset at Twilight',
      description: 'Observe the Sun setting between 17:15 and 18:45 LMST to record forward Mie scattering optical depth (tau) data.',
      targetSolHourRange: [17.0, 18.75],
      completed: false,
      type: 'observe_sunset'
    }
  ],
  currentObjectiveIndex: 0,
  completed: false,
  rewards: {
    journalEntryTitle: 'Astrobiological Reduction Halos & Biosignature Assessment',
    unlockedTool: 'Quantum Multi-Spectral Biosignature Analyzer',
    scientificDataGrant: 'SHERLOC Deep-UV Organic Fluorescence & PIXL Micro-Map',
    researchPointsReward: 1500
  },
  evidenceType: 'gameplay_simulation'
};

export const INITIAL_MISSION: Mission = MISSION_01_GEOLOGICAL_OUTCROP;

export const ALL_MISSIONS: Mission[] = [
  MISSION_01_GEOLOGICAL_OUTCROP,
  MISSION_02_LABORATORY_ASSAY,
  MISSION_03_RIMFAX_SUBSURFACE,
  MISSION_04_EXPAND_OUTPOST,
  MISSION_05_NERETVA_EXPEDITION,
  MISSION_06_CHEYAVA_ASTROBIOLOGY
];
