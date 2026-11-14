import { MarsRegion, RegionalExpeditionRoute } from '../../types/region';

export const MARS_REGIONS: MarsRegion[] = [
  {
    id: 'jezero_crater',
    code: 'MB-R01-JC',
    name: 'Jezero Crater',
    subtitle: 'Paleolake Delta & Octavia Base',
    quadrangle: 'MC-13 Syrtis Major',
    centerCoordinates: {
      latitude: 18.4447,
      longitude: 77.4508,
      elevation: -2574,
      datum: 'MOLA IAU 2000 Mars Areoid',
      crs: 'Equirectangular / Planetocentric Mars'
    },
    bounds: {
      minLat: 18.36,
      maxLat: 18.52,
      minLon: 77.32,
      maxLon: 77.48
    },
    molaDatumElevation: -2574,
    elevationRange: {
      min: -2610,
      max: -2480
    },
    biomeType: 'paleolake_delta',
    geologicalEra: 'Late Noachian to Early Hesperian (~3.8 - 3.6 Ga)',
    distanceFromJezeroKm: 0,
    bearingFromJezero: 'ORIGIN (0°)',
    transitTimeRoverHours: 0,
    transitTimeHopperMinutes: 0,
    travelDifficulty: 'nominal',
    status: 'active',
    environmentalProfile: {
      surfacePressurePa: 610,
      temperatureCelsius: -45,
      dustOpticalDepthTau: 0.38,
      windSpeedMs: 6.2,
      windDirectionDegrees: 110,
      solarIrradianceWm2: 590,
      uvIndex: 8.5,
      radiationMsvYear: 245,
      stormFrequency: 'moderate',
      dustRisk: 'moderate',
      gravityMs2: 3.71
    },
    geologicalSummary:
      'A 45-km diameter impact basin formed ~3.9 billion years ago that was subsequently flooded by liquid water, creating an open-basin paleolake fed by Neretva Vallis. The resulting fan delta contains rich deposits of smectite clays, carbonates, and organic molecules.',
    scientificSignificance:
      'Primary landing site for NASA Mars 2020 Perseverance. The lacustrine mudstones and deltaic sandstones represent prime astrobiological repositories for fossilized micro-biosignatures.',
    keyGeologicalFeatures: [
      'Western Sedimentary River Delta',
      'Kodiak Butte Isolated Delta Outlier',
      'Belva Impact Crater (1 km diameter)',
      'Séítah Aeolian Dune Fields & Olivine Bedrock',
      'Citadelle Ridge Basaltic Flows'
    ],
    keyMissions: ['NASA Mars 2020 (Perseverance)', 'NASA Ingenuity Mars Helicopter'],
    datasetsUsed: [
      'NASA MOLA Global Topography DTM',
      'NASA MRO HiRISE Jezero Stereo DTM (0.25m/px)',
      'NASA MRO CTX Global Mosaic',
      'NASA MRO CRISM Targeted Hyperspectral Mineral Map'
    ],
    discoveryCount: 20,
    svgOrbitalCoords: { x: 52, y: 48 }
  },
  {
    id: 'neretva_vallis',
    code: 'MB-R02-NV',
    name: 'Neretva Vallis Inflow Gorge',
    subtitle: 'Crater Rim Breach & Fluvial Canyon',
    quadrangle: 'MC-13 Syrtis Major',
    centerCoordinates: {
      latitude: 18.5204,
      longitude: 77.2145,
      elevation: -2250,
      datum: 'MOLA IAU 2000 Mars Areoid',
      crs: 'Equirectangular / Planetocentric Mars'
    },
    bounds: {
      minLat: 18.42,
      maxLat: 18.62,
      minLon: 77.05,
      maxLon: 77.30
    },
    molaDatumElevation: -2250,
    elevationRange: {
      min: -2450,
      max: -1850
    },
    biomeType: 'fluvial_canyon',
    geologicalEra: 'Late Noachian (~3.75 Ga)',
    distanceFromJezeroKm: 18.4,
    bearingFromJezero: '282° WNW',
    transitTimeRoverHours: 1.2,
    transitTimeHopperMinutes: 4.5,
    travelDifficulty: 'rugged',
    status: 'expedition_ready',
    environmentalProfile: {
      surfacePressurePa: 585,
      temperatureCelsius: -52,
      dustOpticalDepthTau: 0.42,
      windSpeedMs: 9.8,
      windDirectionDegrees: 285,
      solarIrradianceWm2: 575,
      uvIndex: 9.0,
      radiationMsvYear: 255,
      stormFrequency: 'high',
      dustRisk: 'high',
      gravityMs2: 3.71
    },
    geologicalSummary:
      'A deep, 100-kilometer fluvial valley carved by violent catastrophic flash floods that breached the western rim of Jezero Crater. The gorge features 300-meter vertical canyon walls, cross-bedded fluvial gravel bars, boulder levees, and hanging dry waterfalls.',
    scientificSignificance:
      'Samples rocks washed downstream from hundreds of kilometers across the ancient Nili Planum highlands, offering a natural cross-section of early Martian crust outside the Jezero impact basin.',
    keyGeologicalFeatures: [
      'Western Crater Rim Chasm Breach',
      'Upper Cataract Plunge Pool',
      'Megaflood Rounded Boulder Levees',
      'Polygonal Columnar Jointing Strata',
      'Hanging Tributary Dry Canyons'
    ],
    keyMissions: ['NASA Mars 2020 (Extended Campaign)', 'ESA Mars Express (HRSC)'],
    datasetsUsed: [
      'ESA Mars Express HRSC High-Resolution Stereo Color',
      'NASA MRO HiRISE Stereo DTM (Neretva Entrance)',
      'NASA MRO CRISM Targeted Spectral Mineralogy'
    ],
    discoveryCount: 5,
    svgOrbitalCoords: { x: 34, y: 44 }
  },
  {
    id: 'nili_fossae',
    code: 'MB-R03-NF',
    name: 'Nili Fossae Troughs',
    subtitle: 'Ancient Tectonic Grabens & Carbonates',
    quadrangle: 'MC-13 Syrtis Major',
    centerCoordinates: {
      latitude: 21.8542,
      longitude: 74.8210,
      elevation: -850,
      datum: 'MOLA IAU 2000 Mars Areoid',
      crs: 'Equirectangular / Planetocentric Mars'
    },
    bounds: {
      minLat: 20.80,
      maxLat: 23.10,
      minLon: 73.50,
      maxLon: 76.20
    },
    molaDatumElevation: -850,
    elevationRange: {
      min: -1500,
      max: 650
    },
    biomeType: 'tectonic_rift',
    geologicalEra: 'Early Noachian (~4.0 - 3.9 Ga)',
    distanceFromJezeroKm: 185.6,
    bearingFromJezero: '320° NW',
    transitTimeRoverHours: 12.5,
    transitTimeHopperMinutes: 18.0,
    travelDifficulty: 'extreme',
    status: 'survey_pending',
    environmentalProfile: {
      surfacePressurePa: 510,
      temperatureCelsius: -58,
      dustOpticalDepthTau: 0.32,
      windSpeedMs: 14.5,
      windDirectionDegrees: 340,
      solarIrradianceWm2: 560,
      uvIndex: 11.2,
      radiationMsvYear: 285,
      stormFrequency: 'moderate',
      dustRisk: 'moderate',
      gravityMs2: 3.71
    },
    geologicalSummary:
      'A vast system of curved concentric grabens and tectonic rift valleys created by the immense shock of the ancient Isidis impact basin. Holds the largest exposed deposits of magnesium-carbonate, serpentine, and unaltered olivine in the solar system.',
    scientificSignificance:
      'Serpentinization reactions here generated abundant hydrogen and methane in Mars’s warmest, wettest era, creating conditions closely analogous to Earth’s deep-sea hydrothermal alkaline vent systems where life originated.',
    keyGeologicalFeatures: [
      'Nili Graben Fault Scarps (1,200m relief)',
      'Green Olivine Sand Dunes & Escarpments',
      'Hydrothermal Magnesium-Carbonate Crusts',
      'Impact Megabreccia Blocks (>100m wide)',
      'Kaolinite Clay Subsurface Veins'
    ],
    keyMissions: ['NASA MRO', 'NASA Mars Odyssey (THEMIS)', 'ESA Mars Express'],
    datasetsUsed: [
      'NASA MRO CRISM Hyperspectral Carbonate Mapping',
      'NASA Mars Odyssey THEMIS Multispectral Thermal',
      'NASA MOLA Planetary Gridded Topography'
    ],
    discoveryCount: 0,
    svgOrbitalCoords: { x: 22, y: 22 }
  },
  {
    id: 'isidis_planitia',
    code: 'MB-R04-IP',
    name: 'Isidis Planitia Basin',
    subtitle: 'Vast Impact Lowlands & Dust Seas',
    quadrangle: 'MC-13 / MC-05 Isidis',
    centerCoordinates: {
      latitude: 12.9120,
      longitude: 87.1045,
      elevation: -3750,
      datum: 'MOLA IAU 2000 Mars Areoid',
      crs: 'Equirectangular / Planetocentric Mars'
    },
    bounds: {
      minLat: 10.50,
      maxLat: 15.20,
      minLon: 84.00,
      maxLon: 90.50
    },
    molaDatumElevation: -3750,
    elevationRange: {
      min: -3900,
      max: -3500
    },
    biomeType: 'impact_basin',
    geologicalEra: 'Early Noachian to Amazonian (~3.9 Ga to Present)',
    distanceFromJezeroKm: 142.8,
    bearingFromJezero: '115° ESE',
    transitTimeRoverHours: 9.8,
    transitTimeHopperMinutes: 14.5,
    travelDifficulty: 'moderate',
    status: 'survey_pending',
    environmentalProfile: {
      surfacePressurePa: 785, // Highest atmospheric pressure near Jezero due to deep depression
      temperatureCelsius: -38,
      dustOpticalDepthTau: 0.58,
      windSpeedMs: 7.2,
      windDirectionDegrees: 80,
      solarIrradianceWm2: 605,
      uvIndex: 7.8,
      radiationMsvYear: 220,
      stormFrequency: 'severe',
      dustRisk: 'extreme',
      gravityMs2: 3.71
    },
    geologicalSummary:
      'A giant 1,500-km multi-ring impact basin formed by a colossal asteroid collision during the Late Heavy Bombardment. Its floor is deeply depressed (nearly 4 kilometers below the Martian datum) and covered in smooth volcanic flows, wrinkle ridges, and vast dust mantles.',
    scientificSignificance:
      'The thick atmosphere in this deep basin makes parachute descents and aerodynamic braking safer. It is also the historic crash/landing zone of the UK Beagle 2 lander (discovered by MRO in 2014).',
    keyGeologicalFeatures: [
      'Isidis Basin Floor Wrinkle Ridges',
      'Buried Glacial Mantle Pitted Cones',
      'Historic Beagle 2 Lander Site (2003)',
      'Pliva Vallis Basin Outflow Fan',
      'Vast Active Transverse Aeolian Ridges (TARs)'
    ],
    keyMissions: ['UK/ESA Beagle 2 (2003)', 'NASA Mars Global Surveyor (MGS)'],
    datasetsUsed: [
      'NASA MRO CTX Isidis Lowland Mosaic',
      'NASA MOLA Topographic Shaded Relief',
      'ESA Mars Express OMEGA Spectrometer'
    ],
    discoveryCount: 0,
    svgOrbitalCoords: { x: 82, y: 64 }
  },
  {
    id: 'syrtis_major',
    code: 'MB-R05-SM',
    name: 'Syrtis Major Planum',
    subtitle: 'Basaltic Shield Volcano & Calderas',
    quadrangle: 'MC-13 Syrtis Major',
    centerCoordinates: {
      latitude: 8.4200,
      longitude: 69.5100,
      elevation: 450,
      datum: 'MOLA IAU 2000 Mars Areoid',
      crs: 'Equirectangular / Planetocentric Mars'
    },
    bounds: {
      minLat: 6.00,
      maxLat: 11.00,
      minLon: 66.00,
      maxLon: 73.00
    },
    molaDatumElevation: 450,
    elevationRange: {
      min: -300,
      max: 1800
    },
    biomeType: 'volcanic_shield',
    geologicalEra: 'Hesperian (~3.6 - 3.2 Ga)',
    distanceFromJezeroKm: 345.0,
    bearingFromJezero: '215° SW',
    transitTimeRoverHours: 24.0,
    transitTimeHopperMinutes: 32.0,
    travelDifficulty: 'rugged',
    status: 'orbital_only',
    environmentalProfile: {
      surfacePressurePa: 490,
      temperatureCelsius: -62,
      dustOpticalDepthTau: 0.28,
      windSpeedMs: 16.0,
      windDirectionDegrees: 210,
      solarIrradianceWm2: 615,
      uvIndex: 12.5,
      radiationMsvYear: 310,
      stormFrequency: 'low',
      dustRisk: 'low',
      gravityMs2: 3.71
    },
    geologicalSummary:
      'A massive low-profile volcanic shield structure stretching 1,200 km across, crowned by two giant collapse calderas (Nili Patera and Meroe Patera). The dark tone visible from Earth telescopic observations is caused by unweathered, dark pyroxene and basaltic sands blown by howling Martian winds.',
    scientificSignificance:
      'Represents major Hesperian effusive volcanism. Lava tube networks provide ideal natural shielding candidates for future long-duration human Mars settlements.',
    keyGeologicalFeatures: [
      'Nili Patera Central Caldera Depression',
      'Collapsed Lava Tube Skylights',
      'Dacite & Pyroxene Volcanic Sand Corridors',
      'Hydrothermal Fissure Silica Slabs',
      'Radial Basaltic Dikes'
    ],
    keyMissions: ['NASA Mars Odyssey', 'NASA MRO', 'Telescopic Mars Observers (Huygens 1659)'],
    datasetsUsed: [
      'NASA MGS MOLA Topographic Atlas',
      'NASA MRO CRISM Volcanic Mineralogy',
      'NASA Mars Odyssey THEMIS Day/Night Infrared'
    ],
    discoveryCount: 0,
    svgOrbitalCoords: { x: 28, y: 82 }
  }
];

