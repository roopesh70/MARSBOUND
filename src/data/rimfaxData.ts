import { SubsurfaceLayer, SubsurfaceReflectorAnomaly } from '../types/rimfax';

/**
 * Authentic geological strata profiles by Martian region,
 * calibrated against NASA Perseverance RIMFAX findings.
 */
export const REGIONAL_STRATIGRAPHY: Record<string, SubsurfaceLayer[]> = {
  // 1. Jezero Crater Floor (Octavia Base / Séítah / Máaz Units)
  jezero_crater_floor: [
    {
      depthStartMeters: 0,
      depthEndMeters: 1.2,
      layerName: 'Aeolian Mantle & Regolith Dust',
      formationName: 'Modern Jezero Surficial Mantle',
      dielectricPermittivity: 2.8,
      densityGcm3: 1.5,
      description: 'Fine unconsolidated basaltic sands, dust fallout, and small basalt pebbles.',
      reflectivityDb: -32,
      colorHex: '#c2410c'
    },
    {
      depthStartMeters: 1.2,
      depthEndMeters: 4.8,
      layerName: 'Vesicular Basalt Flow Unit (Máaz)',
      formationName: 'Máaz Crater Floor Basalt Member',
      dielectricPermittivity: 6.4,
      densityGcm3: 2.85,
      description: 'Dense crystalline basalt with secondary sulfate mineral fillings in micro-vesicles.',
      reflectivityDb: -18,
      colorHex: '#475569'
    },
    {
      depthStartMeters: 4.8,
      depthEndMeters: 8.5,
      layerName: 'Olivine Cumulate Layer (Séítah)',
      formationName: 'Séítah Ultramafic Intrusive Member',
      dielectricPermittivity: 7.6,
      densityGcm3: 3.15,
      description: 'Coarse-grained forsteritic olivine and augite pyroxene cumulate showing distinct igneous layering.',
      reflectivityDb: -12,
      colorHex: '#166534'
    },
    {
      depthStartMeters: 8.5,
      depthEndMeters: 10.0,
      layerName: 'Basal Impact Melt & Brecciated Bedrock',
      formationName: 'Jezero Basin Basement Unit',
      dielectricPermittivity: 8.2,
      densityGcm3: 3.2,
      description: 'Shock-melted brecciated basement rock created during the initial 45km asteroid impact.',
      reflectivityDb: -8,
      colorHex: '#334155'
    }
  ],

  // 2. Western Delta Fan (Delta Scarp / Kodiak / Hogwallow)
  jezero_delta_fan: [
    {
      depthStartMeters: 0,
      depthEndMeters: 0.8,
      layerName: 'Eolian Sand Waves & Deflation Lag',
      formationName: 'Delta Topset Lag Deposit',
      dielectricPermittivity: 2.6,
      densityGcm3: 1.45,
      description: 'Windblown ripples and coarse grain lag overlying delta siltstone.',
      reflectivityDb: -34,
      colorHex: '#ea580c'
    },
    {
      depthStartMeters: 0.8,
      depthEndMeters: 4.2,
      layerName: 'Dipping Delta Foreset Cross-Strata',
      formationName: 'Shenandoah Formation (Delta Front)',
      dielectricPermittivity: 4.3,
      densityGcm3: 2.2,
      description: 'Aqueous cross-bedded siltstone and fine sandstone dipping 15° toward the paleo-lake interior.',
      reflectivityDb: -14,
      colorHex: '#0284c7'
    },
    {
      depthStartMeters: 4.2,
      depthEndMeters: 7.8,
      layerName: 'Lacustrine Bottomset Mudstones',
      formationName: 'Tenby Mudstone Member',
      dielectricPermittivity: 5.1,
      densityGcm3: 2.4,
      description: 'Ultra fine-grained smectite clays deposited in quiet, deep paleolake standing water.',
      reflectivityDb: -16,
      colorHex: '#0d9488'
    },
    {
      depthStartMeters: 7.8,
      depthEndMeters: 10.0,
      layerName: 'Submerged Crater Floor Basalt Contact',
      formationName: 'Pre-Delta Paleolake Floor',
      dielectricPermittivity: 7.2,
      densityGcm3: 2.9,
      description: 'Sharp angular unconformity where delta sediment blankets ancient crater floor lava.',
      reflectivityDb: -6,
      colorHex: '#1e293b'
    }
  ],

  // 3. Neretva Vallis Inflow Gorge & Breach
  neretva_vallis_gorge: [
    {
      depthStartMeters: 0,
      depthEndMeters: 2.0,
      layerName: 'Catastrophic Flood Boulder Horizon',
      formationName: 'Neretva Breach Inundation Clasts',
      dielectricPermittivity: 5.8,
      densityGcm3: 2.65,
      description: 'Polymict rounded boulders and high-energy gravels transported through the rim canyon.',
      reflectivityDb: -11,
      colorHex: '#b45309'
    },
    {
      depthStartMeters: 2.0,
      depthEndMeters: 6.5,
      layerName: 'Hydrothermally Fractured Canyon Bedrock',
      formationName: 'Neretva Wall Bedrock Complex',
      dielectricPermittivity: 6.9,
      densityGcm3: 2.8,
      description: 'Dense bedrock fractured by rim breach faulting, filled with secondary sulfate and silica veins.',
      reflectivityDb: -15,
      colorHex: '#64748b'
    },
    {
      depthStartMeters: 6.5,
      depthEndMeters: 10.0,
      layerName: 'Ancient Noachian Anorthositic Crust',
      formationName: 'Primordial Planetary Flotation Crust',
      dielectricPermittivity: 8.4,
      densityGcm3: 3.1,
      description: 'Pristine plagioclase-rich Noachian crustal rocks dating back >4.2 billion years.',
      reflectivityDb: -9,
      colorHex: '#475569'
    }
  ]
};

