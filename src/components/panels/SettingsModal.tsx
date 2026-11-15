import React from 'react';
import { Settings, X, Volume2, VolumeX, RotateCcw, Monitor, Sun, Moon, Sunrise, Sunset, FastForward } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetSave: () => void;
  currentSolHour?: number;
  onSetSolTime?: (hour: number, minute?: number) => void;
  solSpeedMultiplier?: number;
  onSetSolSpeedMultiplier?: (speed: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
  onResetSave,
  currentSolHour = 10.75,
  onSetSolTime,
  solSpeedMultiplier = 30,
  onSetSolSpeedMultiplier
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-1 sm:p-2 md:p-4 animate-in fade-in">
      <div className="relative w-full max-w-xl bg-mars-surface border border-mars-border rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[98vh] max-h-[98vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-2 md:p-4 border-b border-mars-border/80 bg-mars-panel/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-mars-surface rounded-lg text-mars-orange border border-mars-border">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-display text-white tracking-wide">
              SIMULATOR SETTINGS & CELESTIAL CONTROLS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-mars-dust hover:text-white hover:bg-white/10 border border-mars-border/50 transition-all cursor-pointer"
            title="Close Settings [Esc / C]"
          >
            <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-mars-sand hidden sm:inline">Esc</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-2.5 md:p-5 space-y-3 md:space-y-4 font-mono text-xs overflow-y-auto">
          {/* Martian Solar Cycle & Blue Sunset Presets */}
          <div className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-black/40 to-mars-panel/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-bold">
                <Sun className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <span className="text-cyan-200">Martian Solar Cycle & LMST Time Warp</span>
              </div>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/50">
                CURRENT: {Math.floor(currentSolHour).toString().padStart(2, '0')}:{Math.floor((currentSolHour % 1) * 60).toString().padStart(2, '0')} LMST
              </span>
            </div>

            <p className="text-[10px] text-mars-sand/80 leading-relaxed">
              Mars&apos; 1.52 AU solar distance shrinks the Sun to 0.35° angular diameter. Fine suspended ferric oxide dust causes forward Mie scattering, producing intense cyan-blue halos at twilight and butterscotch skies at midday.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSetSolTime?.(6, 0)}
                className="p-2.5 rounded-xl bg-black/60 border border-sky-500/40 hover:border-sky-400 hover:bg-sky-950/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-1.5 text-sky-300 font-bold text-xs">
                  <Sunrise className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span>06:00 DAWN / SUNRISE</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1">Ethereal blue glow on Jezero rim</div>
              </button>

              <button
                onClick={() => onSetSolTime?.(12, 0)}
                className="p-2.5 rounded-xl bg-black/60 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-1.5 text-amber-300 font-bold text-xs">
                  <Sun className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>12:00 SOLAR MIDDAY</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1">Butterscotch ochre dust sky</div>
              </button>

              <button
                onClick={() => onSetSolTime?.(18, 15)}
                className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-400 hover:border-cyan-300 hover:bg-cyan-900/50 text-left transition-all cursor-pointer group shadow-[0_0_12px_rgba(6,182,212,0.2)]"
              >
                <div className="flex items-center space-x-1.5 text-cyan-200 font-bold text-xs">
                  <Sunset className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span>18:15 BLUE SUNSET</span>
                </div>
                <div className="text-[10px] text-cyan-300/80 mt-1">Curiosity Sol 956 Mie scattering aureole</div>
              </button>

              <button
                onClick={() => onSetSolTime?.(21, 30)}
                className="p-2.5 rounded-xl bg-black/60 border border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-950/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-1.5 text-indigo-300 font-bold text-xs">
                  <Moon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span>21:30 MARTIAN NIGHT</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1">Phobos orbit, Milky Way & stars</div>
              </button>
            </div>

            {/* Time Warp Speed Multiplier */}
            <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-mars-sand text-[11px] font-bold">
                <FastForward className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sol Clock Time Warp Rate:</span>
              </div>
              <div className="flex items-center space-x-1">
                {[
                  { speed: 1, label: '1x (Real)' },
                  { speed: 30, label: '30x (Default)' },
                  { speed: 120, label: '120x (Fast)' },
                  { speed: 360, label: '360x (Timelapse)' }
                ].map(({ speed, label }) => (
                  <button
                    key={speed}
                    onClick={() => onSetSolSpeedMultiplier?.(speed)}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                      solSpeedMultiplier === speed
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                        : 'bg-black/40 text-mars-dust border-mars-border hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audio setting */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-mars-border bg-mars-panel/50">
            <div className="flex items-center space-x-3">
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
              <div>
                <div className="font-bold text-white">Atmospheric Audio & Sound Effects</div>
                <div className="text-[10px] text-mars-sand">Synthesized thin CO2 wind & scanner telemetry</div>
              </div>
            </div>
            <button
              onClick={() => {
                onToggleMute();
                audioService.setMuted(!isMuted);
              }}
              className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                  : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
              }`}
            >
              {isMuted ? 'MUTED' : 'ENABLED'}
            </button>
          </div>

          {/* Graphics preset */}
          <div className="p-3.5 rounded-xl border border-mars-border bg-mars-panel/50 space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Monitor className="w-4 h-4 text-mars-orange" />
              <span>Renderer Preset</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="p-2 rounded-lg bg-mars-surface border border-mars-border text-mars-dust text-center hover:text-white cursor-pointer">
                Low (Fast)
              </button>
              <button className="p-2 rounded-lg bg-mars-orange/20 border border-mars-orange text-white text-center font-bold cursor-pointer">
                Balanced (60fps)
              </button>
              <button className="p-2 rounded-lg bg-mars-surface border border-mars-border text-mars-dust text-center hover:text-white cursor-pointer">
                Ultra (Hi-Res)
              </button>
            </div>
          </div>

          {/* Controls Reference */}
          <div className="p-3.5 rounded-xl border border-mars-border bg-black/40 space-y-2 text-[11px]">
            {typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? (
              <>
                <span className="text-mars-sand font-bold block uppercase">MOBILE TOUCH CONTROLS</span>
                <div className="grid grid-cols-2 gap-y-1.5 text-gray-300">
                  <div><span className="text-mars-orange font-bold">[Left Joystick]</span> Move Astronaut / Rover</div>
                  <div><span className="text-mars-orange font-bold">[Swipe Screen]</span> Look Around & Rotate</div>
                  <div><span className="text-mars-orange font-bold">[HOP Button]</span> Low-gravity Hop</div>
                  <div><span className="text-mars-orange font-bold">[SPRINT Button]</span> Fast Traverse Hike</div>
                  <div><span className="text-mars-orange font-bold">[SCAN Button]</span> Raman Spectrometer</div>
                  <div><span className="text-mars-orange font-bold">[TOOLS Button]</span> Quick EVA Action Dial</div>
                  <div><span className="text-mars-orange font-bold">[Top Status Bar]</span> Tactical Map & Radar</div>
                  <div><span className="text-mars-orange font-bold">[Context Pills]</span> Board Rover / Enter Lab</div>
                </div>
              </>
            ) : (
              <>
                <span className="text-mars-sand font-bold block uppercase">KEYBOARD & MOUSE CONTROLS</span>
                <div className="grid grid-cols-2 gap-y-1.5 text-gray-300">
                  <div><span className="text-mars-orange font-bold">[W, A, S, D]</span> Move Astronaut / Rover</div>
                  <div><span className="text-mars-orange font-bold">[Mouse]</span> Look around (Click to lock)</div>
                  <div><span className="text-mars-orange font-bold">[Space]</span> Low-gravity Hop</div>
                  <div><span className="text-mars-orange font-bold">[Shift]</span> Sprint / Fast hike</div>
                  <div><span className="text-mars-orange font-bold">[F]</span> Activate Field Scanner</div>
                  <div><span className="text-mars-orange font-bold">[M]</span> Tactical GIS Map</div>
                  <div><span className="text-mars-orange font-bold">[J]</span> Research Journal</div>
                  <div><span className="text-mars-orange font-bold">[U]</span> Subsurface RIMFAX Radargram</div>
                  <div><span className="text-mars-orange font-bold">[G]</span> Deploy Core Drill</div>
                  <div><span className="text-mars-orange font-bold">[B]</span> Outpost Build Mode</div>
                  <div><span className="text-mars-orange font-bold">[E]</span> Mount/Dismount Rover</div>
                  <div><span className="text-mars-orange font-bold">[Esc / C]</span> Settings / Celestial Warp</div>
                </div>
              </>
            )}
          </div>

          {/* Reset Progress */}
          <div className="pt-2 border-t border-mars-border/60 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Reset Saved Expedition</div>
              <div className="text-[10px] text-mars-dust/60">Clears local storage progress</div>
            </div>
            <button
              onClick={() => {
                if (confirm('Reset your Mars expedition progress?')) {
                  onResetSave();
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 hover:bg-rose-900/60 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-mars-border/80 bg-mars-panel/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-mars-orange hover:bg-mars-rust text-white font-mono text-xs font-bold transition-all cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
