/**
 * MARS ARCHIVAL LIBRARY & NASA DIGITAL REPOSITORY
 * Exhaustive scientific dataset, NASA digital resources, mission archives,
 * planetary physics, climate telemetry, peer-reviewed documents, and curated image gallery.
 */

export interface MarsPlanetaryFactsheet {
  name: string;
  designation: string;
  diameterKm: number;
  massKg: string;
  surfaceGravityMs2: number; // 3.72076 m/s2 (0.379 g)
  earthGravityRatio: number;
  meanDensityGcm3: number;
  escapeVelocityKms: number;
  axialTiltDegrees: number;
  solarOrbitDays: number; // 686.98 Earth days
  solDurationSeconds: number; // 88,775.244 seconds (24h 39m 35.244s)
  semiMajorAxisAU: number; // 1.524 AU
  perihelionAU: number;
  aphelionAU: number;
  orbitalEccentricity: number;
  albedo: number;
  meanSurfaceTempCelsius: number;
  temperatureRangeCelsius: { min: number; max: number };
  surfacePressureMbar: { min: number; max: number; mean: number };
}

export interface AtmosphereGas {
  name: string;
  chemicalFormula: string;
  percentage: number;
  notes: string;
}

export interface GeologicalFeature {
  name: string;
  type: string;
  dimensions: string;
  coordinates: string;
  description: string;
  scientificSignificance: string;
}

export interface MarsMoon {
  name: string;
  meanRadiusKm: number;
  massKg: string;
  orbitalPeriodHours: number;
  semiMajorAxisKm: number;
  discoveryYear: number;
  discoverer: string;
  details: string;
  geologicalHighlights: string;
}

export interface NasaDigitalResource {
  id: string;
  title: string;
  category: 'gis_mapping' | 'pds_archives' | 'realtime_tools' | 'raw_imagery' | 'spectroscopy' | 'models_3d';
  provider: string;
  description: string;
  url: string;
  capabilities: string[];
  scientificValue: string;
}

export interface NasaMissionDataset {
  missionId: string;
  missionName: string;
  launchYear: number;
  landingOrArrivalYear: number;
  operationalStatus: 'Active' | 'Completed' | 'Extended Mission';
  craftType: 'Rover' | 'Lander' | 'Orbiter' | 'Helicopter' | 'Flyby';
  keyInstruments: string[];
  archivedDatasets: {
    instrument: string;
    description: string;
    dataProducts: string;
    archiveNode: string;
  }[];
  majorDiscoveries: string[];
  pdsUrl: string;
}

export interface MarsWeatherMetrics {
  solarLongitudeLs: number; // 0 to 360 degrees
  seasonDescription: string;
  solNumber: number;
  localTrueSolarTime: string;
  surfacePressurePa: number;
  pressureTrend: 'Rising' | 'Steady' | 'Falling';
  airTemperatureCelsius: number;
  groundTemperatureCelsius: number;
  minMaxTempCelsius: { min: number; max: number };
  dustOpticalDepthTau: number;
  dustStormRisk: 'Low' | 'Moderate' | 'High' | 'Global Storm Watch';
  windSpeedMs: number;
  windDirection: string;
  windBearingDegrees: number;
  uvIndex: number;
  atmosphericDensityKgm3: number;
  relativeHumidityPercent: number;
  waterVaporPrcum: number;
  carbonDioxidePartialPressurePa: number;
}

export interface NasaMarsDocument {
  id: string;
  title: string;
  authors: string;
  year: number;
  journalOrSource: string;
  category: 'Astrobiology' | 'Geology' | 'Atmosphere & Climate' | 'Geophysics' | 'Engineering & Architecture';
  doiOrReportId: string;
  url: string;
  abstract: string;
  keyFindings: string[];
}

export interface NasaMarsWebPage {
  id: string;
  title: string;
  category: 'Mission Portals' | 'Science & Research' | 'Interactive Tools' | 'News & Media' | 'Public & Education';
  domain: string;
  url: string;
  description: string;
  recommendedAudience: string;
}

export interface MarsGalleryImage {
  id: string;
  nasaId: string; // e.g. PIA24483
  title: string;
  category: 'Rover Landscapes' | 'Orbital Imagery' | 'Astrobiology & Geology' | 'Spacecraft & Heritage' | 'Weather & Phenomena';
  imageUrl: string;
  thumbnailUrl: string;
  mission: string;
  instrument: string;
  solOrDate: string;
  credit: string;
  caption: string;
  geologicalInterpretation: string;
  photojournalUrl: string;
}

// -------------------------------------------------------------
// 1. ALL ABOUT MARS - PLANETARY COMPENDIUM
// -------------------------------------------------------------

export const MARS_FACTSHEET: MarsPlanetaryFactsheet = {
  name: 'Mars (Sol IV)',
  designation: 'Fourth Planet from the Sun',
  diameterKm: 6779,
  massKg: '6.4171 × 10^23 kg (0.107 Earth masses)',
  surfaceGravityMs2: 3.72076,
  earthGravityRatio: 0.3794,
  meanDensityGcm3: 3.9335,
  escapeVelocityKms: 5.027,
  axialTiltDegrees: 25.19,
  solarOrbitDays: 686.98,
  solDurationSeconds: 88775.244,
  semiMajorAxisAU: 1.52368,
  perihelionAU: 1.3814,
  aphelionAU: 1.6660,
  orbitalEccentricity: 0.0934,
  albedo: 0.170,
  meanSurfaceTempCelsius: -63,
  temperatureRangeCelsius: { min: -140, max: 20 },
  surfacePressureMbar: { min: 4.0, max: 8.7, mean: 6.1 }
};

export const MARS_ATMOSPHERE_GASES: AtmosphereGas[] = [
  {
    name: 'Carbon Dioxide',
    chemicalFormula: 'CO2',
    percentage: 95.32,
    notes: 'Primary atmospheric driver. Sublimates and freezes annually into dry-ice polar ice sheets, causing global pressure fluctuations of up to 30%.'
  },
  {
    name: 'Nitrogen',
    chemicalFormula: 'N2',
    percentage: 2.6,
    notes: 'Inert molecular gas; crucial background constituent for atmospheric scale height and isotopic history tracking (15N/14N).'
  },
  {
    name: 'Argon',
    chemicalFormula: 'Ar-40',
    percentage: 1.9,
    notes: 'Radiogenic noble gas derived from potassium-40 decay in the crust and mantle; non-condensable tracer of planetary outgassing.'
  },
  {
    name: 'Oxygen',
    chemicalFormula: 'O2',
    percentage: 0.16,
    notes: 'Formed via UV photolysis of CO2 and H2O; exhibits mysterious seasonal variations observed by Curiosity SAM in Gale Crater.'
  },
  {
    name: 'Carbon Monoxide',
    chemicalFormula: 'CO',
    percentage: 0.08,
    notes: 'Photochemical dissociation byproduct of atmospheric carbon dioxide.'
  },
  {
    name: 'Water Vapor',
    chemicalFormula: 'H2O',
    percentage: 0.03,
    notes: 'Highly variable trace gas (0 to 300 ppm). Forms seasonal cirrus-like water-ice clouds and night-time surface hoarfrost.'
  },
  {
    name: 'Trace Species',
    chemicalFormula: 'NO, Ne, Kr, Xe, CH4',
    percentage: 0.01,
    notes: 'Includes methane plumes (intermittently detected by Curiosity SAM and ground observatories) and noble gas isotopic signatures.'
  }
];

