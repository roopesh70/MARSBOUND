import { SampleAnalysisProfile } from '../types/science';

export const SAMPLE_ANALYSIS_PROFILES: Record<string, SampleAnalysisProfile> = {
  // 1. CHEYAVA FALLS - The sensation of Mars 2020: Leopard spots & Vivianite
  poi_cheyava_falls: {
    discoveryId: 'poi_cheyava_falls',
    sampleName: 'Cheyava Falls Spotted Mudstone Core',
    rockClass: 'sedimentary',
    primaryInstrument: 'PIXL XRF & SHERLOC Deep-UV Raman',
    elementalAssay: {
      SiO2: 44.8,
      FeO: 21.4,
      MgO: 8.2,
      Al2O3: 7.9,
      CaO: 5.6,
      TiO2: 0.9,
      SO3: 6.2,
      P2O5: 3.8,
      Cl: 0.7,
      totalOxideWt: 99.5,
      traceElements: ['Vanadium (120 ppm)', 'Nickel (85 ppm)', 'Yttrium (24 ppm)']
    },
    mineralPhases: [
      { name: 'Vivianite (Iron Phosphate)', formula: 'Fe₃(PO₄)₂·8H₂O', wtPercent: 14.5, crystalSystem: 'Monoclinic' },
      { name: 'Calcium Sulfate (Bassanite)', formula: 'CaSO₄·0.5H₂O', wtPercent: 18.2, crystalSystem: 'Monoclinic' },
      { name: 'Hematite (Fe Oxide Rim)', formula: 'Fe₂O₃', wtPercent: 12.0, crystalSystem: 'Trigonal' },
      { name: 'Fe-Smectite (Nontronite)', formula: 'Na₀.₃Fe₂³⁺(Si,Al)₄O₁₀(OH)₂·nH₂O', wtPercent: 36.5, crystalSystem: 'Monoclinic' },
      { name: 'Amorphous Silica Matrix', formula: 'SiO₂·nH₂O', wtPercent: 18.8, crystalSystem: 'Amorphous' }
    ],
    biosignature: {
      score: 94,
      classification: 'Prime Biosignature Candidate',
      organicCarbonDetected: true,
      redoxDisequilibrium: true,
      vivianitePhosphateHalo: true,
      carbonIsotopeAnomaly: 'Depleted δ¹³C signature (-28‰ VPDB) co-located with reduced iron-phosphate rings',
      nasaSignificanceReport: 
        'PIXL chemical mapping reveals millimeter-scale white calcium sulfate veins flanked by dark "leopard spot" reaction halos. Within these halos, iron-phosphate (vivianite) co-localizes with aromatic organic molecules detected by SHERLOC. On Earth, identical chemical reduction halos form when ancient anaerobic microbes utilize ferric iron and sulfate as electron acceptors.'
    },
    baseResearchPoints: 350,
    scientificInsights: [
      'Chemical energy source: Ancient microbial metabolism may have utilized redox reaction between iron and sulfate.',
      'Aromatic ring molecules detected within the vivianite rims.',
      'Formed during late Noachian/early Hesperian habitable lake conditions.'
    ],
    scientificPaperRef: {
      title: 'A Potential Biosignature Candidate in Veined Lacustrine Mudstones of Neretva Vallis',
      authors: 'Farley, K. A., Stack, K. M., Hurowitz, J. A., et al.',
      journal: 'NASA Mars 2020 Science Team Report / Nature Geoscience',
      year: 2024,
      doi: '10.1038/s41561-024-01520-x'
    }
  },

  // 2. HOGWALLOW FLATS - Organic-bearing Delta Mudstone
  poi_hogwallow_flats: {
    discoveryId: 'poi_hogwallow_flats',
    sampleName: 'Hogwallow Organic Mudstone Core',
    rockClass: 'sedimentary',
    primaryInstrument: 'SHERLOC Raman & WATSON',
    elementalAssay: {
      SiO2: 51.6,
      FeO: 14.8,
      MgO: 11.2,
      Al2O3: 10.4,
      CaO: 4.8,
      TiO2: 0.8,
      SO3: 4.6,
      P2O5: 0.9,
      Cl: 0.5,
      totalOxideWt: 99.6,
      traceElements: ['Chromium (240 ppm)', 'Strontium (180 ppm)', 'Zirconium (70 ppm)']
    },
    mineralPhases: [
      { name: 'Fe/Mg-Smectite (Saponite)', formula: '(Ca/2,Na)₀.₃(Mg,Fe)₃(Si,Al)₄O₁₀(OH)₂·4H₂O', wtPercent: 44.0, crystalSystem: 'Monoclinic' },
      { name: 'Anhydrite Sulfate', formula: 'CaSO₄', wtPercent: 16.5, crystalSystem: 'Orthorhombic' },
      { name: 'Albite Plagioclase', formula: 'NaAlSi₃O₈', wtPercent: 19.5, crystalSystem: 'Triclinic' },
      { name: 'Magnetite', formula: 'Fe₃O₄', wtPercent: 8.0, crystalSystem: 'Isometric' },
      { name: 'Polycyclic Aromatic Organics', formula: 'C_n H_m Rings', wtPercent: 1.2, crystalSystem: 'Amorphous' }
    ],
    biosignature: {
      score: 82,
      classification: 'High Astrobiological Interest',
      organicCarbonDetected: true,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      carbonIsotopeAnomaly: 'Aromatic fluorescence peaks at 280-320nm excitation',
      nasaSignificanceReport:
        'SHERLOC Raman spectroscopy identified multiple aromatic organic carbon functional groups embedded directly in smectite clay sheets. Clays are exceptional preservers of biological organic matter over billions of years on Earth.'
    },
    baseResearchPoints: 280,
    scientificInsights: [
      'Deposited in a low-energy lacustrine bottomset environment.',
      'High cation-exchange capacity in smectite clays shielded organic chains from solar UV degradation.',
      'Key target for Earth laboratory gas chromatography-mass spectrometry (GC-MS).'
    ],
    scientificPaperRef: {
      title: 'Diverse organic molecules observed by SHERLOC on the delta front of Jezero crater',
      authors: 'Scheller, E. L., Razzell Hollis, J., Cardarelli, E. L., et al.',
      journal: 'Science',
      year: 2022,
      doi: '10.1126/science.abn9083'
    }
  },

  // 3. WILDCAT RIDGE - Sulfate and Organic Mudstone
  poi_wildcat_ridge: {
    discoveryId: 'poi_wildcat_ridge',
    sampleName: 'Wildcat Organic-Bearing Sulfate Core',
    rockClass: 'sedimentary',
    primaryInstrument: 'SHERLOC Raman & PIXL',
    elementalAssay: {
      SiO2: 43.2,
      FeO: 16.1,
      MgO: 9.8,
      Al2O3: 8.4,
      CaO: 8.2,
      TiO2: 0.7,
      SO3: 11.8,
      P2O5: 0.6,
      Cl: 0.8,
      totalOxideWt: 99.6,
      traceElements: ['Zinc (95 ppm)', 'Copper (45 ppm)', 'Cobalt (30 ppm)']
    },
    mineralPhases: [
      { name: 'Gypsum (Hydrated Sulfate)', formula: 'CaSO₄·2H₂O', wtPercent: 28.0, crystalSystem: 'Monoclinic' },
      { name: 'Magnesian Smectite', formula: 'Mg₃Si₄O₁₀(OH)₂', wtPercent: 34.0, crystalSystem: 'Monoclinic' },
      { name: 'Ferrihydrite', formula: 'Fe₂O₃·0.5H₂O', wtPercent: 14.5, crystalSystem: 'Trigonal' },
      { name: 'Quartz / Microcrystalline Silica', formula: 'SiO₂', wtPercent: 21.0, crystalSystem: 'Trigonal' }
    ],
    biosignature: {
      score: 86,
      classification: 'High Astrobiological Interest',
      organicCarbonDetected: true,
      redoxDisequilibrium: true,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Sulfate evaporite minerals precipitate when water bodies evaporate, trapping micro-droplets and organic matter within fluid inclusions. Wildcat Ridge exhibits the highest concentration of organic signatures detected in the fan front.'
    },
    baseResearchPoints: 300,
    scientificInsights: [
      'Evidence of saline lake evaporation phase in Jezero.',
      'Sulfate minerals are prime targets for extracting ancient fluid inclusions (paleo-water).',
      'Samples cached into Titanium Tube #21 for Earth Return.'
    ],
    scientificPaperRef: {
      title: 'A rich organic-mineral record in the Jezero crater delta front',
      authors: 'Simon, J. I., Shuster, D. L., et al.',
      journal: 'Journal of Geophysical Research: Planets',
      year: 2023,
      doi: '10.1029/2023JE007871'
    }
  },

  // 4. JEZERO DELTA SCARP - Fine-Grained Delta Mudstone
  poi_delta_scarp: {
    discoveryId: 'poi_delta_scarp',
    sampleName: 'Jezero Delta Mudstone (Sample #MB-01)',
    rockClass: 'sedimentary',
    primaryInstrument: 'CheMin XRD & Mastcam-Z',
    elementalAssay: {
      SiO2: 48.5,
      FeO: 17.2,
      MgO: 10.1,
      Al2O3: 9.8,
      CaO: 5.4,
      TiO2: 0.9,
      SO3: 5.8,
      P2O5: 0.8,
      Cl: 0.6,
      totalOxideWt: 99.1,
      traceElements: ['Barium (110 ppm)', 'Lithium (35 ppm)']
    },
    mineralPhases: [
      { name: 'Nontronite Clay (Fe-smectite)', formula: 'Na₀.₃Fe₂³⁺(Si,Al)₄O₁₀(OH)₂·nH₂O', wtPercent: 42.0, crystalSystem: 'Monoclinic' },
      { name: 'Opaline Silica', formula: 'SiO₂·nH₂O', wtPercent: 24.5, crystalSystem: 'Amorphous' },
      { name: 'Bassanite (Calcium Sulfate)', formula: 'CaSO₄·0.5H₂O', wtPercent: 15.5, crystalSystem: 'Monoclinic' },
      { name: 'Augite Pyroxene', formula: '(Ca,Mg,Fe)₂Si₂O₆', wtPercent: 16.0, crystalSystem: 'Monoclinic' }
    ],
    biosignature: {
      score: 78,
      classification: 'High Astrobiological Interest',
      organicCarbonDetected: true,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Lacustrine delta bottomset mudstones deposited in standing water. The presence of hydrated opaline silica and smectite confirms prolonged aqueous alteration at near-neutral pH—the gold standard for microbial habitability.'
    },
    baseResearchPoints: 240,
    scientificInsights: [
      'Confirms perennial lake existence in Jezero 3.7 billion years ago.',
      'Hydrated silica can preserve microfossils in cellular-level detail.',
      'Near-neutral pH aqueous regime with low salinity.'
    ],
    scientificPaperRef: {
      title: 'Perseverance rover reveals an ancient delta-lake system and flood deposits at Jezero crater',
      authors: 'Mangold, N., Gupta, S., Armstrong, R., et al.',
      journal: 'Science',
      year: 2021,
      doi: '10.1126/science.abl4051'
    }
  },

  // 5. SÉÍTAH DUNES - Olivine Cumulate Igneous Rock
  poi_seetah_dunes: {
    discoveryId: 'poi_seetah_dunes',
    sampleName: 'Séítah Olivine Cumulate (Sample #MB-03)',
    rockClass: 'igneous',
    primaryInstrument: 'PIXL XRF & SuperCam LIBS',
    elementalAssay: {
      SiO2: 41.2,
      FeO: 22.8,
      MgO: 24.6,
      Al2O3: 4.1,
      CaO: 3.8,
      TiO2: 0.5,
      SO3: 1.2,
      P2O5: 0.4,
      Cl: 0.2,
      totalOxideWt: 98.8,
      traceElements: ['Nickel (1450 ppm)', 'Chromium (2800 ppm)', 'Cobalt (110 ppm)']
    },
    mineralPhases: [
      { name: 'Forsteritic Olivine (Fo72)', formula: '(Mg₀.₇₂Fe₀.₂₈)₂SiO₄', wtPercent: 52.0, crystalSystem: 'Orthorhombic' },
      { name: 'Augite Pyroxene', formula: 'Ca(Mg,Fe)Si₂O₆', wtPercent: 28.5, crystalSystem: 'Monoclinic' },
      { name: 'Magnesium Carbonate (Alteration)', formula: 'MgCO₃', wtPercent: 8.5, crystalSystem: 'Trigonal' },
      { name: 'Chromite Spinel', formula: 'FeCr₂O₄', wtPercent: 4.5, crystalSystem: 'Isometric' },
      { name: 'Plagioclase Feldspar', formula: 'CaAl₂Si₂O₈', wtPercent: 5.5, crystalSystem: 'Triclinic' }
    ],
    biosignature: {
      score: 12,
      classification: 'Abiotic Control',
      organicCarbonDetected: false,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Ultramafic igneous cumulate representing the base floor of Jezero Crater before lake inundation. Provides an invaluable abiotic baseline control. The secondary magnesium carbonate in interstitial voids proves post-emplacement carbonation by ancient groundwaters.'
    },
    baseResearchPoints: 210,
    scientificInsights: [
      'High-magnesium olivine indicates crystallization in a deep, slowly cooling magma chamber or thick lava lake.',
      'Allows precise radiometric dating of Jezero crater floor formation (~3.99 Ga).',
      'Carbonate minerals within the olivine grains prove early carbon dioxide sequestration on Mars.'
    ],
    scientificPaperRef: {
      title: 'A igneous cumulate rock in Jezero crater, Mars',
      authors: 'Farley, K. A., Amundsen, H. E. F., et al.',
      journal: 'Science',
      year: 2022,
      doi: '10.1126/science.abo2196'
    }
  },

  // 6. ATOKO POINT - Pure Anorthosite Crust Fragment
  poi_atoko_point: {
    discoveryId: 'poi_atoko_point',
    sampleName: 'Atoko Point Anorthositic Crust Fragment',
    rockClass: 'crustal_fragment',
    primaryInstrument: 'SuperCam LIBS & Mastcam-Z',
    elementalAssay: {
      SiO2: 54.2,
      FeO: 3.1,
      MgO: 1.8,
      Al2O3: 26.5,
      CaO: 10.9,
      TiO2: 0.2,
      SO3: 0.3,
      P2O5: 0.1,
      Cl: 0.1,
      totalOxideWt: 97.2,
      traceElements: ['Europium (+Eu anomaly 4.2 ppm)', 'Gallium (22 ppm)']
    },
    mineralPhases: [
      { name: 'Plagioclase Feldspar (Anorthite)', formula: 'CaAl₂Si₂O₈', wtPercent: 86.0, crystalSystem: 'Triclinic' },
      { name: 'Diopside Pyroxene', formula: 'CaMgSi₂O₆', wtPercent: 8.5, crystalSystem: 'Monoclinic' },
      { name: 'Quartz Micro-Veins', formula: 'SiO₂', wtPercent: 3.5, crystalSystem: 'Trigonal' }
    ],
    biosignature: {
      score: 4,
      classification: 'Abiotic Control',
      organicCarbonDetected: false,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Pale, boulder-sized float rock unlike anything else encountered in Jezero. Composed almost purely of plagioclase feldspar (anorthosite). This represents pristine, ancient planetary crust from the primordial Martian magma ocean >4.2 billion years ago, washed down into the crater during catastrophic floods.'
    },
    baseResearchPoints: 290,
    scientificInsights: [
      'Evidence for an ancient lunar-like flotation crust on early Mars.',
      'Shock metamorphism features indicate ejection by giant impact basins (Isidis).',
      'Oldest crustal rock fragment yet analyzed in the Syrtis Major Quadrangle.'
    ],
    scientificPaperRef: {
      title: 'Diverse crustal lithologies revealed by SuperCam in Jezero crater',
      authors: 'Wiens, R. C., Udry, A., Beyssac, O., et al.',
      journal: 'Nature Geoscience',
      year: 2024,
      doi: '10.1038/s41561-024-01412-2'
    }
  },

  // 7. CASTELL HENLLYS - Lacustrine Carbonates
  poi_castell_henllys: {
    discoveryId: 'poi_castell_henllys',
    sampleName: 'Castell Henllys Lacustrine Carbonate Core',
    rockClass: 'sedimentary',
    primaryInstrument: 'PIXL XRF & SHERLOC',
    elementalAssay: {
      SiO2: 38.4,
      FeO: 12.1,
      MgO: 26.8,
      Al2O3: 3.2,
      CaO: 8.9,
      TiO2: 0.3,
      SO3: 2.1,
      P2O5: 0.7,
      Cl: 0.4,
      totalOxideWt: 92.9,
      traceElements: ['Manganese (620 ppm)', 'Strontium (310 ppm)']
    },
    mineralPhases: [
      { name: 'Hydromagnesite / Magnesite', formula: 'Mg₅(CO₃)₄(OH)₂·4H₂O', wtPercent: 46.0, crystalSystem: 'Monoclinic' },
      { name: 'Microcrystalline Chert (Silica)', formula: 'SiO₂', wtPercent: 32.0, crystalSystem: 'Trigonal' },
      { name: 'Dolomite', formula: 'CaMg(CO₃)₂', wtPercent: 14.5, crystalSystem: 'Trigonal' }
    ],
    biosignature: {
      score: 88,
      classification: 'Prime Biosignature Candidate',
      organicCarbonDetected: true,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      carbonIsotopeAnomaly: 'Enriched in light carbon isotopes compatible with biogenic fractionation',
      nasaSignificanceReport:
        'Lacustrine carbonate rock formed along the ancient crater margin shoreline ("bathtub ring"). On Earth, alkaline lakes produce microbialites and stromatolites within hydromagnesite and silica chert, entombing cellular structures indefinitely.'
    },
    baseResearchPoints: 310,
    scientificInsights: [
      'Alkaline paleolake shoreline facies with low-energy quiet precipitation.',
      'Highest carbonate concentration sampled across the entire mission.',
      'Optimal lithology for preserving microbial structural morphology.'
    ],
    scientificPaperRef: {
      title: 'Carbonate-bearing rocks on the rim of Jezero crater and implications for ancient biosignatures',
      authors: 'Horgan, B. H. N., Anderson, R. B., et al.',
      journal: 'Icarus',
      year: 2020,
      doi: '10.1016/j.icarus.2019.113526'
    }
  },

  // 8. KODIAK BUTTE - Fluvial Delta Sandstone
  poi_kodiak_butte: {
    discoveryId: 'poi_kodiak_butte',
    sampleName: 'Kodiak Cross-Bedded Sandstone',
    rockClass: 'sedimentary',
    primaryInstrument: 'Mastcam-Z & SuperCam',
    elementalAssay: {
      SiO2: 56.4,
      FeO: 15.2,
      MgO: 8.4,
      Al2O3: 11.2,
      CaO: 4.2,
      TiO2: 0.9,
      SO3: 1.8,
      P2O5: 0.5,
      Cl: 0.3,
      totalOxideWt: 98.9,
      traceElements: ['Vanadium (140 ppm)', 'Zirconium (110 ppm)']
    },
    mineralPhases: [
      { name: 'Quartz / Detrital Silica', formula: 'SiO₂', wtPercent: 38.0, crystalSystem: 'Trigonal' },
      { name: 'Plagioclase Feldspar', formula: 'NaAlSi₃O₈ - CaAl₂Si₂O₈', wtPercent: 28.0, crystalSystem: 'Triclinic' },
      { name: 'Hematite Matrix Cement', formula: 'Fe₂O₃', wtPercent: 18.5, crystalSystem: 'Trigonal' },
      { name: 'Smectite Matrix', formula: 'Clay Silicates', wtPercent: 12.0, crystalSystem: 'Monoclinic' }
    ],
    biosignature: {
      score: 42,
      classification: 'Moderate Aqueous Alteration',
      organicCarbonDetected: false,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Deltaic foreset sandstone demonstrating classic Gilbert-type delta deposition. High water velocity carried sand and gravel into the lake; moderate preservation potential for organics due to high oxic turbulence.'
    },
    baseResearchPoints: 190,
    scientificInsights: [
      'Proves lake water level once reached 250m depth above the crater floor.',
      'Foreset bedding dip angle (~22°) reveals rapid fluvial discharge from Neretva Vallis.',
      'Erosion remnant isolated from main western fan.'
    ],
    scientificPaperRef: {
      title: 'Geomorphology and stratigraphy of the Kodiak remnant butte in Jezero',
      authors: 'Gupta, S., Mangold, N., et al.',
      journal: 'Science Advances',
      year: 2022,
      doi: '10.1126/sciadv.abm7784'
    }
  },

  // 9. NERETVA INFLOW GORGE SAMPLES (Breach & Catastrophic flood rocks)
  poi_neretva_canyon: {
    discoveryId: 'poi_neretva_canyon',
    sampleName: 'Neretva Canyon Wall Crustal Clast',
    rockClass: 'impact_breccia',
    primaryInstrument: 'PIXL XRF & CheMin',
    elementalAssay: {
      SiO2: 50.1,
      FeO: 18.4,
      MgO: 12.2,
      Al2O3: 9.8,
      CaO: 5.1,
      TiO2: 0.7,
      SO3: 1.4,
      P2O5: 0.4,
      Cl: 0.3,
      totalOxideWt: 98.4,
      traceElements: ['Nickel (420 ppm)', 'Cobalt (60 ppm)']
    },
    mineralPhases: [
      { name: 'Shocked Pyroxene (Enstatite)', formula: 'Mg₂Si₂O₆', wtPercent: 38.0, crystalSystem: 'Orthorhombic' },
      { name: 'Calc-alkaline Feldspar', formula: 'KAlSi₃O₈', wtPercent: 32.0, crystalSystem: 'Monoclinic' },
      { name: 'Chlorite Alteration', formula: '(Mg,Fe)₅Al(AlSi₃O₁₀)(OH)₈', wtPercent: 16.5, crystalSystem: 'Monoclinic' },
      { name: 'Impact Melt Glass', formula: 'Amorphous Silicate', wtPercent: 11.0, crystalSystem: 'Amorphous' }
    ],
    biosignature: {
      score: 28,
      classification: 'Moderate Aqueous Alteration',
      organicCarbonDetected: false,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Excavated from the deep bedrock canyon wall of the Neretva gorge. Contains planar deformation features from the initial Jezero asteroid impact event, later carved by catastrophic flood channels.'
    },
    baseResearchPoints: 230,
    scientificInsights: [
      'Records the violent asteroid impact that formed the 45km Jezero basin 3.9 Ga.',
      'Post-impact hydrothermal circulation deposited chlorite and secondary silica.',
      'Bedrock wall exposure provides complete cross-section of early Martian crust.'
    ],
    scientificPaperRef: {
      title: 'Structural evolution of the Neretva Vallis breach into Jezero crater',
      authors: 'Stack, K. M., et al.',
      journal: 'Geophysical Research Letters',
      year: 2023,
      doi: '10.1029/2023GL103890'
    }
  },

  // 10. NERETVA BREACH OUTPOST - Rim fault impact breccia
  poi_neretva_breach_outpost: {
    discoveryId: 'poi_neretva_breach_outpost',
    sampleName: 'Chasm Rim Breccia Core #NV-01',
    rockClass: 'impact_breccia',
    primaryInstrument: 'CheMin XRD & PIXL',
    elementalAssay: {
      SiO2: 47.9,
      FeO: 19.8,
      MgO: 14.1,
      Al2O3: 8.2,
      CaO: 5.4,
      TiO2: 0.8,
      SO3: 1.9,
      P2O5: 0.3,
      Cl: 0.4,
      totalOxideWt: 98.8,
      traceElements: ['Chromium (980 ppm)', 'Scandium (32 ppm)']
    },
    mineralPhases: [
      { name: 'Low-Calcium Pyroxene', formula: '(Mg,Fe)SiO₃', wtPercent: 41.0, crystalSystem: 'Orthorhombic' },
      { name: 'Plagioclase', formula: 'CaAl₂Si₂O₈', wtPercent: 29.0, crystalSystem: 'Triclinic' },
      { name: 'Iron-Saponite Clays', formula: 'Smectite Silicate', wtPercent: 18.0, crystalSystem: 'Monoclinic' },
      { name: 'Magnetite Matrix', formula: 'Fe₃O₄', wtPercent: 10.5, crystalSystem: 'Isometric' }
    ],
    biosignature: {
      score: 22,
      classification: 'Low Organic Context',
      organicCarbonDetected: false,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Shattered rim bedrock at the tectonic breach fault. Aqueous hydrothermal fluids circulated through the fractures during the lake highstand.'
    },
    baseResearchPoints: 220,
    scientificInsights: [
      'Demonstrates the catastrophic rupture of the Jezero rim by incoming floodwaters.',
      'Saponite clay confirms hydrothermal alteration temperature between 80°C and 150°C.'
    ],
    scientificPaperRef: {
      title: 'Tectonic breach dynamics of Jezero Crater rim',
      authors: 'NASA Planetary Data System / JPL-Caltech',
      journal: 'USGS Planetary Investigation Report',
      year: 2024
    }
  },

  // 11. RIMFAX SUBSURFACE ANOMALIES & DEEP CORE DRILLINGS
  rimfax_ice_lens_01: {
    discoveryId: 'rimfax_ice_lens_01',
    sampleName: 'Cryo-Preserved Permafrost Core #ICE-01',
    rockClass: 'sedimentary',
    primaryInstrument: 'RIMFAX GPR & CheMin XRD Chamber',
    elementalAssay: {
      SiO2: 32.4,
      FeO: 9.8,
      MgO: 6.2,
      Al2O3: 5.4,
      CaO: 4.1,
      TiO2: 0.4,
      SO3: 8.9,
      P2O5: 0.6,
      Cl: 1.2,
      totalOxideWt: 69.0, // Balance is pure H2O ice matrix (31 wt%)
      traceElements: ['Deuterium (δD +4200‰)', 'Perchlorate Salts (0.8 wt%)']
    },
    mineralPhases: [
      { name: 'Amorphous H₂O Ice Matrix', formula: 'H₂O(s)', wtPercent: 31.0, crystalSystem: 'Hexagonal' },
      { name: 'Magnesium Sulfate Hydrate', formula: 'MgSO₄·7H₂O', wtPercent: 24.5, crystalSystem: 'Orthorhombic' },
      { name: 'Smectite Clay Permafrost', formula: 'Hydrated Phyllosilicate', wtPercent: 28.5, crystalSystem: 'Monoclinic' },
      { name: 'Halite Micro-Crystals', formula: 'NaCl', wtPercent: 16.0, crystalSystem: 'Isometric' }
    ],
    biosignature: {
      score: 91,
      classification: 'Prime Biosignature Candidate',
      organicCarbonDetected: true,
      redoxDisequilibrium: true,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Pristine cryo-preserved subsurface ice lens protected from surface cosmic rays and harsh UV radiation. Deep cryopreservation can keep ancient microbial cellular structures intact for over 3 billion years.'
    },
    baseResearchPoints: 400,
    scientificInsights: [
      'Subsurface ice lens confirmed at depth -2.8m by sharp dielectric reflection contrast.',
      'Contains ancient trapped paleo-atmospheric gases within ice grain boundaries.',
      'Extraordinary target for in-situ water extraction and Earth return cryo-storage.'
    ],
    scientificPaperRef: {
      title: 'Subsurface permafrost and dielectric reflectors in Jezero crater',
      authors: 'Hamran, S.-E., Paige, D. A., et al.',
      journal: 'Science',
      year: 2022,
      doi: '10.1126/science.abp8564'
    }
  },

  rimfax_paleochannel_02: {
    discoveryId: 'rimfax_paleochannel_02',
    sampleName: 'Buried Channel Paleolake Core #DF-02',
    rockClass: 'sedimentary',
    primaryInstrument: 'RIMFAX GPR & PIXL XRF',
    elementalAssay: {
      SiO2: 49.2,
      FeO: 18.5,
      MgO: 10.4,
      Al2O3: 9.8,
      CaO: 5.1,
      TiO2: 0.8,
      SO3: 5.2,
      P2O5: 0.9,
      Cl: 0.5,
      totalOxideWt: 100.4,
      traceElements: ['Aromatic Organics (24 ppm)', 'Vanadium (140 ppm)']
    },
    mineralPhases: [
      { name: 'Lacustrine Fe-Smectite', formula: 'Na₀.₃Fe₂³⁺Si₄O₁₀(OH)₂·nH₂O', wtPercent: 48.0, crystalSystem: 'Monoclinic' },
      { name: 'Detrital Quartz', formula: 'SiO₂', wtPercent: 26.0, crystalSystem: 'Trigonal' },
      { name: 'Anhydrite Sulfate', formula: 'CaSO₄', wtPercent: 14.5, crystalSystem: 'Orthorhombic' },
      { name: 'Polycyclic Aromatic Carbon', formula: 'C_n H_m', wtPercent: 1.8, crystalSystem: 'Amorphous' }
    ],
    biosignature: {
      score: 85,
      classification: 'High Astrobiological Interest',
      organicCarbonDetected: true,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Buried paleochannel thalweg deposit. River flow concentrated organic debris at the base of the channel before being sealed by fine mudstone blanket.'
    },
    baseResearchPoints: 360,
    scientificInsights: [
      'Incised channel geometry mapped by dipping RIMFAX radar horizons.',
      'High concentrations of preserved complex organic carbon rings.'
    ],
    scientificPaperRef: {
      title: 'Radar tomography of deltaic channel systems in Jezero crater',
      authors: 'Dromart, G., Hamran, S.-E., et al.',
      journal: 'JGR Planets',
      year: 2023,
      doi: '10.1029/2023JE007888'
    }
  },

  rimfax_lava_tube_03: {
    discoveryId: 'rimfax_lava_tube_03',
    sampleName: 'Lava Tube Roof Crystalline Core #LT-03',
    rockClass: 'igneous',
    primaryInstrument: 'RIMFAX GPR & SuperCam LIBS',
    elementalAssay: {
      SiO2: 50.8,
      FeO: 18.2,
      MgO: 13.9,
      Al2O3: 9.4,
      CaO: 6.8,
      TiO2: 0.7,
      SO3: 0.2,
      P2O5: 0.2,
      Cl: 0.1,
      totalOxideWt: 100.3,
      traceElements: ['Nickel (450 ppm)', 'Chromium (920 ppm)']
    },
    mineralPhases: [
      { name: 'Titanaugite Pyroxene', formula: 'Ca(Mg,Fe,Ti)(Si,Al)₂O₆', wtPercent: 46.0, crystalSystem: 'Monoclinic' },
      { name: 'Labradorite Feldspar', formula: '(Ca,Na)(Al,Si)₄O₈', wtPercent: 36.5, crystalSystem: 'Triclinic' },
      { name: 'Forsterite Olivine', formula: 'Mg₂SiO₄', wtPercent: 12.0, crystalSystem: 'Orthorhombic' },
      { name: 'Titanomagnetite', formula: 'Fe₂.₅Ti₀.₅O₄', wtPercent: 5.5, crystalSystem: 'Isometric' }
    ],
    biosignature: {
      score: 6,
      classification: 'Abiotic Control',
      organicCarbonDetected: false,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Pristine unweathered volcanic basalt extracted from subterranean lava tube ceiling. Completely sheltered from surface weathering since emplacement ~3.8 Ga.'
    },
    baseResearchPoints: 420,
    scientificInsights: [
      'Radar hyperbolic arc revealed a 6m-wide subsurface subterranean hollow conduit.',
      'Exceptional mechanical stability for future astronaut base shelters.'
    ],
    scientificPaperRef: {
      title: 'Subsurface volcanic structures and cavity detection on Mars',
      authors: 'NASA Planetary Geophysics Working Group',
      journal: 'Icarus',
      year: 2024
    }
  },

  rimfax_hydrothermal_vent_04: {
    discoveryId: 'rimfax_hydrothermal_vent_04',
    sampleName: 'Hydrothermal Opaline Silica Core #HT-04',
    rockClass: 'hydrothermal',
    primaryInstrument: 'RIMFAX GPR & CheMin XRD',
    elementalAssay: {
      SiO2: 84.6,
      FeO: 4.2,
      MgO: 2.1,
      Al2O3: 2.8,
      CaO: 1.4,
      TiO2: 0.3,
      SO3: 3.5,
      P2O5: 0.4,
      Cl: 0.3,
      totalOxideWt: 99.6,
      traceElements: ['Boron (65 ppm)', 'Lithium (88 ppm)', 'Arsenic (14 ppm)']
    },
    mineralPhases: [
      { name: 'Opaline Silica Sinter (Opal-A)', formula: 'SiO₂·nH₂O', wtPercent: 78.0, crystalSystem: 'Amorphous' },
      { name: 'Chalcedony / Quartz', formula: 'SiO₂', wtPercent: 14.5, crystalSystem: 'Trigonal' },
      { name: 'Jarosite Sulfate', formula: 'KFe₃(SO₄)₂(OH)₆', wtPercent: 7.5, crystalSystem: 'Trigonal' }
    ],
    biosignature: {
      score: 93,
      classification: 'Prime Biosignature Candidate',
      organicCarbonDetected: true,
      redoxDisequilibrium: true,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Precipitated from ascending hydrothermal fluids in an alkaline paleolake floor. On Earth (e.g. Yellowstone, El Tatio), hydrothermal silica sinters preserve microbial filaments and bio-fabrics in pristine silica petrifaction.'
    },
    baseResearchPoints: 450,
    scientificInsights: [
      'Radar pinpointed vertical high-reflectivity acoustic chimney at -3.5m depth.',
      'Highest concentration of opaline silica recorded on the mission.'
    ],
    scientificPaperRef: {
      title: 'Hydrothermal silica deposits in ancient Martian paleolakes',
      authors: 'Ruff, S. W., Farmer, J. D., et al.',
      journal: 'Nature Communications',
      year: 2023,
      doi: '10.1038/s41467-023-37651-4'
    }
  },

  rimfax_impact_melt_lens_05: {
    discoveryId: 'rimfax_impact_melt_lens_05',
    sampleName: 'Impact Basin Melt Glass Core #IM-05',
    rockClass: 'impact_breccia',
    primaryInstrument: 'RIMFAX GPR & PIXL XRF',
    elementalAssay: {
      SiO2: 51.4,
      FeO: 17.8,
      MgO: 12.1,
      Al2O3: 9.2,
      CaO: 6.1,
      TiO2: 0.8,
      SO3: 0.9,
      P2O5: 0.3,
      Cl: 0.2,
      totalOxideWt: 98.8,
      traceElements: ['Iridium (8.4 ppb)', 'Platinum (14 ppb)']
    },
    mineralPhases: [
      { name: 'Shocked Maskelynite Glass', formula: 'CaAl₂Si₂O₈ (Amorphous)', wtPercent: 52.0, crystalSystem: 'Amorphous' },
      { name: 'Coesite (High-Pressure Silica)', formula: 'SiO₂', wtPercent: 12.5, crystalSystem: 'Monoclinic' },
      { name: 'Shocked Pyroxene', formula: '(Mg,Fe)SiO₃', wtPercent: 28.0, crystalSystem: 'Orthorhombic' },
      { name: 'Native Iron Spherules', formula: 'Fe-Ni', wtPercent: 7.5, crystalSystem: 'Isometric' }
    ],
    biosignature: {
      score: 10,
      classification: 'Abiotic Control',
      organicCarbonDetected: false,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Formed under extreme pressures (>35 GPa) and temperatures (>1500°C) during the Jezero impact basin excavation. High platinum-group element abundances trace the impacting asteroid body.'
    },
    baseResearchPoints: 380,
    scientificInsights: [
      'Planar radar reflector mapped across a 50m subsurface lens at -6.8m depth.',
      'Preserves high-pressure coesite shock polymorphism.'
    ],
    scientificPaperRef: {
      title: 'Impact petrology and shock metamorphism of the Jezero basin',
      authors: 'NASA PDS Geosciences Node',
      journal: 'Meteoritics & Planetary Science',
      year: 2024
    }
  }
};

