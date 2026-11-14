import React, { useState } from 'react';
import { RimfaxRadarTelemetry } from '../../types/rimfax';
import { SUBSURFACE_ANOMALIES } from '../../data/rimfaxData';
import { rimfaxService } from '../../services/rimfaxService';
import { 
  X, 
  Radio, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Drill, 
  Database, 
  MapPin
} from 'lucide-react';

interface RimfaxRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: RimfaxRadarTelemetry;
  roverPosition: { x: number; y: number; z: number };
  onDeployCoreDrill: () => void;
  isDrilling: boolean;
}

export const RimfaxRadarModal: React.FC<RimfaxRadarModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  roverPosition,
  onDeployCoreDrill,
  isDrilling
}) => {
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string>(SUBSURFACE_ANOMALIES[0].id);

  if (!isOpen) return null;

  const selectedAnomaly = SUBSURFACE_ANOMALIES.find((a) => a.id === selectedAnomalyId) || SUBSURFACE_ANOMALIES[0];
  const isCored = rimfaxService.isAnomalyDrilled(selectedAnomaly.id);
  const distToSelected = Math.round(Math.hypot(roverPosition.x - selectedAnomaly.worldPosition.x, roverPosition.z - selectedAnomaly.worldPosition.z));
  const currentLayers = rimfaxService.getActiveStratigraphy(roverPosition.x, roverPosition.z);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-mars-surface border border-mars-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[88vh] max-h-[820px]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-mars-border/80 bg-mars-panel/90 font-mono">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                  GROUND-PENETRATING RADAR (GPR)
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-xs text-gray-400">150-1200 MHz Ultra-Wideband</span>
              </div>
              <h2 className="text-lg font-bold font-display text-white tracking-wide">
                RIMFAX SUBSURFACE TOMOGRAPHY CONSOLE
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-mars-dust hover:text-white hover:bg-white/10 border border-mars-border/50 transition-all cursor-pointer text-xs"
            title="Close [U / Esc]"
          >
            <span className="text-[10px] font-bold bg-white/10 px-1.5 py-0.5 rounded text-mars-sand">U / Esc</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-mars-border/80">
          
          {/* Left Column: Stratigraphic Column & Current Reading */}
          <div className="lg:col-span-5 flex flex-col h-full bg-[#0a0f14] p-5 overflow-y-auto font-mono text-xs space-y-4">
            
            <div className="p-3.5 bg-black/60 border border-cyan-500/30 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>CURRENT SUBSURFACE LOCATION SOUNDING</span>
              </span>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-700">
                  <span className="text-gray-400 text-[10px] block">DIELECTRIC (ε_r)</span>
                  <span className="text-white font-bold text-sm">
                    {telemetry.currentDielectricConstant.toFixed(1)}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-700">
                  <span className="text-gray-400 text-[10px] block">RADAR RANGE</span>
                  <span className="text-emerald-400 font-bold text-sm">0 to -10.0m</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-300">
                Active Unit: <span className="text-white font-bold">{telemetry.activeFormation}</span>
              </div>
            </div>

            {/* Vertical Stratigraphic Column Display */}
            <div className="space-y-2 flex-1">
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                STRATIGRAPHIC CROSS-SECTION (0 to -10m)
              </span>

              <div className="space-y-2">
                {currentLayers.map((layer, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-mars-border/60 bg-black/40 space-y-1 relative overflow-hidden"
                  >
                    <div 
                      className="absolute top-0 bottom-0 left-0 w-1.5"
                      style={{ backgroundColor: layer.colorHex }}
                    />
                    <div className="flex items-center justify-between pl-1">
                      <span className="text-white font-bold text-xs">{layer.layerName}</span>
                      <span className="text-cyan-400 text-[10px] font-bold">
                        -{layer.depthStartMeters}m to -{layer.depthEndMeters}m
                      </span>
                    </div>

                    <div className="text-[10px] text-gray-400 pl-1 flex items-center space-x-3">
                      <span>ε_r: {layer.dielectricPermittivity}</span>
                      <span>Density: {layer.densityGcm3} g/cm³</span>
                      <span>Refl: {layer.reflectivityDb} dB</span>
                    </div>

                    <p className="text-[11px] text-gray-300 pl-1 font-sans leading-relaxed pt-0.5">
                      {layer.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Anomalous Reflector Catalog & Deep Core Drilling */}
          <div className="lg:col-span-7 flex flex-col h-full bg-black/60 p-5 overflow-y-auto font-mono text-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ANOMALOUS SUBSURFACE REFLECTOR TARGETS ({SUBSURFACE_ANOMALIES.length})</span>
              </span>
              <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-0.5 rounded">
                GPR GROUND PENETRATION
              </span>
            </div>

            {/* Anomaly Cards Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SUBSURFACE_ANOMALIES.map((anom) => {
                const isSelected = anom.id === selectedAnomalyId;
                const drilled = rimfaxService.isAnomalyDrilled(anom.id);
                const dist = Math.round(Math.hypot(roverPosition.x - anom.worldPosition.x, roverPosition.z - anom.worldPosition.z));

                return (
                  <div
                    key={anom.id}
                    onClick={() => setSelectedAnomalyId(anom.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                        : 'bg-mars-surface/80 hover:bg-white/5 border-mars-border'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-white text-xs leading-snug line-clamp-1">
                        {anom.name}
                      </div>
                      {drilled ? (
                        <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40 shrink-0 ml-1">
                          CORED
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40 shrink-0 ml-1">
                          DEPTH -{anom.targetDepthMeters}m
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
                      <span>Range: {dist}m</span>
                      <span className="text-cyan-400 font-bold">+{anom.baseResearchPoints} RP</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Anomaly Details Card */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-slate-900 to-black border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-mars-border/50 pb-2">
                <div>
                  <h3 className="text-white font-bold text-sm font-sans">{selectedAnomaly.name}</h3>
                  <div className="text-[11px] text-cyan-300 font-mono mt-0.5">
                    Target Depth: -{selectedAnomaly.targetDepthMeters}m | Dielectric Contrast: {selectedAnomaly.dielectricContrast}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-gray-400">ROVER DISTANCE</div>
                  <div className="text-sm font-bold text-amber-400">{distToSelected}m</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  GEOLOGICAL & RADAR TOMOGRAPHY INTERPRETATION
                </span>
                <p className="text-gray-200 text-xs font-sans leading-relaxed">
                  {selectedAnomaly.geologicalInterpretation}
                </p>
              </div>

              <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-cyan-300 block mb-0.5">
                  NASA PLANETARY SCIENCE SIGNIFICANCE
                </span>
                <p className="text-gray-300 text-[11px] font-sans leading-relaxed">
                  {selectedAnomaly.nasaScienceSignificance}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                {isCored ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-bold flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>SUBSURFACE CORE SAMPLE RETRIEVED & LOGGED IN INVENTORY</span>
                  </div>
                ) : distToSelected <= selectedAnomaly.radiusMeters ? (
                  <button
                    onClick={onDeployCoreDrill}
                    disabled={isDrilling}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs tracking-wider shadow-lg border border-amber-300 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Drill className={`w-4 h-4 ${isDrilling ? 'animate-spin' : ''}`} />
                    <span>
                      {isDrilling
                        ? 'EXTRACTING SUBSURFACE DEEP CORE (-' + selectedAnomaly.targetDepthMeters + 'm)...'
                        : 'DEPLOY ROBOTIC ARM CORE DRILL (+' + selectedAnomaly.baseResearchPoints + ' RP)'}
                    </span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 text-center text-xs text-gray-400 font-mono bg-black/40 rounded-xl border border-mars-border flex items-center justify-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-mars-orange" />
                    <span>DRIVE ROVER WITHIN {selectedAnomaly.radiusMeters}m TO DRILL (CURRENTLY {distToSelected}m AWAY)</span>
                  </div>
                )}
              </div>
            </div>

            {/* NASA Instrument Citation */}
            <div className="p-3 bg-black/40 border border-mars-border/40 rounded-xl text-[10px] text-gray-400 space-y-1">
              <div className="text-gray-300 font-bold flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>INSTRUMENT CITATION: RIMFAX (Mars 2020 Perseverance)</span>
              </div>
              <p className="leading-relaxed">
                Principal Investigator: Svein-Erik Hamran (University of Oslo / FFI / NASA JPL). "Radar sounding of the subsurface in Jezero crater, Mars." Science 377, 1111–1115 (2022).
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-mars-border/80 bg-mars-panel/90 flex items-center justify-between font-mono text-xs">
          <div className="text-gray-400 text-[11px]">
            Press <span className="text-white font-bold">[G]</span> anytime while driving near reflectors to drill deep core
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-mars-surface hover:bg-white/10 text-white font-bold border border-mars-border transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <span>RETURN TO COCKPIT</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-mars-sand">[U / Esc]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
