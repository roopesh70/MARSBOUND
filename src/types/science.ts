export interface ElementalAssay {
  SiO2: number; // wt% (Silicon Dioxide)
  FeO: number;  // wt% (Iron Oxide)
  MgO: number;  // wt% (Magnesium Oxide)
  Al2O3: number; // wt% (Aluminum Oxide)
  CaO: number;  // wt% (Calcium Oxide)
  TiO2: number; // wt% (Titanium Dioxide)
  SO3: number;  // wt% (Sulfur Trioxide)
  P2O5: number; // wt% (Phosphorus Pentoxide)
  Cl: number;   // wt% (Chlorine)
  totalOxideWt: number;
  traceElements: string[];
}

export interface MineralPhase {
  name: string;
  formula: string;
  wtPercent: number;
  crystalSystem: string;
}

export type BiosignatureRating = 
  | 'Abiotic Control' 
  | 'Low Organic Context' 
  | 'Moderate Aqueous Alteration' 
  | 'High Astrobiological Interest' 
  | 'Prime Biosignature Candidate';

export interface BiosignatureAssessment {
  score: number; // 0 to 100
  classification: BiosignatureRating;
  organicCarbonDetected: boolean;
  redoxDisequilibrium: boolean;
  vivianitePhosphateHalo: boolean;
  carbonIsotopeAnomaly?: string;
  nasaSignificanceReport: string;
}

export interface SampleAnalysisProfile {
  discoveryId: string;
  sampleName: string;
  rockClass: 'sedimentary' | 'igneous' | 'hydrothermal' | 'impact_breccia' | 'crustal_fragment';
  primaryInstrument: string;
  elementalAssay: ElementalAssay;
  mineralPhases: MineralPhase[];
  biosignature: BiosignatureAssessment;
  baseResearchPoints: number;
  scientificInsights: string[];
  scientificPaperRef: {
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi?: string;
  };
}

export interface TechUpgrade {
  id: string;
  name: string;
  category: 'suit' | 'rover' | 'instruments' | 'outpost';
  costRP: number;
  iconName: string;
  description: string;
  gameplayEffect: string;
  prerequisites?: string[];
}

export interface ScienceLabState {
  researchPoints: number;
  analyzedSampleIds: string[];
  unlockedTechIds: string[];
}
