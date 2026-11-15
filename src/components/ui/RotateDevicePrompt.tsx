import React from 'react';
import { RotateCw, Compass, ArrowRight } from 'lucide-react';

interface RotateDevicePromptProps {
  onDismiss: () => void;
}

export const RotateDevicePrompt: React.FC<RotateDevicePromptProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-6 text-center select-none animate-in fade-in">
      {/* Curved Astronaut Visor Backdrop Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.25) 0%, transparent 75%)'
        }}
      />

      <div className="relative max-w-sm w-full space-y-6 flex flex-col items-center">
        {/* Animated Rotating Phone Device Icon */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-mars-orange/15 border border-mars-orange/40 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
          <div className="w-10 h-16 rounded-xl border-2 border-mars-orange flex items-center justify-center animate-[spin_4s_ease-in-out_infinite] shadow-lg">
            <div className="w-6 h-10 border border-mars-sand/50 rounded flex items-center justify-center">
              <Compass className="w-4 h-4 text-mars-orange" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 p-1.5 bg-black rounded-full border border-mars-orange text-mars-orange">
            <RotateCw className="w-4 h-4 animate-spin-slow" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2 font-mono">
          <span className="text-[10px] text-mars-sand font-bold tracking-widest uppercase block">
            NASA JEZERO TACTICAL TELEMETRY
          </span>
          <h2 className="text-lg font-bold font-display text-white tracking-wide">
            ROTATE DEVICE TO LANDSCAPE
          </h2>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            MARSBOUND&apos;s astronaut EVA cockpit, GIS tactical mapping, and RIMFAX radar arrays are calibrated for 16:9 widescreen orientation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-2">
          <button
            onClick={() => {
              // Attempt browser fullscreen if supported
              if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {});
              }
              onDismiss();
            }}
            className="w-full py-3 px-4 rounded-xl bg-mars-orange hover:bg-mars-rust text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>CONTINUE IN FULLSCREEN LANDSCAPE</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onDismiss}
            className="text-[11px] font-mono text-mars-dust/70 hover:text-white underline transition-colors cursor-pointer block w-full py-1"
          >
            Continue in Portrait anyway
          </button>
        </div>
      </div>
    </div>
  );
};