/**
 * 5 High-Interest Subsurface Anomalous Reflector Zones across Jezero & Neretva.
 * Rover detection of these reflector anomalies triggers coring prompts.
 */
export const SUBSURFACE_ANOMALIES: SubsurfaceReflectorAnomaly[] = [
  {
    id: 'rimfax_ice_lens_01',
    name: 'Subsurface Permafrost Ice Lens Anomaly',
    worldPosition: { x: -75, z: 45 },
    radiusMeters: 24,
    targetDepthMeters: 2.8,
    dielectricContrast: 'High (ε_r = 3.1 pure ice vs 7.2 basalt host rock)',
    geologicalInterpretation:
      'Sharp hyperbolic radar reflection signatures indicate a lens-shaped body of subsurface pore ice / permafrost insulated beneath 2.5 meters of dry basaltic regolith.',
    nasaScienceSignificance:
      'Subsurface ice in low-latitude Jezero is a monumental find for in-situ resource utilization (ISRU) and astrobiology paleoclimatology.',
    drillableSampleName: 'Cryo-Preserved Permafrost Core #ICE-01',
    drillableSampleNotes: 'Drilled from 2.8m subsurface ice lens detected by RIMFAX Ground Penetrating Radar.',
    baseResearchPoints: 400
  },
  {
    id: 'rimfax_paleochannel_02',
    name: 'Buried Delta Paleochannel Infill',
    worldPosition: { x: -125, z: -35 },
    radiusMeters: 28,
    targetDepthMeters: 4.2,
    dielectricContrast: 'Moderate-High (ε_r = 4.1 clay infill vs 6.5 sandstone)',
    geologicalInterpretation:
      'U-shaped dipping radar reflectors showing an incised fluvial paleochannel buried beneath subsequent delta lake sedimentation.',
    nasaScienceSignificance:
      'Ancient channel beds concentrate dense organic detritus washed in during peak river discharge phases.',
    drillableSampleName: 'Buried Channel Paleolake Core #DF-02',
    drillableSampleNotes: 'Extracted from incised paleochannel cross-strata detected by RIMFAX.',
    baseResearchPoints: 360
  },
  {
    id: 'rimfax_lava_tube_03',
    name: 'Subsurface Volcanic Lava Tube Cavity',
    worldPosition: { x: -220, z: -145 },
    radiusMeters: 22,
    targetDepthMeters: 5.6,
    dielectricContrast: 'Extreme (ε_r = 1.0 air/void vs 7.8 basalt roof)',
    geologicalInterpretation:
      'Characteristic dual-boundary radar reflection arch indicating an intact hollow subterranean volcanic conduit / lava tube.',
    nasaScienceSignificance:
      'Subsurface cavities provide natural radiation shielding for future human habitats and protect unweathered volcanic minerals.',
    drillableSampleName: 'Lava Tube Roof Crystalline Core #LT-03',
    drillableSampleNotes: 'Extracted from structurally sound lava tube ceiling stratum.',
    baseResearchPoints: 420
  },
  {
    id: 'rimfax_hydrothermal_vent_04',
    name: 'Buried Hydrothermal Silica Chimney',
    worldPosition: { x: 70, z: -80 },
    radiusMeters: 20,
    targetDepthMeters: 3.5,
    dielectricContrast: 'High (ε_r = 3.8 opaline silica vs 7.5 cumulate floor)',
    geologicalInterpretation:
      'Vertical column of high-reflectivity acoustic contrast indicating a fossilized sublacustrine hydrothermal spring or mineral mound.',
    nasaScienceSignificance:
      'Hydrothermal vents on Earth are primary candidates for the origin of early life and preserve micro-fossils in silica chert.',
    drillableSampleName: 'Hydrothermal Opaline Silica Core #HT-04',
    drillableSampleNotes: 'Drilled from deep hydrothermal chimney conduit identified by RIMFAX GPR.',
    baseResearchPoints: 450
  },
  {
    id: 'rimfax_impact_melt_lens_05',
    name: 'Deep Impact Melt Sheet Lens',
    worldPosition: { x: 110, z: 85 },
    radiusMeters: 26,
    targetDepthMeters: 6.8,
    dielectricContrast: 'High (ε_r = 8.6 impact glass vs 6.2 fractured bedrock)',
    geologicalInterpretation:
      'Continuous planar sheet of high-density shocked glass formed during the energetic peak of the Jezero impact basin excavation.',
    nasaScienceSignificance:
      'Provides absolute radiometric crystallization age of the Jezero basin impact event (~3.94 billion years).',
    drillableSampleName: 'Impact Basin Melt Glass Core #IM-05',
    drillableSampleNotes: 'Extracted from deep impact melt horizon via RIMFAX subsurface targeting.',
    baseResearchPoints: 380
  }
];
