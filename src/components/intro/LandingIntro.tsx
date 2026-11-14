import React from 'react';
import { Rocket, Globe, Compass, Shield, BookOpen, Database, Play } from 'lucide-react';

interface LandingIntroProps {
  onStart: () => void;
  onOpenProvenance: () => void;
}

export const LandingIntro: React.FC<LandingIntroProps> = ({ onStart, onOpenProvenance }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-in fade-in select-none">
      <div className="relative w-full max-w-3xl bg-mars-surface border border-mars-border/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Banner with Mars gradient & Logo */}
        <div className="relative p-8 text-center bg-gradient-to-b from-mars-rust/40 via-mars-panel to-mars-surface border-b border-mars-border/80 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-mars-orange/20 border border-mars-orange/40 px-3 py-1 rounded-full text-xs font-mono font-bold text-mars-orange tracking-widest uppercase">
            <Globe className="w-3.5 h-3.5 animate-spin" />
            <span>NASA SPACE APPS CHALLENGE • JEZERO CRATER EXPEDITION</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black font-display tracking-widest text-white drop-shadow-md">
            MARSBOUND
          </h1>
          <p className="text-sm md:text-base font-display text-mars-dust tracking-wider">
            Explore. Survive. Discover. Build.
          </p>

          <p className="text-xs font-mono text-gray-300 max-w-xl mx-auto leading-relaxed pt-2">
            Step onto the surface of Mars as an astronaut stationed at Octavia E. Butler Base in Jezero Crater.
            Navigate real terrain grounded in NASA HiRISE and MOLA elevation data, investigate genuine Perseverance rover mission discoveries, and survive the harsh Martian environment.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6 bg-mars-surface">
          <div className="p-3.5 rounded-xl border border-mars-border bg-mars-panel/50 space-y-1">
            <div className="flex items-center space-x-1.5 text-mars-orange font-mono font-bold text-xs">
              <Compass className="w-4 h-4" />
              <span>EXPLORE</span>
            </div>
            <p className="text-[11px] text-gray-400 font-sans leading-tight">
              Traverse real Jezero topography with Mars gravity hops and tactical GIS map overlays.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-mars-border bg-mars-panel/50 space-y-1">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-mono font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>SURVIVE</span>
            </div>
            <p className="text-[11px] text-gray-400 font-sans leading-tight">
              Manage suit oxygen and battery levels. Return to the habitat safe zone to recharge.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-mars-border bg-mars-panel/50 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono font-bold text-xs">
              <BookOpen className="w-4 h-4" />
              <span>DISCOVER</span>
            </div>
            <p className="text-[11px] text-gray-400 font-sans leading-tight">
              Scan geological outcrops, collect simulated samples, and read verified science records.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-mars-border bg-mars-panel/50 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-mono font-bold text-xs">
              <Rocket className="w-4 h-4" />
              <span>BUILD</span>
            </div>
            <p className="text-[11px] text-gray-400 font-sans leading-tight">
              Establish and expand your research outpost with solar power and life-support nodes.
            </p>
          </div>
        </div>

        {/* Action Controls & Launch Button */}
        <div className="p-6 border-t border-mars-border bg-mars-panel/90 flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={onOpenProvenance}
            className="flex items-center space-x-2 text-xs font-mono text-mars-dust hover:text-white transition-colors"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>NASA Data Provenance & References</span>
          </button>

          <button
            onClick={onStart}
            className="w-full md:w-auto flex items-center justify-center space-x-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-mars-red to-mars-orange hover:from-mars-rust hover:to-mars-red text-white font-mono text-sm font-bold tracking-widest shadow-xl border border-mars-glow/40 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>COMMENCE EXPEDITION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
