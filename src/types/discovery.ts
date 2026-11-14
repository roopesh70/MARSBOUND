import { EvidenceType, DiscoveryCategory, MarsCoordinates } from './mars';

export interface DatasetProvenance {
  datasetId: string;
  title: string;
  provider: string; // e.g. "NASA / JPL-Caltech / University of Arizona"
  mission: string; // e.g. "Mars 2020 / Mars Reconnaissance Orbiter"
  instrument: string; // e.g. "HiRISE / Mastcam-Z / MEDA / CRISM"
  productIdOrVersion: string;
  sourceUrl: string;
  archiveId: string;
  acquisitionDate?: string;
  spatialCoverage: string;
  crs: string;
  datum: string;
  resolutionMeters: number | string;
  evidenceType: EvidenceType;
  usageTerms: string;
  knownLimitations: string;
}

export interface DiscoveryRecord {
  id: string;
  name: string;
  category: DiscoveryCategory;
  mission: string;
  region: string;
  coordinates: MarsCoordinates;
  worldPosition: { x: number; y: number; z: number }; // Local 3D scene coords
  summary: string;
  scientificSignificance: string;
  detailedGeology: string;
  evidenceType: EvidenceType;
  primaryInstrument: string;
  observationDate?: string;
  imageUrl?: string;
  imageCaption?: string;
  imageCredit?: string;
  provenance: DatasetProvenance[];
  sampleCollectable: boolean;
  sampleName?: string;
  sampleType?: string;
  mineralSignatures?: string[];
  scientificSources: {
    title: string;
    url: string;
    doiOrArchiveRef?: string;
  }[];
  verificationStatus: 'verified' | 'reviewed' | 'simulation_placeholder';
}

export interface PlayerDiscoveryState {
  discoveredIds: string[];
  scannedAt: Record<string, string>; // ID -> ISO Timestamp
  collectedSamples: {
    id: string;
    discoveryId: string;
    sampleName: string;
    timestamp: string;
    sol: number;
    notes: string;
  }[];
}
