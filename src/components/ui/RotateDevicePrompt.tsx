import React, { useState } from 'react';
import { RotateCw, Compass, ArrowRight, Play, Maximize } from 'lucide-react';

interface RotateDevicePromptProps {
  onDismiss: () => void;
}

export const RotateDevicePrompt: React.FC<RotateDevicePromptProps> = ({ onDismiss }) => {
  const [isAttempting, setIsAttempting] = useState(false);

  const handleFullscreenLandscape = async () => {
    setIsAttempting(true);

    // 1. Request Fullscreen across all vendor implementations
    try {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }
    } catch {
      // Fullscreen not permitted or failed
    }

    // 2. Lock screen orientation to landscape
    try {
      const screenOrientation = (window.screen?.orientation || (window.screen as any)?.mozOrientation || (window.screen as any)?.msOrientation) as any;
      if (screenOrientation && typeof screenOrientation.lock === 'function') {
        await screenOrientation.lock('landscape');
      } else if ((window.screen as any)?.lockOrientation) {
        (window.screen as any).lockOrientation('landscape');
      } else if ((window.screen as any)?.webkitLockOrientation) {
        (window.screen as any).webkitLockOrientation('landscape');
      } else if ((window.screen as any)?.mozLockOrientation) {
        (window.screen as any).mozLockOrientation('landscape');
      }
    } catch {
      // Screen orientation lock not permitted by browser (e.g. iOS Safari)
    }

    // Always dismiss immediately so the player is never trapped
    setTimeout(() => {
      onDismiss();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-4 text-center select-none animate-in fade-in">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.3) 0%, transparent 75%)'
        }}
      />

      <div className="relative max-w-xs sm:max-w-sm w-full space-y-4 flex flex-col items-center bg-mars-surface/90 border border-mars-border/80 rounded-2xl p-6 shadow-2xl">
        {/* Animated Rotating Phone Device Icon */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-mars-orange/15 border border-mars-orange/40 shadow-[0_0_25px_rgba(249,115,22,0.35)]">
          <div className="w-8 h-14 rounded-lg border-2 border-mars-orange flex items-center justify-center animate-[spin_4s_ease-in-out_infinite] shadow-lg">
            <div className="w-5 h-8 border border-mars-sand/50 rounded flex items-center justify-center">
              <Compass className="w-3.5 h-3.5 text-mars-orange" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 p-1 bg-black rounded-full border border-mars-orange text-mars-orange">
            <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1.5 font-mono">
          <span className="text-[9px] text-mars-sand font-bold tracking-widest uppercase block">
            NASA JEZERO CRATER EXPEDITION
          </span>
          <h2 className="text-base sm:text-lg font-bold font-display text-white tracking-wide">
            RECOMMENDED: LANDSCAPE
          </h2>
          <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
            Turn your phone horizontally or enter fullscreen landscape for the best panoramic Martian view.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 pt-1">
          <button
            onClick={handleFullscreenLandscape}
            disabled={isAttempting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-mars-red to-mars-orange hover:from-mars-rust hover:to-mars-red text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <Maximize className="w-3.5 h-3.5" />
            <span>CONTINUE IN FULLSCREEN LANDSCAPE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onDismiss}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-mars-border text-mars-sand hover:text-white font-mono text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 active:scale-95"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>PLAY IN PORTRAIT MODE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