export const REGIONAL_EXPEDITION_ROUTES: RegionalExpeditionRoute[] = [
  {
    id: 'route_jezero_to_neretva',
    sourceRegionId: 'jezero_crater',
    targetRegionId: 'neretva_vallis',
    name: 'Western Rim Breach Expedition Traverse',
    distanceKm: 18.4,
    elevationDeltaMeters: 324, // Climb up from crater floor
    roverTraverseDifficulty: 'medium',
    suborbitalFlightViable: true,
    requiredRoverBatteryKwh: 34,
    requiredOxygenSupplyKg: 4.8,
    hazardWarnings: [
      'Steep 18° rocky rim slopes near the inflow breach',
      'High wind gusts in canyon bottleneck (>35 km/h)',
      'Sharp boulder talus can degrade rover wheel treads'
    ]
  },
  {
    id: 'route_jezero_to_nili',
    sourceRegionId: 'jezero_crater',
    targetRegionId: 'nili_fossae',
    name: 'Great Highland Graben Corridor',
    distanceKm: 185.6,
    elevationDeltaMeters: 1724, // Substantial highland ascent
    roverTraverseDifficulty: 'high',
    suborbitalFlightViable: true,
    requiredRoverBatteryKwh: 260,
    requiredOxygenSupplyKg: 38.0,
    hazardWarnings: [
      'Extreme elevation ascent reduces atmospheric density to 510 Pa',
      'Severe cosmic and solar UV radiation on highland ridges',
      'Complex multi-fault scarps require precise route waypoint navigation'
    ]
  },
  {
    id: 'route_jezero_to_isidis',
    sourceRegionId: 'jezero_crater',
    targetRegionId: 'isidis_planitia',
    name: 'Eastern Pliva Spillway Descent',
    distanceKm: 142.8,
    elevationDeltaMeters: -1176, // Deep descent into basin
    roverTraverseDifficulty: 'medium',
    suborbitalFlightViable: true,
    requiredRoverBatteryKwh: 190,
    requiredOxygenSupplyKg: 28.5,
    hazardWarnings: [
      'Dense atmospheric haze and extreme dust storm formation zone',
      'Deep dust drifts risk rover wheel entrapment',
      'Zero visual landmarks across flat aeolian terrain'
    ]
  },
  {
    id: 'route_jezero_to_syrtis',
    sourceRegionId: 'jezero_crater',
    targetRegionId: 'syrtis_major',
    name: 'Shield Volcano Ascent Crossing',
    distanceKm: 345.0,
    elevationDeltaMeters: 3024,
    roverTraverseDifficulty: 'impassable', // Requires Suborbital Hopper
    suborbitalFlightViable: true,
    requiredRoverBatteryKwh: 480,
    requiredOxygenSupplyKg: 72.0,
    hazardWarnings: [
      'Distance exceeds safe unassisted ground rover range; Suborbital Hopper recommended',
      'High abrasive basalt grit storms',
      'Caldera rim thermal anomalies'
    ]
  }
];

export function getRegionById(id: string): MarsRegion | undefined {
  return MARS_REGIONS.find((r) => r.id === id);
}

export function getExpeditionRoute(fromId: string, toId: string): RegionalExpeditionRoute | undefined {
  return REGIONAL_EXPEDITION_ROUTES.find(
    (r) => (r.sourceRegionId === fromId && r.targetRegionId === toId) ||
           (r.sourceRegionId === toId && r.targetRegionId === fromId)
  );
}
