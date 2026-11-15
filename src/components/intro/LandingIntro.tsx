import React from 'react';
import { Rocket, Globe, Compass, Shield, BookOpen, Database, Play } from 'lucide-react';

interface LandingIntroProps {
  onStart: () => void;
  onOpenProvenance: () => void;
}

export const LandingIntro: React.FC<LandingIntroProps> = ({ onStart, onOpenProvenance }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-1 sm:p-2 md:p-4 animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-mars-surface border border-mars-border/90 rounded-xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[98vh] max-h-[98vh]">
        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Banner with Mars gradient & Logo */}
          <div className="relative p-3 sm:p-5 md:p-8 text-center bg-gradient-to-b from-mars-rust/40 via-mars-panel to-mars-surface border-b border-mars-border/80 space-y-1.5 md:space-y-3">
            <div className="inline-flex items-center space-x-1.5 bg-mars-orange/20 border border-mars-orange/40 px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-mono font-bold text-mars-orange tracking-widest uppercase">
              <Globe className="w-3 h-3 md:w-3.5 md:h-3.5 animate-spin shrink-0" />
              <span>NASA JEZERO CRATER EXPEDITION</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black font-display tracking-widest text-white drop-shadow-md">
              MARSBOUND
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-display text-mars-dust tracking-wider">
              Explore. Survive. Discover. Build.
            </p>

            <p className="text-[11px] sm:text-xs font-mono text-gray-300 max-w-lg mx-auto leading-relaxed pt-1">
              Step onto the surface of Mars as an astronaut stationed at Octavia E. Butler Base in Jezero Crater.
              Navigate real topography from NASA HiRISE and MOLA elevation datasets, sample genuine rover discoveries, and establish a permanent human outpost.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 p-3 md:p-5 bg-mars-surface">
            <div className="p-2.5 md:p-3 rounded-lg md:rounded-xl border border-mars-border bg-mars-panel/50 space-y-0.5 md:space-y-1">
              <div className="flex items-center space-x-1.5 text-mars-orange font-mono font-bold text-[11px] md:text-xs">
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>EXPLORE</span>
              </div>
              <p className="text-[9.5px] md:text-[11px] text-gray-400 font-sans leading-tight">
                Traverse real Jezero topography with low-gravity hops and GIS terrain mapping.
              </p>
            </div>

            <div className="p-2.5 md:p-3 rounded-lg md:rounded-xl border border-mars-border bg-mars-panel/50 space-y-0.5 md:space-y-1">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-mono font-bold text-[11px] md:text-xs">
                <Shield className="w-3.5 h-3.5 shrink-0" />
                <span>SURVIVE</span>
              </div>
              <p className="text-[9.5px] md:text-[11px] text-gray-400 font-sans leading-tight">
                Manage suit oxygen and battery levels. Recharge inside habitat domes.
              </p>
            </div>

            <div className="p-2.5 md:p-3 rounded-lg md:rounded-xl border border-mars-border bg-mars-panel/50 space-y-0.5 md:space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-mono font-bold text-[11px] md:text-xs">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>DISCOVER</span>
              </div>
              <p className="text-[9.5px] md:text-[11px] text-gray-400 font-sans leading-tight">
                Scan geological outcrops, extract core samples, and analyze biosignatures.
              </p>
            </div>

            <div className="p-2.5 md:p-3 rounded-lg md:rounded-xl border border-mars-border bg-mars-panel/50 space-y-0.5 md:space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-400 font-mono font-bold text-[11px] md:text-xs">
                <Rocket className="w-3.5 h-3.5 shrink-0" />
                <span>BUILD</span>
              </div>
              <p className="text-[9.5px] md:text-[11px] text-gray-400 font-sans leading-tight">
                Construct solar grids, MOXIE O₂ generators, and expand your research outpost.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Launch Button (Sticky Bottom Bar) */}
        <div className="p-3 sm:p-4 md:p-5 border-t border-mars-border bg-mars-panel/95 flex flex-col sm:flex-row items-center justify-between gap-2.5 md:gap-4 shrink-0">
          <button
            onClick={onOpenProvenance}
            className="flex items-center space-x-1.5 text-[10px] md:text-xs font-mono text-mars-dust hover:text-white transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>NASA Data Provenance & Science References</span>
          </button>

          <button
            onClick={onStart}
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-6 md:px-8 py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-mars-red to-mars-orange hover:from-mars-rust hover:to-mars-red text-white font-mono text-xs sm:text-sm font-bold tracking-widest shadow-xl border border-mars-glow/40 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>COMMENCE EXPEDITION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