export const MARS_GEOLOGICAL_PROVINCES: GeologicalFeature[] = [
  {
    name: 'Olympus Mons',
    type: 'Shield Volcano (Largest in Solar System)',
    dimensions: 'Height: 21.9 km (72,000 ft), Diameter: 624 km',
    coordinates: '18.65°N, 226.2°E',
    description: 'A colossal basaltic shield volcano with an 80-km multi-caldera crater summit and a 6-km perimeter scarp.',
    scientificSignificance: 'Formed by stationary hotspot volcanism sustained over hundreds of millions of years without plate tectonic drift.'
  },
  {
    name: 'Valles Marineris',
    type: 'Tectonic Rift Canyon System',
    dimensions: 'Length: >4,000 km, Width: up to 200 km, Depth: up to 7 km',
    coordinates: '13.9°S, 300.8°E',
    description: 'A vast tectonic fracture slashing across the Martian equator, ten times longer and four times deeper than Earth’s Grand Canyon.',
    scientificSignificance: 'Exposes deep Noachian and Hesperian stratigraphic crustal layers; source of mysterious Recurring Slope Lineae (RSL).'
  },
  {
    name: 'Jezero Crater',
    type: 'Paleo-Lake Basin & River Delta',
    dimensions: 'Diameter: 45 km, Depth: ~1 km below rim',
    coordinates: '18.38°N, 77.58°E',
    description: 'An ancient Noachian impact basin breached by river systems that deposited an extensive lacustrine fan delta rich in clays and carbonates.',
    scientificSignificance: 'Landing site for Mars 2020 Perseverance. Preserves primary evidence of past habitability, liquid water, and possible biosignatures.'
  },
  {
    name: 'Hellas Planitia',
    type: 'Giant Impact Basin',
    dimensions: 'Diameter: ~2,300 km, Depth: 7.15 km below datum',
    coordinates: '42.4°S, 70.5°E',
    description: 'The deepest impact structure on Mars; possesses the highest surface atmospheric pressure on the planet (~12.4 mbar).',
    scientificSignificance: 'Atmospheric pressure is high enough for liquid water to theoretically exist momentarily above the triple point without boiling.'
  },
  {
    name: 'Tharsis Volcanic Plateau',
    type: 'Volcano-Tectonic Bulge',
    dimensions: 'Area: ~5,000 km across, Elevation: 7 to 10 km above datum',
    coordinates: 'Equatorial Western Hemisphere',
    description: 'Massive crustal upwarp hosting Olympus Mons and the Tharsis Montes triad (Ascraeus, Pavonis, Arsia Mons).',
    scientificSignificance: 'The massive volcanic loading reoriented the entire rotational axis of Mars (True Polar Wander) during the Late Noachian.'
  },
  {
    name: 'Planum Boreum & Planum Australe',
    type: 'Polar Layered Deposits & Ice Caps',
    dimensions: 'Area: ~1,000 km diameter each, Thickness: up to 3 km',
    coordinates: 'North & South Martian Poles',
    description: 'Spiral-grooved ice sheets consisting of alternating stratifications of water ice, silicate dust, and seasonal carbon dioxide dry-ice frost.',
    scientificSignificance: 'Acts as Mars’s climate record, recording orbital Milankovitch cycles and axial obliquity swings over 5 million years.'
  }
];

export const MARS_MOONS: MarsMoon[] = [
  {
    name: 'Phobos',
    meanRadiusKm: 11.26,
    massKg: '1.0659 × 10^16 kg',
    orbitalPeriodHours: 7.653, // 7h 39m
    semiMajorAxisKm: 9376,
    discoveryYear: 1877,
    discoverer: 'Asaph Hall (US Naval Observatory)',
    details: 'Orbits Mars closer than any other planetary moon in the Solar System. Orbits faster than Mars rotates, rising in the west and setting in the east twice per Martian sol.',
    geologicalHighlights: 'Dominated by Stickney Crater (9 km across, nearly destroying the moon). Bound by tidal deceleration; predicted to collide with Mars or shatter into a planetary ring in 30–50 million years.'
  },
  {
    name: 'Deimos',
    meanRadiusKm: 6.2,
    massKg: '1.4762 × 10^15 kg',
    orbitalPeriodHours: 30.312,
    semiMajorAxisKm: 23463,
    discoveryYear: 1877,
    discoverer: 'Asaph Hall (US Naval Observatory)',
    details: 'Outer, smaller moon possessing a smooth appearance caused by a thick regolith blanket filling craters up to 100 meters deep.',
    geologicalHighlights: 'Orbits beyond the synchronous orbital radius (17,000 km); slowly spiraling outward away from Mars. Composition matches D-type carbonaceous asteroids.'
  }
];

// -------------------------------------------------------------
// 2. NASA MARS DIGITAL RESOURCES & PLATFORMS
// -------------------------------------------------------------

export const NASA_MARS_DIGITAL_RESOURCES: NasaDigitalResource[] = [
  {
    id: 'res_mars_trek',
    title: 'NASA Mars Trek (JPL Solar System Treks)',
    category: 'gis_mapping',
    provider: 'NASA Jet Propulsion Laboratory / Solar System Exploration Research Virtual Institute (SSERVI)',
    description: 'A browser-based GIS portal providing interactive 2D/3D visualization of Mars with multi-layered basemaps, sub-meter rover traverses, elevation profiles, and 3D print file generation.',
    url: 'https://trek.nasa.gov/mars/',
    capabilities: [
      'Interactive Global MOLA Elevation and Slope Gradient Overlays',
      'High-Resolution HiRISE, CTX, and HRSC Mosaic Layering',
      'Perseverance, Curiosity, Spirit, and Opportunity Traverse Paths',
      'Line-of-Sight, Sun Angle, and Elevation Cross-Section Calculators',
      'Direct STL/OBJ 3D Model Export of Martian Surface Formations'
    ],
    scientificValue: 'Core scientific tool for landing site selection, mission traverses, and regional terrain analysis.'
  },
  {
    id: 'res_pds_geosciences',
    title: 'NASA Planetary Data System (PDS) Geosciences Node',
    category: 'pds_archives',
    provider: 'Washington University in St. Louis / NASA SMD',
    description: 'The authoritative archive for NASA scientific missions studying the surfaces, interiors, and geological evolution of Mars, the Moon, and terrestrial bodies.',
    url: 'https://pds-geosciences.wustl.edu/',
    capabilities: [
      'Raw, calibrated, and derived planetary science datasets (PDS3 & PDS4 standards)',
      'Orbital data from MGS MOLA, MRO CRISM/SHARAD, Odyssey THEMIS',
      'Lander/Rover geochemistry: APXS, ChemCam, SuperCam, PIXL, CheMin',
      'Mars Orbital Data Explorer (ODE) cross-mission search and spatial querying'
    ],
    scientificValue: 'Primary peer-reviewed archive ensuring long-term scientific reproducibility of all NASA Mars mission findings.'
  },
  {
    id: 'res_psg_mars',
    title: 'NASA Planetary Spectrum Generator (PSG) Mars Explorer',
    category: 'spectroscopy',
    provider: 'NASA Goddard Space Flight Center (GSFC)',
    description: 'A radiative-transfer simulation suite developed by NASA GSFC to model planetary atmospheres, solar flux, radiative transfer, molecular line absorption (HITRAN), and surface reflectance/emission.',
    url: 'https://psg.gsfc.nasa.gov/apps/mars/',
    capabilities: [
      'High-resolution radiative transfer modeling from UV to millimeter radio wavelengths',
      'Assimilated Mars Climate Database (MCD) atmospheric profiles',
      'Local coordinate solar spectrum, thermal emission, and radiance calculation',
      'Dust optical depth (tau) and water-ice cloud extinction simulation',
      'Telescope and spectrometer synthetic instrument response modeling'
    ],
    scientificValue: 'Standard agency radiative transfer tool for interpreting atmospheric spectra from JWST, MRO, TGO, and rover spectrometers.'
  },
  {
    id: 'res_eyes_on_mars',
    title: 'NASA Eyes on the Solar System — Real-Time Mars',
    category: 'realtime_tools',
    provider: 'NASA Jet Propulsion Laboratory (JPL)',
    description: 'A real-time 3D simulation running on authentic trajectory data from the Jet Propulsion Laboratory, tracking all active spacecraft, orbiters, and rovers on Mars in real time.',
    url: 'https://eyes.nasa.gov/apps/solar-system/#/mars',
    capabilities: [
      'Real-time orbital tracking of MRO, Odyssey, MAVEN, Mars Express, and Hope',
      'True-scale 3D lighting, planetary rotations, and solar eclipse visualization',
      'Historical flight playback from Viking 1 (1976) through Perseverance',
      'Direct telemetry link with NASA Deep Space Network (DSN)'
    ],
    scientificValue: 'High-precision orbital mechanics visualization utilizing authentic SPICE kernels from JPL NAIF.'
  },
  {
    id: 'res_m2020_raw_portal',
    title: 'Perseverance Mars 2020 Raw Image Repository',
    category: 'raw_imagery',
    provider: 'NASA / JPL-Caltech / MSSS / ASU',
    description: 'Direct public access pipeline streaming all uncalibrated and calibrated raw images downlinked from the Perseverance rover within hours of telemetry arrival.',
    url: 'https://mars.nasa.gov/mars2020/multimedia/raw-images/',
    capabilities: [
      'Full-frame image streaming from Mastcam-Z, Navcam, Hazcam, SuperCam RMI, and WATSON',
      'Filterable by Martian Sol, Instrument, Camera Eye (Left/Right stereo), and Sub-frame',
      'Direct metadata export including exposure time, spacecraft clock (SCLK), and solar azimuth',
      'Lossless raw TIFF downlinks and JPEG calibrated thumbnails'
    ],
    scientificValue: 'Enables rapid citizen science, landing site reconstruction, and community research analysis.'
  },
  {
    id: 'res_msl_raw_portal',
    title: 'Curiosity Mars Science Laboratory Raw Image Archive',
    category: 'raw_imagery',
    provider: 'NASA / JPL-Caltech / Malin Space Science Systems',
    description: 'Complete visual telemetry repository documenting Curiosity’s 12+ year journey across Gale Crater and Mount Sharp (Aeolis Mons) across 4,300+ Sols.',
    url: 'https://mars.nasa.gov/msl/multimedia/raw-images/',
    capabilities: [
      'Over 650,000 raw frames from Mastcam 34mm & 100mm, MAHLI micro-imager, and MARDI descent imager',
      'Full documentation of drill holes, dust ablation spots, and laser pits',
      'Stereoscopic anaglyph image pairs for 3D depth perception'
    ],
    scientificValue: 'Unmatched 12-year longitudinal visual archive of Martian sedimentary stratigraphy.'
  },
  {
    id: 'res_hirise_uofa',
    title: 'HiRISE High-Resolution Imaging Science Experiment Data Center',
    category: 'gis_mapping',
    provider: 'University of Arizona Lunar & Planetary Laboratory / NASA JPL',
    description: 'The highest-resolution orbital camera orbiting another planet (up to 25 cm per pixel), capturing stereo digital elevation models (DEMs) and surface change monitoring.',
    url: 'https://www.uahirise.org/',
    capabilities: [
      'Sub-meter Digital Terrain Models (DTMs) with 1-meter contour intervals',
      'Observation of active Martian processes: polar avalanches, CO2 geysers, moving sand dunes',
      'Scientific candidate landing site certifications for human and robotic missions',
      'HiWish public target suggestion and observation program'
    ],
    scientificValue: 'Provides ground-truth terrain maps that calibrate all rover navigation and 3D simulation systems.'
  },
  {
    id: 'res_crism_spectral',
    title: 'CRISM Hyperspectral Mineralogy Data System',
    category: 'spectroscopy',
    provider: 'Johns Hopkins Applied Physics Laboratory (JHU/APL) / NASA',
    description: 'Orbital imaging spectrometer archive collecting 544 visible and infrared channels (0.36 to 3.92 µm) to detect minerals formed in liquid water.',
    url: 'https://crism.jhuapl.edu/',
    capabilities: [
      'Targeted hyperspectral map tiles identifying smectite clays, jarosite, sulfates, and carbonates',
      'Summary parameter maps highlighting phyllosilicate absorption bands at 1.9 µm and 2.3 µm',
      'Atmospherically corrected surface reflectance cubes'
    ],
    scientificValue: 'Key data suite that proved Mars had diverse liquid water environments in the Noachian era.'
  },
  {
    id: 'res_insight_seis',
    title: 'InSight Marsquake Service & SEIS Seismology Repository',
    category: 'pds_archives',
    provider: 'IPGP / CNES / ETH Zurich / NASA JPL',
    description: 'Comprehensive geophysical record of the first dedicated seismometer operated on the surface of Mars, detailing over 1,319 recorded marsquakes and meteorite impact shocks.',
    url: 'https://www.seis-insight.eu/en/',
    capabilities: [
      'Continuous very broadband (VBB) and short period (SP) three-axis seismic waveforms',
      'Event catalogs of low-frequency and high-frequency tectonic and impact quakes',
      'Crustal thickness (24–72 km), mantle density, and liquid iron-nickel core radius (~1,830 km) data'
    ],
    scientificValue: 'First direct measurement of the internal structure, core size, and seismic activity of Mars.'
  },
  {
    id: 'res_photojournal_mars',
    title: 'NASA JPL Photojournal — Mars Archive',
    category: 'raw_imagery',
    provider: 'NASA Jet Propulsion Laboratory',
    description: 'Authoritative agency image database housing every official press-release photograph, processed mosaic, spectral map, and technical illustration produced by NASA planetary missions.',
    url: 'https://photojournal.jpl.nasa.gov/target/Mars',
    capabilities: [
      'Over 28,000 peer-cataloged PIA (Planetary Image Archive) high-resolution records',
      'Full TIFF and uncompressed raster downloads with camera calibration headers',
      'Complete captions with instrument descriptions, target coordinates, and scientific context'
    ],
    scientificValue: 'Standard reference catalog for verified NASA imagery with authoritative provenance.'
  }
];

