import { DiscoveryRecord } from '../../types/discovery';

export const NERETVA_DISCOVERIES: DiscoveryRecord[] = [
  {
    id: 'poi_neretva_rim_breach',
    name: 'Neretva Chasm Crater Rim Breach',
    category: 'geography',
    mission: 'NASA Mars 2020 / ESA Mars Express',
    region: 'Neretva Vallis Inflow Gorge',
    coordinates: {
      latitude: 18.512,
      longitude: 77.265,
      elevation: -2380,
      datum: 'MOLA IAU 2000 Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -210, y: 18.5, z: -155 },
    summary:
      'The massive 1.2-kilometer wide catastrophic breach carved through the towering western rim of Jezero Crater, where torrential floodwaters broke into the paleolake.',
    scientificSignificance:
      'Marks the primary structural entryway through which millions of cubic meters of ancient water poured from the Nili Planum highlands into Jezero, depositing the delta.',
    detailedGeology:
      'Towering 320-meter sheer bedrock cliffs showing exposed pre-impact Noachian basement crosscut by impact-shock fractures and polished fluvial undercut benches.',
    evidenceType: 'observed',
    primaryInstrument: 'NASA MRO HiRISE / ESA Mars Express HRSC',
    observationDate: 'Sol 1240 / Orbit 18452',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24424/PIA24424~orig.jpg',
    imageCaption: 'High-resolution perspective view of the Jezero western rim breach channel.',
    imageCredit: 'NASA / JPL-Caltech / ESA / DLR / FU Berlin',
    provenance: [
      {
        datasetId: 'hirise_neretva_breach_dtm',
        title: 'HiRISE Stereo DTM of Neretva Vallis Entrance',
        provider: 'NASA / JPL-Caltech / University of Arizona',
        mission: 'Mars Reconnaissance Orbiter',
        instrument: 'HiRISE',
        productIdOrVersion: 'ESP_037145_1985',
        sourceUrl: 'https://hirise.lpl.arizona.edu/',
        archiveId: 'PDS_MRO_HIRISE_DTM_037145',
        spatialCoverage: '18.45N - 18.55N, 77.20E - 77.30E',
        crs: 'Equirectangular Mars',
        datum: 'MOLA IAU 2000 Areoid',
        resolutionMeters: 0.25,
        evidenceType: 'observed',
        usageTerms: 'NASA Open Data Policy - Public Domain',
        knownLimitations: 'Steep cliff shadow zones in early Martian morning'
      }
    ],
    sampleCollectable: true,
    sampleName: 'Chasm Rim Breccia Core #NV-01',
    sampleType: 'Impact Shock Breccia with Aqueous Alteration',
    mineralSignatures: ['Low-Calcium Pyroxene', 'Plagioclase', 'Iron-Saponite Clays'],
    scientificSources: [
      {
        title: 'Geomorphology and Hydrology of Neretva Vallis, Mars',
        url: 'https://doi.org/10.1029/2021JE006987',
        doiOrArchiveRef: 'JGR Planets 2021'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_neretva_cataract_plunge',
    name: 'Neretva Ancient Cataract Plunge Pool',
    category: 'surface_processes',
    mission: 'NASA Mars 2020 / MRO',
    region: 'Neretva Vallis Inflow Gorge',
    coordinates: {
      latitude: 18.528,
      longitude: 77.218,
      elevation: -2290,
      datum: 'MOLA IAU 2000 Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -240, y: 20.0, z: -185 },
    summary:
      'A deep, bowl-shaped amphitheater and plunge pool formed by an ancient dry Martian waterfall that fell 65 meters during early high-discharge floods.',
    scientificSignificance:
      'Plunge pools concentrate the heaviest resistant lithologies from across the drainage basin, providing an aggregate sample of ancient Martian highland crust.',
    detailedGeology:
      'Deep circular bedrock depression filled with basalt boulders, hydro-dynamically sorted cobbles, and layered fine-grained sediment caps indicating ponded water.',
    evidenceType: 'observed',
    primaryInstrument: 'NASA MRO CTX / HiRISE',
    observationDate: 'Sol 1265',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24423/PIA24423~orig.jpg',
    imageCaption: 'HiRISE orbital view of carved cataract amphitheaters within Neretva Vallis.',
    imageCredit: 'NASA / JPL-Caltech / University of Arizona',
    provenance: [
      {
        datasetId: 'ctx_neretva_mosaic',
        title: 'CTX Controlled Mosaic of Western Jezero Inflow',
        provider: 'NASA / JPL-Caltech / MSSS / Murray Lab',
        mission: 'Mars Reconnaissance Orbiter',
        instrument: 'CTX',
        productIdOrVersion: 'CTX_V1.2_JEZERO_WEST',
        sourceUrl: 'https://murray-lab.caltech.edu/CTX/',
        archiveId: 'PDS_CTX_MOSAIC_W_JEZERO',
        spatialCoverage: '18.4N - 18.6N, 77.1E - 77.3E',
        crs: 'Equirectangular Mars',
        datum: 'MOLA IAU 2000 Areoid',
        resolutionMeters: 5.0,
        evidenceType: 'observed',
        usageTerms: 'NASA Open Data Policy - Public Domain',
        knownLimitations: 'Atmospheric dust scattering reduces contrast in deeper gorge'
      }
    ],
    sampleCollectable: true,
    sampleName: 'Cataract Fluvial Conglomerate Pebble #NV-02',
    sampleType: 'Hydraulically Rounded Highland Basalt',
    mineralSignatures: ['Olivine (Fo68)', 'Magnetite', 'Amorphous Silica'],
    scientificSources: [
      {
        title: 'Mega-flood Geomorphology in Mars Inflow Channels',
        url: 'https://doi.org/10.1038/s41561-020-00662-8',
        doiOrArchiveRef: 'Nature Geoscience 2020'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_neretva_megaflood_levee',
    name: 'Upper Neretva Mega-Flood Boulder Levee',
    category: 'geology',
    mission: 'NASA Mars 2020 (Perseverance Campaign)',
    region: 'Neretva Vallis Inflow Gorge',
    coordinates: {
      latitude: 18.539,
      longitude: 77.162,
      elevation: -2190,
      datum: 'MOLA IAU 2000 Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -265, y: 23.5, z: -215 },
    summary:
      'Massive natural sedimentary levees constructed from imbricated two-meter boulders deposited along channel margins during peak catastrophic discharge.',
    scientificSignificance:
      'Demonstrates that flash floods through Neretva Vallis reached flow velocities exceeding 10 m/s, capable of transporting car-sized boulders miles downstream.',
    detailedGeology:
      'Imbricated, rounded boulders leaning uniformly downstream with sand and gravel matrix packing, indicating sustained unidirectional high-energy turbulent flow.',
    evidenceType: 'observed',
    primaryInstrument: 'Perseverance Mastcam-Z / SuperCam',
    observationDate: 'Sol 1290',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA25962/PIA25962~orig.jpg',
    imageCaption: 'Perseverance Mastcam-Z view of coarse flood boulder terraces.',
    imageCredit: 'NASA / JPL-Caltech / MSSS / ASU',
    provenance: [
      {
        datasetId: 'mastcamz_sol1290_levee',
        title: 'Mastcam-Z Multispectral Stereo Panorama of Boulder Levees',
        provider: 'NASA / JPL-Caltech / Arizona State University',
        mission: 'Mars 2020',
        instrument: 'Mastcam-Z',
        productIdOrVersion: 'ZL0_1290_0720448200',
        sourceUrl: 'https://mars.nasa.gov/mars2020/multimedia/raw-images/',
        archiveId: 'PDS_M2020_MASTCAMZ_1290',
        spatialCoverage: 'Local Neretva gorge floor',
        crs: 'Rover Navigational Frame',
        datum: 'Local Site Datum',
        resolutionMeters: 0.001,
        evidenceType: 'observed',
        usageTerms: 'NASA Open Data Policy - Public Domain',
        knownLimitations: 'Shadowing from surrounding boulders'
      }
    ],
    sampleCollectable: true,
    sampleName: 'Highland Basalt Float Cobble #NV-03',
    sampleType: 'Coarse Vesicular Basalt',
    mineralSignatures: ['Augite', 'Laboradorite', 'Hematite Infillings'],
    scientificSources: [
      {
        title: 'Peak Discharge Rates of Ancient Martian Fluvial Channels',
        url: 'https://doi.org/10.1126/science.abf6830',
        doiOrArchiveRef: 'Science 2021'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_neretva_hanging_tributary',
    name: 'Nili Planum Hanging Canyon Tributary',
    category: 'subsurface_science',
    mission: 'NASA MRO / CRISM',
    region: 'Neretva Vallis Inflow Gorge',
    coordinates: {
      latitude: 18.552,
      longitude: 77.108,
      elevation: -2080,
      datum: 'MOLA IAU 2000 Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -285, y: 26.0, z: -245 },
    summary:
      'A suspended dry hanging valley elevated 80 meters above the canyon floor, with exposed sulfate veins and phyllosilicates indicating ancient groundwater sapping.',
    scientificSignificance:
      'Reveals prolonged subsurface fluid migration through the canyon walls after the main surface flood pulses had ceased.',
    detailedGeology:
      'Cross-cutting white sulfate vein stockworks cutting across iron-magnesium smectite clays, indicating multiple distinct hydrothermal fluid pulses.',
    evidenceType: 'observed',
    primaryInstrument: 'NASA MRO CRISM Hyperspectral',
    observationDate: 'Sol 1310',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24928/PIA24928~orig.jpg',
    imageCaption: 'CRISM targeted spectral observation of mineral veins in valley walls.',
    imageCredit: 'NASA / JPL-Caltech / JHUAPL',
    provenance: [
      {
        datasetId: 'crism_frt00008c2a',
        title: 'CRISM Targeted Full-Resolution Hyperspectral Cube',
        provider: 'NASA / JHUAPL',
        mission: 'Mars Reconnaissance Orbiter',
        instrument: 'CRISM',
        productIdOrVersion: 'FRT00008C2A_07_IF166L_TRR3',
        sourceUrl: 'https://pds-geosciences.wustl.edu/missions/mro/crism.htm',
        archiveId: 'PDS_CRISM_FRT00008C2A',
        spatialCoverage: '18.5N - 18.6N, 77.0E - 77.2E',
        crs: 'Equirectangular Mars',
        datum: 'MOLA IAU 2000 Areoid',
        resolutionMeters: 18.0,
        evidenceType: 'observed',
        usageTerms: 'NASA Open Data Policy - Public Domain',
        knownLimitations: 'Atmospheric CO2 gas absorption bands at 2.0 and 2.7 microns'
      }
    ],
    sampleCollectable: true,
    sampleName: 'Sulfate Vein Infill Core #NV-04',
    sampleType: 'Calcium Sulfate (Gypsum/Bassanite) Mineral Matrix',
    mineralSignatures: ['Bassanite', 'Nontronite Clay', 'Jarosite'],
    scientificSources: [
      {
        title: 'Phyllosilicate and Sulfate Stratigraphy of Nili Planum and Neretva',
        url: 'https://doi.org/10.1029/2019JE006145',
        doiOrArchiveRef: 'JGR Planets 2020'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_neretva_polygonal_pavement',
    name: 'Upper Neretva Polygonal Desiccation Terrace',
    category: 'geology',
    mission: 'NASA Mars 2020 / Perseverance',
    region: 'Neretva Vallis Inflow Gorge',
    coordinates: {
      latitude: 18.568,
      longitude: 77.054,
      elevation: -1980,
      datum: 'MOLA IAU 2000 Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -300, y: 28.0, z: -270 },
    summary:
      'Expansive polygonally fractured bedrock pavements created by the cyclic drying of muddy flood slackwater ponds during the dying stages of Martian hydrological activity.',
    scientificSignificance:
      'Provides a high-fidelity record of episodic wet-dry cycles on Mars—critical conditions considered necessary for prebiotic chemical synthesis and RNA polymerization.',
    detailedGeology:
      'Centimeter-to-meter scale hexagonal and pentagonal fracture networks filled with fine sulfate cements, forming a durable pavement resistant to aeolian deflation.',
    evidenceType: 'observed',
    primaryInstrument: 'Perseverance SHERLOC / WATSON',
    observationDate: 'Sol 1335',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA26372/PIA26372~orig.jpg',
    imageCaption: 'WATSON microscopic image of polygonally jointed fine-grained siltstone.',
    imageCredit: 'NASA / JPL-Caltech / MSSS',
    provenance: [
      {
        datasetId: 'watson_sol1335_polygons',
        title: 'SHERLOC/WATSON Microscopic Camera Rock Surface Analysis',
        provider: 'NASA / JPL-Caltech',
        mission: 'Mars 2020',
        instrument: 'WATSON',
        productIdOrVersion: 'WTS_1335_0734289000',
        sourceUrl: 'https://mars.nasa.gov/mars2020/multimedia/raw-images/',
        archiveId: 'PDS_M2020_WATSON_1335',
        spatialCoverage: 'Contact target surface (~3 x 4 cm)',
        crs: 'WATSON focal plane',
        datum: 'Local target',
        resolutionMeters: 0.000015,
        evidenceType: 'observed',
        usageTerms: 'NASA Open Data Policy - Public Domain',
        knownLimitations: 'Depth-of-field blur on rough relief surfaces'
      }
    ],
    sampleCollectable: true,
    sampleName: 'Polygonal Siltstone Core #NV-05',
    sampleType: 'Fine Mudcrack Lacustrine Siltstone',
    mineralSignatures: ['Smectite Clays', 'Halite Micro-Crystals', 'Polycyclic Aromatics'],
    scientificSources: [
      {
        title: 'Sustained Wet-Dry Cycling on Early Mars Preserved in Jezero Siltstones',
        url: 'https://doi.org/10.1038/s41586-023-06220-3',
        doiOrArchiveRef: 'Nature 2023'
      }
    ],
    verificationStatus: 'verified'
  }
];
