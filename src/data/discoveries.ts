import { DiscoveryRecord } from '../types/discovery';
import { NASA_PROVENANCE_REGISTRY } from './nasaProvenance';

export const JEZERO_DISCOVERIES: DiscoveryRecord[] = [
  {
    id: 'poi_octavia_landing',
    name: 'Octavia E. Butler Landing Site',
    category: 'spacecraft',
    mission: 'NASA Mars 2020',
    region: 'Jezero Crater Floor',
    coordinates: {
      latitude: 18.4447,
      longitude: 77.4508,
      elevation: -2574,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -24, y: 0.9, z: 18 },
    summary: 'The historic touchdown location of NASA’s Perseverance rover and Ingenuity helicopter on Sol 0 (February 18, 2021).',
    scientificSignificance: 
      'Marks the start of the Mars 2020 surface exploration campaign. The blast zone from the Sky Crane descent stage swept away thin surface dust, exposing bedrock slabs of igneous composition.',
    detailedGeology: 
      'The surface here consists of volcanic bedrock slabs coated with a thin mantle of reddish eolian dust. Initial spectra from SuperCam and PIXL revealed pyroxene and plagioclase crystals, indicating an igneous volcanic flow or shallow magma intrusion rather than sedimentary lakebed.',
    evidenceType: 'historical_record',
    primaryInstrument: 'Mastcam-Z / Navcam / HiRISE Descent Imaging',
    observationDate: '2021-02-18',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24483/PIA24483~orig.jpg',
    imageCaption: 'High-resolution panorama of the Octavia E. Butler landing site captured by Perseverance Mastcam-Z.',
    imageCredit: 'NASA / JPL-Caltech / ASU / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[3], // MEDA
      NASA_PROVENANCE_REGISTRY[4]  // Mars Trek
    ],
    sampleCollectable: false,
    scientificSources: [
      {
        title: 'NASA Mars 2020 Landing Site Press Release',
        url: 'https://mars.nasa.gov/news/8882/welcome-to-octavia-e-butler-landing/'
      },
      {
        title: 'HiRISE MRO Observation of Mars 2020 Touchdown (ESP_068294_1985)',
        url: 'https://www.uahirise.org/ESP_068294_1985'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_ingenuity_field',
    name: 'Wright Brothers Field (Ingenuity Airfield)',
    category: 'spacecraft',
    mission: 'NASA Mars 2020 / Ingenuity',
    region: 'Jezero Crater Floor East',
    coordinates: {
      latitude: 18.4449,
      longitude: 77.4512,
      elevation: -2573,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: 22, y: 0.8, z: 12 },
    summary: 'The historic first airfield on another planet where NASA’s Ingenuity Mars Helicopter achieved powered, controlled atmospheric flight.',
    scientificSignificance: 
      'Proved that aerodynamic flight is possible in Mars’s ultra-thin atmosphere (less than 1% of Earth’s atmospheric density). Ingenuity completed 72 flights across 3 years.',
    detailedGeology: 
      'A remarkably flat, smooth patch of crater floor selected specifically to minimize rocks and landing hazards during automated rotor touchdowns.',
    evidenceType: 'observed',
    primaryInstrument: 'Ingenuity Navcam & High-Resolution Return-to-Earth Color Camera',
    observationDate: '2021-04-19 (Sol 59)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24650/PIA24650~large.jpg',
    imageCaption: 'Ingenuity hovering during its historic first flight over Wright Brothers Field on Mars.',
    imageCredit: 'NASA / JPL-Caltech / Mastcam-Z',
    provenance: [
      NASA_PROVENANCE_REGISTRY[3],
      NASA_PROVENANCE_REGISTRY[4]
    ],
    sampleCollectable: false,
    scientificSources: [
      {
        title: 'NASA Ingenuity Mars Helicopter Overview',
        url: 'https://mars.nasa.gov/technology/helicopter/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_delta_scarp',
    name: 'Delta Scarp — Hawkes Bay Outcrop',
    category: 'geology',
    mission: 'NASA Mars 2020 / MRO CRISM',
    region: 'Western Jezero Delta Front',
    coordinates: {
      latitude: 18.4230,
      longitude: 77.4320,
      elevation: -2530,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -85, y: 5.6, z: -65 },
    summary: 'A prominent cliff face of layered fine-grained sedimentary rock deposited in the ancient delta front, rich in biosignature-preserving clay minerals.',
    scientificSignificance: 
      'Primary research target for Mars astrobiology. Fine-grained mudstones deposited in calm lake water are the ideal terrestrial analog for preserving organic molecules and microscopic fossils.',
    detailedGeology: 
      'Laminated siltstones and mudstones exhibiting millimeter-to-centimeter scale planar bedding. CRISM and SHERLOC spectroscopic observations confirm high concentrations of Fe/Mg smectite clays (nontronite), which form through aqueous alteration in neutral-to-alkaline water.',
    evidenceType: 'observed',
    primaryInstrument: 'SuperCam Laser Induced Breakdown Spectroscopy / SHERLOC UV Raman',
    observationDate: '2022-04-19 (Sol 414)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24685/PIA24685~orig.jpg',
    imageCaption: 'Layered sedimentary rocks at the base of the Jezero delta front, imaged by Perseverance Mastcam-Z.',
    imageCredit: 'NASA / JPL-Caltech / ASU / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0], // HiRISE DTM
      NASA_PROVENANCE_REGISTRY[2]  // CRISM Clays
    ],
    sampleCollectable: true,
    sampleName: 'Jezero Delta Mudstone (Sample #MB-01)',
    sampleType: 'Fine-grained sedimentary mudstone with smectite clay matrix',
    mineralSignatures: ['Fe/Mg Smectite Clay', 'Hydrated Silica', 'Calcium Sulfate Veins'],
    scientificSources: [
      {
        title: 'Perseverance Rover Scrutinizes Jezero Delta Deposits (Science 2022)',
        url: 'https://www.science.org/doi/10.1126/science.abo4738'
      },
      {
        title: 'CRISM Hyperspectral Characterization of Jezero Crater Western Delta (NASA PDS)',
        url: 'https://pds-geosciences.wustl.edu/missions/mro/crism.htm'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_hogwallow_flats',
    name: 'Hogwallow Flats Organic-Bearing Mudstones',
    category: 'geology',
    mission: 'NASA Mars 2020',
    region: 'Delta Front Lower Member',
    coordinates: {
      latitude: 18.4350,
      longitude: 77.4280,
      elevation: -2538,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -68, y: 4.1, z: -32 },
    summary: 'A light-toned, fractured expanse of sedimentary mudstone containing the highest concentration of organic molecules detected by the SHERLOC instrument.',
    scientificSignificance: 
      'Demonstrates that organic carbon compounds were preserved in ancient Jezero lake muds. The presence of sulfate minerals alongside clays indicates evaporating briny lake conditions.',
    detailedGeology: 
      'Ultra-fine grained mudstones with polygonal mudcrack networks and prominent white calcium sulfate veins cutting through the bedding planes.',
    evidenceType: 'observed',
    primaryInstrument: 'SHERLOC Deep UV Fluorescence & Raman Spectrometer / PIXL',
    observationDate: '2022-07-15 (Sol 498)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA25340/PIA25340~medium.jpg',
    imageCaption: 'Abrasion patch at Hogwallow Flats showing fine-grained sedimentary laminations and crystal matrix.',
    imageCredit: 'NASA / JPL-Caltech / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[2]
    ],
    sampleCollectable: true,
    sampleName: 'Hogwallow Organic Mudstone Core',
    sampleType: 'Fine-grained mudstone with carbonaceous inclusions',
    mineralSignatures: ['Aromatic Organics', 'Anhydrite Sulfate', 'Nontronite Clay'],
    scientificSources: [
      {
        title: 'Diverse organic compounds in Jezero Crater, Mars (Nature 2023)',
        url: 'https://www.nature.com/articles/s41586-023-06143-z'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_three_forks',
    name: 'Three Forks Sample Depot',
    category: 'spacecraft',
    mission: 'NASA Mars 2020 / Mars Sample Return',
    region: 'Delta Front Base',
    coordinates: {
      latitude: 18.4290,
      longitude: 77.4380,
      elevation: -2552,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -35, y: 2.2, z: -25 },
    summary: 'Humanity’s first sample repository on another world, where Perseverance deposited 10 hermetically sealed titanium sample tubes on the surface.',
    scientificSignificance: 
      'Provides a safe, flat backup collection site where future Sample Retrieval Helicopters can collect sample tubes to return to Earth for laboratory analysis.',
    detailedGeology: 
      'Even, hazard-free patch of delta-front regolith chosen after orbital and rover analysis for safe future aerial recovery.',
    evidenceType: 'historical_record',
    primaryInstrument: 'WATSON Camera & Mastcam-Z',
    observationDate: '2023-01-20 (Sol 682)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA25681/PIA25681~large.jpg',
    imageCaption: 'A titanium sample tube lying on the surface of Mars at the Three Forks sample depot.',
    imageCredit: 'NASA / JPL-Caltech / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[3],
      NASA_PROVENANCE_REGISTRY[4]
    ],
    sampleCollectable: false,
    scientificSources: [
      {
        title: 'NASA Perseverance Completes Mars Sample Depot',
        url: 'https://mars.nasa.gov/news/9338/nasas-perseverance-rover-completes-first-sample-depot-on-another-world/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_kodiak_butte',
    name: 'Kodiak Butte (Delta Stratigraphic Remnant)',
    category: 'geology',
    mission: 'NASA Mars 2020 / HiRISE',
    region: 'South Jezero Delta Remnant',
    coordinates: {
      latitude: 18.3980,
      longitude: 77.4120,
      elevation: -2510,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -160, y: 19.8, z: 95 },
    summary: 'A 60-meter high isolated mesa showing classical Gilbert-type delta architecture with clear topset, foreset, and bottomset strata.',
    scientificSignificance: 
      'Provides unequivocal proof that Jezero Crater once held a sustained body of open water with fluctuating lake levels, confirming the presence of a true paleolake.',
    detailedGeology: 
      'The southern face of Kodiak clearly exposes dipping foreset beds (~20° angle of repose) deposited by sediment avalanching down the front of the delta into deep water, capped by horizontal fluvial topset conglomerates.',
    evidenceType: 'observed',
    primaryInstrument: 'Mastcam-Z Long-range Telephoto & SuperCam RMI',
    observationDate: '2021-04-15 (Sol 55)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24814/PIA24814~large.jpg',
    imageCaption: 'Long-distance mosaic of Kodiak butte showing horizontal topsets and inclined foreset sedimentary beds.',
    imageCredit: 'NASA / JPL-Caltech / ASU / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0], // HiRISE DTM
      NASA_PROVENANCE_REGISTRY[1]  // MOLA
    ],
    sampleCollectable: true,
    sampleName: 'Kodiak Cross-Bedded Sandstone',
    sampleType: 'Deltaic foreset sandstone with silica cement',
    mineralSignatures: ['Fluvial Quartz/Feldspar', 'Smectite Matrix', 'Hematite Inclusions'],
    scientificSources: [
      {
        title: 'Perseverance Rover Reveals Delta Architecture at Jezero Crater (Mangold et al., Science 2021)',
        url: 'https://www.science.org/doi/10.1126/science.abl4051'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_seitah_dunes',
    name: 'Séítah Dune Field & Olivine Cumulate',
    category: 'surface_processes',
    mission: 'NASA Mars 2020',
    region: 'Crater Floor South of Landing',
    coordinates: {
      latitude: 18.4310,
      longitude: 77.4410,
      elevation: -2580,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: 75, y: -2.2, z: -115 },
    summary: 'Complex field of active eolian megaripples and sand dunes overlying an ancient igneous cumulate bedrock rich in coarse olivine crystals.',
    scientificSignificance: 
      'Represents some of the oldest bedrock in Jezero Crater, formed prior to the river delta by a slowly cooling magma body or thick lava lake.',
    detailedGeology: 
      'Coarse-grained olivine-rich cumulate rock (termed the "Brac" and "Bastide" abraided patches). Olivine grains are cemented by pyroxene and show microscopic alteration rinds from subsequent water interaction.',
    evidenceType: 'observed',
    primaryInstrument: 'PIXL X-Ray Fluorescence & SHERLOC Micro-Spectrometer',
    observationDate: '2021-11-12 (Sol 260)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24924/PIA24924~medium.jpg',
    imageCaption: 'Perseverance view across the rugged ripple fields of South Séítah.',
    imageCredit: 'NASA / JPL-Caltech',
    provenance: [
      NASA_PROVENANCE_REGISTRY[2], // CRISM
      NASA_PROVENANCE_REGISTRY[3]  // MEDA
    ],
    sampleCollectable: true,
    sampleName: 'Séítah Olivine Cumulate (Sample #MB-03)',
    sampleType: 'Ultramafic igneous cumulate rock',
    mineralSignatures: ['Coarse Forsterite Olivine', 'Augite Pyroxene', 'Carbonate Carbon Alteration'],
    scientificSources: [
      {
        title: 'An Igneous Origin for the Floor Units of Jezero Crater (Farley et al., Science 2022)',
        url: 'https://www.science.org/doi/10.1126/science.abo2196'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_skrinkle_haven',
    name: 'Skrinkle Haven Torrential Flood Conglomerate',
    category: 'geology',
    mission: 'NASA Mars 2020',
    region: 'Upper Delta River Channel',
    coordinates: {
      latitude: 18.4150,
      longitude: 77.4200,
      elevation: -2495,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -115, y: 10.2, z: -20 },
    summary: 'Stacked curvilinear rock layers filled with massive rounded cobblestones and boulders deposited by violent, torrential ancient floodwaters.',
    scientificSignificance: 
      'Proves that Mars experienced high-energy river floods capable of moving boulders up to a meter across, contrasting with the calm lake mudstones below.',
    detailedGeology: 
      'Poorly sorted, matrix-supported pebble-to-boulder conglomerates displaying steep trough cross-bedding and imbricated cobbles.',
    evidenceType: 'observed',
    primaryInstrument: 'Mastcam-Z Stereo Anaglyph & SuperCam LIBS',
    observationDate: '2023-03-01 (Sol 721)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA25827/PIA25827~medium.jpg',
    imageCaption: 'Curving conglomerate rock layers at Skrinkle Haven revealing ancient Martian river rapids.',
    imageCredit: 'NASA / JPL-Caltech / ASU / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[1]
    ],
    sampleCollectable: true,
    sampleName: 'River-Tumbled Basaltic Cobble',
    sampleType: 'Rounded fluvial conglomerate clast',
    mineralSignatures: ['Fluvial Plagioclase', 'Basaltic Glass', 'Magnetite'],
    scientificSources: [
      {
        title: 'NASA Rover Finds Evidence of Extreme Ancient River at Jezero',
        url: 'https://mars.nasa.gov/news/9408/nasas-perseverance-rover-finds-evidence-of-ancient-river/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_belva_crater',
    name: 'Belva Impact Crater (Sub-Delta Exposure)',
    category: 'geology',
    mission: 'NASA Mars 2020 / HiRISE',
    region: 'Northern Delta Edge',
    coordinates: {
      latitude: 18.5020,
      longitude: 77.3480,
      elevation: -2480,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -180, y: 14.5, z: -175 },
    summary: 'A 1-kilometer diameter impact crater excavated into the delta, providing a natural deep trench through several stratigraphic layers.',
    scientificSignificance: 
      'Enables direct observation of the transition between the early crater floor igneous basement and the overlying river-deposited delta layers without deep drilling.',
    detailedGeology: 
      'Impact crater walls expose large megaclasts, impact breccia, and tilted fault blocks. Boulders measuring up to 3 meters in diameter were hurled across the rim by high-energy flood waters or impact ejection.',
    evidenceType: 'observed',
    primaryInstrument: 'Mastcam-Z Panorama & HiRISE High-Resolution Imaging',
    observationDate: '2023-05-18 (Sol 800)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA25889/PIA25889~large.jpg',
    imageCaption: '152-image panorama of Belva Crater taken by Perseverance Mastcam-Z.',
    imageCredit: 'NASA / JPL-Caltech / ASU / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0], // HiRISE DTM
      NASA_PROVENANCE_REGISTRY[1]  // MOLA
    ],
    sampleCollectable: true,
    sampleName: 'Belva Impact Breccia & Clast',
    sampleType: 'Polymict impact breccia with fractured basalt and sandstone',
    mineralSignatures: ['Feldspathic Breccia', 'Shattered Pyroxene', 'Impact Melt Glass'],
    scientificSources: [
      {
        title: 'HiRISE Image of Belva Crater within Jezero Crater (ESP_037145_1985)',
        url: 'https://www.uahirise.org/ESP_037145_1985'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_neretva_canyon',
    name: 'Neretva Vallis River Gorge & Inflow Channel',
    category: 'geography',
    mission: 'NASA Mars 2020 / MRO CTX',
    region: 'Northwest Crater Rim Breach',
    coordinates: {
      latitude: 18.5200,
      longitude: 77.2900,
      elevation: -2410,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -220, y: 18.2, z: -110 },
    summary: 'The colossal inflow river canyon that breached the 4-billion-year-old rim of Jezero Crater, channeling water and sediment into the ancient lake.',
    scientificSignificance: 
      'The geological highway through which hundreds of cubic kilometers of water drained into Jezero, cutting steep cliffs and exposing ancient Noachian crustal rocks.',
    detailedGeology: 
      'Deeply incised bedrock channel with canyon walls standing over 100 meters high. Outcrops display complex fluvial terraces and canyon-floor boulder fields.',
    evidenceType: 'observed',
    primaryInstrument: 'MRO CTX Mosaic & HiRISE Stereo DTM',
    observationDate: '2024-06-10 (Sol 1175)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA26335/PIA26335~large.jpg',
    imageCaption: 'Perseverance gaze up the steep bedrock canyon walls of Neretva Vallis.',
    imageCredit: 'NASA / JPL-Caltech / ASU',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[1]
    ],
    sampleCollectable: true,
    sampleName: 'Neretva Canyon Wall Crustal Clast',
    sampleType: 'Ancient Noachian anorthositic crustal fragment',
    mineralSignatures: ['Calc-alkaline Feldspar', 'Shocked Quartz', 'Chlorite Alteration'],
    scientificSources: [
      {
        title: 'NASA Perseverance Begins Climb Up Jezero Crater Rim',
        url: 'https://mars.nasa.gov/news/9638/nasas-perseverance-rover-begins-climb-up-jezero-craters-rim/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_cheyava_falls',
    name: 'Cheyava Falls (Leopard Spots Biosignature Candidate)',
    category: 'geology',
    mission: 'NASA Mars 2020',
    region: 'Bright Angel Valley',
    coordinates: {
      latitude: 18.4720,
      longitude: 77.3820,
      elevation: -2465,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -145, y: 12.0, z: -90 },
    summary: 'A reddish mudstone outcrop riddled with white calcium sulfate veins and striking millimeter-sized "leopard spots" rimmed with iron and phosphate.',
    scientificSignificance: 
      'Heralded by NASA in July 2024 as the most promising potential biosignature candidate found on Mars. On Earth, similar chemical reduction halos are produced by microbial metabolic reactions utilizing iron and sulfur.',
    detailedGeology: 
      'Fine-grained sedimentary rock composed of clay and silt with millimeter-scale halos. The central cores contain calcium sulfate (gypsum/bassanite), surrounded by dark reaction rims enriched in iron phosphate (vivianite) and organic carbon molecules detected by SHERLOC.',
    evidenceType: 'observed',
    primaryInstrument: 'SHERLOC Raman / PIXL Micro-XRF / Mastcam-Z Close-Up',
    observationDate: '2024-07-21 (Sol 1215)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA26368/PIA26368~orig.jpg',
    imageCaption: 'Mastcam-Z close-up of Cheyava Falls showing the distinctive millimeter-scale leopard spots and white sulfate veins.',
    imageCredit: 'NASA / JPL-Caltech / MSSS / ASU',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[2]
    ],
    sampleCollectable: true,
    sampleName: 'Cheyava Falls Spotted Mudstone Core',
    sampleType: 'Fine-grained mudstone with iron-phosphate reduction halos',
    mineralSignatures: ['Vivianite (Iron Phosphate)', 'Calcium Sulfate', 'Aromatic Organic Carbon', 'Hematite'],
    scientificSources: [
      {
        title: 'NASA’s Perseverance Rover Scientists Find Intriguing Mars Rock (Cheyava Falls)',
        url: 'https://www.jpl.nasa.gov/news/nasas-perseverance-rover-scientists-find-intriguing-mars-rock'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_castell_henllys',
    name: 'Castell Henllys (Jezero Margin Carbonate Unit)',
    category: 'geology',
    mission: 'NASA Mars 2020 / MRO CRISM',
    region: 'Inner Crater Rim Shoreline',
    coordinates: {
      latitude: 18.4100,
      longitude: 77.4900,
      elevation: -2450,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: 140, y: 8.5, z: 65 },
    summary: 'A distinct continuous band of magnesium-rich carbonate rock lining the inner rim of Jezero Crater, often termed the ancient "bathtub ring".',
    scientificSignificance: 
      'Carbonate minerals precipitate directly in alkaline water and are premier hosts for fossilized microbial mats (stromatolites). Their presence proves ancient Jezero had neutral-to-alkaline, habitable lake chemistry.',
    detailedGeology: 
      'Magnesite (MgCO3) and olivine-bearing layered rocks. Texture displays laminated planar to wavy bedding consistent with shallow lacustrine shoreline precipitation or serpentinization of ultramafic bedrock.',
    evidenceType: 'observed',
    primaryInstrument: 'CRISM Hyperspectral / SuperCam Infrared / Mastcam-Z',
    observationDate: '2024-02-14 (Sol 1061)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA26154/PIA26154~medium.jpg',
    imageCaption: 'Perseverance Mastcam-Z mosaic of the light-toned layered rocks of the Margin Carbonate unit.',
    imageCredit: 'NASA / JPL-Caltech / ASU / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[2]
    ],
    sampleCollectable: true,
    sampleName: 'Castell Henllys Lacustrine Carbonate Core',
    sampleType: 'Hydromagnesite-bearing lacustrine carbonate rock',
    mineralSignatures: ['Magnesite (MgCO3)', 'Silica Chert', 'Hydrated Smectite'],
    scientificSources: [
      {
        title: 'Carbonate-bearing rocks in Jezero crater, Mars (Horgan et al., Icarus)',
        url: 'https://mars.nasa.gov/news/8547/nasas-mars-2020-will-hunt-for-microscopic-fossils/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_mount_washburn',
    name: 'Mount Washburn & Atoko Point Anorthosite',
    category: 'geology',
    mission: 'NASA Mars 2020',
    region: 'Neretva Channel Margin',
    coordinates: {
      latitude: 18.4900,
      longitude: 77.3400,
      elevation: -2440,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -130, y: 16.0, z: -145 },
    summary: 'A field of dark boulder-strewn slopes crowned by "Atoko Point" — a striking, speckled boulder of bright crystalline anorthosite.',
    scientificSignificance: 
      'Anorthosite is rare on Mars and represents pristine, primitive crust formed billions of years ago in a magma ocean or deep subsurface magma chamber, excavated by ancient giant impacts.',
    detailedGeology: 
      'Boulder measuring 45 cm wide consisting primarily of plagioclase feldspar and pyroxene crystals. Its unique pale mineralogy contrasts sharply with the ubiquitous dark basaltic rocks of Jezero Crater.',
    evidenceType: 'observed',
    primaryInstrument: 'SuperCam LIBS & Remote Micro-Imager (RMI)',
    observationDate: '2024-05-27 (Sol 1162)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA26315/PIA26315~medium.jpg',
    imageCaption: 'SuperCam RMI image of the speckled white boulder "Atoko Point" discovered on Mount Washburn.',
    imageCredit: 'NASA / JPL-Caltech / LANL / CNES / CNRS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[1]
    ],
    sampleCollectable: true,
    sampleName: 'Atoko Point Anorthositic Crust Fragment',
    sampleType: 'Coarse-grained crystalline anorthosite rock',
    mineralSignatures: ['Plagioclase Feldspar', 'Augite Pyroxene', 'Ilmenite'],
    scientificSources: [
      {
        title: 'NASA’s Perseverance Finds a Diverse Array of Boulders at Mount Washburn',
        url: 'https://mars.nasa.gov/news/9630/nasas-perseverance-finds-a-diverse-array-of-boulders-at-mount-washburn/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_berea_outcrop',
    name: 'Berea Outcrop (Upper Delta Siltstone & Carbonate)',
    category: 'geology',
    mission: 'NASA Mars 2020',
    region: 'Fan Crest Member',
    coordinates: {
      latitude: 18.4380,
      longitude: 77.4190,
      elevation: -2505,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -95, y: 7.5, z: -110 },
    summary: 'Layered delta-top siltstone where Perseverance acquired core sample #16, displaying fine laminations formed in low-energy backwater river channels.',
    scientificSignificance: 
      'Contains high levels of both carbonate and hydrated silica, two minerals capable of entrapping and preserving delicate organic macromolecules over billions of years.',
    detailedGeology: 
      'Planar stratified quartz-feldspar siltstone with abundant magnesium carbonate cement and authigenic silica grains. Abrasion tests revealed very fine grain size and minimal diagenetic destruction.',
    evidenceType: 'observed',
    primaryInstrument: 'PIXL / SHERLOC / Mastcam-Z',
    observationDate: '2023-03-30 (Sol 749)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA25828/PIA25828~medium.jpg',
    imageCaption: 'Perseverance sampling arm working against the flat stratified surfaces of the Berea outcrop.',
    imageCredit: 'NASA / JPL-Caltech / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[2]
    ],
    sampleCollectable: true,
    sampleName: 'Berea Siltstone Core (Sample #MB-16)',
    sampleType: 'Fluvial delta-top siltstone with carbonate matrix',
    mineralSignatures: ['Magnesium Carbonate', 'Hydrated Silica', 'Detrital Feldspar'],
    scientificSources: [
      {
        title: 'Perseverance Caches Sample 16 from Berea Outcrop',
        url: 'https://mars.nasa.gov/news/9380/nasas-perseverance-rover-caches-its-16th-rock-core-sample/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_yori_pass',
    name: 'Yori Pass Fluvial Channel Slabs',
    category: 'geology',
    mission: 'NASA Mars 2020',
    region: 'Neretva - Delta Confluence',
    coordinates: {
      latitude: 18.4410,
      longitude: 77.4330,
      elevation: -2520,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -50, y: 3.5, z: -80 },
    summary: 'Large flat sandstone slabs carved by the main delta channel, featuring prominent cross-bedding and ripple crests frozen in stone.',
    scientificSignificance: 
      'Exposes the transition zone where fast-moving river currents from Neretva Vallis slowed down as they met the open water of Lake Jezero, dropping sandy sediments.',
    detailedGeology: 
      'Medium-to-coarse sandstone displaying asymmetrical ripple marks and sub-horizontal planar bedding with minor pebble lenses.',
    evidenceType: 'observed',
    primaryInstrument: 'Mastcam-Z Stereo & SuperCam RMI',
    observationDate: '2022-11-20 (Sol 623)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA25625/PIA25625~medium.jpg',
    imageCaption: 'Mastcam-Z image of sandstone plates and ripples at Yori Pass.',
    imageCredit: 'NASA / JPL-Caltech / ASU / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[1]
    ],
    sampleCollectable: true,
    sampleName: 'Yori Pass Channel Sandstone Slab',
    sampleType: 'Cross-bedded fluvial sandstone',
    mineralSignatures: ['Quartz-Feldspar Sand', 'Ferric Oxide Rinds', 'Smectite Matrix'],
    scientificSources: [
      {
        title: 'Perseverance Investigates Ancient Delta Riverbed at Yori Pass',
        url: 'https://mars.nasa.gov/news/9306/nasas-perseverance-rover-investigates-ancient-delta-riverbed/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_rochette_citadelle',
    name: 'Citadelle Ridge & Rochette (First Mars Rock Core)',
    category: 'geology',
    mission: 'NASA Mars 2020',
    region: 'South Séítah Ridge',
    coordinates: {
      latitude: 18.4410,
      longitude: 77.4580,
      elevation: -2570,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: 45, y: 1.5, z: 35 },
    summary: 'The historic location on Citadelle Ridge where Perseverance drilled and sealed humanity’s very first rock core sample on Mars (Sample #1 "Montdenier" from rock target "Rochette").',
    scientificSignificance: 
      'Marked the triumphant first successful sample caching on another planet on Sol 190 (September 2021). Mineral analysis confirmed that the crater floor is composed of igneous volcanic rocks altered by groundwater.',
    detailedGeology: 
      'A resistant, low ridge of volcanic basalt (Máaz formation) containing olivine, pyroxene, and iron-titanium oxides. Microscopic PIXL scans showed secondary salt minerals (sulfates and carbonates) inside void pockets, proving liquid water flowed through the rocks after they crystallized.',
    evidenceType: 'observed',
    primaryInstrument: 'Corer Drill / PIXL / Mastcam-Z / WATSON',
    observationDate: '2021-09-06 (Sol 194)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24833/PIA24833~orig.jpg',
    imageCaption: 'Mastcam-Z view of Citadelle ridge and the Rochette abraded patch where Sample #1 was cored.',
    imageCredit: 'NASA / JPL-Caltech / ASU / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[1]
    ],
    sampleCollectable: true,
    sampleName: 'Rochette Basalt Core (Sample #MB-01-M)',
    sampleType: 'Crystalline vesicular volcanic basalt with secondary salt veins',
    mineralSignatures: ['Pyroxene', 'Plagioclase Feldspar', 'Hydrated Sulfate Voids', 'Olivine'],
    scientificSources: [
      {
        title: 'NASA’s Perseverance Rover Successfully Caches First Rock Sample',
        url: 'https://mars.nasa.gov/news/9029/nasas-perseverance-rover-successfully-caches-its-first-rock-sample/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_enchanted_lake',
    name: 'Enchanted Lake Bottomset Mudstones',
    category: 'geology',
    mission: 'NASA Mars 2020',
    region: 'Lower Delta Scarp Base',
    coordinates: {
      latitude: 18.4280,
      longitude: 77.4380,
      elevation: -2545,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -65, y: 3.8, z: -45 },
    summary: 'A dramatic outcrop of thinly laminated, fine-grained mudstone at the base of the delta scarp, nicknamed for its resemblance to sedimentary sequences in national parks on Earth.',
    scientificSignificance: 
      'Represents bottomset beds deposited in quiet, deeper lake water far from the turbulent river mouth. Fine muds that settle slowly in still water have the highest potential for preserving microscopic fossil biosignatures.',
    detailedGeology: 
      'Thin, paper-like millimeter-scale laminations of clay-silt mudstone interbedded with thin sulfate crusts. SuperCam remote micro-imager (RMI) revealed rhythmic sedimentary varves possibly recording seasonal cycles in ancient Lake Jezero.',
    evidenceType: 'observed',
    primaryInstrument: 'SuperCam RMI / Mastcam-Z / SHERLOC',
    observationDate: '2022-04-30 (Sol 424)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA25325/PIA25325~orig.jpg',
    imageCaption: 'SuperCam RMI telescopic panorama of the thinly layered mudstone strata at Enchanted Lake.',
    imageCredit: 'NASA / JPL-Caltech / LANL / CNES / CNRS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[2]
    ],
    sampleCollectable: true,
    sampleName: 'Enchanted Lake Laminated Mudstone',
    sampleType: 'Lacustrine bottomset clay mudstone with rhythmic laminations',
    mineralSignatures: ['Smectite Clays', 'Iron Oxides', 'Calcium Sulfate Veins', 'Phyllosilicates'],
    scientificSources: [
      {
        title: 'Perseverance Rover Examines "Enchanted Lake" at the Base of the Jezero Delta',
        url: 'https://mars.nasa.gov/news/9208/nasas-perseverance-rover-arrives-at-the-delta/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_wildcat_ridge',
    name: 'Wildcat Ridge (Organic-Rich Evaporite Mudstone)',
    category: 'subsurface_science',
    mission: 'NASA Mars 2020',
    region: 'Delta Front Margin',
    coordinates: {
      latitude: 18.4190,
      longitude: 77.4260,
      elevation: -2520,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -135, y: 8.6, z: -60 },
    summary: 'A 1-meter-high sedimentary cliff where Perseverance discovered the highest concentrations of organic matter yet detected on the mission, enclosed in sulfate-rich mudstone.',
    scientificSignificance: 
      'Organic molecules with ring structures (aromatic compounds) were found directly correlated with sulfate minerals that formed as a hypersaline lake dried up. On Earth, sulfates are known to preserve fossilized microbes for hundreds of millions of years.',
    detailedGeology: 
      'Very fine silt-clay mudstone rich in calcium sulfate (gypsum/anhydrite) cement. Deep ultraviolet Raman and fluorescence spectra from SHERLOC pinpointed complex carbon-bearing molecules intertwined with sulfate grains.',
    evidenceType: 'observed',
    primaryInstrument: 'SHERLOC / PIXL / Mastcam-Z',
    observationDate: '2022-07-20 (Sol 504)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24928/PIA24928~orig.jpg',
    imageCaption: 'The abrasion patch at Wildcat Ridge revealing fine-grained siltstone and sulfate veins where organic signatures were detected.',
    imageCredit: 'NASA / JPL-Caltech / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[2]
    ],
    sampleCollectable: true,
    sampleName: 'Wildcat Organic-Bearing Sulfate Core',
    sampleType: 'Hypersaline evaporitic mudstone with aromatic organic inclusions',
    mineralSignatures: ['Aromatic Organics', 'Calcium Sulfate (Gypsum)', 'Smectite', 'Carbonates'],
    scientificSources: [
      {
        title: 'NASA’s Perseverance Rover Investigates Geologically Rich "Wildcat Ridge"',
        url: 'https://mars.nasa.gov/news/9253/nasas-perseverance-rover-investigates-geologically-rich-wildcat-ridge/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_bright_angel',
    name: 'Bright Angel (Polygonal Fractured Channel Floor)',
    category: 'geology',
    mission: 'NASA Mars 2020',
    region: 'Neretva Vallis Channel Floor',
    coordinates: {
      latitude: 18.4100,
      longitude: 77.4080,
      elevation: -2490,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -195, y: 13.5, z: -135 },
    summary: 'A bizarre, bright-toned geological unit exposed inside the Neretva Vallis river channel featuring jagged polygonal fractures, "popcorn" texture, and mineral-filled ridges.',
    scientificSignificance: 
      'Formed either as ancient river sediments altered by intense groundwater flow or by hydrothermal fluids circulating through river deposits. The light-toned rocks contrast starkly with the dark basalt floor.',
    detailedGeology: 
      'Fine-grained, pale-toned rock with distinctive polygonal contraction cracks, filled with hardened resistant mineral veins that stand in relief above the eroded surface. Contains high concentrations of hydrated iron-sulfates and carbonate minerals.',
    evidenceType: 'observed',
    primaryInstrument: 'Mastcam-Z Stereo / SuperCam / PIXL',
    observationDate: '2024-06-15 (Sol 1180)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA26372/PIA26372~orig.jpg',
    imageCaption: 'Perseverance lookback panorama showing the bright, fractured rocky terrain of Bright Angel in Neretva Vallis.',
    imageCredit: 'NASA / JPL-Caltech / ASU / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[4]
    ],
    sampleCollectable: true,
    sampleName: 'Bright Angel Polygonal Siltstone Core',
    sampleType: 'Hydrothermally altered pale siltstone with mineral veins',
    mineralSignatures: ['Hydrated Sulfates', 'Carbonates', 'Secondary Silica', 'Iron Oxides'],
    scientificSources: [
      {
        title: 'NASA’s Perseverance Explores "Bright Angel" in Neretva Vallis',
        url: 'https://mars.nasa.gov/news/9658/nasas-perseverance-explores-bright-angel-in-jezero-crater/'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'poi_otis_peak',
    name: 'Otis Peak Mega-Flood Conglomerate',
    category: 'geology',
    mission: 'NASA Mars 2020',
    region: 'Belva Crater Margin Apron',
    coordinates: {
      latitude: 18.4140,
      longitude: 77.4180,
      elevation: -2505,
      datum: 'MOLA Mars Areoid',
      crs: 'Planetocentric East-positive'
    },
    worldPosition: { x: -150, y: 10.2, z: -155 },
    summary: 'A coarse, chaotic conglomerate boulder bed where Perseverance cored rock sample #18, preserving rounded river cobbles carried by catastrophic Martian floods.',
    scientificSignificance: 
      'Direct physical evidence that Mars experienced torrential, high-velocity flooding capable of moving boulders hundreds of kilograms in mass from deep in the Martian highlands into Lake Jezero.',
    detailedGeology: 
      'Poorly sorted polymict conglomerate with well-rounded pebbles and cobbles of basalt, gabbro, and quartz embedded in a sand-silt matrix. Core abrasion revealed multi-colored clasts transported from diverse geological origins outside Jezero.',
    evidenceType: 'observed',
    primaryInstrument: 'PIXL / Mastcam-Z / WATSON',
    observationDate: '2023-06-13 (Sol 822)',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA25962/PIA25962~orig.jpg',
    imageCaption: 'Abraded patch on Otis Peak showing colorful rounded clasts within the coarse river conglomerate.',
    imageCredit: 'NASA / JPL-Caltech / MSSS',
    provenance: [
      NASA_PROVENANCE_REGISTRY[0],
      NASA_PROVENANCE_REGISTRY[2]
    ],
    sampleCollectable: true,
    sampleName: 'Otis Peak River Conglomerate Core (Sample #MB-18)',
    sampleType: 'Coarse polymict fluvial conglomerate with rounded highland clasts',
    mineralSignatures: ['Feldspar', 'Pyroxene', 'Highland Anorthosite', 'Clay Cement'],
    scientificSources: [
      {
        title: 'Perseverance Caches Sample 18 from Otis Peak Conglomerate',
        url: 'https://mars.nasa.gov/news/9454/nasas-perseverance-rover-caches-its-18th-rock-core-sample/'
      }
    ],
    verificationStatus: 'verified'
  }
];

export { NERETVA_DISCOVERIES } from './regions/neretvaDiscoveries';
import { NERETVA_DISCOVERIES } from './regions/neretvaDiscoveries';

export const ALL_DISCOVERIES: DiscoveryRecord[] = [
  ...JEZERO_DISCOVERIES,
  ...NERETVA_DISCOVERIES
];

