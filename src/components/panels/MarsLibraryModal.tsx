import React, { useState } from 'react';
import {
  MARS_FACTSHEET,
  MARS_ATMOSPHERE_GASES,
  MARS_GEOLOGICAL_PROVINCES,
  MARS_MOONS,
  NASA_MARS_DIGITAL_RESOURCES,
  NASA_MISSION_DATASETS,
  NASA_MARS_DOCUMENTS,
  NASA_MARS_WEB_PAGES,
  MARS_IMAGE_GALLERY,
  MarsGalleryImage
} from '../../data/marsLibraryData';
import { audioService } from '../../services/audioService';
import { MarsWeatherClimatePanel } from './MarsWeatherClimatePanel';
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
  Wind,
  Maximize2,
  Sparkles,
  ChevronRight,
  Layers,
  Cpu
} from 'lucide-react';

interface MarsLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LibraryTab =
  | 'overview'
  | 'weather'
  | 'digital_resources'
  | 'documents'
  | 'web_directory'
  | 'datasets'
  | 'gallery';

export const MarsLibraryModal: React.FC<MarsLibraryModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<LibraryTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<MarsGalleryImage | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>('All');

  if (!isOpen) return null;

  const handleTabChange = (tab: LibraryTab) => {
    setActiveTab(tab);
    audioService.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-1 sm:p-2 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl h-[98vh] max-h-[98vh] bg-[#181516] border border-white/10 rounded-2xl md:rounded-3xl shadow-[0_0_60px_rgba(249,115,22,0.12)] overflow-hidden flex flex-col font-sans text-zinc-100 select-none">
        
        {/* ========================================================= */}
        {/* TOP GODDARD ARCHIVAL COMMAND HEADER                       */}
        {/* ========================================================= */}
        <header className="flex flex-row items-center justify-between px-3 py-2 sm:px-6 sm:py-3 border-b border-white/10 bg-[#141213] shrink-0 gap-2 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3.5 truncate">
            <div className="p-1.5 sm:p-2.5 bg-orange-600/15 rounded-xl sm:rounded-2xl text-orange-400 border border-orange-500/30 shadow-sm shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="truncate">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase bg-orange-600/15 border border-orange-500/30 text-orange-400 px-2 py-0.2 sm:px-2.5 sm:py-0.5 rounded-full font-semibold truncate">
                  NASA Mars Archive
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider hidden sm:inline">
                  ONLINE
                </span>
              </div>
              <h1 className="text-xs sm:text-lg md:text-xl font-bold font-sans tracking-tight text-white flex items-center gap-1.5 sm:gap-2 truncate">
                Mars Archival Library
              </h1>
            </div>
          </div>

          {/* Search Bar & Close Button */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div className="relative w-36 sm:w-72">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-orange-400/80" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-3 py-1 sm:py-1.5 bg-[#221f20] border border-white/10 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/60 transition-all"
              />
            </div>
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#221f20] hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer shrink-0"
              title="Close Library [L / Esc]"
            >
              <span className="text-[10px] font-mono font-bold bg-white/5 px-1.5 py-0.5 rounded text-orange-400 hidden sm:inline">
                L / Esc
              </span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* MAIN NAVIGATION TAB PILL BAR (GODDARD WARM OBSIDIAN)       */}
        {/* ========================================================= */}
        <nav className="flex items-center space-x-1 sm:space-x-1.5 px-3 py-1.5 sm:px-5 sm:py-2 bg-[#141213] border-b border-white/10 overflow-x-auto scrollbar-none shrink-0 text-xs">
          {[
            { id: 'overview', label: 'About Mars', icon: Sparkles },
            { id: 'weather', label: 'Real Weather & Climate (PSG)', icon: CloudSun },
            { id: 'digital_resources', label: 'NASA Digital Resources', icon: Cpu },
            { id: 'documents', label: 'Documents & Journals', icon: FileText },
            { id: 'web_directory', label: 'NASA Web Portals', icon: Globe },
            { id: 'datasets', label: 'NASA Mars Datasets', icon: Database },
            { id: 'gallery', label: 'Mars Image Gallery', icon: ImageIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as LibraryTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium tracking-normal transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-orange-600/30 text-orange-400 border border-orange-500/50 shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ========================================================= */}
        {/* TAB CONTENT CONTAINER (SCROLLABLE)                         */}
        {/* ========================================================= */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-zinc-700/50 bg-[#181516]">

          {/* TAB 1: ALL ABOUT MARS (PLANETARY COMPENDIUM) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Planetary Hero Summary Card */}
              <div className="p-6 rounded-2xl bg-[#221f20] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-2 max-w-2xl relative z-10">
                  <div className="flex items-center space-x-2 text-orange-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Planetary Compendium: {MARS_FACTSHEET.name}</span>
                  </div>
                  <h2 className="text-2xl font-bold font-sans text-white tracking-tight">
                    The Red Planet: Sol IV Complete Science Dossier
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                    Mars is the second smallest planet in the Solar System, possessing half Earth’s diameter, 
                    38% of Earth’s surface gravity, and a rarefied carbon dioxide atmosphere. It preserves 
                    a 4.5-billion-year geologic record spanning ancient warm, watery epochs (Noachian) to 
                    the hyper-arid frozen deserts of the present day (Amazonian).
                  </p>
                </div>

                {/* Key Metrics Quick Pill */}
                <div className="grid grid-cols-2 gap-3 w-full md:w-auto font-mono text-xs shrink-0 relative z-10">
                  <div className="p-3 bg-[#1a1718] border border-white/5 rounded-xl space-y-0.5">
                    <span className="text-zinc-400 text-[10px] block uppercase">SURFACE GRAVITY</span>
                    <span className="text-orange-400 font-bold text-sm">3.72 m/s² (0.38 g)</span>
                  </div>
                  <div className="p-3 bg-[#1a1718] border border-white/5 rounded-xl space-y-0.5">
                    <span className="text-zinc-400 text-[10px] block uppercase">SOL DURATION</span>
                    <span className="text-orange-400 font-bold text-sm">24h 39m 35s</span>
                  </div>
                  <div className="p-3 bg-[#1a1718] border border-white/5 rounded-xl space-y-0.5">
                    <span className="text-zinc-400 text-[10px] block uppercase">ORBITAL YEAR</span>
                    <span className="text-orange-400 font-bold text-sm">686.98 Earth Days</span>
                  </div>
                  <div className="p-3 bg-[#1a1718] border border-white/5 rounded-xl space-y-0.5">
                    <span className="text-zinc-400 text-[10px] block uppercase">AXIAL TILT</span>
                    <span className="text-orange-400 font-bold text-sm">25.19° (Earth-like)</span>
                  </div>
                </div>
              </div>

              {/* Physical & Orbital Factsheet Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
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
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#221f20] border border-white/5 hover:border-orange-500/30 transition-all">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">{item.label}</span>
                      <span className="text-white font-bold text-sm mt-0.5 block">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atmospheric Composition Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  <span>Atmospheric Profile & Molecular Composition</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MARS_ATMOSPHERE_GASES.map((gas, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#221f20] border border-white/5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold font-sans text-sm">{gas.name} ({gas.chemicalFormula})</span>
                        <span className="text-orange-400 font-mono font-bold text-xs bg-orange-600/15 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                          {gas.percentage}%
                        </span>
                      </div>

                      {/* Abundance Visual Progress Slider */}
                      <div className="relative h-2 rounded-full bg-gradient-to-r from-orange-950 via-amber-700 to-orange-500 overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(3, gas.percentage))}%` }}
                        />
                      </div>

                      <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                        {gas.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Major Geological Provinces */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Prominent Geological Provinces & Landmarks</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {MARS_GEOLOGICAL_PROVINCES.map((geo, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#221f20] border border-white/5 hover:border-orange-500/40 transition-all space-y-2.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest bg-orange-600/15 px-2 py-0.5 rounded-full border border-orange-500/30 inline-block">
                          {geo.type}
                        </span>
                        <h4 className="text-base font-bold text-white font-sans">{geo.name}</h4>
                        <div className="text-[11px] font-mono text-zinc-400">
                          📐 {geo.dimensions}
                        </div>
                        <p className="text-xs text-zinc-300 font-sans leading-relaxed pt-1">
                          {geo.description}
                        </p>
                      </div>
                      <div className="pt-2.5 border-t border-white/5 text-xs text-emerald-400 font-mono flex items-start gap-1.5">
                        <span className="shrink-0 font-bold">✦</span>
                        <span>{geo.scientificSignificance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moons of Mars: Phobos and Deimos */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>The Moons of Mars: Phobos & Deimos Dossiers</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MARS_MOONS.map((moon) => (
                    <div key={moon.name} className="p-5 rounded-2xl bg-[#221f20] border border-white/5 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                        <div>
                          <h4 className="text-lg font-bold text-white font-sans">{moon.name}</h4>
                          <span className="text-[11px] font-mono text-zinc-400">Discovered {moon.discoveryYear} by {moon.discoverer}</span>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <span className="text-orange-400 font-bold block">{moon.meanRadiusKm} km radius</span>
                          <span className="text-zinc-400 text-[10px]">{moon.orbitalPeriodHours}h orbit</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                        {moon.details}
                      </p>
                      <div className="p-3 rounded-xl bg-[#1a1718] border border-orange-500/20 text-xs text-orange-200 font-mono">
                        ✦ Geological Highlight: {moon.geologicalHighlights}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REAL CURRENT WEATHER & CLIMATE (NASA PSG) */}
          {activeTab === 'weather' && (
            <MarsWeatherClimatePanel />
          )}

          {/* TAB 3: NASA MARS DIGITAL RESOURCES */}
          {activeTab === 'digital_resources' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#221f20] border border-white/5 space-y-1.5">
                <div className="flex items-center space-x-2 text-orange-400 font-mono font-bold text-xs uppercase tracking-wider">
                  <Cpu className="w-4 h-4 text-orange-400" />
                  <span>AUTHORITATIVE NASA DIGITAL PLATFORMS & EXPLORATION TOOLS</span>
                </div>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
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
                  <div key={res.id} className="p-5 rounded-2xl bg-[#221f20] border border-white/5 hover:border-orange-500/40 transition-all space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 bg-orange-600/15 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                            {res.category.replace('_', ' ')}
                          </span>
                          <h3 className="text-base font-bold text-white font-sans mt-2">{res.title}</h3>
                          <span className="text-[11px] font-mono text-zinc-400 block">{res.provider}</span>
                        </div>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/40 text-xs font-mono font-bold transition-all cursor-pointer shrink-0 shadow-sm"
                        >
                          <span>Launch</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                        {res.description}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">KEY CAPABILITIES</span>
                        <ul className="space-y-1 text-xs font-mono text-zinc-300">
                          {res.capabilities.map((cap, ci) => (
                            <li key={ci} className="flex items-start space-x-1.5">
                              <ChevronRight className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                              <span>{cap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 text-xs font-mono text-emerald-400">
                      ✦ Scientific Application: {res.scientificValue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: NASA DOCUMENTS, ARTICLES & SCIENTIFIC JOURNALS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#221f20] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 text-orange-400 font-mono font-bold text-xs uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-orange-400" />
                    <span>PEER-REVIEWED SCIENTIFIC LITERATURE & NASA TECHNICAL REPORTS</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed mt-1">
                    Landmark publications from Science, Nature, JGR Planets, and the NASA Technical Reports Server (NTRS).
                  </p>
                </div>
                <a
                  href="https://ntrs.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/40 text-xs font-mono font-bold transition-all shrink-0 cursor-pointer shadow-sm"
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
                  <div key={doc.id} className="p-5 rounded-2xl bg-[#221f20] border border-white/5 hover:border-orange-500/40 transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono uppercase bg-orange-600/15 text-orange-400 px-2.5 py-0.5 rounded-full border border-orange-500/30 font-semibold">
                            {doc.category}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {doc.journalOrSource} ({doc.year})
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white font-sans">{doc.title}</h4>
                        <span className="text-xs font-mono text-zinc-400 block">{doc.authors}</span>
                      </div>

                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#1c191a] hover:bg-white/10 text-orange-400 border border-white/10 text-xs font-mono font-bold transition-all shrink-0 cursor-pointer"
                      >
                        <span>{doc.doiOrReportId}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                      {doc.abstract}
                    </p>

                    <div className="p-3.5 rounded-xl bg-[#1c191a] border border-white/5 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider block">KEY SCIENTIFIC FINDINGS</span>
                      <ul className="space-y-1 text-xs font-mono text-zinc-300">
                        {doc.keyFindings.map((kf, kfi) => (
                          <li key={kfi} className="flex items-start space-x-1.5">
                            <span className="text-orange-400 font-bold shrink-0">✦</span>
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

          {/* TAB 5: NASA OFFICIAL WEB DIRECTORY (HYPERLINKED) */}
          {activeTab === 'web_directory' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#221f20] border border-white/5 space-y-1.5">
                <div className="flex items-center space-x-2 text-orange-400 font-mono font-bold text-xs uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span>OFFICIAL NASA & JPL WEBSITES, REPOSITORIES & REAL-TIME PORTALS</span>
                </div>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
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
                  <div key={page.id} className="p-5 rounded-2xl bg-[#221f20] border border-white/5 hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-3.5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase bg-[#1c191a] text-zinc-300 border border-white/10 px-2 py-0.5 rounded">
                          {page.category}
                        </span>
                        <span className="text-xs font-mono text-orange-400">{page.domain}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-sans">{page.title}</h4>
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                        {page.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-zinc-400">Audience: {page.recommendedAudience}</span>
                      <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs font-mono font-bold text-orange-400 hover:text-orange-300 transition-colors"
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

          {/* TAB 6: ALL NASA DATASETS OF MARS */}
          {activeTab === 'datasets' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#221f20] border border-white/5 space-y-1.5">
                <div className="flex items-center space-x-2 text-orange-400 font-mono font-bold text-xs uppercase tracking-wider">
                  <Database className="w-4 h-4 text-orange-400" />
                  <span>NASA PLANETARY DATA SYSTEM (PDS) MISSION DATA REPOSITORIES</span>
                </div>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
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
                  <div key={mission.missionId} className="p-5 rounded-2xl bg-[#221f20] border border-white/5 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-3.5 gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                            mission.operationalStatus === 'Active' 
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50' 
                              : 'bg-[#1c191a] text-zinc-400 border-white/10'
                          }`}>
                            {mission.operationalStatus}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {mission.craftType} • Launched {mission.launchYear} • Mars Arrival {mission.landingOrArrivalYear}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white font-sans mt-1">{mission.missionName}</h3>
                      </div>

                      <a
                        href={mission.pdsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 text-xs font-mono font-bold border border-orange-500/40 transition-all shrink-0 cursor-pointer shadow-sm"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Access PDS Archive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Archived Instrument Datasets */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                        ARCHIVED INSTRUMENT DATASETS
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mission.archivedDatasets.map((ds, dsi) => (
                          <div key={dsi} className="p-3.5 rounded-xl bg-[#1c191a] border border-white/5 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white font-mono">{ds.instrument}</span>
                              <span className="text-[10px] font-mono text-zinc-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                                {ds.archiveNode}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 font-sans leading-relaxed">{ds.description}</p>
                            <div className="text-[10px] font-mono text-zinc-400 border-t border-white/5 pt-1">
                              📁 Products: {ds.dataProducts}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Major Discoveries */}
                    <div className="p-4 rounded-xl bg-[#1c191a] border border-emerald-500/20 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                        MAJOR SCIENTIFIC DISCOVERIES RETURNED
                      </span>
                      <ul className="space-y-1 text-xs text-zinc-200 font-sans">
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

          {/* TAB 7: MARS IMAGE GALLERY (CURATED WITH SCIENTIFIC LABELS) */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {['All', 'Rover Landscapes', 'Orbital Imagery', 'Astrobiology & Geology', 'Spacecraft & Heritage', 'Weather & Phenomena'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setGalleryFilter(cat);
                      audioService.playClick();
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                      galleryFilter === cat
                        ? 'bg-orange-500 text-black font-bold shadow-md shadow-orange-500/20'
                        : 'bg-[#221f20] text-zinc-400 hover:text-white border border-white/5'
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
                    className="group relative rounded-2xl bg-[#221f20] border border-white/5 overflow-hidden hover:border-orange-500/50 transition-all cursor-pointer flex flex-col"
                  >
                    {/* Image Thumbnail Container */}
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-mono text-orange-400 border border-orange-500/40">
                        {img.nasaId}
                      </div>
                      <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-zinc-300 group-hover:text-orange-400 transition-colors">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Meta & Labels */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-orange-400 block font-semibold">{img.category}</span>
                        <h4 className="text-xs font-bold text-white font-sans line-clamp-1 group-hover:text-orange-400 transition-colors">
                          {img.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2">
                          {img.caption}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
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
        {/* IMAGE LIGHTBOX MODAL (WARM GODDARD LUXURY OBSIDIAN)       */}
        {/* ========================================================= */}
        {selectedImage && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in">
            <div className="relative max-w-5xl w-full max-h-[92vh] bg-[#181516] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
              {/* Lightbox Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#141213]">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-mono font-bold text-orange-400 bg-orange-600/15 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                    {selectedImage.nasaId}
                  </span>
                  <h3 className="text-base font-bold text-white font-sans">{selectedImage.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 rounded-xl bg-[#221f20] hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lightbox Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700/50">
                <div className="relative rounded-2xl overflow-hidden bg-black max-h-[50vh] flex items-center justify-center border border-white/5">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    className="max-h-[50vh] w-auto object-contain mx-auto"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#221f20] border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider block font-bold">SCIENTIFIC CAPTION</span>
                    <p className="text-zinc-200 font-sans leading-relaxed">{selectedImage.caption}</p>
                    <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-white/5">
                      📸 Credit: {selectedImage.credit}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#221f20] border border-white/5 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">GEOLOGICAL & ASTROBIOLOGICAL INTERPRETATION</span>
                      <p className="text-emerald-300 font-sans leading-relaxed bg-[#1c191a] p-3 rounded-xl border border-emerald-500/20">
                        {selectedImage.geologicalInterpretation}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-zinc-400 font-mono text-[11px] border-t border-white/5">
                      <span>Mission: {selectedImage.mission}</span>
                      <a
                        href={selectedImage.photojournalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-orange-400 hover:text-orange-300 font-bold"
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
