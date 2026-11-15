export interface NasaChallengeResource {
  id: string;
  title: string;
  category: 'mapping_gis' | 'mission_data' | 'environmental' | 'geology';
  description: string;
  url: string;
  usageInMarsbound: string;
  challengeRequirementMet: string;
}

export const NASA_CHALLENGE_RESOURCES: NasaChallengeResource[] = [
  {
    id: 'nasa_mars_trek',
    title: 'NASA Mars Trek (JPL)',
    category: 'mapping_gis',
    description: 
      'NASA Solar System Treks online browser tool providing interactive 2D/3D visualization, elevation profiling, slope hazard overlays, and high-resolution camera mosaics.',
    url: 'https://trek.nasa.gov/mars/',
    usageInMarsbound: 
      'Source for our Tactical Map layers (MOLA elevation shading, HiRISE high-res visible imagery, slope hazard analysis, and Perseverance traverse coordinates).',
    challengeRequirementMet: 'Layered GIS map integration and astronaut pathfinding support.'
  },
  {
    id: 'hirise_uahirise',
    title: 'HiRISE Digital Terrain Models & Orthoimages',
    category: 'mission_data',
    description: 
      'Sub-meter resolution stereo-photogrammetric 3D digital elevation models and visible surface imagery from the Mars Reconnaissance Orbiter (MRO).',
    url: 'https://www.uahirise.org/',
    usageInMarsbound: 
      'Used to calibrate our Jezero delta scarp, crater slopes, and boulder distribution in the 3D rendering pipeline.',
    challengeRequirementMet: 'Scientifically accurate, high-fidelity local terrain exploration.'
  },
  {
    id: 'nasa_pds_geosciences',
    title: 'NASA Planetary Data System (PDS) Geosciences Node',
    category: 'geology',
    description: 
      'Official archive for NASA planetary science missions analyzing the surface, interior, and geochemical evolution of Mars.',
    url: 'https://pds-geosciences.wustl.edu/',
    usageInMarsbound: 
      'Supplies reviewed geological classification, mineral spectra, and MOLA topographic reference data.',
    challengeRequirementMet: 'Strict scientific traceability and provenance validation for all field discoveries.'
  },
  {
    id: 'perseverance_mars2020',
    title: 'NASA Mars 2020 Perseverance Mission & Raw Images',
    category: 'mission_data',
    description: 
      'Official NASA Mars 2020 mission portal providing rover traverse maps, Mastcam-Z pan-chromatic images, SuperCam laser spectra, and drill core sample logs.',
    url: 'https://mars.nasa.gov/mars2020/',
    usageInMarsbound: 
      'Supplies accurate POI coordinates (Octavia E. Butler, Kodiak, Belva, Delta Front) and simulated sample registry data.',
    challengeRequirementMet: 'Authentic rover science collaboration and exploration context.'
  },
  {
    id: 'meda_weather_telemetry',
    title: 'Perseverance MEDA Environmental Telemetry',
    category: 'environmental',
    description: 
      'Daily atmospheric pressure, air temperature, relative humidity, solar UV radiation, and wind sensor observations in Jezero Crater.',
    url: 'https://mars.nasa.gov/mars2020/mission/instruments/meda/',
    usageInMarsbound: 
      'Powers the HUD environmental readings: realistic ~610 Pa surface pressure, -84°C to -14°C temperature cycles, and dust opacity.',
    challengeRequirementMet: 'Hostile Martian environment tracking for astronaut survival decision-making.'
  },
  {
    id: 'crism_mineralogy',
    title: 'CRISM Hyperspectral Mineralogy Data (NASA PDS / JHU APL)',
    category: 'geology',
    description: 
      'Orbital spectrometer data mapping phyllosilicates (smectite clays), carbonates, and olivine in Jezero Crater, archived in NASA PDS Geosciences Node.',
    url: 'https://pds-geosciences.wustl.edu/missions/mro/crism.htm',
    usageInMarsbound: 
      'Powers the Tactical Map Mineralogy Layer, guiding the player to high-value astrobiological sample locations.',
    challengeRequirementMet: 'Identification of high-priority scientific targets during EVA Marswalks.'
  }
];
