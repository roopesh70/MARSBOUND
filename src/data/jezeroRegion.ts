import { MarsRegionMetadata } from '../types/mars';

export const JEZERO_REGION_METADATA: MarsRegionMetadata = {
  id: 'jezero_crater',
  name: 'Jezero Crater (Perseverance Landing & Delta Region)',
  targetPlanet: 'mars',
  centerCoordinates: {
    latitude: 18.4447, // Octavia E. Butler Landing
    longitude: 77.4508, // East-positive convention
    elevation: -2574, // Meters below Mars datum (MOLA areoid)
    datum: 'MOLA IAU 2000 Mars Areoid',
    crs: 'Equirectangular / Planetocentric Mars (IAU 2000)'
  },
  bounds: {
    minLat: 18.36,
    maxLat: 18.52,
    minLon: 77.32,
    maxLon: 77.48
  },
  molaDatumElevation: -2574,
  geologicalContext: 
    'An ancient 45-km diameter impact crater formed during the Noachian era (~3.8 to 4.0 billion years ago) that once hosted a paleolake fed by an inlet river valley (Neretva Vallis), depositing a fan-shaped sedimentary river delta rich in clay minerals with high potential for preserving ancient biosignatures.',
  perseveranceLandingDate: '2021-02-18T20:55:00Z',
  primaryMission: 'NASA Mars 2020 (Perseverance & Ingenuity)',
  datasetsUsed: [
    'NASA MOLA (Mars Global Surveyor) Global Topography DTM',
    'NASA MRO HiRISE Jezero Crater Stereo DTM (DTEEC_037145_1985_037211_1985)',
    'NASA MRO CTX Mosaic (Caltech Bruce Murray Laboratory)',
    'NASA MRO CRISM Targeted Hyperspectral Mineral Map (FRT00005C5E)',
    'NASA Mars 2020 MEDA Atmospheric Environmental Sensor Telemetry'
  ]
};
