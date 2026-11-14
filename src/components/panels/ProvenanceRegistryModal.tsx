import React from 'react';
import { NASA_PROVENANCE_REGISTRY } from '../../data/nasaProvenance';
import { NASA_CHALLENGE_RESOURCES } from '../../data/nasaResources';
import { Database, X, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { EvidenceBadge } from '../ui/EvidenceBadge';

interface ProvenanceRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProvenanceRegistryModal: React.FC<ProvenanceRegistryModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-mars-surface border border-mars-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mars-border/80 bg-mars-panel/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-mars-sand uppercase">
                SCIENTIFIC PROVENANCE & NASA OPEN DATA REGISTRY
              </span>
              <h2 className="text-lg font-bold font-display text-white">
                Space Apps Challenge Reference Catalog
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-mars-dust hover:text-white hover:bg-white/10 border border-mars-border/50 transition-all cursor-pointer"
            title="Close Registry [R / Esc / C]"
          >
            <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-mars-sand">R / Esc</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs">
          {/* Mission & Challenge Context */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-cyan-950/40 border border-blue-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>NASA SPACE APPS CHALLENGE: INTERPLANETARY SURVIVAL GUIDE (MARTIAN MAP)</span>
            </div>
            <p className="text-gray-300 font-sans text-xs leading-relaxed">
              This application integrates multi-mission planetary datasets from NASA JPL, MRO, MGS, and the Mars 2020 mission.
              Every factual surface feature, elevation coordinate, and atmospheric reading is verified against authoritative archives with documented evidence classes.
            </p>
          </div>

          {/* NASA Space Apps Challenge Referenced Resources */}
          <div className="space-y-3">
            <span className="text-[11px] text-mars-sand font-bold tracking-wider uppercase block">
              OFFICIAL CHALLENGE RESOURCES INTEGRATED
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {NASA_CHALLENGE_RESOURCES.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-xl border border-mars-border/70 bg-mars-panel/50 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{res.title}</span>
                      <span className="text-[10px] bg-mars-surface px-1.5 py-0.5 rounded text-mars-sand uppercase">
                        {res.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans">
                      {res.description}
                    </p>
                    <div className="text-[10px] text-emerald-400 font-mono pt-1">
                      Role: {res.usageInMarsbound}
                    </div>
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-sky-400 hover:text-sky-300 text-[11px] pt-1.5 border-t border-mars-border/40"
                  >
                    <span>Visit Source Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Dataset Provenance Registry Entries */}
          <div className="space-y-3 pt-4 border-t border-mars-border/60">
            <span className="text-[11px] text-mars-sand font-bold tracking-wider uppercase block">
              COMPLETE DATASET PROVENANCE AUDIT LOG ({NASA_PROVENANCE_REGISTRY.length} DATASETS)
            </span>
            <div className="space-y-3">
              {NASA_PROVENANCE_REGISTRY.map((prov) => (
                <div
                  key={prov.datasetId}
                  className="p-4 rounded-xl border border-mars-border/80 bg-black/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold text-xs">{prov.title}</div>
                      <div className="text-mars-sand text-[10px]">
                        {prov.provider} • {prov.mission} • {prov.instrument}
                      </div>
                    </div>
                    <EvidenceBadge type={prov.evidenceType} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-gray-300 bg-mars-surface/60 p-2.5 rounded-lg border border-mars-border/40">
                    <div>
                      <span className="text-mars-sand/70 block">Product ID:</span>
                      <span className="font-bold truncate block">{prov.productIdOrVersion}</span>
                    </div>
                    <div>
                      <span className="text-mars-sand/70 block">Resolution:</span>
                      <span className="font-bold">{prov.resolutionMeters}</span>
                    </div>
                    <div>
                      <span className="text-mars-sand/70 block">CRS / Datum:</span>
                      <span className="font-bold">{prov.datum}</span>
                    </div>
                    <div>
                      <span className="text-mars-sand/70 block">Archive:</span>
                      <span className="font-bold truncate block">{prov.archiveId}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-[11px] text-amber-200/80 bg-amber-950/20 p-2 rounded border border-amber-500/20">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Scientific Caveat: {prov.knownLimitations}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-mars-border/30 text-[10px]">
                    <span className="text-mars-dust/60">{prov.usageTerms}</span>
                    <a
                      href={prov.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1 text-sky-400 hover:text-sky-300"
                    >
                      <span>Archive Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-mars-border/80 bg-mars-panel/90 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-mars-surface hover:bg-white/10 text-white font-mono text-xs font-bold border border-mars-border transition-all cursor-pointer"
          >
            <span>CLOSE REGISTRY</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-mars-sand">[R / Esc]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
