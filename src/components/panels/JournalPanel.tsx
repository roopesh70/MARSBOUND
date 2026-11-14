import React from 'react';
import { DiscoveryRecord } from '../../types/discovery';
import { BookOpen, X, TestTube, MapPin } from 'lucide-react';
import { EvidenceBadge } from '../ui/EvidenceBadge';

interface JournalPanelProps {
  isOpen: boolean;
  onClose: () => void;
  discoveredPois: DiscoveryRecord[];
  collectedSamples: {
    id: string;
    discoveryId: string;
    sampleName: string;
    timestamp: string;
    sol: number;
    notes: string;
  }[];
  onSelectPoi: (poi: DiscoveryRecord) => void;
}

export const JournalPanel: React.FC<JournalPanelProps> = ({
  isOpen,
  onClose,
  discoveredPois,
  collectedSamples,
  onSelectPoi
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-mars-surface border border-mars-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mars-border/80 bg-mars-panel/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-mars-orange/20 rounded-lg text-mars-orange border border-mars-orange/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-mars-sand uppercase">
                RESEARCH JOURNAL & GEOLOGICAL LOG
              </span>
              <h2 className="text-lg font-bold font-display text-white">
                Field Observations & Collected Samples
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-mars-dust hover:text-white hover:bg-white/10 border border-mars-border/50 transition-all cursor-pointer"
            title="Close Journal [J / Esc / C]"
          >
            <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-mars-sand">J / Esc</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs">
          {/* Discovered Features Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-mars-sand font-bold tracking-wider uppercase">
                DISCOVERED MARS FEATURES ({discoveredPois.length} / 5)
              </span>
            </div>

            {discoveredPois.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-mars-border text-center text-mars-dust">
                No features discovered yet. Explore Jezero Crater and use your scanner [F] near marked locations.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {discoveredPois.map((poi) => (
                  <div
                    key={poi.id}
                    onClick={() => {
                      onClose();
                      onSelectPoi(poi);
                    }}
                    className="p-4 rounded-xl border border-mars-border/80 bg-mars-panel/60 hover:bg-mars-panel hover:border-mars-orange cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <EvidenceBadge type={poi.evidenceType} />
                      <span className="text-[10px] text-mars-sand">{poi.region}</span>
                    </div>
                    <div className="font-bold text-white group-hover:text-mars-orange transition-colors">
                      {poi.name}
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans line-clamp-2">
                      {poi.summary}
                    </p>
                    <div className="flex items-center space-x-1 text-[10px] text-mars-sand/80 pt-1 border-t border-mars-border/40">
                      <MapPin className="w-3 h-3 text-mars-orange" />
                      <span>{poi.coordinates.latitude.toFixed(2)}°N, {poi.coordinates.longitude.toFixed(2)}°E</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collected Virtual Samples */}
          <div className="space-y-3 pt-4 border-t border-mars-border/60">
            <span className="text-[11px] text-mars-sand font-bold tracking-wider uppercase flex items-center space-x-2">
              <TestTube className="w-4 h-4 text-emerald-400" />
              <span>COLLECTED SIMULATED SAMPLES ({collectedSamples.length})</span>
            </span>

            {collectedSamples.length === 0 ? (
              <div className="p-5 rounded-xl border border-dashed border-mars-border text-center text-mars-dust">
                No samples recorded yet. Approach rock outcrops and collect simulated samples from the discovery modal.
              </div>
            ) : (
              <div className="space-y-2">
                {collectedSamples.map((sample) => (
                  <div
                    key={sample.id}
                    className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-emerald-300 flex items-center space-x-2">
                        <span>{sample.sampleName}</span>
                        <span className="text-[10px] bg-emerald-900/60 text-emerald-400 px-2 py-0.5 rounded">
                          SIMULATED SAMPLE
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 font-sans">
                        Recorded on Sol {sample.sol} • {sample.notes}
                      </div>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      LOGGED IN BIO-ARCHIVE
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-mars-border/80 bg-mars-panel/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-mars-border hover:bg-white/10 text-white font-mono text-xs font-bold transition-all"
          >
            CLOSE JOURNAL
          </button>
        </div>
      </div>
    </div>
  );
};
