import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Database,
  ArrowRight,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useMobileDetection } from '../../hooks/useMobileDetection';

interface LandingIntroProps {
  onStart: () => void;
  onOpenProvenance: () => void;
}

type EditorialSection = 'essay' | 'controls' | 'payloads';

interface DustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
}

export const LandingIntro: React.FC<LandingIntroProps> = ({ onStart, onOpenProvenance }) => {
  const [section, setSection] = useState<EditorialSection>('essay');
  const [isMuted, setIsMuted] = useState(false);
  const [solTime, setSolTime] = useState('14:32:08');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mobile = useMobileDetection();

  // Mars Sol Clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String((now.getUTCHours() + 14) % 24).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setSolTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        try {
          audioService.playDiscoveryFound();
        } catch {
          // Ignore
        }
        onStart();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        try {
          audioService.playClick();
        } catch {
          // Ignore
        }
        onOpenProvenance();
      } else if (e.key === '1') {
        setSection('essay');
        try { audioService.playClick(); } catch {}
      } else if (e.key === '2') {
        setSection('controls');
        try { audioService.playClick(); } catch {}
      } else if (e.key === '3') {
        setSection('payloads');
        try { audioService.playClick(); } catch {}
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart, onOpenProvenance]);

  // Ambient Dust Particle Canvas (Soft, cinematic background)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = mobile.isMobile ? 25 : 55;
    const motes: DustMote[] = [];
    const palette = ['#e09867', '#d97746', '#c85a32', '#fbbf24'];

    for (let i = 0; i < count; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0.1 + Math.random() * 0.35,
        vy: -0.08 + (Math.random() - 0.5) * 0.18,
        size: 0.7 + Math.random() * 1.8,
        alpha: Math.random() * 0.5,
        baseAlpha: 0.15 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle editorial hairline horizontal rules across background
      ctx.strokeStyle = 'rgba(243, 194, 153, 0.03)';
      ctx.lineWidth = 1;
      for (let y = 120; y < height; y += 140) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw drifting warm Martian dust
      motes.forEach((m, idx) => {
        m.x += m.vx;
        m.y += m.vy + Math.sin(m.phase) * 0.12;
        m.phase += 0.015;

        if (m.x > width + 10) m.x = -10;
        if (m.x < -10) m.x = width + 10;
        if (m.y > height + 10) m.y = -10;
        if (m.y < -10) m.y = height + 10;

        const col = palette[idx % palette.length];
        const alpha = m.baseAlpha * (0.6 + 0.4 * Math.sin(m.phase));

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.globalAlpha = alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [mobile.isMobile]);

  const handleToggleAudio = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    audioService.setMuted(next);
    if (!next) {
      try {
        audioService.playClick();
      } catch {
        // Ignore
      }
    }
  }, [isMuted]);

  const handleLaunch = () => {
    try {
      audioService.playDiscoveryFound();
    } catch {
      // Ignore
    }
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070504]/94 backdrop-blur-2xl p-2 sm:p-4 md:p-6 select-none overflow-hidden animate-in fade-in duration-500">
      {/* Background Subtle Atmosphere Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Main Editorial Magazine Spread Container */}
      <div className="relative w-full max-w-5xl bg-[#110c0a]/95 border border-white/10 rounded-xl sm:rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[96vh] z-20 backdrop-blur-2xl text-gray-200">
        
        {/* MASTHEAD: Editorial Header Bar */}
        <header className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 bg-[#160f0d]/90 flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-mars-sand/80 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-mars-orange inline-block" />
            <span className="font-bold text-white tracking-wider">THE JEZERO EXPEDITIONARY REVIEW</span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-mars-dust/70">VOL. 01 • ISSUE 1042</span>
          </div>

          <div className="flex items-center space-x-3 text-[9.5px] sm:text-[10px]">
            <span className="hidden md:inline text-mars-dust/60">OCTAVIA E. BUTLER BASE // 18.44°N 77.45°E</span>
            <span className="text-mars-orange font-bold">SOL 142 // {solTime} LST</span>
            <button
              onClick={handleToggleAudio}
              className="p-1 rounded text-mars-sand/70 hover:text-white transition-colors cursor-pointer"
              title="Toggle Audio Feedback"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
          </div>
        </header>

        {/* SCROLLABLE EDITORIAL BODY */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          
          {/* COVER SPREAD: Editorial Title & Headline */}
          <section className="px-4 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b border-white/10 bg-gradient-to-b from-[#18110e]/90 to-[#110c0a]/80">
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-mars-orange font-bold uppercase mb-2">
              <span>SPECIAL FIELD DOSSIER // HUMAN SURFACE SETTLEMENT</span>
              <span className="text-white/40">NASA SPACE APPS 2026</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-[0.18em] sm:tracking-[0.22em] text-[#faf5f0] drop-shadow-[0_2px_15px_rgba(200,90,50,0.3)]">
                  MARSBOUND
                </h1>
                <p className="text-xs sm:text-sm md:text-base font-mono tracking-wider text-mars-sand/90 font-medium">
                  An Expedition Across Jezero Crater's Ancient Lacustrine Delta
                </p>
              </div>

              {/* Lead Editorial Dek Paragraph */}
              <div className="max-w-md lg:text-right lg:border-l lg:border-white/10 lg:pl-6 text-[11px] sm:text-xs font-mono text-gray-300 leading-relaxed">
                Stationed on the Jezero delta scarp, humanity takes its first permanent steps on the Martian surface.
                Built on authentic NASA HiRISE 3D elevation data and Perseverance rover geochemical discoveries.
              </div>
            </div>
          </section>

          {/* EDITORIAL SPECIFICATION STRIP: 4 Key Metrics */}
          <section className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-white/10 bg-[#0d0908] font-mono text-xs">
            <div className="p-3 sm:p-4 space-y-0.5">
              <span className="text-[9px] sm:text-[10px] text-mars-sand/60 uppercase tracking-widest block">01 / GRAVITATIONAL FIELD</span>
              <div className="text-base sm:text-lg font-bold text-white">0.38g</div>
              <span className="text-[10px] text-mars-dust/70 block">3.72 m/s² Surface Accel</span>
            </div>

            <div className="p-3 sm:p-4 space-y-0.5">
              <span className="text-[9px] sm:text-[10px] text-mars-sand/60 uppercase tracking-widest block">02 / ATMOSPHERIC PRESSURE</span>
              <div className="text-base sm:text-lg font-bold text-cyan-300">6.1 hPa</div>
              <span className="text-[10px] text-mars-dust/70 block">95.3% CO₂ • 2.6% N₂</span>
            </div>

            <div className="p-3 sm:p-4 space-y-0.5">
              <span className="text-[9px] sm:text-[10px] text-mars-sand/60 uppercase tracking-widest block">03 / SURFACE THERMAL</span>
              <div className="text-base sm:text-lg font-bold text-amber-300">-63°C</div>
              <span className="text-[10px] text-mars-dust/70 block">Diurnal: -90°C to 0°C</span>
            </div>

            <div className="p-3 sm:p-4 space-y-0.5">
              <span className="text-[9px] sm:text-[10px] text-mars-sand/60 uppercase tracking-widest block">04 / TOPOGRAPHIC DATUM</span>
              <div className="text-base sm:text-lg font-bold text-emerald-300">-2,574 m</div>
              <span className="text-[10px] text-mars-dust/70 block">NASA MOLA Areoid Datum</span>
            </div>
          </section>

          {/* EDITORIAL MAGAZINE GRID: 4 Core Feature Columns */}
          <section className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-white/10 bg-[#120d0b]">
            {/* Column 01: EXPLORATION */}
            <article className="p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:bg-white/[0.02] transition-colors">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-mono font-light text-mars-orange/80">01</span>
                  <span className="text-[9px] font-mono tracking-widest text-mars-sand/60 uppercase">SYS-NAV</span>
                </div>
                <div className="text-[9px] font-mono tracking-[0.2em] text-mars-orange uppercase font-bold">
                  SURFACE CARTOGRAPHY
                </div>
                <h3 className="text-sm font-bold text-white font-mono leading-snug">
                  Traversing the Ancient Delta
                </h3>
                <p className="text-[11px] font-mono text-gray-300 leading-relaxed">
                  Navigate authentic Jezero topography derived from 0.25m/pixel NASA HiRISE stereo pairs. Traverse rocky scarp crests with 0.38g low-gravity hops or pilot the six-wheeled exploration rover across the ancient lakebed.
                </p>
              </div>
              <div className="pt-2 border-t border-white/10 text-[9.5px] font-mono text-mars-dust/70 flex items-center justify-between">
                <span>PAYLOAD: HiRISE DTM</span>
                <span className="text-mars-orange">ACTIVE</span>
              </div>
            </article>

            {/* Column 02: SURVIVAL */}
            <article className="p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:bg-white/[0.02] transition-colors">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-mono font-light text-cyan-400/80">02</span>
                  <span className="text-[9px] font-mono tracking-widest text-cyan-300/60 uppercase">SYS-LIFE</span>
                </div>
                <div className="text-[9px] font-mono tracking-[0.2em] text-cyan-400 uppercase font-bold">
                  LIFE EQUILIBRIUM
                </div>
                <h3 className="text-sm font-bold text-white font-mono leading-snug">
                  Survival at 6.1 Millibars
                </h3>
                <p className="text-[11px] font-mono text-gray-300 leading-relaxed">
                  Manage EVA suit oxygen consumption, power drain, and thermal insulation against cryogenic Martian winds. Return to habitat airlock modules to replenish consumable reserves before life support critical failure.
                </p>
              </div>
              <div className="pt-2 border-t border-white/10 text-[9.5px] font-mono text-mars-dust/70 flex items-center justify-between">
                <span>SYSTEM: CLOSED-LOOP O₂</span>
                <span className="text-cyan-400">NOMINAL</span>
              </div>
            </article>

            {/* Column 03: DISCOVERY */}
            <article className="p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:bg-white/[0.02] transition-colors">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-mono font-light text-emerald-400/80">03</span>
                  <span className="text-[9px] font-mono tracking-widest text-emerald-300/60 uppercase">SYS-GEO</span>
                </div>
                <div className="text-[9px] font-mono tracking-[0.2em] text-emerald-400 uppercase font-bold">
                  GEOCHEMICAL ASSAYS
                </div>
                <h3 className="text-sm font-bold text-white font-mono leading-snug">
                  Interrogating Ancient Strata
                </h3>
                <p className="text-[11px] font-mono text-gray-300 leading-relaxed">
                  Deploy deep-UV Raman lasers and X-ray fluorescence spectrometers to interrogate lacustrine mudstones and olivine-carbonate sands. Collect sealed sediment core samples to evaluate past astrobiological biosignatures.
                </p>
              </div>
              <div className="pt-2 border-t border-white/10 text-[9.5px] font-mono text-mars-dust/70 flex items-center justify-between">
                <span>INSTRUMENT: PIXL + SHERLOC</span>
                <span className="text-emerald-400">STANDBY</span>
              </div>
            </article>

            {/* Column 04: SETTLEMENT / BUILD */}
            <article className="p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:bg-white/[0.02] transition-colors">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-mono font-light text-amber-400/80">04</span>
                  <span className="text-[9px] font-mono tracking-widest text-amber-300/60 uppercase">SYS-ISRU</span>
                </div>
                <div className="text-[9px] font-mono tracking-[0.2em] text-amber-400 uppercase font-bold">
                  IN-SITU FABRICATION
                </div>
                <h3 className="text-sm font-bold text-white font-mono leading-snug">
                  Building Octavia E. Butler Base
                </h3>
                <p className="text-[11px] font-mono text-gray-300 leading-relaxed">
                  Construct photovoltaic solar fields, deploy MOXIE atmospheric oxygen extraction facilities, and assemble pressurized geodesic research domes to expand the permanent footprint of human exploration on Mars.
                </p>
              </div>
              <div className="pt-2 border-t border-white/10 text-[9.5px] font-mono text-mars-dust/70 flex items-center justify-between">
                <span>FACILITY: ISRU POWER GRID</span>
                <span className="text-amber-400">EXPANDABLE</span>
              </div>
            </article>
          </section>

          {/* EDITORIAL FIELD GUIDE TABS (Magazine Section Switcher) */}
          <section className="p-4 sm:p-6 bg-[#0f0a09]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-1 sm:space-x-3 text-[10px] sm:text-xs font-mono uppercase tracking-wider">
                <button
                  onClick={() => setSection('essay')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    section === 'essay'
                      ? 'bg-white/10 text-white font-bold border border-white/20'
                      : 'text-mars-sand/60 hover:text-white'
                  }`}
                >
                  01 // FIELD ESSAY
                </button>
                <button
                  onClick={() => setSection('controls')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    section === 'controls'
                      ? 'bg-white/10 text-white font-bold border border-white/20'
                      : 'text-mars-sand/60 hover:text-white'
                  }`}
                >
                  02 // FLIGHT CONTROLS
                </button>
                <button
                  onClick={() => setSection('payloads')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    section === 'payloads'
                      ? 'bg-white/10 text-white font-bold border border-white/20'
                      : 'text-mars-sand/60 hover:text-white'
                  }`}
                >
                  03 // SCIENCE PAYLOADS
                </button>
              </div>

              <span className="text-[9.5px] font-mono text-mars-dust/50 hidden sm:inline uppercase">
                NASA SPACE APPS RECONNAISSANCE
              </span>
            </div>

            {/* TAB CONTENT 01: FIELD ESSAY */}
            {section === 'essay' && (
              <div className="space-y-3 font-mono text-xs text-gray-300 leading-relaxed animate-in fade-in duration-200">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="text-mars-orange font-bold text-[11px] tracking-wider uppercase flex items-center space-x-2">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>COMMAND DIRECTIVE // FLIGHT CONTROLLER LOG SOL 1042</span>
                  </div>
                  <p className="text-[11.5px] text-gray-300">
                    "Three and a half billion years ago, an energetic river breached the crater rim at Neretva Vallis, dumping sediment into an ancient lake the size of Lake Tahoe. Today, that riverbed is a silent expanse of layered mudstone, olivine dunes, and iron-magnesium smectite clays. Your mandate as Commander of Octavia E. Butler Base is to explore these geological time capsules, test autonomous in-situ resource extraction, and record sample caches that may answer biology’s most profound question: were we ever alone?"
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT 02: FLIGHT CONTROLS */}
            {section === 'controls' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-mono text-xs animate-in fade-in duration-200">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="text-mars-orange font-bold text-[11px] tracking-wider uppercase border-b border-white/10 pb-1.5">
                    ASTRONAUT EVA & VEHICLE CONTROLS
                  </div>
                  <div className="space-y-1.5 text-[10.5px]">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Locomotion (Walk / Steer)</span>
                      <span className="font-bold text-white">[W] [A] [S] [D]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Look & Perspective</span>
                      <span className="font-bold text-white">MOUSE DRAG / CLICK</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Low-Gravity Jump / Leap</span>
                      <span className="font-bold text-white">[SPACE]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Jet-Assist Sprint</span>
                      <span className="font-bold text-white">[SHIFT]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Spectrometer Scan / Board Rover</span>
                      <span className="font-bold text-white">[F]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Toggle Astronaut / Rover</span>
                      <span className="font-bold text-white">[V]</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="text-cyan-300 font-bold text-[11px] tracking-wider uppercase border-b border-white/10 pb-1.5">
                    AVIONICS & HUD SHORTCUTS
                  </div>
                  <div className="space-y-1.5 text-[10.5px]">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tactical GIS Satellite Map</span>
                      <span className="font-bold text-cyan-300">[M]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mars Knowledge Archive</span>
                      <span className="font-bold text-cyan-300">[L]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Outpost Fabrication Grid</span>
                      <span className="font-bold text-cyan-300">[B]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">RIMFAX Ground Penetrating Radar</span>
                      <span className="font-bold text-cyan-300">[R]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expedition Field Missions</span>
                      <span className="font-bold text-cyan-300">[J] / [O]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">EVA Settings & Realistic Sun</span>
                      <span className="font-bold text-cyan-300">[ESC]</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 03: SCIENCE PAYLOADS */}
            {section === 'payloads' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs animate-in fade-in duration-200">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex justify-between text-mars-orange font-bold text-[11px]">
                    <span>PIXL SPECTROMETER</span>
                    <span className="text-[9px] text-white/50">X-RAY BEAM</span>
                  </div>
                  <p className="text-[10.5px] text-gray-300 leading-snug">
                    Planetary Instrument for X-ray Lithochemistry. Maps fine-scale elemental chemistry of rock textures down to 100 micrometers.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex justify-between text-cyan-400 font-bold text-[11px]">
                    <span>SHERLOC RAMAN SPECTRA</span>
                    <span className="text-[9px] text-white/50">DEEP-UV LASER</span>
                  </div>
                  <p className="text-[10.5px] text-gray-300 leading-snug">
                    Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals. Detects aromatic organic compounds.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex justify-between text-emerald-400 font-bold text-[11px]">
                    <span>RIMFAX GROUND RADAR</span>
                    <span className="text-[9px] text-white/50">UWB 150-1200 MHz</span>
                  </div>
                  <p className="text-[10.5px] text-gray-300 leading-snug">
                    Radar Imager for Mars' Subsurface Experiment. Profiles bedrock layers and dielectric anomalies down to 10 meters depth.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex justify-between text-amber-400 font-bold text-[11px]">
                    <span>MOXIE O₂ ELECTROLYSIS</span>
                    <span className="text-[9px] text-white/50">ISRU REFACTOR</span>
                  </div>
                  <p className="text-[10.5px] text-gray-300 leading-snug">
                    Mars Oxygen ISRU Experiment. Demonstrates solid-oxide electrolysis of ambient atmospheric CO₂ into breathable O₂.
                  </p>
                </div>
              </div>
            )}
          </section>

        </div>

        {/* MAGAZINE COLOPHON & ACTION FOOTER */}
        <footer className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-white/10 bg-[#160f0d] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 font-mono text-xs">
          {/* Provenance Link */}
          <button
            onClick={onOpenProvenance}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 text-mars-sand/80 hover:text-white px-3 py-2 rounded-lg border border-white/10 hover:border-white/30 transition-all cursor-pointer text-[11px]"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>NASA Data Provenance & References</span>
            <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-black/60 text-white/60 text-[9px] border border-white/10">P</kbd>
          </button>

          {/* Bold Editorial Launch Button */}
          <button
            onClick={handleLaunch}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-3 rounded-xl bg-gradient-to-r from-mars-red to-mars-orange hover:from-mars-rust hover:to-mars-red text-white font-bold tracking-widest uppercase shadow-[0_4px_25px_rgba(200,90,50,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer text-xs sm:text-sm"
          >
            <span>COMMENCE EXPEDITION</span>
            <ArrowRight className="w-4 h-4 ml-1" />
            <kbd className="hidden lg:inline text-[9px] bg-black/30 border border-white/20 px-1.5 py-0.5 rounded text-white/80">
              ENTER
            </kbd>
          </button>
        </footer>

      </div>
    </div>
  );
};
