import React from 'react';
import { OutpostStructureType, OutpostStructure, BuildToolMode } from '../../types/outpost';
import { Sun, Battery, Beaker, Radio, Home, RotateCw, CheckCircle, AlertTriangle, X, Zap, Trash2, Recycle, Crosshair } from 'lucide-react';

interface OutpostBuildModalProps {
  isActive: boolean;
  selectedType: OutpostStructureType;
  buildToolMode: BuildToolMode;
  isValidPlacement: boolean;
  targetedStructure?: OutpostStructure | null;
  onSelectType: (type: OutpostStructureType) => void;
  onToggleToolMode: (mode: BuildToolMode) => void;
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
  buildToolMode,
  isValidPlacement,
  targetedStructure,
  onSelectType,
  onToggleToolMode,
  onRotate,
  onClose,
  totalPowerGen,
  totalPowerCon,
  totalBatteryWh
}) => {
  if (!isActive) return null;

  const netPower = totalPowerGen - totalPowerCon;
  const isDismantleMode = buildToolMode === 'dismantle';

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none z-40">
      {/* Top Banner: Grid telemetry, Mode Toggle & Close */}
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

        {/* Mode Switch Pills & Exit Button */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-black/80 backdrop-blur-md p-1 rounded-xl border border-mars-border font-mono text-xs">
            <button
              onClick={() => onToggleToolMode('construct')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                !isDismantleMode
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>CONSTRUCT</span>
            </button>
            <button
              onClick={() => onToggleToolMode('dismantle')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                isDismantleMode
                  ? 'bg-rose-600 text-white shadow-lg animate-pulse'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>DISMANTLE [X]</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-mars-surface/90 hover:bg-white/10 border border-mars-border text-white font-mono text-xs font-bold transition-all cursor-pointer"
          >
            <X className="w-4 h-4 text-mars-sand" />
            <span>EXIT [B / Esc]</span>
          </button>
        </div>
      </div>

      {/* Center Hologram Status */}
      <div className="flex flex-col items-center pointer-events-auto space-y-2">
        {isDismantleMode ? (
          targetedStructure ? (
            targetedStructure.id === 'outpost_hab_core' ? (
              <div className="flex items-center space-x-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold shadow-2xl border bg-rose-950/95 border-rose-500 text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>PROTECTED LIFE SUPPORT • CANNOT DISMANTLE PRIMARY HABITAT CORE</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold shadow-2xl border bg-amber-950/95 border-amber-500 text-amber-200 animate-pulse">
                <Trash2 className="w-4 h-4 text-amber-400" />
                <span>CLICK TO DISMANTLE: {targetedStructure.name.toUpperCase()} • RECYCLE MODULE</span>
              </div>
            )
          ) : (
            <div className="flex items-center space-x-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold shadow-2xl border bg-black/85 border-rose-500/60 text-rose-200">
              <Crosshair className="w-4 h-4 text-rose-400 animate-spin" />
              <span>AIM AT ANY BUILT STRUCTURE WITHIN 16M TO TARGET & DISMANTLE</span>
            </div>
          )
        ) : (
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
        )}

        <div className="flex items-center space-x-3 text-[11px] font-mono text-gray-300 bg-black/60 px-4 py-1.5 rounded-lg border border-mars-border/80">
          <button
            onClick={() => onToggleToolMode(isDismantleMode ? 'construct' : 'dismantle')}
            className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer text-amber-300"
          >
            <Recycle className="w-3.5 h-3.5" />
            <span>[X] Toggle Dismantle / Build</span>
          </button>
          <span>•</span>
          <button
            onClick={onRotate}
            className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-mars-orange" />
            <span>[R] Rotate (45°)</span>
          </button>
          <span>•</span>
          <span>Left-Click to {isDismantleMode ? 'Dismantle' : 'Place'}</span>
        </div>
      </div>

      {/* Bottom Structure Selection Palette */}
      <div className="flex justify-center w-full pointer-events-auto">
        <div className="grid grid-cols-6 gap-3 bg-black/85 backdrop-blur-md p-3 rounded-2xl border border-mars-border/80 shadow-2xl max-w-4xl w-full">
          {STRUCTURE_CARDS.map((card) => {
            const isSelected = !isDismantleMode && selectedType === card.type;
            return (
              <button
                key={card.type}
                onClick={() => {
                  onSelectType(card.type);
                  onToggleToolMode('construct');
                }}
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

          {/* 6th Card: Dismantle / Salvage Tool */}
          <button
            onClick={() => onToggleToolMode('dismantle')}
            className={`flex flex-col items-center p-3 rounded-xl border font-mono transition-all text-center cursor-pointer ${
              isDismantleMode
                ? 'bg-rose-950/60 border-rose-500 text-rose-200 ring-2 ring-rose-500/60 scale-105'
                : 'bg-mars-surface border-rose-900/60 text-rose-300 hover:text-white hover:bg-rose-950/30'
            }`}
          >
            <div className="p-2 rounded-lg bg-black/40 mb-1.5">
              <Trash2 className="w-5 h-5 text-rose-400" />
            </div>
            <div className="font-bold text-xs text-rose-300">Dismantle [X]</div>
            <div className="text-[10px] text-rose-400 font-bold mt-0.5">Salvage Node</div>
            <div className="text-[9px] text-gray-400 leading-tight mt-1 hidden md:block">
              Decommission & reclaim base components
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
