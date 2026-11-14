import React, { useState, useMemo } from 'react';
import { SampleAnalysisProfile, TechUpgrade } from '../../types/science';
import { getSampleAnalysisProfile } from '../../data/scienceSampleData';
import { TECH_TREE_UPGRADES } from '../../data/techTree';
import { audioService } from '../../services/audioService';
import { 
  X, 
  FlaskConical, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Wind, 
  Sun, 
  Layers, 
  Award, 
  Database, 
  Activity, 
  Rocket
} from 'lucide-react';

interface ScienceLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedSamples: {
    id: string;
    discoveryId: string;
    sampleName: string;
    timestamp: string;
    sol: number;
    notes: string;
  }[];
  analyzedSampleIds: string[];
  researchPoints: number;
  unlockedTechIds: string[];
  onSampleAnalyzed: (sampleId: string, pointsAwarded: number) => void;
  onUnlockTech: (techId: string, costRP: number) => void;
}

export const ScienceLabModal: React.FC<ScienceLabModalProps> = ({
  isOpen,
  onClose,
  collectedSamples,
  analyzedSampleIds,
  researchPoints,
  unlockedTechIds,
  onSampleAnalyzed,
  onUnlockTech
}) => {
  const [activeTab, setActiveTab] = useState<'spectrometer' | 'tech_tree' | 'msr_cache'>('spectrometer');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [recentRpAward, setRecentRpAward] = useState<number | null>(null);

  // If player hasn't collected any field samples yet, provide a calibration reference sample
  const effectiveSamples = useMemo(() => {
    if (collectedSamples.length > 0) {
      return collectedSamples;
    }
    return [
      {
        id: 'sample_ref_octavia_00',
        discoveryId: 'poi_rochette_crater_floor',
        sampleName: 'Octavia Base Calibration Basalt (Reference #00)',
        timestamp: new Date().toISOString(),
        sol: 142,
        notes: 'Reference calibration basalt collected outside Octavia Outpost airlock.'
      }
    ];
  }, [collectedSamples]);

  const activeSample = effectiveSamples[selectedSampleIndex] || effectiveSamples[0];
  const isCurrentSampleAnalyzed = analyzedSampleIds.includes(activeSample?.id);

  const sampleProfile: SampleAnalysisProfile = useMemo(() => {
    if (!activeSample) {
      return getSampleAnalysisProfile('poi_rochette_crater_floor', 'Martian Basalt');
    }
    return getSampleAnalysisProfile(activeSample.discoveryId, activeSample.sampleName);
  }, [activeSample]);

  // Handle spectrometer scan trigger
  const handleRunSpectrometer = () => {
    if (isScanning || isCurrentSampleAnalyzed) return;

    setIsScanning(true);
    setScanProgress(0);
    audioService.playSpectrometerScan();

    const durationMs = 2400;
    const intervalMs = 60;
    const steps = durationMs / intervalMs;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(100, Math.round((currentStep / steps) * 100));
      setScanProgress(progress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsScanning(false);

        // Apply bonus RP if cryo-chiller tech is unlocked
        const hasCryoBonus = unlockedTechIds.includes('tech_chemin_cryo');
        const points = Math.round(sampleProfile.baseResearchPoints * (hasCryoBonus ? 1.4 : 1.0));

        audioService.playSpectrometerComplete();
        setRecentRpAward(points);
        setTimeout(() => setRecentRpAward(null), 4000);

        onSampleAnalyzed(activeSample.id, points);
      }
    }, intervalMs);
  };

  const handleTechPurchase = (tech: TechUpgrade) => {
    if (researchPoints < tech.costRP || unlockedTechIds.includes(tech.id)) return;
    audioService.playTechUnlock();
    onUnlockTech(tech.id, tech.costRP);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-6xl bg-mars-surface border border-mars-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[880px]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-mars-border/80 bg-mars-panel/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <FlaskConical className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  OCTAVIA RESEARCH MODULE
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-xs font-mono text-gray-400">PIXL XRF & CheMin XRD Facility</span>
              </div>
              <h2 className="text-lg font-bold font-display text-white tracking-wide">
                FIELD SCIENCE & GEOCHEMISTRY LABORATORY
              </h2>
            </div>
          </div>

          {/* Research Points Counter & Close */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-400/50 text-emerald-300 font-mono shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">{researchPoints} RP</span>
            </div>

            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-mars-dust hover:text-white hover:bg-white/10 border border-mars-border/50 transition-all cursor-pointer"
              title="Close Science Lab [K / Esc]"
            >
              <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-mars-sand">K / Esc</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-2 px-6 py-2.5 bg-black/50 border-b border-mars-border/60 text-xs font-mono">
          <button
            onClick={() => setActiveTab('spectrometer')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'spectrometer'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="font-bold">CHEMIN / PIXL SPECTROMETER</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded ml-1 font-mono">
              {analyzedSampleIds.length}/{effectiveSamples.length} Analyzed
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tech_tree')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tech_tree'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-bold">APPLIED RESEARCH TREE</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded ml-1 font-mono">
              {unlockedTechIds.length}/{TECH_TREE_UPGRADES.length} Unlocked
            </span>
          </button>

          <button
            onClick={() => setActiveTab('msr_cache')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'msr_cache'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">MARS SAMPLE RETURN (MSR) CACHE</span>
          </button>
        </div>

        {/* Tab 1: CheMin / PIXL Spectrometer Analysis */}
        {activeTab === 'spectrometer' && (
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-mars-border/80">
            
            {/* Left Column: Sample Inventory Carousel */}
            <div className="lg:col-span-4 flex flex-col h-full bg-black/40 overflow-hidden">
              <div className="p-3.5 border-b border-mars-border/60 bg-mars-panel/60 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>SPECIMEN RACK ({effectiveSamples.length})</span>
                </span>
                <span className="text-[10px] font-mono text-mars-sand">
                  {collectedSamples.length === 0 ? 'CALIBRATION MODE' : 'FIELD SAMPLING'}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 font-mono text-xs">
                {effectiveSamples.map((sample, idx) => {
                  const isAnalyzed = analyzedSampleIds.includes(sample.id);
                  const isSelected = idx === selectedSampleIndex;

                  return (
                    <div
                      key={sample.id}
                      onClick={() => setSelectedSampleIndex(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-400 shadow-md ring-1 ring-emerald-400/40'
                          : 'bg-mars-surface/90 hover:bg-white/5 border-mars-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-bold text-white text-xs leading-snug line-clamp-1">
                          {sample.sampleName}
                        </div>
                        {isAnalyzed ? (
                          <span className="flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40 shrink-0 ml-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>ANALYZED</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40 shrink-0 ml-1 animate-pulse">
                            PENDING
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                        {sample.notes}
                      </div>

                      <div className="text-[10px] text-mars-dust flex items-center justify-between mt-2 pt-1.5 border-t border-mars-border/30">
                        <span>Sol {sample.sol}</span>
                        <span className="text-emerald-400 font-bold">
                          +{sampleProfile.baseResearchPoints} RP
                        </span>
                      </div>
                    </div>
                  );
                })}

                {collectedSamples.length === 0 && (
                  <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-[11px] text-amber-200 space-y-1">
                    <div className="font-bold text-amber-300">EXPLORATION SAMPLING TIP:</div>
                    <p className="text-gray-300 leading-relaxed">
                      Drive or walk to any of the 25 authentic NASA sites (e.g. Cheyava Falls, Hogwallow, Kodiak). Open the discovery window and click <strong>COLLECT SIMULATED SAMPLE</strong> to retrieve fresh drill cores for laboratory analysis!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Column: Spectrometer Active Analysis Chamber */}
            <div className="lg:col-span-4 flex flex-col h-full bg-[#0a0f14] p-5 justify-between relative overflow-hidden">
              
              {/* Top Instrument Status Readout */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-bold">CHEMIN / PIXL CHAMBER</span>
                </div>
                <div className="text-[10px] text-gray-400 bg-black/60 px-2 py-1 rounded border border-cyan-500/30">
                  DETECTOR: CCD -100°C
                </div>
              </div>

              {/* Graphic Diffraction & XRF Chamber */}
              <div className="my-auto flex flex-col items-center justify-center relative py-6">
                {/* Concentric XRD Diffraction Rings */}
                <div className="relative w-48 h-48 rounded-full border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                  <div className={`absolute inset-4 rounded-full border border-dashed border-emerald-400/40 ${isScanning ? 'animate-spin' : ''}`} />
                  <div className="absolute inset-8 rounded-full border border-cyan-400/20" />
                  <div className="absolute inset-14 rounded-full border border-purple-400/30" />
                  
                  {/* Central Specimen Crystal / Core */}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-emerald-400 flex flex-col items-center justify-center shadow-xl">
                    <FlaskConical className={`w-8 h-8 ${isScanning ? 'text-emerald-300 animate-bounce' : 'text-emerald-400'}`} />
                  </div>

                  {/* Laser Scanning Crosshairs */}
                  {isScanning && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-cyan-400/80 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-full w-0.5 bg-emerald-400/80 shadow-[0_0_10px_#34d399] animate-pulse" />
                      </div>
                    </>
                  )}
                </div>

                {/* Progress / Status Display */}
                <div className="mt-5 text-center space-y-1.5 font-mono">
                  <div className="text-white text-xs font-bold uppercase tracking-wider">
                    {isScanning
                      ? `ACQUIRING X-RAY DIFFRACTION SPECTRA... ${scanProgress}%`
                      : isCurrentSampleAnalyzed
                      ? 'SPECTRA FULLY CHARACTERIZED'
                      : 'SPECIMEN LOADED • READY FOR XRD/XRF'}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Primary: {sampleProfile.primaryInstrument}
                  </div>

                  {isScanning && (
                    <div className="w-56 h-2 bg-black/60 rounded-full overflow-hidden border border-cyan-500/40 mx-auto mt-2">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-75"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Toast Celebration on completion */}
                {recentRpAward && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-2xl animate-in zoom-in-90 font-mono text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>+{recentRpAward} RESEARCH POINTS AWARDED!</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div>
                {!isCurrentSampleAnalyzed ? (
                  <button
                    onClick={handleRunSpectrometer}
                    disabled={isScanning}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-bold tracking-wider shadow-lg border border-emerald-400/50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isScanning ? 'DIFFRACTION IN PROGRESS...' : 'RUN SPECTROMETRIC ANALYSIS (XRD / XRF)'}
                    </span>
                  </button>
                ) : (
                  <div className="w-full py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ANALYSIS COMPLETED (+{sampleProfile.baseResearchPoints} RP LOGGED)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Geochemical Assay & Biosignature Readout */}
            <div className="lg:col-span-4 flex flex-col h-full bg-black/60 p-5 overflow-y-auto font-mono text-xs space-y-4">
              
              {/* Target Sample Header */}
              <div className="p-3 bg-mars-panel/90 border border-mars-border/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span className="uppercase tracking-wider text-emerald-400 font-bold">
                    LITHOLOGICAL CLASSIFICATION
                  </span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-white font-bold uppercase">
                    {sampleProfile.rockClass}
                  </span>
                </div>
                <div className="text-white text-sm font-bold font-sans">
                  {sampleProfile.sampleName}
                </div>
              </div>

              {/* Biosignature Potential Meter */}
              <div className="p-3.5 bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-500/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-300 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>ASTROBIOLOGY & BIOSIGNATURE POTENTIAL</span>
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    sampleProfile.biosignature.score >= 80
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                      : sampleProfile.biosignature.score >= 50
                      ? 'bg-amber-950 text-amber-300 border-amber-400'
                      : 'bg-gray-800 text-gray-300 border-gray-600'
                  }`}>
                    {sampleProfile.biosignature.score}% ({sampleProfile.biosignature.classification})
                  </span>
                </div>

                <p className="text-gray-300 text-[11px] leading-relaxed font-sans">
                  {sampleProfile.biosignature.nasaSignificanceReport}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sampleProfile.biosignature.organicCarbonDetected && (
                    <span className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] px-2 py-0.5 rounded">
                      ✓ Aromatic Carbon Detected
                    </span>
                  )}
                  {sampleProfile.biosignature.redoxDisequilibrium && (
                    <span className="bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-[10px] px-2 py-0.5 rounded">
                      ✓ Redox Reaction Halos
                    </span>
                  )}
                  {sampleProfile.biosignature.vivianitePhosphateHalo && (
                    <span className="bg-purple-950/80 border border-purple-500/50 text-purple-300 text-[10px] px-2 py-0.5 rounded">
                      ✓ Iron Phosphate Leopard Spots
                    </span>
                  )}
                </div>
              </div>

              {/* Elemental Oxide Assay (wt%) Bars */}
              <div className="p-3.5 bg-mars-panel/60 border border-mars-border/60 rounded-xl space-y-2.5">
                <span className="text-[11px] font-bold text-gray-200 block uppercase tracking-wider">
                  PIXL ELEMENTAL OXIDE ASSAY (WT %)
                </span>

                <div className="space-y-1.5 text-[11px]">
                  {[
                    { label: 'SiO₂ (Silica)', val: sampleProfile.elementalAssay.SiO2, color: 'bg-sky-500' },
                    { label: 'FeO (Iron Oxide)', val: sampleProfile.elementalAssay.FeO, color: 'bg-rose-500' },
                    { label: 'MgO (Magnesia)', val: sampleProfile.elementalAssay.MgO, color: 'bg-emerald-500' },
                    { label: 'Al₂O₃ (Alumina)', val: sampleProfile.elementalAssay.Al2O3, color: 'bg-amber-500' },
                    { label: 'CaO (Lime)', val: sampleProfile.elementalAssay.CaO, color: 'bg-indigo-400' },
                    { label: 'SO₃ (Sulfate)', val: sampleProfile.elementalAssay.SO3, color: 'bg-yellow-400' },
                    { label: 'P₂O₅ (Phosphate)', val: sampleProfile.elementalAssay.P2O5, color: 'bg-purple-400' },
                  ].map((elem) => (
                    <div key={elem.label} className="space-y-0.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-300">{elem.label}</span>
                        <span className="font-bold text-white">{elem.val.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-mars-border/40">
                        <div 
                          className={`h-full ${elem.color}`}
                          style={{ width: `${Math.min(100, elem.val * 1.5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identified Mineral Phases */}
              <div className="p-3.5 bg-mars-panel/60 border border-mars-border/60 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-gray-200 block uppercase tracking-wider">
                  IDENTIFIED MINERAL PHASES (CheMin XRD)
                </span>

                <div className="space-y-1.5 text-[11px]">
                  {sampleProfile.mineralPhases.map((phase) => (
                    <div key={phase.name} className="p-2 rounded bg-black/40 border border-mars-border/40 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{phase.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{phase.formula}</div>
                      </div>
                      <span className="text-emerald-400 font-bold text-xs">{phase.wtPercent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scientific Paper Citation */}
              <div className="p-3 bg-black/50 border border-mars-border/50 rounded-xl space-y-1 text-[10px] text-gray-400">
                <div className="text-mars-sand font-bold flex items-center space-x-1">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>NASA PEER-REVIEWED CITATION</span>
                </div>
                <div className="text-gray-300 font-semibold">{sampleProfile.scientificPaperRef.title}</div>
                <div>{sampleProfile.scientificPaperRef.authors} ({sampleProfile.scientificPaperRef.journal}, {sampleProfile.scientificPaperRef.year})</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Technology & Engineering Research Tree */}
        {activeTab === 'tech_tree' && (
          <div className="flex-1 overflow-y-auto p-6 font-mono text-xs space-y-6 bg-[#0a0f14]">
            {/* Intro banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-900 to-emerald-950/60 border border-emerald-500/40 gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>APPLIED MARTIAN ENGINEERING & HARDWARE RESEARCH</span>
                </h3>
                <p className="text-gray-300 text-xs mt-1 font-sans">
                  Use Scientific Research Points ($RP$) earned from rock spectrometry to unlock engineering upgrades for your Astronaut Suit, Mars Rover, and Outpost Base.
                </p>
              </div>

              <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-400 text-emerald-300 shrink-0 shadow-lg">
                <Award className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-[10px] text-gray-400">AVAILABLE BALANCE</div>
                  <div className="text-base font-bold text-white">{researchPoints} RP</div>
                </div>
              </div>
            </div>

            {/* Upgrades Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TECH_TREE_UPGRADES.map((tech) => {
                const isUnlocked = unlockedTechIds.includes(tech.id);
                const canAfford = researchPoints >= tech.costRP;
                const meetsPrereq = !tech.prerequisites || tech.prerequisites.every((p) => unlockedTechIds.includes(p));

                let iconNode = <Zap className="w-5 h-5" />;
                if (tech.category === 'suit') iconNode = <Wind className="w-5 h-5" />;
                if (tech.category === 'rover') iconNode = <Zap className="w-5 h-5" />;
                if (tech.category === 'outpost') iconNode = <Sun className="w-5 h-5" />;
                if (tech.category === 'instruments') iconNode = <Sparkles className="w-5 h-5" />;

                return (
                  <div
                    key={tech.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
                        : canAfford && meetsPrereq
                        ? 'bg-mars-surface border-mars-border hover:border-emerald-400'
                        : 'bg-black/40 border-mars-border/40 opacity-75'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isUnlocked
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-white/10 text-emerald-400'
                        }`}>
                          {iconNode}
                        </div>

                        {isUnlocked ? (
                          <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ACTIVE</span>
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/40">
                            {tech.costRP} RP
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                          CATEGORY: {tech.category}
                        </span>
                        <h4 className="text-white font-bold text-sm mt-0.5">{tech.name}</h4>
                      </div>

                      <p className="text-gray-300 text-xs font-sans leading-relaxed">
                        {tech.description}
                      </p>

                      <div className="p-2.5 bg-black/60 rounded-xl border border-mars-border/40 text-[11px] text-emerald-300 font-mono">
                        <span className="text-gray-400 font-bold block mb-0.5">EFFECT:</span>
                        {tech.gameplayEffect}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-mars-border/40">
                      {isUnlocked ? (
                        <div className="w-full py-2 text-center text-xs text-emerald-400 font-bold font-mono">
                          ✓ UPGRADE ACTIVE IN SIMULATOR
                        </div>
                      ) : canAfford && meetsPrereq ? (
                        <button
                          onClick={() => handleTechPurchase(tech)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wider border border-emerald-400/50 shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>RESEARCH UPGRADE ({tech.costRP} RP)</span>
                        </button>
                      ) : !meetsPrereq ? (
                        <div className="w-full py-2 text-center text-xs text-amber-400 font-mono bg-amber-950/40 rounded-lg border border-amber-500/30">
                          REQUIRES PRE-REQUISITE TECH
                        </div>
                      ) : (
                        <div className="w-full py-2 text-center text-xs text-gray-500 font-mono flex items-center justify-center space-x-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>NEED {tech.costRP - researchPoints} MORE RP</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Mars Sample Return (MSR) Cache Depot */}
        {activeTab === 'msr_cache' && (
          <div className="flex-1 overflow-y-auto p-6 font-mono text-xs space-y-6 bg-[#0a0f14]">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-black border border-indigo-500/40 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-400/60 flex items-center justify-center text-indigo-300 shadow-xl">
                  <Rocket className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                    NASA / ESA MARS SAMPLE RETURN ARCHITECTURE
                  </div>
                  <h3 className="text-lg font-bold text-white">HERMETIC TITANIUM SAMPLE DEPOT</h3>
                </div>
              </div>

              <p className="text-gray-300 text-xs font-sans leading-relaxed max-w-3xl">
                NASA’s Mars 2020 mission caches core samples into hermetically sealed titanium tubes deposited at strategic drop sites (like Three Forks). These specimens are designed to be retrieved by a Sample Retrieval Lander, launched to Mars orbit via the Mars Ascent Vehicle (MAV), and transported to Earth laboratories for ultimate bio-chemical verification.
              </p>

              {/* Cache Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-black/60 border border-indigo-500/30">
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">TOTAL TUBES CACHED</span>
                  <span className="text-2xl font-bold text-white mt-1 block">
                    {effectiveSamples.length} / 43
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    {analyzedSampleIds.length} Characterized in Lab
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-indigo-500/30">
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">ASTROBIOLOGICAL PRIORITY</span>
                  <span className="text-2xl font-bold text-purple-400 mt-1 block">
                    {analyzedSampleIds.includes('poi_cheyava_falls') ? 'TIER 1 (MAX)' : 'TIER 2'}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    High-Biosignature Clays Present
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-indigo-500/30">
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">MSR RETRIEVAL READINESS</span>
                  <span className="text-2xl font-bold text-cyan-400 mt-1 block">
                    {unlockedTechIds.includes('tech_msr_caching') ? 'CERTIFIED 100%' : 'STANDBY 65%'}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Planetary Protection Seal
                  </span>
                </div>
              </div>
            </div>

            {/* List of Cached Sample Tubes */}
            <div className="space-y-3">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>TITANIUM SAMPLE TUBE LOG REGISTER</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {effectiveSamples.map((sample, i) => {
                  const prof = getSampleAnalysisProfile(sample.discoveryId, sample.sampleName);
                  const isAnalyzed = analyzedSampleIds.includes(sample.id);

                  return (
                    <div
                      key={sample.id}
                      className="p-3.5 rounded-xl bg-black/50 border border-mars-border flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-mars-sand font-bold">
                            TUBE #{String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-white font-bold text-xs">{sample.sampleName}</span>
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Class: {prof.rockClass} • Sol {sample.sol}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isAnalyzed
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                            : 'bg-amber-950 text-amber-300 border-amber-400'
                        }`}>
                          {isAnalyzed ? 'VERIFIED' : 'UNSCANNED'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-mars-border/80 bg-mars-panel/90 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2 text-gray-400">
            <span>CheMin XRD / PIXL Micro-Focus X-Ray Instrument v3.2</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-mars-surface hover:bg-white/10 text-white font-bold border border-mars-border transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <span>RETURN TO SURFACE</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-mars-sand">[K / Esc]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
