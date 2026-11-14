import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Clock,
  MapPin,
  Flame,
  Sun,
  ExternalLink,
  Calendar,
  Sliders,
  Eye,
  Check
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface MarsLocationProfile {
  id: string;
  name: string;
  region: string;
  coords: string;
  altitude: string;
  tempCurrent: number;
  tempMin: number;
  tempMax: number;
  tempScaleHeight: number;
  pressureMbar: number;
  windSpeedKmh: number;
  windDirDeg: number;
  windDirLabel: string;
  tau: number;
  iceTau: number;
  visibilityKm: number;
  uvIndex: number;
  closestAsset: {
    name: string;
    flag: string;
    distance: string;
    operationalSince: string;
    coords: string;
    image: string;
  };
}

const MARS_LOCATIONS: Record<string, MarsLocationProfile> = {
  syrtis_major: {
    id: 'syrtis_major',
    name: 'Syrtis Major',
    region: 'Syrtis Major Planum',
    coords: '9.9°N 70°E',
    altitude: '1624 m',
    tempCurrent: -78,
    tempMin: -87,
    tempMax: -25,
    tempScaleHeight: -79,
    pressureMbar: 5.371,
    windSpeedKmh: 39,
    windDirDeg: 12,
    windDirLabel: 'NNE',
    tau: 0.333,
    iceTau: 0.051,
    visibilityKm: 9.9,
    uvIndex: 0,
    closestAsset: {
      name: 'Perseverance Rover',
      flag: '🇺🇸',
      distance: '661.6 km away',
      operationalSince: '2021-02-18',
      coords: '18.4447°N 77.4508°E',
      image: 'https://images-assets.nasa.gov/image/PIA24422/PIA24422~orig.jpg'
    }
  },
  jezero_crater: {
    id: 'jezero_crater',
    name: 'Jezero Crater',
    region: 'Western Delta / Octavia Base',
    coords: '18.4447°N 77.4508°E',
    altitude: '-2568 m',
    tempCurrent: -72,
    tempMin: -82,
    tempMax: -18,
    tempScaleHeight: -75,
    pressureMbar: 6.142,
    windSpeedKmh: 24,
    windDirDeg: 115,
    windDirLabel: 'ESE',
    tau: 0.384,
    iceTau: 0.042,
    visibilityKm: 12.4,
    uvIndex: 0,
    closestAsset: {
      name: 'Perseverance Rover & Base',
      flag: '🇺🇸',
      distance: '0.0 km (Current Site)',
      operationalSince: '2021-02-18',
      coords: '18.4447°N 77.4508°E',
      image: 'https://images-assets.nasa.gov/image/PIA24422/PIA24422~orig.jpg'
    }
  },
  gale_crater: {
    id: 'gale_crater',
    name: 'Gale Crater',
    region: 'Aeolis Palus / Mt. Sharp',
    coords: '4.5895°S 137.4417°E',
    altitude: '-4450 m',
    tempCurrent: -65,
    tempMin: -76,
    tempMax: -12,
    tempScaleHeight: -68,
    pressureMbar: 7.824,
    windSpeedKmh: 18,
    windDirDeg: 245,
    windDirLabel: 'WSW',
    tau: 0.412,
    iceTau: 0.038,
    visibilityKm: 14.2,
    uvIndex: 0,
    closestAsset: {
      name: 'Curiosity Rover',
      flag: '🇺🇸',
      distance: '3,740 km away',
      operationalSince: '2012-08-06',
      coords: '4.5895°S 137.4417°E',
      image: 'https://images-assets.nasa.gov/image/PIA16239/PIA16239~orig.jpg'
    }
  }
};