/**
 * Fallback generator providing authentic geochemical and mineralogical profiles
 * for any sample from the 25 discovery sites.
 */
export function getSampleAnalysisProfile(discoveryId: string, sampleName: string): SampleAnalysisProfile {
  if (SAMPLE_ANALYSIS_PROFILES[discoveryId]) {
    return SAMPLE_ANALYSIS_PROFILES[discoveryId];
  }

  // Smart algorithmic synthesis based on name & context
  const isClayOrMud = sampleName.toLowerCase().includes('mud') || sampleName.toLowerCase().includes('clay') || sampleName.toLowerCase().includes('shale');
  const isCarbonate = sampleName.toLowerCase().includes('carbonate') || sampleName.toLowerCase().includes('chert');
  const isOrganic = sampleName.toLowerCase().includes('organic') || sampleName.toLowerCase().includes('spot') || sampleName.toLowerCase().includes('wildcat');
  const isBasalt = sampleName.toLowerCase().includes('basalt') || sampleName.toLowerCase().includes('igneous') || sampleName.toLowerCase().includes('olivine');

  if (isOrganic || (isClayOrMud && isCarbonate)) {
    return {
      discoveryId,
      sampleName,
      rockClass: 'sedimentary',
      primaryInstrument: 'PIXL XRF & SHERLOC Raman Suite',
      elementalAssay: {
        SiO2: 46.5,
        FeO: 18.2,
        MgO: 11.4,
        Al2O3: 9.6,
        CaO: 6.8,
        TiO2: 0.7,
        SO3: 5.4,
        P2O5: 1.2,
        Cl: 0.5,
        totalOxideWt: 100.3,
        traceElements: ['Zinc (80 ppm)', 'Nickel (120 ppm)', 'Cobalt (40 ppm)']
      },
      mineralPhases: [
        { name: 'Fe-Smectite Clay', formula: 'Na₀.₃Fe₂³⁺(Si,Al)₄O₁₀(OH)₂·nH₂O', wtPercent: 44.0, crystalSystem: 'Monoclinic' },
        { name: 'Calcium Sulfate Veinlets', formula: 'CaSO₄·0.5H₂O', wtPercent: 22.0, crystalSystem: 'Monoclinic' },
        { name: 'Magnesium Carbonate', formula: 'MgCO₃', wtPercent: 16.0, crystalSystem: 'Trigonal' },
        { name: 'Aromatic Carbon Inclusions', formula: 'Polycyclic Rings', wtPercent: 1.5, crystalSystem: 'Amorphous' }
      ],
      biosignature: {
        score: 79,
        classification: 'High Astrobiological Interest',
        organicCarbonDetected: true,
        redoxDisequilibrium: true,
        vivianitePhosphateHalo: false,
        nasaSignificanceReport:
          'Aqueous lacustrine deposit with detected aromatic organic functional groups. Fine sediment preserved under anoxic bottom waters.'
      },
      baseResearchPoints: 260,
      scientificInsights: [
        'High organic carbon preservation potential in fine-grained clays.',
        'Neutral to alkaline aqueous depositional environment.'
      ],
      scientificPaperRef: {
        title: 'Geochemical Characterization of Jezero Lacustrine Sedimentology',
        authors: 'NASA Mars 2020 Science Team',
        journal: 'JGR Planets',
        year: 2023
      }
    };
  }

  if (isBasalt) {
    return {
      discoveryId,
      sampleName,
      rockClass: 'igneous',
      primaryInstrument: 'SuperCam LIBS & CheMin XRD',
      elementalAssay: {
        SiO2: 48.2,
        FeO: 19.5,
        MgO: 14.8,
        Al2O3: 8.9,
        CaO: 6.2,
        TiO2: 0.9,
        SO3: 0.8,
        P2O5: 0.4,
        Cl: 0.2,
        totalOxideWt: 99.9,
        traceElements: ['Chromium (1200 ppm)', 'Nickel (380 ppm)']
      },
      mineralPhases: [
        { name: 'Augite Pyroxene', formula: 'Ca(Mg,Fe)Si₂O₆', wtPercent: 42.0, crystalSystem: 'Monoclinic' },
        { name: 'Plagioclase (Labradorite)', formula: '(Ca,Na)Al(Al,Si)Si₂O₈', wtPercent: 34.0, crystalSystem: 'Triclinic' },
        { name: 'Olivine', formula: '(Mg,Fe)₂SiO₄', wtPercent: 14.0, crystalSystem: 'Orthorhombic' },
        { name: 'Titanomagnetite', formula: 'Fe₃₋ₓTiₓO₄', wtPercent: 8.5, crystalSystem: 'Isometric' }
      ],
      biosignature: {
        score: 8,
        classification: 'Abiotic Control',
        organicCarbonDetected: false,
        redoxDisequilibrium: false,
        vivianitePhosphateHalo: false,
        nasaSignificanceReport:
          'High-temperature volcanic rock. Excellent abiotic baseline for planetary geochemical evolution.'
      },
      baseResearchPoints: 180,
      scientificInsights: [
        'Rapid effusive lava cooling on ancient crater floor.',
        'Pristine silicate minerals show minimal late-stage aqueous weathering.'
      ],
      scientificPaperRef: {
        title: 'Igneous Petrology of Floor Units in Jezero Crater',
        authors: 'NASA Mars 2020 Science Team',
        journal: 'Science',
        year: 2022
      }
    };
  }

  // Default sedimentary rock profile
  return {
    discoveryId,
    sampleName,
    rockClass: 'sedimentary',
    primaryInstrument: 'CheMin XRD & PIXL XRF',
    elementalAssay: {
      SiO2: 52.1,
      FeO: 16.4,
      MgO: 10.2,
      Al2O3: 10.8,
      CaO: 5.1,
      TiO2: 0.8,
      SO3: 3.2,
      P2O5: 0.6,
      Cl: 0.4,
      totalOxideWt: 99.6,
      traceElements: ['Zirconium (95 ppm)', 'Vanadium (110 ppm)']
    },
    mineralPhases: [
      { name: 'Smectite Phyllosilicates', formula: 'Hydrated Clay Silicate', wtPercent: 38.0, crystalSystem: 'Monoclinic' },
      { name: 'Detrital Quartz / Silica', formula: 'SiO₂', wtPercent: 28.0, crystalSystem: 'Trigonal' },
      { name: 'Plagioclase Feldspar', formula: 'CaAl₂Si₂O₈', wtPercent: 20.0, crystalSystem: 'Triclinic' },
      { name: 'Hematite Matrix', formula: 'Fe₂O₃', wtPercent: 12.5, crystalSystem: 'Trigonal' }
    ],
    biosignature: {
      score: 54,
      classification: 'Moderate Aqueous Alteration',
      organicCarbonDetected: false,
      redoxDisequilibrium: false,
      vivianitePhosphateHalo: false,
      nasaSignificanceReport:
        'Aqueous sedimentary rock formed in moving water. Contains altered phyllosilicates indicating ancient water-rock interaction.'
    },
    baseResearchPoints: 210,
    scientificInsights: [
      'Deposited by fluvio-lacustrine transport during active hydrological era.',
      'Aqueous alteration occurred under mildly acidic to neutral conditions.'
    ],
    scientificPaperRef: {
      title: 'Sedimentology and Mineralogy of Jezero Crater Fluvial Systems',
      authors: 'NASA Planetary Data System',
      journal: 'Astrobiology Journal',
      year: 2023
    }
  };
}
