import React from 'react';
import { DiscoveryRecord } from '../../types/discovery';
import { Scan, Radio } from 'lucide-react';

interface ScannerReticleProps {
  nearestPoi: DiscoveryRecord | null;
  distance: number;
  onScan: () => void;
  battery: number;
}

export const ScannerReticle: React.FC<ScannerReticleProps> = ({
  nearestPoi,
  distance,
  onScan,
  battery
}) => {
  const inRange = distance <= 14;
  const canScan = battery >= 12;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
      {/* Central Targeting Reticle */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Reticle ring */}
        <div className={`w-8 h-8 rounded-full border border-dashed transition-all duration-300 ${
          inRange ? 'border-cyan-400 scale-125 animate-pulse' : 'border-white/30'
        }`} />
        {/* Center cross dot */}
        <div className={`w-1.5 h-1.5 rounded-full ${inRange ? 'bg-cyan-400' : 'bg-white/60'}`} />

        {/* Framing brackets */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-mars-orange" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-mars-orange" />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-mars-orange" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-mars-orange" />
      </div>

      {/* Target POI Prompt Box */}
      {nearestPoi && (
        <div className="mt-3 md:mt-6 flex flex-col items-center space-y-1 font-mono text-[9px] md:text-xs">
          <div className="flex items-center space-x-1.5 md:space-x-2 bg-black/75 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg border border-mars-border/80 shadow-xl max-w-[90vw] md:max-w-none">
            <Radio className={`w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 ${inRange ? 'text-cyan-400 animate-ping' : 'text-mars-sand'}`} />
            <span className="text-white font-semibold truncate">{nearestPoi.name}</span>
            <span className="text-mars-sand font-bold shrink-0">[{Math.round(distance)}m]</span>
          </div>

          {inRange && (
            <button
              onClick={onScan}
              className={`pointer-events-auto px-2.5 py-1 md:px-4 md:py-1.5 rounded-md md:rounded-lg text-[9px] md:text-xs font-bold tracking-wider uppercase transition-all shadow-lg flex items-center space-x-1 md:space-x-1.5 border ${
                canScan 
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400 animate-pulse cursor-pointer' 
                  : 'bg-rose-950/80 text-rose-300 border-rose-500 cursor-not-allowed'
              }`}
            >
              <Scan className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
              <span>{canScan ? <>SCAN TARGET<span className="hidden md:inline"> [F]</span></> : 'INSUFFICIENT BATTERY'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
