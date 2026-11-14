import React, { useState, useEffect } from 'react';
import { DiscoveryRecord } from '../../types/discovery';
import { EvidenceBadge } from '../ui/EvidenceBadge';
import { X, ExternalLink, TestTube, CheckCircle2, Database, Info, Sparkles, Camera, Image as ImageIcon } from 'lucide-react';

interface DiscoveryModalProps {
  poi: DiscoveryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onCollectSample: (poi: DiscoveryRecord) => void;
  isSampleCollected: boolean;
}

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
  poi,
  isOpen,
  onClose,
  onCollectSample,
  isSampleCollected
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [poi?.id]);

  if (!isOpen || !poi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-mars-surface border border-mars-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-mars-border/80 bg-mars-panel/90">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-mars-sand">
                {poi.region}
              </span>
              <span className="text-mars-border">•</span>
              <EvidenceBadge type={poi.evidenceType} />
            </div>
            <h2 className="text-xl font-bold font-display text-white tracking-wide">
              {poi.name}
            </h2>
            <div className="text-xs font-mono text-mars-sand">
              Coordinates: {poi.coordinates.latitude.toFixed(4)}° N, {poi.coordinates.longitude.toFixed(4)}° E | Elev: {poi.coordinates.elevation.toFixed(0)}m ({poi.coordinates.datum})
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-mars-dust hover:text-white hover:bg-white/10 border border-mars-border/50 transition-all cursor-pointer"
            title="Dismiss Discovery [F / Esc / C]"
          >
            <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-mars-sand">F / Esc</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs">
          {/* NASA Photo Feature Section */}
          <div className="rounded-xl overflow-hidden border border-mars-border/80 bg-black/60 shadow-xl">
            {/* Image Header with Camera & Date */}
            <div className="px-3.5 py-2 bg-mars-panel/90 border-b border-mars-border/50 flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-2 text-mars-orange font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span>NASA OBSERVATION ARCHIVE • {poi.primaryInstrument}</span>
              </div>
              {poi.observationDate && (
                <span className="text-mars-sand/80 font-mono text-[10px] bg-mars-surface px-2 py-0.5 rounded border border-mars-border/50">
                  OBS: {poi.observationDate}
                </span>
              )}
            </div>

            {/* Photo / Fallback Visualizer */}
            <div className="relative w-full min-h-[220px] max-h-72 bg-gradient-to-b from-[#180d09] to-[#0c0604] flex items-center justify-center overflow-hidden">
              {poi.imageUrl && !imgError ? (
                <>
                  {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center space-x-2 text-mars-dust text-xs">
                      <div className="w-4 h-4 border-2 border-mars-orange border-t-transparent rounded-full animate-spin" />
                      <span>Retrieving NASA Planetary Image Asset...</span>
                    </div>
                  )}
                  <img
                    src={poi.imageUrl}
                    alt={poi.name}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                    className={`w-full max-h-72 object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                </>
              ) : (
                /* Fallback stylized satellite radar preview */
                <div className="w-full py-8 px-6 text-center space-y-2 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-mars-orange/15 border border-mars-orange/40 flex items-center justify-center text-mars-orange mb-1">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="text-white font-bold text-xs uppercase tracking-wider">
                    {poi.name} High-Resolution Geological Target
                  </div>
                  <p className="text-mars-sand text-[11px] max-w-md">
                    {poi.imageCaption || poi.summary}
                  </p>
                  <div className="text-[10px] text-mars-dust font-mono">
                    Provider: {poi.imageCredit || 'NASA / JPL-Caltech / MSSS / USGS'}
                  </div>
                </div>
              )}
            </div>

            {/* Caption & Credit Bar */}
            <div className="p-3 bg-mars-panel/90 text-[11px] text-mars-sand flex flex-col sm:flex-row sm:items-center justify-between border-t border-mars-border/40 gap-1.5">
              <span className="font-sans leading-tight text-gray-300">{poi.imageCaption || 'Planetary surface observation'}</span>
              <span className="text-mars-dust/70 shrink-0 font-mono text-[10px]">{poi.imageCredit}</span>
            </div>
          </div>

          {/* Plain language summary & significance */}
          <div className="bg-mars-panel/60 p-4 rounded-xl border border-mars-border/60 space-y-3">
            <div>
              <span className="text-[11px] text-mars-sand font-bold tracking-wider uppercase block mb-1">
                EXECUTIVE SUMMARY
              </span>
              <p className="text-gray-200 text-sm leading-relaxed font-sans">
                {poi.summary}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-mars-orange font-bold tracking-wider uppercase block mb-1">
                SCIENTIFIC SIGNIFICANCE
              </span>
              <p className="text-gray-300 text-xs leading-relaxed">
                {poi.scientificSignificance}
              </p>
            </div>
          </div>

          {/* Detailed Geology */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>GEOLOGICAL INTERPRETATION</span>
            </h3>
            <p className="text-gray-300 leading-relaxed bg-black/40 p-3.5 rounded-lg border border-mars-border/40 text-[11px]">
              {poi.detailedGeology}
            </p>
          </div>

          {/* Mineral Signatures if available */}
          {poi.mineralSignatures && poi.mineralSignatures.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>HYPERSPECTRAL MINERAL SIGNATURES (CRISM/SHERLOC)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {poi.mineralSignatures.map((mineral, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[11px] font-semibold"
                  >
                    {mineral}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Provenance Box */}
          <div className="bg-black/50 p-4 rounded-xl border border-mars-border space-y-2">
            <div className="flex items-center space-x-1.5 text-mars-sand font-bold">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>SCIENTIFIC PROVENANCE & DATA ARCHIVE</span>
            </div>
            {poi.provenance.map((prov, idx) => (
              <div key={idx} className="text-[11px] text-gray-300 pt-1 border-t border-mars-border/30">
                <div className="text-white font-semibold">{prov.title}</div>
                <div className="text-mars-sand/70">
                  Provider: {prov.provider} | Instrument: {prov.instrument}
                </div>
                <div className="text-mars-dust/60 text-[10px] mt-0.5">
                  Resolution: {prov.resolutionMeters} | Archive: {prov.archiveId}
                </div>
              </div>
            ))}
          </div>

          {/* Scientific Research Sources */}
          {poi.scientificSources && poi.scientificSources.length > 0 && (
            <div>
              <span className="text-[11px] text-mars-sand font-bold tracking-wider uppercase block mb-2">
                PEER-REVIEWED REFERENCES & ARCHIVES
              </span>
              <div className="space-y-1.5">
                {poi.scientificSources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-mars-surface hover:bg-white/5 border border-mars-border text-sky-400 text-xs transition-colors"
                  >
                    <span>{src.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Sample Collection Action */}
        <div className="p-4 border-t border-mars-border/80 bg-mars-panel/90 flex items-center justify-between">
          <div className="text-xs text-mars-dust font-mono">
            Status: <span className="text-emerald-400 font-bold uppercase">{poi.verificationStatus}</span>
          </div>

          <div className="flex items-center space-x-2.5">
            {poi.sampleCollectable && !isSampleCollected && (
              <button
                onClick={() => onCollectSample(poi)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold tracking-wider shadow-lg border border-emerald-400/50 transition-all cursor-pointer"
              >
                <TestTube className="w-4 h-4" />
                <span>COLLECT SIMULATED SAMPLE</span>
              </button>
            )}

            {poi.sampleCollectable && isSampleCollected && (
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs bg-emerald-950/70 border border-emerald-500/50 px-3.5 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>SAMPLE LOGGED</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-mars-surface hover:bg-white/10 text-white font-mono text-xs font-bold border border-mars-border transition-all cursor-pointer"
              title="Dismiss [F / Esc]"
            >
              <span>DISMISS</span>
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-mars-sand">[F / Esc]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
