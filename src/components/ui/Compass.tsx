import React from 'react';
import { Compass as CompassIcon } from 'lucide-react';

interface CompassProps {
  heading: number; // 0 to 360
}

export const Compass: React.FC<CompassProps> = ({ heading }) => {
  const getCardinal = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'N';
    if (deg >= 22.5 && deg < 67.5) return 'NE';
    if (deg >= 67.5 && deg < 112.5) return 'E';
    if (deg >= 112.5 && deg < 157.5) return 'SE';
    if (deg >= 157.5 && deg < 202.5) return 'S';
    if (deg >= 202.5 && deg < 247.5) return 'SW';
    if (deg >= 247.5 && deg < 292.5) return 'W';
    return 'NW';
  };

  const cardinal = getCardinal(heading);

  return (
    <div className="flex items-center space-x-1.5 md:space-x-3 bg-black/65 backdrop-blur-md px-2 py-1 md:px-4 md:py-2 rounded-lg border border-mars-border/60 text-mars-dust font-mono shadow-lg">
      <CompassIcon className="w-3.5 h-3.5 md:w-5 md:h-5 text-mars-orange animate-pulse shrink-0" />
      <div className="flex items-baseline space-x-1 md:space-x-2">
        <span className="text-sm md:text-lg font-bold text-white tracking-wider md:tracking-widest">{cardinal}</span>
        <span className="text-[9px] md:text-xs text-mars-sand font-mono">{heading.toString().padStart(3, '0')}°</span>
      </div>
      <div className="h-3 md:h-4 w-px bg-mars-border mx-0.5 md:mx-1" />
      <div className="w-14 sm:w-20 md:w-32 h-1 md:h-2 bg-mars-surface rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 bottom-0 w-2 md:w-3 bg-mars-accent rounded-full transition-all duration-75"
          style={{ left: `${(heading / 360) * 100}%` }}
        />
      </div>
    </div>
  );
};