export const MarsWeatherClimatePanel: React.FC = () => {
  const [selectedLocKey, setSelectedLocKey] = useState<string>('syrtis_major');
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);

  // Map layer toggles
  const [showWinds, setShowWinds] = useState<boolean>(true);
  const [showPois, setShowPois] = useState<boolean>(true);
  const [showTopo, setShowTopo] = useState<boolean>(true);

  const loc = MARS_LOCATIONS[selectedLocKey] || MARS_LOCATIONS.syrtis_major;

  // Streamline Animation Canvas
  const mapCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = canvas.width;
    const height = canvas.height;

    // Particle streamlines setup
    const numParticles = 130;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.6 + Math.random() * 1.4,
      length: 12 + Math.random() * 18,
      age: Math.random() * 100
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (showWinds) {
        ctx.lineWidth = 1.2;
        for (const p of particles) {
          p.age += 1;
          if (p.age > 120 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
            p.x = Math.random() * (width * 0.4);
            p.y = Math.random() * height;
            p.age = 0;
          }

          // Flow vector field across Syrtis Major into Isidis basin
          const nx = p.x / width;
          const ny = p.y / height;
          const angle = -0.35 + Math.sin(nx * Math.PI + ny * 1.5) * 0.45;
          const dx = Math.cos(angle) * p.speed * 2.2;
          const dy = Math.sin(angle) * p.speed * 1.5;

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - dx * (p.length * 0.15), p.y - dy * (p.length * 0.15));

          const alpha = Math.min(1, Math.sin((p.age / 120) * Math.PI)) * 0.75;
          ctx.strokeStyle = `rgba(180, 245, 200, ${alpha})`;
          ctx.stroke();

          p.x += dx;
          p.y += dy;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [showWinds]);

  return (
    <div className="w-full bg-[#181516] text-zinc-100 rounded-3xl overflow-hidden shadow-2xl border border-white/5 font-sans p-3 sm:p-5 select-none space-y-4">
      
      {/* Top Header: Cursive Goddard Signature Script + Mars Explorer + Subtitle & Region Quick Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-white/10 text-xs gap-3">
        <div className="flex items-center space-x-3">
          {/* Cursive "Goddard" Signature Script replaces NASA meatball */}
          {/* <MarsExplorerSignatureScript /> */} 
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display leading-none">
              Real Weather & Climate of Mars
            </h1>
            <p className="text-[11px] text-zinc-400 font-sans tracking-wide mt-1">
              Climatological data based on LMD/EMARS MY32 Moderate dust
            </p>
          </div>
        </div>

        {/* Region Quick Selector Pills & PSG Link */}
        <div className="flex items-center space-x-2 flex-wrap">
          <div className="flex items-center bg-[#221f20] p-1 rounded-xl border border-white/5 space-x-1">
            {Object.values(MARS_LOCATIONS).map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedLocKey(l.id);
                  audioService.playClick();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedLocKey === l.id
                    ? 'bg-orange-600/30 text-orange-400 font-bold border border-orange-500/50'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>

          <a
            href="https://psg.gsfc.nasa.gov/apps/mars/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/40 text-xs font-mono font-bold transition-all shadow-sm"
          >
            <span>NASA PSG</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Dashboard Cards Grid (Full Width, No Side Navigation) */}
      <div className="w-full space-y-4">

        {/* Location Picker Dropdown Banner (if opened) */}
        {showLocationPicker && (
          <div className="p-3 bg-[#231f21] rounded-2xl border border-orange-500/40 flex flex-wrap items-center gap-2 text-xs animate-in fade-in duration-200">
            <span className="text-zinc-400 font-mono text-[11px] mr-2">SELECT MARS REGION:</span>
            {Object.values(MARS_LOCATIONS).map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedLocKey(l.id);
                  setShowLocationPicker(false);
                  audioService.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  selectedLocKey === l.id
                    ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                    : 'bg-black/30 hover:bg-white/10 text-zinc-300'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{l.name}</span>
                {selectedLocKey === l.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* ROW 1: PRIMARY WEATHER CARDS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          
          {/* Card 1 (Left Column, 5 cols): Main Temp, Ephemeris & Closest Rover */}
          <div className="lg:col-span-5 bg-[#221f20] rounded-2xl p-4 sm:p-5 border border-white/5 flex flex-col justify-between space-y-4">
            
            {/* Dust Cloud Graphic + Primary Big Temp */}
            <div className="flex items-center justify-between">
              <DustStormIllustration className="w-36 h-20 shrink-0" />
              <div className="text-right">
                <div className="text-5xl sm:text-6xl font-light tracking-tighter text-white font-sans">
                  {loc.tempCurrent}°<span className="text-2xl font-normal text-zinc-400">C</span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  Surface at {loc.tempMin}°C and {loc.tempScaleHeight}°C at a scaleheight above
                </div>
              </div>
            </div>

            {/* Orbital Calendar & Ephemeris Data */}
            <div className="text-xs text-zinc-300 space-y-1 font-sans border-t border-white/5 pt-3">
              <div className="text-zinc-400 text-[11px]">NH Spring, aphelion at LS:71</div>
              <div className="flex items-center space-x-2 text-zinc-200">
                <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>MY39, Sol 44 01:02 MTC (Ls 21.81)</span>
              </div>
              <div className="text-[11px] text-zinc-400 pl-5.5">
                JD 2461359.0037 (11 mins delay to Earth)
              </div>
              <div className="text-[11px] text-zinc-400 pl-5.5">
                2026, November 14 12:05 UT
              </div>
            </div>

            {/* Geographic Region Badge (Clickable to switch region) */}
            <div
              onClick={() => {
                setShowLocationPicker(!showLocationPicker);
                audioService.playClick();
              }}
              className="flex items-start space-x-2 text-xs text-zinc-300 pt-1 border-t border-white/5 cursor-pointer hover:bg-white/5 p-1 rounded-lg transition"
              title="Click to switch Mars region"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>{loc.name}, Mars</span>
                  <span className="text-[10px] text-orange-400 font-mono">Switch Region ▾</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  {loc.coords} Altitude: {loc.altitude}
                </div>
              </div>
            </div>

            {/* Closest Rover Surface Asset Card */}
            <div className="p-3 bg-[#1a1718] rounded-xl border border-white/5 flex items-center space-x-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-white/10 relative">
                <img
                  src="https://images-assets.nasa.gov/image/PIA24422/PIA24422~orig.jpg"
                  alt="Perseverance Rover"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://mars.nasa.gov/system/resources/detail_files/25640_PIA24422-web.jpg';
                  }}
                />
                <span className="absolute top-1 right-1 text-xs">🇺🇸</span>
              </div>
              <div className="text-[11px] leading-snug">
                <span className="font-bold text-white block">
                  {loc.closestAsset.name} {loc.closestAsset.flag}
                </span>
                <span className="text-zinc-400 block">
                  is closest surface asset ({loc.closestAsset.distance}). Operational since {loc.closestAsset.operationalSince}.
                </span>
                <span className="text-zinc-500 font-mono text-[10px] block mt-0.5">
                  Location {loc.closestAsset.coords}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): 4 Metric Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 2: Wind and Pressure Gauges */}
            <div className="bg-[#221f20] rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-xs text-zinc-400 font-medium">
                <Wind className="w-3.5 h-3.5" />
                <span>Wind and Pressure</span>
              </div>

              <div className="flex items-center justify-around py-3">
                {/* Wind Compass Dial */}
                <WindCompassGauge speedKmh={loc.windSpeedKmh} bearingDeg={loc.windDirDeg} />

                {/* Pressure Dial */}
                <PressureArcGauge pressureMbar={loc.pressureMbar} />
              </div>

              <div className="text-[11px] text-zinc-400 text-center border-t border-white/5 pt-2">
                Normal wind conditions at this location
              </div>
            </div>

            {/* Card 3: Dust and Visibility */}
            <div className="bg-[#221f20] rounded-2xl p-4 border border-white/5 flex flex-col justify-between space-y-3">
              <div className="flex items-center space-x-1.5 text-xs text-zinc-400 font-medium">
                <Eye className="w-3.5 h-3.5" />
                <span>Dust and Visibility</span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-light text-white font-sans">{loc.visibilityKm}</span>
                <span className="text-xs text-zinc-400">km</span>
                <span className="text-xs font-semibold text-zinc-200">Moderate visibility</span>
              </div>

              {/* Dust Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-300">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Flame className="w-3 h-3 text-orange-400" /> Dust
                  </span>
                  <span className="font-mono text-zinc-300">{loc.tau}</span>
                </div>
                <div className="relative h-2 rounded-full bg-gradient-to-r from-orange-950 via-amber-700 to-orange-500 overflow-visible">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-zinc-900 shadow-md"
                    style={{ left: `${Math.min(95, Math.max(5, (loc.tau / 1.0) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Ice Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-300">
                  <span className="flex items-center gap-1 text-zinc-400">
                    ❄ Ice
                  </span>
                  <span className="font-mono text-zinc-300">{loc.iceTau}</span>
                </div>
                <div className="relative h-2 rounded-full bg-gradient-to-r from-blue-950 via-slate-600 to-cyan-400 overflow-visible">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-zinc-900 shadow-md"
                    style={{ left: `${Math.min(95, Math.max(5, (loc.iceTau / 0.2) * 100))}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 border-t border-white/5 pt-2">
                7.5 pr-um of water vapor above
              </div>
            </div>

            {/* Card 4: Sunrise and Sunset + Terminator Shaded Globe */}
            <div className="bg-[#221f20] rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-xs text-zinc-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Sunrise and Sunset</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-2">
                  <div className="text-2xl font-light text-white font-mono">05:42</div>
                  <SunriseSunsetArc sunrise="06:19" sunset="18:32" />
                </div>

                {/* Shaded Mars Day/Night Globe */}
                <TerminatorMarsGlobe />
              </div>

              <div className="text-[10px] text-zinc-400 border-t border-white/5 pt-2 leading-relaxed">
                Times in Local Mean Solar Time (LMST). MTC is 01:02 and LTST is 05:16.
              </div>
            </div>

            {/* Card 5: UV Radiation Levels */}
            <div className="bg-[#221f20] rounded-2xl p-4 border border-white/5 flex flex-col justify-between space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-zinc-400 font-medium">
                <Sun className="w-3.5 h-3.5 text-orange-400" />
                <span>UV Radiation Levels</span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-light text-white font-sans">{loc.uvIndex}</span>
                <span className="text-xs font-semibold text-zinc-200">Low risk</span>
              </div>

              {/* Horizontal UV spectrum gradient */}
              <div className="relative h-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-600 overflow-visible">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-zinc-900 shadow-md"
                  style={{ left: `${Math.min(95, Math.max(5, (loc.uvIndex / 10) * 100))}%` }}
                />
              </div>

              <p className="text-[10px] text-zinc-400 leading-snug border-t border-white/5 pt-2">
                The local UV radiation field is being affected by the aerosols column (τ {loc.tau}), the local pressure, the atmospheric composition, the heliocentric distance (1.608 AU) and the local time.
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* ROW 2: HORIZONTAL 24-HOUR FORECAST STRIP */}
        {/* ========================================================= */}
        <div className="bg-[#221f20] rounded-2xl p-4 border border-white/5 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700">
          <div className="min-w-[920px] flex items-center justify-between text-center">
            {HOURLY_DIURNAL_FORECAST.map((slot, idx) => (
              <div key={idx} className="flex-1 px-1 flex flex-col items-center space-y-1.5">
                <span className={`text-[11px] font-sans ${idx === 0 ? 'font-bold text-white' : 'text-zinc-400'}`}>
                  {slot.hour}
                </span>
                <DustStormIcon className="w-6 h-4 text-zinc-300" />
                <span className="text-[11px] font-mono font-medium text-zinc-200">
                  {slot.temp}°C
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ROW 3: 5-SOL EXTENDED FORECAST + INTERACTIVE MARS WIND MAP */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column (5 cols): 5-Sol Forecast List */}
          <div className="lg:col-span-5 bg-[#221f20] rounded-2xl p-4 border border-white/5 space-y-2.5">
            {EXTENDED_SOL_FORECAST.map((sol, index) => (
              <div
                key={index}
                className="p-3 bg-[#1c191a] rounded-xl border border-white/5 flex items-center justify-between text-xs gap-2"
              >
                <span className="font-semibold text-white w-14 shrink-0 font-sans">
                  {sol.label}
                </span>

                <DustStormIcon className="w-7 h-5 text-zinc-300 shrink-0" />

                <div className="text-[10px] text-zinc-400 leading-tight space-y-0.5 shrink-0">
                  <div>⏱ &lt; {sol.pressure} mbar</div>
                  <div>💨 &lt; {sol.windSpeed} km/h</div>
                  <div>☁ &lt; {sol.tau} tau</div>
                </div>

                {/* Temp Gradient Slider Bar */}
                <div className="flex flex-col items-end w-32 shrink-0">
                  <div className="text-[10px] font-mono text-zinc-300 mb-0.5">
                    {sol.tempMax}°C
                  </div>
                  <div className="relative w-full h-2 rounded-full bg-gradient-to-r from-cyan-600 via-emerald-500 to-rose-600">
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-sm" />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-sm" />
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 mt-0.5">
                    {sol.tempMin}°C
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (7 cols): Interactive Mars Topography & Wind Streamline Map */}
          <div className="lg:col-span-7 bg-[#221f20] rounded-2xl p-4 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
            
            {/* Map Canvas Background (Heatmap + Wind Streamlines) */}
            <div className="absolute inset-0 z-0">
              {showTopo && (
                <div
                  className="w-full h-full opacity-80"
                  style={{
                    background: 'radial-gradient(circle at 75% 65%, #059669 0%, #10b981 25%, #0284c7 60%, #0369a1 100%)',
                    filter: 'contrast(1.15) brightness(0.85)'
                  }}
                />
              )}
              <canvas
                ref={mapCanvasRef}
                width={680}
                height={380}
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Map Point of Interest Overlay Markers */}
            {showPois && (
              <div className="relative z-10 w-full h-full pointer-events-none">
                {/* Cassini Crater */}
                <div className="absolute top-[18%] left-[24%] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-[11px] font-sans text-white/90 drop-shadow">.Cassini Crater</span>
                </div>

                {/* Syrtis Major */}
                <div className="absolute top-[68%] left-[48%] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-[11px] font-sans text-white/90 drop-shadow">.Syrtis Major</span>
                </div>

                {/* Perseverance Rover / Jezero Crater (Highlighted) */}
                <div className="absolute top-[42%] left-[68%] flex items-center space-x-1 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                  <span className="text-[11px] font-bold text-amber-300 drop-shadow-md">
                    .Perseverance Rover
                  </span>
                </div>

                {/* Isidis Planitia */}
                <div className="absolute top-[62%] left-[75%] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-[11px] font-sans text-white/80 drop-shadow">.Isidis Planitia</span>
                </div>

                {/* Beagle 2 Lander */}
                <div className="absolute top-[66%] left-[78%] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                  <span className="text-[10px] font-sans text-zinc-300/80 drop-shadow">
                    Beagle 2 Lander (crash)
                  </span>
                </div>

                {/* Zhurong Rover */}
                <div className="absolute top-[12%] right-[8%] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#38bdf8]" />
                  <span className="text-[11px] font-bold text-cyan-300 drop-shadow">.Zhurong Rover</span>
                </div>
              </div>
            )}

            {/* Bottom Overlays: Legend & Toggles */}
            <div className="relative z-10 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 pt-4 border-t border-white/10 mt-auto">
              
              {/* Wind Velocity Scale Legend */}
              <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                <span className="px-2.5 py-1 rounded-lg bg-orange-700 text-white font-bold text-[11px] shadow">
                  Winds
                </span>
                <div className="space-y-1">
                  <div className="text-[10px] text-zinc-300 font-mono">Wind (0 to 100 km/h)</div>
                  <div className="w-36 h-2 rounded-full bg-gradient-to-r from-blue-500 via-green-400 via-yellow-400 to-red-600" />
                </div>
              </div>

              {/* Layer Toggle Switches */}
              <div className="bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center space-x-3 text-xs">
                <div className="flex flex-col space-y-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-[11px] text-zinc-300 w-10">Winds</span>
                    <input
                      type="checkbox"
                      checked={showWinds}
                      onChange={(e) => setShowWinds(e.target.checked)}
                      className="rounded accent-orange-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-[11px] text-zinc-300 w-10">POIs</span>
                    <input
                      type="checkbox"
                      checked={showPois}
                      onChange={(e) => setShowPois(e.target.checked)}
                      className="rounded accent-orange-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-[11px] text-zinc-300 w-10">Topo</span>
                    <input
                      type="checkbox"
                      checked={showTopo}
                      onChange={(e) => setShowTopo(e.target.checked)}
                      className="rounded accent-orange-500 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="flex items-center space-x-1 pl-2 border-l border-white/10">
                  <button
                    onClick={() => {
                      setShowWinds(true);
                      setShowPois(true);
                      setShowTopo(true);
                      audioService.playClick();
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                    title="Reset Layers"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLocKey('jezero_crater');
                      audioService.playClick();
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                    title="Center on Perseverance"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

// =========================================================================
// SUBCOMPONENTS & GAUGES
// =========================================================================

/**
 * Authentic Cursive "Goddard" Signature Script
 * Styled after Dr. Robert H. Goddard's cursive signature
 */
function MarsExplorerSignatureScript() {
  return (
    <div className="flex items-center">
      <span
        className="text-3xl sm:text-4xl text-white font-normal italic tracking-wide drop-shadow-md pr-1.5 select-none"
        style={{
          fontFamily: '"Caveat", "Brush Script MT", "Dancing Script", "Segoe Script", "Apple Chancery", cursive',
          lineHeight: '1',
          letterSpacing: '0.04em',
          transform: 'rotate(-2deg)'
        }}
      >
        Mars Explorer
      </span>
    </div>
  );
}

/**
 * Circular 360-degree Wind Compass Dial
 */
function WindCompassGauge({ speedKmh, bearingDeg }: { speedKmh: number; bearingDeg: number }) {
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Outer Tick Ring */}
        {ticks.map((deg) => {
          const isCardinal = deg % 90 === 0;
          return (
            <line
              key={deg}
              x1="50"
              y1={isCardinal ? '8' : '12'}
              x2="50"
              y2="15"
              stroke={isCardinal ? '#ffffff' : '#52525b'}
              strokeWidth={isCardinal ? '1.8' : '0.8'}
              transform={`rotate(${deg} 50 50)`}
            />
          );
        })}

        {/* Cardinal Direction Letters */}
        <text x="50" y="24" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">N</text>
        <text x="82" y="53" textAnchor="middle" fill="#a1a1aa" fontSize="7" fontWeight="bold">E</text>
        <text x="50" y="82" textAnchor="middle" fill="#a1a1aa" fontSize="7" fontWeight="bold">S</text>
        <text x="18" y="53" textAnchor="middle" fill="#a1a1aa" fontSize="7" fontWeight="bold">W</text>

        {/* Direction Indicator Needle (Arrow) */}
        <g transform={`rotate(${bearingDeg} 50 50)`}>
          <polygon points="50,16 46,30 54,30" fill="#f97316" />
          <polygon points="50,84 47,70 53,70" fill="#ea580c" />
        </g>

        {/* Center Speed Value */}
        <text x="50" y="49" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
          {speedKmh}
        </text>
        <text x="50" y="59" textAnchor="middle" fill="#a1a1aa" fontSize="7">
          km/h
        </text>
      </svg>
    </div>
  );
}

/**
 * Pressure Arc Dial (Low | High with upward arrow needle)
 */
function PressureArcGauge({ pressureMbar }: { pressureMbar: number }) {
  const ticks = Array.from({ length: 25 }, (_, i) => -120 + i * 10);

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Radial Arc Ticks */}
        {ticks.map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="10"
            x2="50"
            y2="16"
            stroke="#71717a"
            strokeWidth="1.2"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}

        {/* Center Upward Indicator Needle */}
        <polygon points="50,22 46,36 54,36" fill="#f97316" />
        <line x1="50" y1="26" x2="50" y2="44" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />

        {/* Center Reading */}
        <text x="50" y="58" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
          {pressureMbar.toFixed(3)}
        </text>
        <text x="50" y="67" textAnchor="middle" fill="#a1a1aa" fontSize="7">
          mbar
        </text>

        {/* Low | High Range Labels */}
        <text x="24" y="86" textAnchor="middle" fill="#71717a" fontSize="6">
          Low
        </text>
        <text x="76" y="86" textAnchor="middle" fill="#71717a" fontSize="6">
          High
        </text>
      </svg>
    </div>
  );
}

/**
 * Celestial Sun Trajectory Arc Graphic
 */
function SunriseSunsetArc({ sunrise, sunset }: { sunrise: string; sunset: string }) {
  return (
    <div className="w-32 h-14 relative">
      <svg viewBox="0 0 120 50" className="w-full h-full overflow-visible">
        {/* Baseline */}
        <line x1="10" y1="40" x2="110" y2="40" stroke="#3f3f46" strokeWidth="1" />

        {/* Dotted Arch */}
        <path
          d="M 15 40 Q 60 4 105 40"
          fill="none"
          stroke="#71717a"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />

        {/* Sun on curve at ~05:42 */}
        <circle cx="34" cy="24" r="4.5" fill="#f97316" stroke="#ffffff" strokeWidth="1" />

        {/* Sunrise marker */}
        <text x="22" y="48" textAnchor="middle" fill="#a1a1aa" fontSize="7" fontFamily="monospace">
          {sunrise}
        </text>

        {/* Sunset marker */}
        <text x="98" y="48" textAnchor="middle" fill="#a1a1aa" fontSize="7" fontFamily="monospace">
          {sunset}
        </text>
      </svg>
    </div>
  );
}

/**
 * Day/Night Terminator Shaded Mars Globe with Pin
 */
function TerminatorMarsGlobe() {
  return (
    <div className="w-16 h-16 relative shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full">
        {/* Dark night hemisphere base */}
        <circle cx="40" cy="40" r="30" fill="#090708" stroke="#3f3f46" strokeWidth="0.8" />

        {/* Illuminated Day Crescent */}
        <path
          d="M 40 10 A 30 30 0 0 1 40 70 A 18 30 0 0 0 40 10 Z"
          fill="#c2410c"
        />

        {/* Soft shadow terminator blur overlay */}
        <path
          d="M 40 10 A 20 30 0 0 1 40 70 Z"
          fill="rgba(0, 0, 0, 0.45)"
        />

        {/* Location Pin */}
        <circle cx="36" cy="38" r="2.5" fill="#ffffff" stroke="#000" strokeWidth="0.8" />
        <line x1="36" y1="40" x2="36" y2="44" stroke="#ffffff" strokeWidth="1" />
      </svg>
    </div>
  );
}

/**
 * Layered Dust Storm Cloud Illustration
 */
function DustStormIllustration({ className = 'w-32 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 80" className={className}>
      <defs>
        <linearGradient id="dustGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#d97706" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="dustGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#451a03" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#92400e" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Atmospheric dust storm wisps */}
      <ellipse cx="80" cy="40" rx="70" ry="14" fill="url(#dustGrad1)" />
      <ellipse cx="75" cy="34" rx="58" ry="11" fill="url(#dustGrad2)" />
      <ellipse cx="86" cy="46" rx="64" ry="10" fill="url(#dustGrad1)" />

      {/* Floating dust particles */}
      <circle cx="35" cy="32" r="1.2" fill="#fde68a" opacity="0.8" />
      <circle cx="58" cy="26" r="1.5" fill="#fde68a" opacity="0.9" />
      <circle cx="95" cy="36" r="1.8" fill="#fde68a" opacity="0.75" />
      <circle cx="120" cy="44" r="1.3" fill="#fde68a" opacity="0.8" />
      <circle cx="108" cy="24" r="1.1" fill="#fde68a" opacity="0.6" />
    </svg>
  );
}

/**
 * Small Dust Storm Cloud Icon for tables
 */
function DustStormIcon({ className = 'w-5 h-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 20" className={className}>
      <ellipse cx="20" cy="10" rx="18" ry="4.5" fill="#d97706" opacity="0.8" />
      <ellipse cx="18" cy="7" rx="14" ry="3.5" fill="#f59e0b" opacity="0.7" />
    </svg>
  );
}

// =========================================================================
// MOCK DIURNAL AND EXTENDED DATA MATCHING GODDARD EXPLORER
// =========================================================================

const HOURLY_DIURNAL_FORECAST = [
  { hour: 'Now', temp: -78 },
  { hour: '06:00', temp: -77 },
  { hour: '07:00', temp: -73 },
  { hour: '08:00', temp: -64 },
  { hour: '09:00', temp: -55 },
  { hour: '10:00', temp: -46 },
  { hour: '11:00', temp: -37 },
  { hour: '12:00', temp: -32 },
  { hour: '13:00', temp: -28 },
  { hour: '14:00', temp: -26 },
  { hour: '15:00', temp: -25 },
  { hour: '16:00', temp: -25 },
  { hour: '17:00', temp: -28 },
  { hour: '18:00', temp: -38 },
  { hour: '19:00', temp: -47 },
  { hour: '20:00', temp: -55 },
  { hour: '21:00', temp: -60 },
  { hour: '22:00', temp: -64 },
  { hour: '23:00', temp: -67 },
  { hour: '00:00', temp: -70 },
  { hour: '01:00', temp: -74 },
  { hour: '02:00', temp: -77 },
  { hour: '03:00', temp: -79 },
  { hour: '04:00', temp: -80 }
];

const EXTENDED_SOL_FORECAST = [
  {
    label: 'Today',
    pressure: '5.69',
    windSpeed: '77',
    tau: '0.588',
    tempMin: -80,
    tempMax: -25
  },
  {
    label: '+1 sol',
    pressure: '5.66',
    windSpeed: '71',
    tau: '0.572',
    tempMin: -80,
    tempMax: -23
  },
  {
    label: '+2 sol',
    pressure: '5.68',
    windSpeed: '78',
    tau: '0.527',
    tempMin: -78,
    tempMax: -25
  },
  {
    label: '+3 sol',
    pressure: '5.75',
    windSpeed: '61',
    tau: '0.614',
    tempMin: -79,
    tempMax: -24
  },
  {
    label: '+4 sol',
    pressure: '5.90',
    windSpeed: '74',
    tau: '0.598',
    tempMin: -80,
    tempMax: -21
  }
];
