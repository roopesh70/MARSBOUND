import React from 'react';
import { MarsCoordinates, MarsSolTime } from '../../types/mars';
import { MapPin, Clock, Globe } from 'lucide-react';

interface CoordinateDisplayProps {
  coordinates: MarsCoordinates;
  solTime: MarsSolTime;
  regionName?: string;
}

export const CoordinateDisplay: React.FC<CoordinateDisplayProps> = ({ 
  coordinates, 
  solTime,
  regionName = 'JEZERO CRATER'
}) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timeString = `${pad(solTime.hour)}:${pad(solTime.minute)}:${pad(Math.floor(solTime.second))} LMST`;
  const isNeretva = regionName.includes('NERETVA');

  // Solar Phase determination
  const hour = solTime.hour + solTime.minute / 60;
  let phaseLabel = 'MIDDAY';
  let phaseStyle = 'bg-amber-950/60 text-amber-300 border-amber-500/40';
  let phaseIcon = '☀️';

  if (hour >= 5.0 && hour < 6.8) {
    phaseLabel = 'BLUE SUNRISE';
    phaseStyle = 'bg-sky-950/80 text-sky-200 border-sky-400/70 shadow-[0_0_8px_rgba(56,189,248,0.4)] animate-pulse';
    phaseIcon = '🌅';
  } else if (hour >= 6.8 && hour < 17.0) {
    phaseLabel = 'MIDDAY';
    phaseStyle = 'bg-amber-950/60 text-amber-300 border-amber-500/40';
    phaseIcon = '☀️';
  } else if (hour >= 17.0 && hour < 18.8) {
    phaseLabel = 'BLUE SUNSET';
    phaseStyle = 'bg-cyan-950/80 text-cyan-200 border-cyan-400/80 shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse';
    phaseIcon = '🌇';
  } else {
    phaseLabel = 'NIGHT';
    phaseStyle = 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40';
    phaseIcon = '🌌';
  }

  return (
    <div className="bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-lg border border-mars-border/60 text-xs font-mono space-y-1 shadow-lg">
      <div className="flex items-center justify-between text-mars-dust border-b border-mars-border/40 pb-1 gap-2">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-mars-sand" />
          <span className="font-bold text-white">SOL {solTime.sol}</span>
          <span className="text-mars-sand/80">({timeString})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          {/* Solar Phase Pill */}
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center space-x-1 ${phaseStyle}`}>
            <span>{phaseIcon}</span>
            <span>{phaseLabel}</span>
          </span>

          <div className={`flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
            isNeretva 
              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse'
              : 'text-mars-sand/70'
          }`}>
            <Globe className={`w-3 h-3 ${isNeretva ? 'text-amber-400' : 'text-mars-dust'}`} />
            <span>{regionName}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-mars-dust pt-0.5">
        <MapPin className="w-3.5 h-3.5 text-mars-orange shrink-0" />
        <span className="text-white font-mono">
          {coordinates.latitude.toFixed(4)}° N, {coordinates.longitude.toFixed(4)}° E
        </span>
        <span className="text-mars-sand/80 font-mono">
          | Elev: <span className="text-white font-bold">{coordinates.elevation.toFixed(0)}m</span> (MOLA)
        </span>
      </div>
    </div>
  );
};