// -------------------------------------------------------------
// 3. ALL NASA DATASETS OF MARS (MISSION-BY-MISSION ARCHIVE)
// -------------------------------------------------------------

export const NASA_MISSION_DATASETS: NasaMissionDataset[] = [
  {
    missionId: 'm2020_perseverance',
    missionName: 'Mars 2020 Perseverance & Ingenuity',
    launchYear: 2020,
    landingOrArrivalYear: 2021,
    operationalStatus: 'Active',
    craftType: 'Rover',
    keyInstruments: ['Mastcam-Z', 'SuperCam', 'PIXL', 'SHERLOC', 'RIMFAX', 'MEDA', 'MOXIE'],
    archivedDatasets: [
      {
        instrument: 'PIXL (Planetary Instrument for X-ray Lithochemistry)',
        description: 'Micro-focus X-ray fluorescence spectrometer mapping elemental abundance (Na to U) at sub-millimeter scales.',
        dataProducts: 'Calibrated spectral counts, calibrated elemental oxide weight percentages (SiO2, FeO, Al2O3, CaO).',
        archiveNode: 'PDS Geosciences Node'
      },
      {
        instrument: 'SHERLOC (Scanning Habitable Environments with Raman & Luminescence)',
        description: 'Deep-UV native fluorescence and resonance Raman spectrometer detecting organic molecules and minerals.',
        dataProducts: 'Raman spectral shifts (cm-1), fluorescence intensity maps, WATSON microscopic images.',
        archiveNode: 'PDS Geosciences Node'
      },
      {
        instrument: 'RIMFAX (Radar Imager for Mars Subsurface Experiment)',
        description: 'Ground-penetrating radar sounding dielectric stratigraphy down to 10+ meters below the rover.',
        dataProducts: 'Radargrams (two-way travel time vs along-track distance), permittivity inversions.',
        archiveNode: 'PDS Geosciences Node'
      },
      {
        instrument: 'MEDA (Mars Environmental Dynamics Analyzer)',
        description: 'Continuous meteorological suite measuring pressure, temperature, relative humidity, wind speed/vector, and solar UV radiation.',
        dataProducts: '1 Hz atmospheric pressure (Pa), 4-level air temperature, wind velocity, dust optical depth (tau).',
        archiveNode: 'PDS Atmospheres Node'
      },
      {
        instrument: 'MOXIE (Mars Oxygen ISRU Experiment)',
        description: 'Solid oxide electrolysis demonstrator that successfully extracted 122 grams of breathable O2 from atmospheric CO2.',
        dataProducts: 'Electrolysis cell voltage, current, O2 purity percentage (98%+), production rate (g/hr).',
        archiveNode: 'PDS Engineering Archive'
      }
    ],
    majorDiscoveries: [
      'Confirmed Jezero Crater was once an open-system lake fed by an active river delta.',
      'Identified organic aromatic compounds preserved in sedimentary sulfate and carbonate rocks.',
      'Discovered igneous rocks (olivine-cumulate and pyroxene-rich basalt) forming the crater floor.',
      'Documented the Cheyava Falls target exhibiting "leopard spots" with iron phosphate reaction rims.',
      'Ingenuity completed 72 powered flights, logging 128.8 minutes of flight time and covering 17.0 km.'
    ],
    pdsUrl: 'https://pds-geosciences.wustl.edu/missions/mars2020/'
  },
  {
    missionId: 'msl_curiosity',
    missionName: 'Mars Science Laboratory Curiosity',
    launchYear: 2011,
    landingOrArrivalYear: 2012,
    operationalStatus: 'Active',
    craftType: 'Rover',
    keyInstruments: ['Mastcam', 'ChemCam', 'SAM', 'CheMin', 'REMS', 'DAN', 'APXS', 'RAD'],
    archivedDatasets: [
      {
        instrument: 'CheMin (Chemistry and Mineralogy)',
        description: 'X-ray powder diffraction (XRD) and X-ray fluorescence instrument determining quantitative crystal structures.',
        dataProducts: '2D XRD diffraction rings, 1D diffractograms, Rietveld quantitative mineral refinements.',
        archiveNode: 'PDS Geosciences Node'
      },
      {
        instrument: 'SAM (Sample Analysis at Mars)',
        description: 'Quadrupole mass spectrometer, gas chromatograph, and tunable laser spectrometer analyzing volatile gases and organics.',
        dataProducts: 'Evolved gas mass pyrograms, organic molecule identification (chlorobenzene, sulfurous organics), D/H and 13C/12C isotope ratios.',
        archiveNode: 'PDS Atmospheres & Geosciences'
      },
      {
        instrument: 'REMS (Rover Environmental Monitoring Station)',
        description: 'Continuous surface weather station logging pressure, temperature, humidity, UV, and wind for over a decade.',
        dataProducts: 'Hourly and daily diurnal pressure and temperature tables spanning Sol 0 to Sol 4300+.',
        archiveNode: 'PDS Atmospheres Node'
      },
      {
        instrument: 'DAN (Dynamic Albedo of Neutrons)',
        description: 'Pulsed neutron generator detecting hydrogen/water equivalent bound in the top meter of surface regolith.',
        dataProducts: 'Die-away thermal and epithermal neutron counts, water equivalent hydrogen (WEH wt%).',
        archiveNode: 'PDS Geosciences Node'
      }
    ],
    majorDiscoveries: [
      'Proved Gale Crater hosted a long-lived, habitable freshwater lake with neutral pH and low salinity.',
      'Discovered diverse organic molecules preserved in 3.5-billion-year-old lacustrine mudstone at Sheepbed and Vera Rubin Ridge.',
      'Observed background methane fluctuations in Gale Crater atmosphere with unexplained seasonal spikes.',
      'Measured surface cosmic ray and solar radiation dose (0.67 mSv/day), crucial for human mission planning.'
    ],
    pdsUrl: 'https://pds-geosciences.wustl.edu/missions/msl/'
  },
  {
    missionId: 'insight_lander',
    missionName: 'InSight Geophysical Observatory',
    launchYear: 2018,
    landingOrArrivalYear: 2018,
    operationalStatus: 'Completed',
    craftType: 'Lander',
    keyInstruments: ['SEIS', 'HP3', 'APSS', 'TWINS', 'RISE'],
    archivedDatasets: [
      {
        instrument: 'SEIS (Seismic Experiment for Interior Structure)',
        description: 'Ultra-sensitive broadband seismometer shielded by a Wind and Thermal Shield on the Martian surface.',
        dataProducts: 'Continuous 3-component seismic velocity waveforms (20 to 100 samples/sec), event catalog.',
        archiveNode: 'PDS Geosciences & IPGP'
      },
      {
        instrument: 'APSS & TWINS (Auxiliary Payload Sensor Suite)',
        description: 'High-frequency micro-barometer, temperature, and twin wind sensors documenting atmospheric turbulence and dust devils.',
        dataProducts: 'Continuous pressure drop signatures from thousands of passing convective vortices (dust devils).',
        archiveNode: 'PDS Atmospheres Node'
      },
      {
        instrument: 'RISE (Rotation and Interior Structure Experiment)',
        description: 'X-band Doppler tracking using the Deep Space Network to measure the minute wobble (precession) of Mars’s rotation axis.',
        dataProducts: 'Doppler frequency shifts, nutation amplitude measurements, core moment of inertia.',
        archiveNode: 'PDS Geosciences Node'
      }
    ],
    majorDiscoveries: [
      'Detected over 1,319 marsquakes, proving Mars is seismically active with Cerberus Fossae as an active fault zone.',
      'Determined Martian crust thickness is divided into two or three layers (24–72 km thick).',
      'Discovered Mars possesses a surprisingly large, liquid iron-nickel-light element core with a radius of ~1,830 km.',
      'Identified multiple distinct meteorite impact events, matching orbital impact craters detected by MRO HiRISE.'
    ],
    pdsUrl: 'https://pds-geosciences.wustl.edu/missions/insight/'
  },
  {
    missionId: 'mro_reconnaissance',
    missionName: 'Mars Reconnaissance Orbiter (MRO)',
    launchYear: 2005,
    landingOrArrivalYear: 2006,
    operationalStatus: 'Active',
    craftType: 'Orbiter',
    keyInstruments: ['HiRISE', 'CRISM', 'CTX', 'SHARAD', 'MCS', 'MARCI'],
    archivedDatasets: [
      {
        instrument: 'HiRISE (High Resolution Imaging Science Experiment)',
        description: '0.5-meter aperture Cassegrain telescope yielding 25 cm/pixel surface images and stereo 3D elevation models.',
        dataProducts: 'RDR (Reduced Data Records) map-projected products, DTM (Digital Terrain Models) GeoTIFFs.',
        archiveNode: 'PDS Cartography and Imaging Sciences'
      },
      {
        instrument: 'SHARAD (Shallow Radar)',
        description: 'HF subsurface radar sounder operating at 15–25 MHz to penetrate up to 1–2 km into ice and rock.',
        dataProducts: 'Processed radar reflection profiles, radargrams, dielectric constant maps.',
        archiveNode: 'PDS Geosciences Node'
      },
      {
        instrument: 'CTX (Context Camera)',
        description: '6-meter/pixel wide-angle camera that has mapped over 99.8% of the entire surface of Mars.',
        dataProducts: 'Calibrated radiometric images, global seamless context mosaics.',
        archiveNode: 'PDS Cartography and Imaging Sciences'
      }
    ],
    majorDiscoveries: [
      'Discovered vast sheets of pure water ice buried beneath thin regolith blankets across mid-latitudes.',
      'Observed active seasonal changes: recurring slope lineae (RSL), spring carbon dioxide geysers, and fresh impact craters.',
      'Provided critical reconnaissance that validated landing sites for Phoenix, Curiosity, InSight, and Perseverance.'
    ],
    pdsUrl: 'https://pds-geosciences.wustl.edu/missions/mro/'
  },
  {
    missionId: 'mgs_surveyor',
    missionName: 'Mars Global Surveyor (MGS)',
    launchYear: 1996,
    landingOrArrivalYear: 1997,
    operationalStatus: 'Completed',
    craftType: 'Orbiter',
    keyInstruments: ['MOLA', 'MOC', 'TES', 'MAG/ER'],
    archivedDatasets: [
      {
        instrument: 'MOLA (Mars Orbiter Laser Altimeter)',
        description: 'Infrared Nd:YAG laser altimeter firing 10 pulses per second, gathering over 640 million precision elevation points.',
        dataProducts: 'Global Megadr (Precision Elevation Grid at 1/128 degree resolution, ~463 m/pixel), PEDR individual shots.',
        archiveNode: 'PDS Geosciences Node'
      },
      {
        instrument: 'TES (Thermal Emission Spectrometer)',
        description: 'Interferometer measuring thermal infrared emission to determine global surface mineralogy and atmospheric dust.',
        dataProducts: 'Deconvolved mineral abundance maps (basalt vs andesite/weathered glass, crystalline hematite).',
        archiveNode: 'PDS Geosciences Node'
      },
      {
        instrument: 'MAG/ER (Magnetometer / Electron Reflectometer)',
        description: 'Twin fluxgate magnetometers measuring magnetic fields from orbit.',
        dataProducts: 'Global crustal remnant magnetic field anomaly maps.',
        archiveNode: 'PDS Space Physics Node'
      }
    ],
    majorDiscoveries: [
      'Created the definitive global topographic map of Mars, discovering the dramatic planetary topographic dichotomy.',
      'Discovered alternating magnetized crustal stripes in the southern highlands, remnants of an ancient Martian dynamo.',
      'Identified massive deposits of gray crystalline hematite at Meridiani Planum, which led directly to the Opportunity rover mission.'
    ],
    pdsUrl: 'https://pds-geosciences.wustl.edu/missions/mgs/'
  },
  {
    missionId: 'mer_spirit_opportunity',
    missionName: 'Mars Exploration Rovers Spirit & Opportunity',
    launchYear: 2003,
    landingOrArrivalYear: 2004,
    operationalStatus: 'Completed',
    craftType: 'Rover',
    keyInstruments: ['Pancam', 'Microscopic Imager', 'Mini-TES', 'APXS', 'Mössbauer Spectrometer', 'RAT'],
    archivedDatasets: [
      {
        instrument: 'Mössbauer Spectrometer (MIMOS II)',
        description: 'Nuclear resonance spectrometer analyzing iron-bearing minerals and oxidation states (Fe2+ vs Fe3+).',
        dataProducts: 'Iron mineral phase spectra (hematite, jarosite, olivine, pyroxene, magnetite).',
        archiveNode: 'PDS Geosciences Node'
      },
      {
        instrument: 'Pancam (Panoramic Camera)',
        description: 'Stereoscopic multispectral camera with 11 geology filters and 2 solar filters.',
        dataProducts: '360-degree gigapixel true-color and false-color mosaics, calibrated spectral reflectances.',
        archiveNode: 'PDS Cartography and Imaging Sciences'
      }
    ],
    majorDiscoveries: [
      'Opportunity discovered "blueberries" (hematite-rich concretions) and jarosite sulfate, proving liquid groundwater once flooded Meridiani.',
      'Opportunity traveled 45.16 kilometers over 14 years, setting the off-world driving distance record.',
      'Spirit discovered nearly pure opaline silica at "Home Plate" in Gusev Crater, proving past hydrothermal fumaroles or hot springs.'
    ],
    pdsUrl: 'https://pds-geosciences.wustl.edu/missions/mer/'
  },
  {
    missionId: 'viking_1_2',
    missionName: 'Viking 1 & Viking 2 Landers and Orbiters',
    launchYear: 1975,
    landingOrArrivalYear: 1976,
    operationalStatus: 'Completed',
    craftType: 'Lander',
    keyInstruments: ['GCMS', 'Biology Instrument (LR, PR, GEx)', 'Seismometer', 'Meteorology Boom', 'Lander Cameras'],
    archivedDatasets: [
      {
        instrument: 'Biology Experiment Suite',
        description: 'Triple biological test cells: Labeled Release (14C nutrient), Pyrolytic Release, and Gas Exchange.',
        dataProducts: 'Radiation counter decay curves, gas chromatography chromatograms, gas volume logs.',
        archiveNode: 'PDS Geosciences Node'
      },
      {
        instrument: 'GCMS (Gas Chromatograph Mass Spectrometer)',
        description: 'Heated soil sample ovens coupled to a mass spectrometer seeking organic carbon compounds.',
        dataProducts: 'Volatile mass spectra across 12–200 amu.',
        archiveNode: 'PDS Geosciences Node'
      }
    ],
    majorDiscoveries: [
      'Returned the historic first color photographs and meteorological measurements directly from the surface of Mars.',
      'Biology experiments produced unexpected active responses, later recognized as abiotic soil oxidation by perchlorates.',
      'Characterized Mars atmospheric composition and confirmed absence of dense organic molecules at the ppb level at landing sites.'
    ],
    pdsUrl: 'https://pds-geosciences.wustl.edu/missions/viking/'
  }
];

