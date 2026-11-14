import React, { useState, useMemo } from 'react';
import {
  MARS_FACTSHEET,
  MARS_ATMOSPHERE_GASES,
  MARS_GEOLOGICAL_PROVINCES,
  MARS_MOONS,
  NASA_MARS_DIGITAL_RESOURCES,
  NASA_MISSION_DATASETS,
  calculateCurrentMarsWeather,
  NASA_MARS_DOCUMENTS,
  NASA_MARS_WEB_PAGES,
  MARS_IMAGE_GALLERY,
  MarsGalleryImage
} from '../../data/marsLibraryData';
import { audioService } from '../../services/audioService';
import {
  BookOpen,
  Database,
  CloudSun,
  FileText,
  Globe,
  Image as ImageIcon,
  Search,
  ExternalLink,
  X,
  Thermometer,
  Wind,
  Sun,
  Maximize2,
  Sparkles,
  ChevronRight,
  Info,
  Flame,
  Layers,
  Compass,
  Cpu
} from 'lucide-react';

interface MarsLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LibraryTab =
  | 'overview'
  | 'digital_resources'
  | 'datasets'
  | 'weather'
  | 'documents'
  | 'web_directory'
  | 'gallery';

export const MarsLibraryModal: React.FC<MarsLibraryModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<LibraryTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<MarsGalleryImage | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>('All');

  // Real-time weather snapshot calibrated via PSG / MEDA
  const currentWeather = useMemo(() => calculateCurrentMarsWeather(), []);

  if (!isOpen) return null;

  const handleTabChange = (tab: LibraryTab) => {
    setActiveTab(tab);
    audioService.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl h-[94vh] bg-gradient-to-b from-[#0d131f] via-[#090d16] to-[#06080e] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(14,165,233,0.18)] overflow-hidden flex flex-col font-sans text-gray-200">
        
        {/* ========================================================= */}
        {/* TOP ARCHIVAL COMMAND HEADER */}
        {/* ========================================================= */}
        <header className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-950/80 shrink-0 gap-3">
          <div className="flex items-center space-x-3.5 w-full sm:w-auto">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-400/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded">
                  NASA Planetary Repository
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  ARCHIVES ONLINE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-display tracking-wide text-white flex items-center gap-2">
                MARS ARCHIVAL LIBRARY & RESEARCH FACILITY
              </h1>
            </div>
          </div>

          {/* Search Bar & Close Button */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-900/90 border border-cyan-500/30 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
              />
            </div>
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer shrink-0"
              title="Close Library [L / Esc]"
            >
              <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-cyan-300">
                L / Esc
              </span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* MAIN NAVIGATION TAB BAR */}
        {/* ========================================================= */}
        <nav className="flex items-center space-x-1 px-4 py-2 bg-slate-950/60 border-b border-cyan-950 overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-900 shrink-0">
          {[
            { id: 'overview', label: 'About Mars', icon: Sparkles },
            { id: 'digital_resources', label: 'NASA Digital Resources', icon: Cpu },
            { id: 'datasets', label: 'NASA Mars Datasets', icon: Database },
            { id: 'weather', label: 'Real Weather & Climate (PSG)', icon: CloudSun },
            { id: 'documents', label: 'Documents & Journals', icon: FileText },
            { id: 'web_directory', label: 'NASA Web Portals', icon: Globe },
            { id: 'gallery', label: 'Mars Image Gallery', icon: ImageIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as LibraryTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ========================================================= */}
        {/* TAB CONTENT CONTAINER (SCROLLABLE) */}
        {/* ========================================================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-900/60">

          {/* TAB 1: ALL ABOUT MARS (PLANETARY COMPENDIUM) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Planetary Hero Summary Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-slate-900/40 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Planetary Dossier: {MARS_FACTSHEET.name}</span>
                  </div>
                  <h2 className="text-2xl font-bold font-display text-white">
                    The Red Planet: Sol IV Complete Compendium
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    Mars is the second smallest planet in the Solar System, possessing half Earth’s diameter, 
                    38% of Earth’s surface gravity, and a rarefied carbon dioxide atmosphere. It preserves 
                    a 4.5-billion-year geologic record spanning ancient warm, watery epochs (Noachian) to 
                    the hyper-arid frozen deserts of the present day (Amazonian).
                  </p>
                </div>

                {/* Key Metrics Quick Pill */}
                <div className="grid grid-cols-2 gap-3 w-full md:w-auto font-mono text-xs shrink-0">
                  <div className="p-3 bg-slate-900/80 border border-cyan-500/20 rounded-xl">
                    <span className="text-slate-400 text-[10px] block">SURFACE GRAVITY</span>
                    <span className="text-cyan-300 font-bold text-sm">3.72 m/s² (0.38 g)</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 border border-cyan-500/20 rounded-xl">
                    <span className="text-slate-400 text-[10px] block">SOL DURATION</span>
                    <span className="text-cyan-300 font-bold text-sm">24h 39m 35s</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 border border-cyan-500/20 rounded-xl">
                    <span className="text-slate-400 text-[10px] block">ORBITAL YEAR</span>
                    <span className="text-cyan-300 font-bold text-sm">686.98 Earth Days</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 border border-cyan-500/20 rounded-xl">
                    <span className="text-slate-400 text-[10px] block">AXIAL TILT</span>
                    <span className="text-cyan-300 font-bold text-sm">25.19° (Earth-like)</span>
                  </div>
                </div>
              </div>

              {/* Physical & Orbital Factsheet Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Physical, Geodetic & Orbital Parameters</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                  {[
                    { label: 'EQUATORIAL DIAMETER', val: `${MARS_FACTSHEET.diameterKm.toLocaleString()} km` },
                    { label: 'PLANETARY MASS', val: MARS_FACTSHEET.massKg },
                    { label: 'ESCAPE VELOCITY', val: `${MARS_FACTSHEET.escapeVelocityKms} km/s` },
                    { label: 'MEAN DENSITY', val: `${MARS_FACTSHEET.meanDensityGcm3} g/cm³` },
                    { label: 'SEMI-MAJOR AXIS', val: `${MARS_FACTSHEET.semiMajorAxisAU} AU (227.9M km)` },
                    { label: 'PERIHELION / APHELION', val: `${MARS_FACTSHEET.perihelionAU} / ${MARS_FACTSHEET.aphelionAU} AU` },
                    { label: 'ORBITAL ECCENTRICITY', val: MARS_FACTSHEET.orbitalEccentricity.toString() },
                    { label: 'SURFACE TEMPERATURE', val: `${MARS_FACTSHEET.meanSurfaceTempCelsius}°C (-140°C to +20°C)` }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{item.label}</span>
                      <span className="text-white font-bold">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atmospheric Composition Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  <span>Atmospheric Profile & Molecular Composition</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MARS_ATMOSPHERE_GASES.map((gas, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold font-mono text-xs">{gas.name} ({gas.chemicalFormula})</span>
                        <span className="text-cyan-400 font-mono font-bold text-xs bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                          {gas.percentage}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        {gas.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Major Geological Provinces */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>Prominent Geological Provinces & Landmarks</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {MARS_GEOLOGICAL_PROVINCES.map((geo, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{geo.type}</span>
                        <h4 className="text-base font-bold text-white font-display">{geo.name}</h4>
                        <div className="text-[10px] font-mono text-slate-400 space-x-2">
                          <span>📐 {geo.dimensions}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                          {geo.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-emerald-300/90 font-mono">
                        ✦ {geo.scientificSignificance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moons of Mars: Phobos and Deimos */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>The Moons of Mars: Phobos & Deimos Dossiers</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MARS_MOONS.map((moon) => (
                    <div key={moon.name} className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <h4 className="text-lg font-bold text-white font-display">{moon.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">Discovered {moon.discoveryYear} by {moon.discoverer}</span>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <span className="text-cyan-400 font-bold block">{moon.meanRadiusKm} km radius</span>
                          <span className="text-slate-400 text-[10px]">{moon.orbitalPeriodHours}h orbit</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {moon.details}
                      </p>
                      <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200 font-mono">
                        ✦ Geological Highlight: {moon.geologicalHighlights}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NASA MARS DIGITAL RESOURCES */}
          {activeTab === 'digital_resources' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                <div className="flex items-center space-x-2 text-cyan-300 font-mono font-bold text-xs">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>AUTHORITATIVE NASA DIGITAL PLATFORMS & EXPLORATION TOOLS</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  These verified platforms power NASA’s active planetary mission operations, rover traverse path planning, 
                  orbital spectroscopic classification, and open scientific data releases.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {NASA_MARS_DIGITAL_RESOURCES.filter(r => 
                  searchQuery === '' || 
                  r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  r.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((res) => (
                  <div key={res.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                            {res.category.replace('_', ' ')}
                          </span>
                          <h3 className="text-base font-bold text-white font-display mt-1.5">{res.title}</h3>
                          <span className="text-[11px] font-mono text-slate-400 block">{res.provider}</span>
                        </div>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer shrink-0"
                        >
                          <span>Launch</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {res.description}
                      </p>

                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">KEY CAPABILITIES</span>
                        <ul className="space-y-1 text-[11px] font-mono text-slate-300">
                          {res.capabilities.map((cap, ci) => (
                            <li key={ci} className="flex items-start space-x-1.5">
                              <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{cap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-emerald-300">
                      ✦ Scientific Application: {res.scientificValue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ALL NASA DATASETS OF MARS */}
          {activeTab === 'datasets' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-1.5">
                <div className="flex items-center space-x-2 text-cyan-300 font-mono font-bold text-xs">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>NASA PLANETARY DATA SYSTEM (PDS) MISSION DATA REPOSITORIES</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Every NASA Mars mission archives peer-reviewed raw, calibrated, and derived science datasets 
                  under PDS3 and PDS4 standards. Explore archived spectrometer readings, radar soundings, 
                  seismology, and geochemistry products.
                </p>
              </div>

              <div className="space-y-5">
                {NASA_MISSION_DATASETS.filter(m =>
                  searchQuery === '' ||
                  m.missionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  m.keyInstruments.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map((mission) => (
                  <div key={mission.missionId} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            mission.operationalStatus === 'Active' 
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50' 
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {mission.operationalStatus}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {mission.craftType} • Launched {mission.launchYear} • Mars Arrival {mission.landingOrArrivalYear}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white font-display mt-1">{mission.missionName}</h3>
                      </div>

                      <a
                        href={mission.pdsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold border border-slate-700 transition-all shrink-0 cursor-pointer"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Access PDS Archive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Archived Instrument Datasets */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        ARCHIVED INSTRUMENT DATASETS
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mission.archivedDatasets.map((ds, dsi) => (
                          <div key={dsi} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-cyan-300 font-mono">{ds.instrument}</span>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                                {ds.archiveNode}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{ds.description}</p>
                            <div className="text-[10px] font-mono text-slate-400 border-t border-slate-900 pt-1">
                              📁 Products: {ds.dataProducts}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Major Discoveries */}
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                        MAJOR SCIENTIFIC DISCOVERIES RETURNED
                      </span>
                      <ul className="space-y-1 text-xs text-slate-200 font-sans">
                        {mission.majorDiscoveries.map((disc, di) => (
                          <li key={di} className="flex items-start space-x-2">
                            <span className="text-emerald-400 font-bold shrink-0">✦</span>
                            <span>{disc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REAL CURRENT WEATHER & CLIMATE (PSG & MEDA) */}
          {activeTab === 'weather' && (
            <div className="space-y-6">
              {/* PSG Link Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900/60 to-blue-950/50 border border-cyan-400/40 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-cyan-300 text-xs font-mono font-bold uppercase">
                    <CloudSun className="w-4 h-4 text-cyan-400" />
                    <span>NASA Planetary Spectrum Generator (PSG) Integration</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Real-Time Mars Radiative Transfer & Climate Simulator
                  </h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-2xl">
                    NASA Goddard’s PSG suite simulates the current Martian atmosphere, dust opacity ($\tau$), 
                    surface temperatures, and radiance curves across Jezero and Gale craters based on astronomical Solar Longitude ($L_s$).
                  </p>
                </div>
                <a
                  href="https://psg.gsfc.nasa.gov/apps/mars/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
                >
                  <span>Launch Official NASA PSG App</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Current Real-Time Mars Atmospheric Dashboard */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>SOLAR LONGITUDE (Ls)</span>
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span className="text-lg font-bold text-cyan-300 block">{currentWeather.solarLongitudeLs}°</span>
                  <span className="text-[10px] text-slate-400 block">{currentWeather.seasonDescription}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>MISSION SOL & TIME</span>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-lg font-bold text-amber-300 block">Sol {currentWeather.solNumber}</span>
                  <span className="text-[10px] text-slate-400 block">{currentWeather.localTrueSolarTime}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>SURFACE PRESSURE</span>
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-lg font-bold text-emerald-300 block">{currentWeather.surfacePressurePa} Pa</span>
                  <span className="text-[10px] text-slate-400 block">({(currentWeather.surfacePressurePa / 100).toFixed(2)} mbar • {currentWeather.pressureTrend})</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>AIR TEMPERATURE</span>
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <span className="text-lg font-bold text-rose-300 block">{currentWeather.airTemperatureCelsius}°C</span>
                  <span className="text-[10px] text-slate-400 block">Ground: {currentWeather.groundTemperatureCelsius}°C (Min {currentWeather.minMaxTempCelsius.min}°C)</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>DUST OPACITY (TAU)</span>
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-lg font-bold text-white block">τ = {currentWeather.dustOpticalDepthTau}</span>
                  <span className="text-[10px] text-emerald-400 block">Risk: {currentWeather.dustStormRisk}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>WIND SPEED & VECTOR</span>
                    <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span className="text-lg font-bold text-white block">{currentWeather.windSpeedMs} m/s</span>
                  <span className="text-[10px] text-slate-400 block">{currentWeather.windDirection}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>UV RADIATION INDEX</span>
                    <Sun className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span className="text-lg font-bold text-purple-300 block">{currentWeather.uvIndex}</span>
                  <span className="text-[10px] text-slate-400 block">Extreme surface UV flux</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>ATMOSPHERIC DENSITY</span>
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-lg font-bold text-white block">{currentWeather.atmosphericDensityKgm3} kg/m³</span>
                  <span className="text-[10px] text-slate-400 block">Scale height ~11.1 km</span>
                </div>
              </div>

              {/* Climate Mechanisms Explained */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 font-sans">
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>Martian Atmospheric Physics & Planetary Climate Cycles</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
                  <div className="space-y-1 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-cyan-400 font-mono font-bold block">1. Polar Dry-Ice Pumping</span>
                    <p>
                      Over 25% to 30% of Mars’s entire atmospheric mass condenses annually onto the winter polar caps as dry ice (CO2 frost), causing massive planetary-scale atmospheric pressure shifts measured by Viking, Curiosity, and Perseverance.
                    </p>
                  </div>
                  <div className="space-y-1 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-amber-400 font-mono font-bold block">2. Global Dust Storm Season</span>
                    <p>
                      During perihelion ($L_s \approx 250^\circ$), intense solar heating triggers convective thermal plumes. Dust devils and regional storms can merge into planet-encircling dust events that plunge daytime temperatures and cover solar panels.
                    </p>
                  </div>
                  <div className="space-y-1 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-emerald-400 font-mono font-bold block">3. Nocturnal Inversion & Low Boiling Point</span>
                    <p>
                      Because surface pressure is near Mars’s water triple point (611.65 Pa), liquid water on the surface instantly boils or freezes. Rapid nocturnal radiative cooling drops temperatures by up to 70°C each night.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NASA DOCUMENTS, ARTICLES & SCIENTIFIC JOURNALS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-300 font-mono font-bold text-xs">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>PEER-REVIEWED SCIENTIFIC LITERATURE & NASA TECHNICAL REPORTS</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed mt-1">
                    Landmark publications from Science, Nature, JGR Planets, and the NASA Technical Reports Server (NTRS).
                  </p>
                </div>
                <a
                  href="https://ntrs.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all shrink-0 cursor-pointer"
                >
                  <span>NASA NTRS Server</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-3.5">
                {NASA_MARS_DOCUMENTS.filter(d =>
                  searchQuery === '' ||
                  d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.category.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((doc) => (
                  <div key={doc.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/40">
                            {doc.category}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {doc.journalOrSource} ({doc.year})
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white font-display">{doc.title}</h4>
                        <span className="text-xs font-mono text-slate-400 block">{doc.authors}</span>
                      </div>

                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono font-bold transition-all shrink-0 cursor-pointer"
                      >
                        <span>{doc.doiOrReportId}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {doc.abstract}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">KEY SCIENTIFIC FINDINGS</span>
                      <ul className="space-y-1 text-[11px] font-mono text-slate-300">
                        {doc.keyFindings.map((kf, kfi) => (
                          <li key={kfi} className="flex items-start space-x-1.5">
                            <span className="text-cyan-400 font-bold shrink-0">✦</span>
                            <span>{kf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: NASA OFFICIAL WEB DIRECTORY (HYPERLINKED) */}
          {activeTab === 'web_directory' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
                <div className="flex items-center space-x-2 text-cyan-300 font-mono font-bold text-xs">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>OFFICIAL NASA & JPL WEBSITES, REPOSITORIES & REAL-TIME PORTALS</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Direct verified hyperlinks to all agency web destinations dedicated to Mars exploration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {NASA_MARS_WEB_PAGES.filter(p =>
                  searchQuery === '' ||
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((page) => (
                  <div key={page.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {page.category}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400">{page.domain}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-display">{page.title}</h4>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {page.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">Audience: {page.recommendedAudience}</span>
                      <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs font-mono font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
                      >
                        <span>Visit Site</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MARS IMAGE GALLERY (CURATED WITH SCIENTIFIC LABELS) */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-cyan-900/40">
                {['All', 'Rover Landscapes', 'Orbital Imagery', 'Astrobiology & Geology', 'Spacecraft & Heritage', 'Weather & Phenomena'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setGalleryFilter(cat);
                      audioService.playClick();
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                      galleryFilter === cat
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {MARS_IMAGE_GALLERY.filter(img => 
                  (galleryFilter === 'All' || img.category === galleryFilter) &&
                  (searchQuery === '' || 
                    img.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    img.nasaId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    img.caption.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map((img) => (
                  <div
                    key={img.id}
                    onClick={() => {
                      setSelectedImage(img);
                      audioService.playClick();
                    }}
                    className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-cyan-500/60 transition-all cursor-pointer flex flex-col"
                  >
                    {/* Image Thumbnail Container */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      <img
                        src={img.thumbnailUrl}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to high-res or placeholder if medium fails
                          (e.target as HTMLImageElement).src = img.imageUrl;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-cyan-300 border border-cyan-500/40">
                        {img.nasaId}
                      </div>
                      <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-slate-300 group-hover:text-cyan-300 transition-colors">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Meta & Labels */}
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 block">{img.category}</span>
                        <h4 className="text-xs font-bold text-white font-display line-clamp-1 group-hover:text-cyan-300 transition-colors">
                          {img.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                          {img.caption}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>{img.instrument}</span>
                        <span>{img.solOrDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* ========================================================= */}
        {/* IMAGE LIGHTBOX MODAL (FULL RESOLUTION & ANNOTATIONS) */}
        {/* ========================================================= */}
        {selectedImage && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-3 sm:p-6 animate-in fade-in">
            <div className="relative max-w-5xl w-full max-h-[92vh] bg-slate-950 border border-cyan-500/40 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
              {/* Lightbox Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                    {selectedImage.nasaId}
                  </span>
                  <h3 className="text-base font-bold text-white font-display">{selectedImage.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lightbox Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-black max-h-[50vh] flex items-center justify-center">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    className="max-h-[50vh] w-auto object-contain mx-auto"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">SCIENTIFIC CAPTION</span>
                    <p className="text-slate-200 font-sans leading-relaxed">{selectedImage.caption}</p>
                    <div className="text-[11px] font-mono text-slate-400 pt-1">
                      📸 Credit: {selectedImage.credit}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">GEOLOGICAL & ASTROBIOLOGICAL INTERPRETATION</span>
                    <p className="text-emerald-200 font-sans leading-relaxed bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
                      {selectedImage.geologicalInterpretation}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-slate-400 font-mono text-[11px]">
                      <span>Mission: {selectedImage.mission}</span>
                      <a
                        href={selectedImage.photojournalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold"
                      >
                        <span>NASA Photojournal Entry</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
