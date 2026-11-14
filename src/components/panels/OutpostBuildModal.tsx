import React from 'react';
import { OutpostStructureType } from '../../types/outpost';
import { Sun, Battery, Beaker, Radio, Home, RotateCw, CheckCircle, AlertTriangle, X, Zap } from 'lucide-react';

interface OutpostBuildModalProps {
  isActive: boolean;
  selectedType: OutpostStructureType;
  isValidPlacement: boolean;
  onSelectType: (type: OutpostStructureType) => void;
  onRotate: () => void;
  onClose: () => void;
  totalPowerGen: number;
  totalPowerCon: number;
  totalBatteryWh: number;
}

const STRUCTURE_CARDS: {
  type: OutpostStructureType;
  name: string;
  icon: React.ReactNode;
  stat: string;
  desc: string;
}[] = [
  {
    type: 'solar_array',
    name: 'Solar Array',
    icon: <Sun className="w-5 h-5 text-amber-400" />,
    stat: '+2,400 W',
    desc: 'Dual-axis triple-junction tracking panels'
  },
  {
    type: 'battery_bank',
    name: 'Battery Bank',
    icon: <Battery className="w-5 h-5 text-cyan-400" />,
    stat: '+20,000 Wh',
    desc: 'Solid-state storage buffer'
  },
  {
    type: 'science_lab',
    name: 'Science Lab',
    icon: <Beaker className="w-5 h-5 text-purple-400" />,
    stat: '-800 W',
    desc: 'Field spectrometer laboratory'
  },
  {
    type: 'comm_dish',
    name: 'Comms Dish',
    icon: <Radio className="w-5 h-5 text-emerald-400" />,
    stat: '-350 W',
    desc: 'High-gain orbital data uplink'
  },
  {
    type: 'habitat_core',
    name: 'Habitat Pod',
    icon: <Home className="w-5 h-5 text-rose-400" />,
    stat: '-1,200 W',
    desc: 'Auxiliary pressurized crew airlock'
  }
];

export const OutpostBuildModal: React.FC<OutpostBuildModalProps> = ({
  isActive,
  selectedType,
  isValidPlacement,
  onSelectType,
  onRotate,
  onClose,
  totalPowerGen,
  totalPowerCon,
  totalBatteryWh
}) => {
  if (!isActive) return null;

  const netPower = totalPowerGen - totalPowerCon;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none z-40">
      {/* Top Banner: Grid telemetry & Close */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        {/* Outpost Power Stats */}
        <div className="flex items-center space-x-4 bg-black/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-mars-orange/60 font-mono shadow-2xl">
          <div className="flex items-center space-x-2 text-mars-sand font-bold text-xs uppercase">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>BASE GRID TELEMETRY:</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div>
              <span className="text-gray-400 text-[10px] block">GENERATION:</span>
              <span className="text-amber-300 font-bold">{totalPowerGen.toLocaleString()} W</span>
            </div>
            <div className="h-4 w-px bg-mars-border" />
            <div>
              <span className="text-gray-400 text-[10px] block">DEMAND:</span>
              <span className="text-rose-400 font-bold">{totalPowerCon.toLocaleString()} W</span>
            </div>
            <div className="h-4 w-px bg-mars-border" />
            <div>
              <span className="text-gray-400 text-[10px] block">NET BALANCE:</span>
              <span className={`font-bold ${netPower >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {netPower >= 0 ? `+${netPower.toLocaleString()}` : netPower.toLocaleString()} W
              </span>
            </div>
            <div className="h-4 w-px bg-mars-border" />
            <div>
              <span className="text-gray-400 text-[10px] block">STORAGE:</span>
              <span className="text-cyan-300 font-bold">{(totalBatteryWh / 1000).toFixed(0)} kWh</span>
            </div>
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={onClose}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-mars-surface/90 hover:bg-white/10 border border-mars-border text-white font-mono text-xs font-bold transition-all"
        >
          <X className="w-4 h-4 text-mars-sand" />
          <span>EXIT BUILD MODE [B / Esc]</span>
        </button>
      </div>

      {/* Center Hologram Status */}
      <div className="flex flex-col items-center pointer-events-auto space-y-2">
        <div
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold shadow-2xl border transition-all ${
            isValidPlacement
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 animate-pulse'
              : 'bg-rose-950/90 border-rose-500 text-rose-300'
          }`}
        >
          {isValidPlacement ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>VALID FOUNDATION • CLICK TO CONSTRUCT</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>OUTSIDE OUTPOST ZONE (MUST BE WITHIN 55m OF HABITAT)</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-mono text-gray-300 bg-black/60 px-4 py-1.5 rounded-lg border border-mars-border/80">
          <button
            onClick={onRotate}
            className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-mars-orange" />
            <span>[R] Rotate Structure (45°)</span>
          </button>
          <span>•</span>
          <span>Left-Click or [Space] to Place</span>
        </div>
      </div>

      {/* Bottom Structure Selection Palette */}
      <div className="flex justify-center w-full pointer-events-auto">
        <div className="grid grid-cols-5 gap-3 bg-black/85 backdrop-blur-md p-3 rounded-2xl border border-mars-border/80 shadow-2xl max-w-3xl w-full">
          {STRUCTURE_CARDS.map((card) => {
            const isSelected = selectedType === card.type;
            return (
              <button
                key={card.type}
                onClick={() => onSelectType(card.type)}
                className={`flex flex-col items-center p-3 rounded-xl border font-mono transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-mars-orange/20 border-mars-orange text-white ring-2 ring-mars-orange/50 scale-105'
                    : 'bg-mars-surface border-mars-border/70 text-mars-dust hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="p-2 rounded-lg bg-black/40 mb-1.5">{card.icon}</div>
                <div className="font-bold text-xs">{card.name}</div>
                <div className="text-[10px] text-amber-300 font-bold mt-0.5">{card.stat}</div>
                <div className="text-[9px] text-gray-400 leading-tight mt-1 hidden md:block">
                  {card.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