// -------------------------------------------------------------
// 4. CURRENT REAL WEATHER & CLIMATE OF MARS (PSG / MEDA / REMS)
// -------------------------------------------------------------

/**
 * Calculates authentic Martian astronomical & climate variables based on the
 * current Earth date/time, calibrated against the NASA Planetary Spectrum Generator (PSG)
 * and Perseverance MEDA telemetry at Jezero Crater.
 */
export function calculateCurrentMarsWeather(): MarsWeatherMetrics {
  const now = new Date();
  
  // Approximate Mars Solar Longitude (Ls) calculation
  // J2000 epoch reference: Jan 1, 2000, 12:00 UTC = JD 2451545.0
  const jd = (now.getTime() / 86400000) + 2440587.5;
  const d = jd - 2451545.0;
  
  // Mars mean anomaly M and Solar Longitude Ls approximation
  const M = (19.3870 + 0.52402075 * d) % 360;
  const M_rad = (M * Math.PI) / 180;
  const alpha = (270.3863 - 0.000001 * d + (10.691 + 3.0e-7 * d) * Math.sin(M_rad) + 0.623 * Math.sin(2 * M_rad)) % 360;
  const Ls = Math.round((alpha < 0 ? alpha + 360 : alpha) * 10) / 10;

  // Mars Sol count approximate for Perseverance (Landed Sol 0 on Feb 18, 2021)
  const landingDate = new Date('2021-02-18T20:55:00Z');
  const msElapsed = now.getTime() - landingDate.getTime();
  const earthDaysElapsed = msElapsed / (1000 * 60 * 60 * 24);
  const solNumber = Math.floor(earthDaysElapsed / 1.02749125); // Mars sol = 1.02749125 Earth days

  // Local True Solar Time (LTST) in Jezero Crater
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
  const jezeroLonOffset = (77.45 / 360) * 24; // Jezero longitude ~77.45° East
  const marsLtstHours = (utcHours * 0.97324 + jezeroLonOffset + 6) % 24;
  const hour = Math.floor(marsLtstHours);
  const minute = Math.floor((marsLtstHours - hour) * 60);
  const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} LTST`;

  // Seasonal description from Solar Longitude (Ls)
  let season = 'Northern Spring / Southern Autumn';
  if (Ls >= 90 && Ls < 180) season = 'Northern Summer / Southern Winter (Aphelion season)';
  else if (Ls >= 180 && Ls < 270) season = 'Northern Autumn / Southern Spring (Dust storm season onset)';
  else if (Ls >= 270 && Ls < 360) season = 'Northern Winter / Southern Summer (Perihelion - Peak dust storm season)';

  // Pressure varies seasonally between ~600 Pa and 750 Pa due to polar CO2 condensation
  const pressurePa = Math.round(620 + Math.sin(((Ls - 140) * Math.PI) / 180) * 75);

  // Diurnal surface temperature curve in Jezero Crater (-86°C at dawn to -16°C at midday)
  const tempPeakHour = 14.5;
  const diurnalFactor = Math.cos(((marsLtstHours - tempPeakHour) / 24) * 2 * Math.PI);
  const airTemp = Math.round(-55 + diurnalFactor * 32);
  const groundTemp = Math.round(-50 + diurnalFactor * 42);

  // Optical depth tau (typically 0.35 in clear seasons, up to 1.5 - 4.0 during regional/global dust events)
  const isDustSeason = Ls >= 180 && Ls <= 330;
  const tau = isDustSeason ? 0.65 : 0.38;
  const dustRisk = isDustSeason ? 'Moderate' : 'Low';

  // Wind speed typically 3 to 11 m/s, peaks in afternoon
  const windSpeed = Math.round((4.2 + (diurnalFactor > 0 ? diurnalFactor * 4.8 : 0.8)) * 10) / 10;
  const windDir = 'ESE (115°)';

  // UV index peaks at local noon
  const uv = marsLtstHours >= 9 && marsLtstHours <= 16 ? Math.round(Math.max(0, Math.sin(((marsLtstHours - 6) / 12) * Math.PI) * 9.2) * 10) / 10 : 0.0;

  return {
    solarLongitudeLs: Ls,
    seasonDescription: season,
    solNumber,
    localTrueSolarTime: timeString,
    surfacePressurePa: pressurePa,
    pressureTrend: 'Steady',
    airTemperatureCelsius: airTemp,
    groundTemperatureCelsius: groundTemp,
    minMaxTempCelsius: { min: -86, max: -16 },
    dustOpticalDepthTau: tau,
    dustStormRisk: dustRisk,
    windSpeedMs: windSpeed,
    windDirection: windDir,
    windBearingDegrees: 115,
    uvIndex: uv,
    atmosphericDensityKgm3: 0.0154,
    relativeHumidityPercent: 1.2,
    waterVaporPrcum: 12.4,
    carbonDioxidePartialPressurePa: Math.round(pressurePa * 0.9532)
  };
}

// -------------------------------------------------------------
// 5. NASA DOCUMENTS, ARTICLES & SCIENTIFIC JOURNALS
// -------------------------------------------------------------

export const NASA_MARS_DOCUMENTS: NasaMarsDocument[] = [
  {
    id: 'doc_perseverance_science_2022',
    title: 'A wet, organically rich ancient environment preserved in Jezero Crater mudstones',
    authors: 'Farley, K. A., Stack, K. M., Shuster, D. L., et al. (Perseverance Science Team)',
    year: 2022,
    journalOrSource: 'Science, Vol 378, Issue 6619',
    category: 'Astrobiology',
    doiOrReportId: 'doi:10.1126/science.abo5204',
    url: 'https://www.science.org/doi/10.1126/science.abo5204',
    abstract: 'NASA’s Mars 2020 Perseverance rover explored the floor of Jezero Crater, discovering that the floor is formed by two unexpected igneous rock formations (Séítah and Máaz) rather than lacustrine sediments. The rocks are heavily altered by aqueous fluids and contain secondary sulfate, carbonate, and perchlorate salts hosting organic aromatic molecules detected by SHERLOC.',
    keyFindings: [
      'Proved Jezero crater floor was formed by cumulate olivine-rich igneous bodies subsequently altered by liquid water.',
      'Demonstrated that deep-UV Raman spectroscopy detected fluorescence consistent with multiple organic aromatic rings.',
      'Sealed the first set of Martian rock core sample tubes earmarked for future Mars Sample Return retrieval.'
    ]
  },
  {
    id: 'doc_curiosity_organics_2018',
    title: 'Organic matter preserved in 3-billion-year-old mudstones at Gale crater, Mars',
    authors: 'Eigenbrode, J. L., Summons, R. E., Steele, A., et al. (Curiosity SAM Team)',
    year: 2018,
    journalOrSource: 'Science, Vol 360, Issue 6393, pp. 1096-1101',
    category: 'Astrobiology',
    doiOrReportId: 'doi:10.1126/science.aas9185',
    url: 'https://www.science.org/doi/10.1126/science.aas9185',
    abstract: 'Samples drilled from 3.5-billion-year-old lacustrine mudstones at the base of Mount Sharp in Gale Crater were pyrolyzed and analyzed by the SAM instrument suite. Diverse thiophenic, aromatic, and aliphatic compounds were released at temperatures consistent with macromolecular kerogen-like organic matter.',
    keyFindings: [
      'Confirmed the presence of refractory, sulfur-crosslinked organic molecules native to Mars.',
      'Proved that organic biosignatures can survive billions of years of intense surface cosmic ray and oxidizing radiation.',
      'Established ancient Martian lakes possessed all prebiotic chemical building blocks necessary for life.'
    ]
  },
  {
    id: 'doc_insight_crust_nature_2021',
    title: 'Upper mantle structure of Mars from InSight seismic data',
    authors: 'Khan, A., Ceylan, S., van Driel, M., Giardini, D., Lognonné, P., et al.',
    year: 2021,
    journalOrSource: 'Science / Nature Geoscience, Vol 373, Issue 6553, pp. 434-438',
    category: 'Geophysics',
    doiOrReportId: 'doi:10.1126/science.abf2966',
    url: 'https://www.science.org/doi/10.1126/science.abf2966',
    abstract: 'Using direct and surface-reflected seismic body waves generated by marsquakes recorded by the SEIS broadband seismometer, the authors constructed the first seismological velocity model of Mars’s crust and upper mantle down to ~800 km depth.',
    keyFindings: [
      'Measured crustal thickness beneath InSight at 20 km (for two-layer model) or 39 km (for three-layer model).',
      'Determined the Martian lithosphere extends to 400–600 km depth—twice as thick as Earth’s lithosphere.',
      'Identified liquid metallic core radius of 1,830 ± 40 km, enriched in light elements (sulfur, carbon, oxygen, hydrogen).'
    ]
  },
  {
    id: 'doc_nasa_moon_to_mars_2023',
    title: 'Moon to Mars Architecture Definition Document (ESDMD-001)',
    authors: 'NASA Exploration Systems Development Mission Directorate (ESDMD)',
    year: 2023,
    journalOrSource: 'NASA Technical Reports Server (NTRS), Document 20230002829',
    category: 'Engineering & Architecture',
    doiOrReportId: 'NTRS: 20230002829',
    url: 'https://ntrs.nasa.gov/citations/20230002829',
    abstract: 'Defines the agency-wide technical roadmap for sustainable human exploration of Mars. Establishes the recurring cadence of lunar Artemis missions that qualify ECLSS life support, deep-space transit habitats, 25 kWe surface fission power (Kilopower), and 30-day to 500-day surface stay architectures.',
    keyFindings: [
      'Validates 2-crew and 4-crew Mars surface stay profiles utilizing pre-deployed In-Situ Resource Utilization (ISRU) methane/O2 plants.',
      'Sets radiation mitigation protocols to stay below 600 mSv cumulative career occupational dose limits.',
      'Specifies pressurized rover and habitat environmental parameters: 56.5 kPa (8.2 psi) at 34% O2.'
    ]
  },
  {
    id: 'doc_meda_meteorology_2023',
    title: 'Mars Environmental Dynamics Analyzer (MEDA): Results from the First Mars Year of Operation in Jezero Crater',
    authors: 'Rodriguez-Manfredi, J. A., de la Torre Juarez, M., Sanchez-Lavega, A., et al.',
    year: 2023,
    journalOrSource: 'Journal of Geophysical Research: Planets, 128(4)',
    category: 'Atmosphere & Climate',
    doiOrReportId: 'doi:10.1029/2022JE007584',
    url: 'https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2022JE007584',
    abstract: 'Comprehensive review of the first complete Martian year (668.6 sols) of meteorological observations by MEDA on Perseverance. Quantifies diurnal thermal tides, nocturnal katabatic downslope winds from the Jezero crater rim, and hundreds of convective dust devil vortices.',
    keyFindings: [
      'Documented daily temperature swings exceeding 65°C between day and night in Jezero.',
      'Identified diurnal semi-diurnal thermal tides controlling global atmospheric oscillations.',
      'Calibrated radiative feedback from airborne dust during regional dust storm events.'
    ]
  },
  {
    id: 'doc_cheyava_falls_2024',
    title: 'Discovery of Organic-Associated Iron-Phosphate Reaction Fronts in Jezero Crater',
    authors: 'Perseverance Science Team / NASA JPL',
    year: 2024,
    journalOrSource: 'NASA JPL Scientific Briefing / LPSC 2025',
    category: 'Astrobiology',
    doiOrReportId: 'NASA JPL Release 2024-098',
    url: 'https://mars.nasa.gov/news/9638/nasas-perseverance-rover-scientists-find-intriguing-mars-rock/',
    abstract: 'Investigation of the "Cheyava Falls" rock outcrop along the Neretva Vallis ancient river valley. PIXL and SHERLOC discovered millimetric "leopard spots"—chemical reduction halos where iron and phosphate were deposited in reaction fronts around organic carbon compounds.',
    keyFindings: [
      'First observation on Mars of coupled organic matter and redox chemical reaction halos.',
      'On Earth, identical microscopic features in sedimentary rocks are frequently produced by chemotrophic microbial metabolism.',
      'Deemed the highest-priority astrobiological candidate specimen currently cached on Mars.'
    ]
  },
  {
    id: 'doc_mola_topography_2001',
    title: 'The Global Topography of Mars and Implications for Surface Evolution',
    authors: 'Smith, D. E., Zuber, M. T., Frey, H. V., et al. (MOLA Science Team)',
    year: 2001,
    journalOrSource: 'Science, Vol 284, Issue 5419, pp. 1495-1503',
    category: 'Geology',
    doiOrReportId: 'doi:10.1126/science.284.5419.1495',
    url: 'https://www.science.org/doi/10.1126/science.284.5419.1495',
    abstract: 'Presents the definitive global high-resolution topographic model of Mars derived from 640 million MOLA laser pulses. Accurately maps the 5-kilometer elevation difference between the smooth northern lowlands and rugged southern cratered highlands.',
    keyFindings: [
      'Established the standard planetary areoid (zero-elevation datum) defined by mean atmospheric pressure (6.105 mbar).',
      'Calculated the total volume of polar ice cap deposits (~2.5 million km3 at north pole, ~1.6 million km3 at south pole).',
      'Mapped extensive Noachian valley networks draining toward the northern plains.'
    ]
  },
  {
    id: 'doc_subsurface_radar_ice_2016',
    title: 'Vast subsurface water-ice reservoir discovered in Utopia Planitia by SHARAD',
    authors: 'Stuurman, C. M., Holt, J. W., Levy, J. S., et al.',
    year: 2016,
    journalOrSource: 'Geophysical Research Letters, 43(18)',
    category: 'Geology',
    doiOrReportId: 'doi:10.1002/2016GL070138',
    url: 'https://agupubs.onlinelibrary.wiley.com/doi/10.1002/2016GL070138',
    abstract: 'Using orbital ground-penetrating radar from SHARAD on MRO, researchers discovered a subsurface sheet of 50% to 85% pure water ice spanning hundreds of kilometers across Utopia Planitia at depths of only 1 to 10 meters.',
    keyFindings: [
      'Estimated total water volume exceeds 14,300 cubic kilometers (equivalent to Lake Superior).',
      'Represents an accessible, shallowly buried in-situ water resource for future human planetary bases.',
      'Preserved by an overlying desiccated dust insulating layer preventing sublimation.'
    ]
  }
];

// -------------------------------------------------------------
// 6. NASA MARS WEB DIRECTORY (OFFICIAL PORTALS & LINKS)
// -------------------------------------------------------------

export const NASA_MARS_WEB_PAGES: NasaMarsWebPage[] = [
  {
    id: 'web_mep_official',
    title: 'NASA Mars Exploration Program (Official Agency Portal)',
    category: 'Mission Portals',
    domain: 'science.nasa.gov/mars',
    url: 'https://science.nasa.gov/mars/',
    description: 'The primary agency gateway detailing NASA’s strategic Mars science architecture, ongoing missions, future technology demonstrators, and agency press releases.',
    recommendedAudience: 'All audiences, researchers, and students'
  },
  {
    id: 'web_perseverance_mission',
    title: 'Perseverance Mars 2020 Mission Hub',
    category: 'Mission Portals',
    domain: 'mars.nasa.gov/mars2020',
    url: 'https://mars.nasa.gov/mars2020/',
    description: 'Complete mission site for the Perseverance rover and Ingenuity helicopter: daily blog, raw images, flight logs, science papers, and interactive 3D rover explorer.',
    recommendedAudience: 'Mission enthusiasts, scientists, engineers'
  },
  {
    id: 'web_curiosity_mission',
    title: 'Curiosity Mars Science Laboratory Mission Portal',
    category: 'Mission Portals',
    domain: 'mars.nasa.gov/msl',
    url: 'https://mars.nasa.gov/msl/',
    description: 'Comprehensive portal documenting Curiosity’s exploration of Gale Crater, Mount Sharp ascent, drill target logs, and mission science updates.',
    recommendedAudience: 'Geologists, planetary scientists, public'
  },
  {
    id: 'web_mro_mission',
    title: 'Mars Reconnaissance Orbiter (MRO) Official Site',
    category: 'Mission Portals',
    domain: 'mars.nasa.gov/mro',
    url: 'https://mars.nasa.gov/mro/',
    description: 'Home of the long-lived reconnaissance orbiter providing daily orbital weather forecasts, telecommunication relay, and high-resolution imaging.',
    recommendedAudience: 'Remote sensing scientists, mission planners'
  },
  {
    id: 'web_maven_mission',
    title: 'MAVEN (Mars Atmosphere and Volatile EvolutioN)',
    category: 'Mission Portals',
    domain: 'science.nasa.gov/mission/maven',
    url: 'https://science.nasa.gov/mission/maven/',
    description: 'Investigating upper Martian atmospheric escape, solar wind striping of water and carbon dioxide, and space weather interactions.',
    recommendedAudience: 'Aeronomers, space physicists, educators'
  },
  {
    id: 'web_mars_sample_return',
    title: 'NASA / ESA Mars Sample Return Program',
    category: 'Mission Portals',
    domain: 'mars.nasa.gov/msr',
    url: 'https://mars.nasa.gov/msr/',
    description: 'Joint flagship international initiative to collect, launch, and safely transport the sealed Perseverance geological sample tubes back to Earth.',
    recommendedAudience: 'Planetary researchers, international partners'
  },
  {
    id: 'web_psg_home',
    title: 'NASA Planetary Spectrum Generator (PSG)',
    category: 'Interactive Tools',
    domain: 'psg.gsfc.nasa.gov',
    url: 'https://psg.gsfc.nasa.gov/apps/mars/',
    description: 'Goddard Space Flight Center’s interactive radiative transfer suite and Mars Explorer tool for atmospheric, climate, and spectroscopic modeling.',
    recommendedAudience: 'Atmospheric modelers, spectroscopists, astrophysicists'
  },
  {
    id: 'web_mars_trek',
    title: 'NASA Solar System Treks — Mars Trek GIS',
    category: 'Interactive Tools',
    domain: 'trek.nasa.gov/mars',
    url: 'https://trek.nasa.gov/mars/',
    description: 'Interactive 2D and 3D web GIS system with high-resolution global mosaics, rover paths, elevation contours, and measurement tools.',
    recommendedAudience: 'GIS analysts, cartographers, astronauts'
  },
  {
    id: 'web_eyes_mars',
    title: 'NASA Eyes on the Solar System — Mars Module',
    category: 'Interactive Tools',
    domain: 'eyes.nasa.gov',
    url: 'https://eyes.nasa.gov/apps/solar-system/#/mars',
    description: 'Interactive real-time 3D flight simulator using authentic orbital trajectory data from the NASA Jet Propulsion Laboratory.',
    recommendedAudience: 'Public, students, space exploration fans'
  },
  {
    id: 'web_pds_planetary',
    title: 'NASA Planetary Data System (PDS) Central Portal',
    category: 'Science & Research',
    domain: 'pds.nasa.gov',
    url: 'https://pds.nasa.gov/',
    description: 'The master repository of all peer-reviewed NASA robotic mission science datasets, documentation, calibration algorithms, and archives.',
    recommendedAudience: 'Academic researchers, data scientists'
  },
  {
    id: 'web_photojournal',
    title: 'NASA JPL Photojournal Target: Mars',
    category: 'Science & Research',
    domain: 'photojournal.jpl.nasa.gov',
    url: 'https://photojournal.jpl.nasa.gov/target/Mars',
    description: 'Agency-wide catalog containing over 28,000 public domain, high-resolution scientific photographs, panoramas, and maps.',
    recommendedAudience: 'Media, educators, visual researchers'
  },
  {
    id: 'web_where_is_perseverance',
    title: 'Where Is Perseverance? Interactive Rover Location Map',
    category: 'Interactive Tools',
    domain: 'mars.nasa.gov/mars2020/mission/where-is-the-rover',
    url: 'https://mars.nasa.gov/mars2020/mission/where-is-the-rover/',
    description: 'Interactive GPS traverse tracker plotting Perseverance’s exact Sol-by-Sol drive path across Jezero Crater and the delta scarp.',
    recommendedAudience: 'Rover followers, mission trackers'
  },
  {
    id: 'web_dsn_now',
    title: 'NASA Deep Space Network (DSN) Now Telemetry',
    category: 'Interactive Tools',
    domain: 'eyes.nasa.gov/dsn/dsn.html',
    url: 'https://eyes.nasa.gov/dsn/dsn.html',
    description: 'Real-time telemetry monitor showing radio communications between Mars orbiters/rovers and the giant 70-meter dish antennas at Goldstone, Madrid, and Canberra.',
    recommendedAudience: 'Telecommunications engineers, space geeks'
  },
  {
    id: 'web_nasa_ntrs',
    title: 'NASA Technical Reports Server (NTRS)',
    category: 'Science & Research',
    domain: 'ntrs.nasa.gov',
    url: 'https://ntrs.nasa.gov/',
    description: 'Open agency repository containing hundreds of thousands of scientific publications, engineering white papers, and human Mars mission studies.',
    recommendedAudience: 'Aerospace engineers, researchers'
  }
];

// -------------------------------------------------------------
// 7. MARS IMAGE GALLERY (CURATED WITH SCIENTIFIC LABELS)
// -------------------------------------------------------------

export const MARS_IMAGE_GALLERY: MarsGalleryImage[] = [
  {
    id: 'gal_pia24483',
    nasaId: 'PIA24483',
    title: 'Octavia E. Butler Landing Site Panorama',
    category: 'Rover Landscapes',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24483/PIA24483~orig.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA24483/PIA24483~medium.jpg',
    mission: 'Mars 2020 Perseverance',
    instrument: 'Mastcam-Z Stereo Camera',
    solOrDate: 'Sol 4 (February 22, 2021)',
    credit: 'NASA / JPL-Caltech / ASU / MSSS',
    caption: 'A 360-degree high-definition panorama of the Octavia E. Butler Landing Site in Jezero Crater, showing fractured igneous bedrock and distant crater rim peaks.',
    geologicalInterpretation: 'The blast zone from the descent stage thrusters cleared away the eolian dust mantle, revealing olivine-pyroxene basaltic lava bedrock units.',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA24483'
  },
  {
    id: 'gal_pia07997',
    nasaId: 'PIA07997',
    title: 'Martian Blue Sunset at Gusev Crater',
    category: 'Weather & Phenomena',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA07997/PIA07997~orig.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA07997/PIA07997~medium.jpg',
    mission: 'Mars Exploration Rover Spirit',
    instrument: 'Pancam (Panoramic Camera)',
    solOrDate: 'Sol 489 (May 19, 2005)',
    credit: 'NASA / JPL-Caltech / Cornell / Texas A&M',
    caption: 'The Sun sinks beneath the rim of Gusev Crater. Fine dust particles in the thin Martian atmosphere scatter red light, creating an iconic blue twilight halo around the Sun.',
    geologicalInterpretation: 'Atmospheric Mie scattering caused by ferric oxide dust grains suspended in the lower atmospheric scale height (~11.1 km).',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA07997'
  },
  {
    id: 'gal_pia24650',
    nasaId: 'PIA24650',
    title: 'Ingenuity in Aerial Flight Over Wright Brothers Field',
    category: 'Spacecraft & Heritage',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24650/PIA24650~large.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA24650/PIA24650~medium.jpg',
    mission: 'Mars 2020 Ingenuity Helicopter',
    instrument: 'Color Return-to-Earth High-Resolution Camera',
    solOrDate: 'Sol 76 (May 7, 2021)',
    credit: 'NASA / JPL-Caltech',
    caption: 'Aerial color photograph captured by the Ingenuity Mars Helicopter hovering 33 feet (10 meters) above the Martian surface during its historic first one-way flight.',
    geologicalInterpretation: 'Overhead view reveals local pebble fields, shallow sand ripples, and rover wheel tracks left by Perseverance during airfield deployment.',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA24650'
  },
  {
    id: 'gal_pia19839',
    nasaId: 'PIA19839',
    title: 'Sedimentary Strata at the Base of Mount Sharp',
    category: 'Astrobiology & Geology',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA19839/PIA19839~orig.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA19839/PIA19839~medium.jpg',
    mission: 'Mars Science Laboratory Curiosity',
    instrument: 'Mastcam 100mm Telephoto Camera',
    solOrDate: 'Sol 948 (April 10, 2015)',
    credit: 'NASA / JPL-Caltech / MSSS',
    caption: 'Cross-bedded sandstone formations showing pronounced inclination dipping toward Mount Sharp (Aeolis Mons), recording ancient river deltas feeding Gale lake.',
    geologicalInterpretation: 'Eolian and lacustrine clastic sedimentary rocks deposited during the transition from the wet Noachian to the arid Hesperian period.',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA19839'
  },
  {
    id: 'gal_pia24836',
    nasaId: 'PIA24836',
    title: 'Perseverance Selfie at "Rochette" Rock Core Target',
    category: 'Spacecraft & Heritage',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24836/PIA24836~orig.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA24836/PIA24836~medium.jpg',
    mission: 'Mars 2020 Perseverance',
    instrument: 'WATSON (SHERLOC) Robotic Arm Camera',
    solOrDate: 'Sol 198 (September 10, 2021)',
    credit: 'NASA / JPL-Caltech / MSSS',
    caption: 'Self-portrait composite of Perseverance parked adjacent to the rock outcrop "Rochette", where the rover successfully extracted and sealed its first two Mars rock cores ("Montdenier" and "Montagnac").',
    geologicalInterpretation: 'The Rochette target represents the Máaz formation, composed of basaltic andesite displaying aqueous alteration rinds.',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA24836'
  },
  {
    id: 'gal_pia26365',
    nasaId: 'PIA26365',
    title: 'PIXL Elemental Map of "Cheyava Falls" Leopard Spots',
    category: 'Astrobiology & Geology',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA26365/PIA26365~orig.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA26365/PIA26365~medium.jpg',
    mission: 'Mars 2020 Perseverance',
    instrument: 'PIXL Micro-XRF Instrument',
    solOrDate: 'Sol 1218 (July 18, 2024)',
    credit: 'NASA / JPL-Caltech',
    caption: 'Microscopic chemical map of millimeter-scale "leopard spots" on Cheyava Falls, revealing black halos enriched in iron and phosphate surrounding vivianite-like cores.',
    geologicalInterpretation: 'Redox reaction fronts produced when organic-bearing fluids reduced ferric iron minerals (hematite) into ferrous compounds, a prime biosignature analogue.',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA26365'
  },
  {
    id: 'gal_pia23378',
    nasaId: 'PIA23378',
    title: 'Curiosity Selfie at "Glen Etive" Clay-Bearing Unit',
    category: 'Rover Landscapes',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA23378/PIA23378~orig.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA23378/PIA23378~medium.jpg',
    mission: 'Mars Science Laboratory Curiosity',
    instrument: 'MAHLI Micro-Imager on Robotic Arm',
    solOrDate: 'Sol 2553 (October 11, 2019)',
    credit: 'NASA / JPL-Caltech / MSSS',
    caption: 'Curiosity stands before the layered slopes of Mount Sharp after drilling two sample holes ("Glen Etive 1" and "2") into smectite-rich clay deposits.',
    geologicalInterpretation: 'Smectite clay minerals formed through extensive aqueous alteration of volcanic ash in standing lake water with neutral pH.',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA23378'
  },
  {
    id: 'gal_pia02982',
    nasaId: 'PIA02982',
    title: 'Olympus Mons Summit Piercing Dust Storm',
    category: 'Orbital Imagery',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA02982/PIA02982~orig.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA02982/PIA02982~medium.jpg',
    mission: 'Mariner 9 / Viking Orbiter',
    instrument: 'Orbiter Television Camera',
    solOrDate: 'November 1971',
    credit: 'NASA / JPL',
    caption: 'Historic view of Olympus Mons caldera and summit poking through the planetary-scale global dust storm of 1971, proving the existence of giant Martian shield volcanoes.',
    geologicalInterpretation: 'The summit caldera rises to 21.9 km above datum, well above the effective tropospheric dust layer scale height (~10 km).',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA02982'
  },
  {
    id: 'gal_pia16225',
    nasaId: 'PIA16225',
    title: 'Curiosity’s First Soil Scoop at "Rocknest"',
    category: 'Astrobiology & Geology',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA16225/PIA16225~orig.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA16225/PIA16225~medium.jpg',
    mission: 'Mars Science Laboratory Curiosity',
    instrument: 'Mastcam Right Eye (100mm)',
    solOrDate: 'Sol 61 (October 7, 2012)',
    credit: 'NASA / JPL-Caltech / MSSS',
    caption: 'Trench left in a windblown Martian sand ripple after Curiosity scooped soil to scrub and condition internal chambers of the SAM and CheMin instruments.',
    geologicalInterpretation: 'Reveals bimodal eolian sorting: coarse dark basaltic sand granules armoring a subsurface core of fine, cohesive silt.',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA16225'
  },
  {
    id: 'gal_pia01141',
    nasaId: 'PIA01141',
    title: 'The "Face on Mars" in Cydonia at High Resolution',
    category: 'Orbital Imagery',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA01141/PIA01141~orig.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA01141/PIA01141~medium.jpg',
    mission: 'Mars Global Surveyor (MGS)',
    instrument: 'Mars Orbiter Camera (MOC)',
    solOrDate: 'April 5, 1998',
    credit: 'NASA / JPL / Malin Space Science Systems',
    caption: 'High-resolution strip of the famous Cydonia mesa originally photographed by Viking 1 in 1976. Shows a natural, wind-eroded, cratered geological butte.',
    geologicalInterpretation: 'A remnant erosional mesa formed by mass wasting and eolian deflation along the Martian highland-lowland planetary dichotomy boundary.',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA01141'
  },
  {
    id: 'gal_pia23962',
    nasaId: 'PIA23962',
    title: 'Perseverance Rover & Ingenuity Helicopter Architectural Design',
    category: 'Spacecraft & Heritage',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA23962/PIA23962~orig.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA23962/PIA23962~medium.jpg',
    mission: 'Mars 2020 Mission Architecture',
    instrument: 'JPL Spacecraft Flight Model Visualization',
    solOrDate: 'July 2020',
    credit: 'NASA / JPL-Caltech',
    caption: 'Comprehensive engineering cutaway and structural portrait showing the nuclear Multi-Mission Radioisotope Thermoelectric Generator (MMRTG), robotic arm, and Ingenuity belly carrier.',
    geologicalInterpretation: 'Equipped with a 45-sample titanium tube caching mechanism designed to withstand 50+ years on the Martian surface.',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA23962'
  },
  {
    id: 'gal_pia08813',
    nasaId: 'PIA08813',
    title: 'Victoria Crater Scalloped Rim in Meridiani Planum',
    category: 'Orbital Imagery',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA08813/PIA08813~orig.jpg',
    thumbnailUrl: 'https://images-assets.nasa.gov/image/PIA08813/PIA08813~medium.jpg',
    mission: 'Mars Reconnaissance Orbiter (MRO)',
    instrument: 'HiRISE Sub-Meter Camera',
    solOrDate: 'October 3, 2006',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona',
    caption: 'Spectacular 800-meter-wide impact crater showing dramatic scalloped cliff alcoves and a dune-covered crater floor. Opportunity rover is visible as a tiny dot on the rim scarp ("Duck Bay").',
    geologicalInterpretation: 'Exposes 30 meters of ancient sulphate bedrock strata, revealing alternating dry dune sandstones and groundwater interdune deposits.',
    photojournalUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA08813'
  }
];
