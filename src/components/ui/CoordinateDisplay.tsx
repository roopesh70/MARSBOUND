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

  return (
    <div className="bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-lg border border-mars-border/60 text-xs font-mono space-y-1 shadow-lg">
      <div className="flex items-center justify-between text-mars-dust border-b border-mars-border/40 pb-1">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-mars-sand" />
          <span className="font-bold text-white">SOL {solTime.sol}</span>
          <span className="text-mars-sand/80">({timeString})</span>
        </div>
        <div className={`flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
          isNeretva 
            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse'
            : 'text-mars-sand/70'
        }`}>
          <Globe className={`w-3 h-3 ${isNeretva ? 'text-amber-400' : 'text-mars-dust'}`} />
          <span>{regionName}</span>
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
