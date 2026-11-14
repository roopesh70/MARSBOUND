import React from 'react';
import { SuitResources } from '../../types/survival';
import { EnvironmentalConditions } from '../../types/mars';
import { Activity, Battery, Wind, Thermometer, ShieldCheck, AlertTriangle } from 'lucide-react';

interface SurvivalStatusProps {
  suit: SuitResources;
  environment: EnvironmentalConditions;
}

export const SurvivalStatus: React.FC<SurvivalStatusProps> = ({ suit, environment }) => {
  const isO2Low = suit.oxygen < 25;
  const isBatLow = suit.battery < 20;

  return (
    <div className="bg-black/65 backdrop-blur-md p-4 rounded-xl border border-mars-border/70 space-y-3 font-mono shadow-2xl min-w-[280px]">
      {/* Header status badge */}
      <div className="flex items-center justify-between pb-2 border-b border-mars-border/50 text-xs">
        <span className="text-mars-sand font-bold tracking-wider uppercase text-[11px]">EVA LIFE SUPPORT</span>
        {suit.isInSafeZone ? (
          <span className="flex items-center text-emerald-400 bg-emerald-950/70 border border-emerald-500/50 px-2 py-0.5 rounded text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 mr-1" />
            OUTPOST RECHARGE ACTIVE
          </span>
        ) : (
          <span className="flex items-center text-mars-orange bg-mars-surface px-2 py-0.5 rounded text-[10px]">
            FIELD EXPEDITION ACTIVE
          </span>
        )}
      </div>

      {/* Oxygen Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="flex items-center text-mars-dust">
            <Activity className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            OXYGEN TANK
          </span>
          <span className={`font-bold ${isO2Low ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
            {Math.round(suit.oxygen)}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-mars-border/60 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isO2Low ? 'bg-rose-500 animate-pulse' : suit.oxygen < 50 ? 'bg-amber-400' : 'bg-cyan-400'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, suit.oxygen))}%` }}
          />
        </div>
      </div>

      {/* Battery Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="flex items-center text-mars-dust">
            <Battery className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            SUIT BATTERY
          </span>
          <span className={`font-bold ${isBatLow ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
            {Math.round(suit.battery)}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-mars-border/60 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isBatLow ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, suit.battery))}%` }}
          />
        </div>
      </div>

      {/* Atmospheric readings from MEDA */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-mars-border/40 text-[11px] text-mars-dust">
        <div className="flex items-center space-x-1.5 bg-mars-surface/70 px-2 py-1 rounded">
          <Thermometer className="w-3 h-3 text-mars-orange" />
          <span>{environment.temperatureCelsius}°C</span>
        </div>
        <div className="flex items-center space-x-1.5 bg-mars-surface/70 px-2 py-1 rounded">
          <Wind className="w-3 h-3 text-sky-400" />
          <span>{environment.surfacePressurePa} Pa (CO₂)</span>
        </div>
      </div>

      {/* Warnings */}
      {suit.isSuffocating && (
        <div className="flex items-center space-x-2 bg-rose-950/90 border border-rose-500 text-rose-200 p-2 rounded text-xs animate-bounce font-bold">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>CRITICAL: OXYGEN DEPLETED! RETURN TO HABITAT</span>
        </div>
      )}
    </div>
  );
};
