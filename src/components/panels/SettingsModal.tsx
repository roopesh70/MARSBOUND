import React from 'react';
import { Settings, X, Volume2, VolumeX, RotateCcw, Monitor } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
  onResetSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-mars-surface border border-mars-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-mars-border/80 bg-mars-panel/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-mars-surface rounded-lg text-mars-orange border border-mars-border">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-display text-white tracking-wide">
              SIMULATOR SETTINGS & CONTROLS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-mars-dust hover:text-white hover:bg-white/10 border border-mars-border/50 transition-all cursor-pointer"
            title="Close Settings [Esc / C]"
          >
            <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-mars-sand">Esc</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 font-mono text-xs">
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
              className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition-colors ${
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
              <button className="p-2 rounded-lg bg-mars-surface border border-mars-border text-mars-dust text-center hover:text-white">
                Low (Fast)
              </button>
              <button className="p-2 rounded-lg bg-mars-orange/20 border border-mars-orange text-white text-center font-bold">
                Balanced (60fps)
              </button>
              <button className="p-2 rounded-lg bg-mars-surface border border-mars-border text-mars-dust text-center hover:text-white">
                Ultra (Hi-Res)
              </button>
            </div>
          </div>

          {/* Controls Reference */}
          <div className="p-3.5 rounded-xl border border-mars-border bg-black/40 space-y-2 text-[11px]">
            <span className="text-mars-sand font-bold block uppercase">KEYBOARD & MOUSE CONTROLS</span>
            <div className="grid grid-cols-2 gap-y-1.5 text-gray-300">
              <div><span className="text-mars-orange font-bold">[W, A, S, D]</span> Move Astronaut</div>
              <div><span className="text-mars-orange font-bold">[Mouse]</span> Look around (Click to lock)</div>
              <div><span className="text-mars-orange font-bold">[Space]</span> Low-gravity Hop</div>
              <div><span className="text-mars-orange font-bold">[Shift]</span> Sprint / Fast hike</div>
              <div><span className="text-mars-orange font-bold">[F]</span> Activate Field Scanner</div>
              <div><span className="text-mars-orange font-bold">[M]</span> Tactical GIS Map</div>
              <div><span className="text-mars-orange font-bold">[J]</span> Research Journal</div>
              <div><span className="text-mars-orange font-bold">[Esc]</span> Unlock pointer / Close</div>
            </div>
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
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 hover:bg-rose-900/60 transition-colors"
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
            className="px-5 py-2 rounded-xl bg-mars-orange hover:bg-mars-rust text-white font-mono text-xs font-bold transition-all"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
