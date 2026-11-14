import React, { useState } from 'react';
import { 
  Globe, 
  Navigation, 
  Rocket, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Clock, 
  Info
} from 'lucide-react';
import { 
  MARS_REGIONS, 
  REGIONAL_EXPEDITION_ROUTES, 
  getExpeditionRoute 
} from '../../data/regions/marsRegions';
import { MarsRegion, RegionalExpeditionRoute } from '../../types/region';
import { audioService } from '../../services/audioService';

interface RegionalOrbitalMapProps {
  currentRegionId?: string;
  onSelectRegion?: (region: MarsRegion) => void;
  onInitiateExpeditionPreview?: (route: RegionalExpeditionRoute) => void;
}

export const RegionalOrbitalMap: React.FC<RegionalOrbitalMapProps> = ({
  currentRegionId = 'jezero_crater',
  onSelectRegion,
  onInitiateExpeditionPreview
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('neretva_vallis');
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'expedition' | 'datasets'>('overview');
  const [simulationActive, setSimulationActive] = useState<boolean>(false);

  const selectedRegion = MARS_REGIONS.find((r) => r.id === selectedRegionId) || MARS_REGIONS[1];
  const activeRoute = getExpeditionRoute(currentRegionId, selectedRegion.id);

  const handleSelectRegion = (region: MarsRegion) => {
    setSelectedRegionId(region.id);
    setSimulationActive(false);
    audioService.playClick();
    if (onSelectRegion) {
      onSelectRegion(region);
    }
  };

  const handleSimulateExpedition = (route: RegionalExpeditionRoute) => {
    setSimulationActive(true);
    audioService.playClick();
    if (onInitiateExpeditionPreview) {
      onInitiateExpeditionPreview(route);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden relative w-full h-full bg-[#0a0504]">
      {/* Planetary GIS SVG Viewport */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-3">
        <div className="relative w-full h-full max-h-[720px] aspect-square rounded-2xl overflow-hidden border border-mars-border/80 shadow-2xl bg-[#0e0705]">
          
          {/* Orbital MOLA Elevation Texture Backdrop */}
          <div 
            className="absolute inset-0 opacity-80 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 82% 64%, rgba(30, 0, 58, 0.9) 0%, rgba(0, 51, 102, 0.7) 25%, transparent 55%),
                radial-gradient(circle at 28% 82%, rgba(139, 0, 0, 0.7) 0%, rgba(178, 34, 34, 0.5) 30%, transparent 60%),
                radial-gradient(circle at 22% 22%, rgba(0, 136, 85, 0.6) 0%, transparent 45%),
                radial-gradient(circle at 52% 48%, rgba(212, 160, 23, 0.5) 0%, transparent 35%),
                linear-gradient(135deg, #180905 0%, #2a1109 50%, #150604 100%)
              `
            }}
          />

          {/* SVG Map of Syrtis Major Quadrangle (MC-13) */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <defs>
              {/* Regional Grid Pattern */}
              <pattern id="orbitalGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
              </pattern>

              {/* Glow filter for active base */}
              <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Coordinate Grid */}
            <rect width="100%" height="100%" fill="url(#orbitalGrid)" />

            {/* Latitude / Longitude Planetary Axis Annotations */}
            <g opacity="0.4" fill="#a3a3a3" fontSize="1.8" fontFamily="monospace">
              <text x="3" y="15">24° N</text>
              <text x="3" y="35">20° N</text>
              <text x="3" y="55">16° N</text>
              <text x="3" y="75">12° N</text>
              <text x="3" y="95">8° N</text>

              <text x="18" y="98">70° E</text>
              <text x="38" y="98">75° E</text>
              <text x="58" y="98">80° E</text>
              <text x="78" y="98">85° E</text>
            </g>

            {/* Planetary Structural Formations (MOLA Topographic Contours) */}
            <g fill="none" opacity="0.35">
              {/* Isidis Multi-ring Basin Edge Arc */}
              <ellipse 
                cx="88" 
                cy="68" 
                rx="35" 
                ry="45" 
                stroke="#6366f1" 
                strokeWidth="0.8" 
                strokeDasharray="2 1" 
              />
              <ellipse 
                cx="88" 
                cy="68" 
                rx="24" 
                ry="32" 
                stroke="#38bdf8" 
                strokeWidth="0.5" 
                strokeDasharray="1 1.5" 
              />
              <text x="82" y="56" fill="#818cf8" fontSize="2.2" fontFamily="monospace" fontWeight="bold">
                ISIDIS IMPACT BASIN FLOOR (-3,800m)
              </text>

              {/* Syrtis Major Volcanic Shield Dome */}
              <circle cx="28" cy="82" r="22" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 1.5" />
              <ellipse cx="27" cy="81" rx="6" ry="4" stroke="#f87171" strokeWidth="0.6" />
              <text x="18" y="86" fill="#f87171" fontSize="2.0" fontFamily="monospace" fontWeight="bold">
                NILI PATERA CALDERA (+450m)
              </text>

              {/* Nili Fossae Concentric Tectonic Grabens (Arcing Faults) */}
              <path 
                d="M 12 10 Q 22 24 30 36" 
                stroke="#34d399" 
                strokeWidth="0.9" 
                strokeDasharray="1.5 1" 
              />
              <path 
                d="M 16 8 Q 26 22 34 34" 
                stroke="#34d399" 
                strokeWidth="0.7" 
                strokeDasharray="1.5 1" 
              />
              <path 
                d="M 8 15 Q 18 28 26 40" 
                stroke="#10b981" 
                strokeWidth="0.6" 
              />
              <text x="14" y="28" fill="#34d399" fontSize="2.0" fontFamily="monospace" fontWeight="bold">
                NILI FOSSAE TECTONIC GRABENS
              </text>

              {/* Neretva Inflow Valley Channel Gorge */}
              <path 
                d="M 34 44 Q 42 46 52 48" 
                stroke="#f59e0b" 
                strokeWidth="1.2" 
              />
              <text x="36" y="42" fill="#fbbf24" fontSize="1.8" fontFamily="monospace">
                NERETVA VALLIS CANYON
              </text>

              {/* Jezero Crater Rim Circle (45km scale) */}
              <circle cx="52" cy="48" r="4.2" stroke="#f59e0b" strokeWidth="0.8" fill="rgba(245, 158, 11, 0.08)" />
            </g>

            {/* Inter-Region Expedition Corridors (Trajectory Vectors) */}
            {REGIONAL_EXPEDITION_ROUTES.map((route) => {
              const src = MARS_REGIONS.find((r) => r.id === route.sourceRegionId);
              const tgt = MARS_REGIONS.find((r) => r.id === route.targetRegionId);
              if (!src || !tgt) return null;

              const isSelectedRoute = (selectedRegion.id === tgt.id || selectedRegion.id === src.id);

              return (
                <g key={route.id} className="transition-all duration-300">
                  <line
                    x1={src.svgOrbitalCoords.x}
                    y1={src.svgOrbitalCoords.y}
                    x2={tgt.svgOrbitalCoords.x}
                    y2={tgt.svgOrbitalCoords.y}
                    stroke={isSelectedRoute ? '#f59e0b' : '#525252'}
                    strokeWidth={isSelectedRoute ? 1.0 : 0.5}
                    strokeDasharray={isSelectedRoute ? '2 1' : '1.5 1.5'}
                    opacity={isSelectedRoute ? 1.0 : 0.4}
                  />

                  {/* Route Midpoint Distance Tag */}
                  <rect
                    x={(src.svgOrbitalCoords.x + tgt.svgOrbitalCoords.x) / 2 - 5}
                    y={(src.svgOrbitalCoords.y + tgt.svgOrbitalCoords.y) / 2 - 2}
                    width="10"
                    height="3.4"
                    rx="0.8"
                    fill="rgba(10, 5, 4, 0.9)"
                    stroke={isSelectedRoute ? '#f59e0b' : '#404040'}
                    strokeWidth="0.3"
                  />
                  <text
                    x={(src.svgOrbitalCoords.x + tgt.svgOrbitalCoords.x) / 2}
                    y={(src.svgOrbitalCoords.y + tgt.svgOrbitalCoords.y) / 2 + 0.5}
                    fill={isSelectedRoute ? '#fbbf24' : '#a3a3a3'}
                    fontSize="1.6"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {route.distanceKm} km
                  </text>
                </g>
              );
            })}

            {/* Regional Hub Nodes */}
            {MARS_REGIONS.map((region) => {
              const isCurrent = region.id === currentRegionId;
              const isSelected = region.id === selectedRegion.id;
              const isHovered = region.id === hoveredRegionId;
              const { x, y } = region.svgOrbitalCoords;

              let nodeColor = '#a3a3a3';
              if (isCurrent) nodeColor = '#10b981'; // Emerald for active base
              else if (region.status === 'expedition_ready') nodeColor = '#f59e0b'; // Amber
              else if (region.status === 'survey_pending') nodeColor = '#38bdf8'; // Sky blue
              else if (region.status === 'orbital_only') nodeColor = '#ec4899'; // Pink

              return (
                <g
                  key={region.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => handleSelectRegion(region)}
                  onMouseEnter={() => setHoveredRegionId(region.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                  className="cursor-pointer transition-transform duration-200"
                >
                  {/* Outer pulse indicator */}
                  {(isSelected || isCurrent) && (
                    <circle
                      cx="0"
                      cy="0"
                      r="6.5"
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth="0.6"
                      className="animate-ping opacity-60"
                    />
                  )}

                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      cx="0"
                      cy="0"
                      r="5.0"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.7"
                    />
                  )}

                  {/* Core Node */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isHovered ? 3.4 : 2.6}
                    fill={nodeColor}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    filter={isCurrent ? 'url(#glowGreen)' : 'url(#glowOrange)'}
                  />

                  {/* Node Label Badge */}
                  <g pointerEvents="none">
                    <rect
                      x="-14"
                      y="4"
                      width="28"
                      height="4.2"
                      rx="1"
                      fill="rgba(8, 4, 3, 0.95)"
                      stroke={isSelected ? '#ffffff' : nodeColor}
                      strokeWidth={isSelected ? 0.45 : 0.3}
                    />
                    <text
                      x="0"
                      y="6.8"
                      fill="#ffffff"
                      fontSize="1.9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {region.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Map Top Floating Header Banner */}
          <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md p-2 rounded-xl border border-mars-border text-white flex items-center space-x-2 shadow-2xl font-mono text-xs">
            <Globe className="w-4 h-4 text-mars-orange" />
            <span className="font-bold text-mars-sand">SYRTIS MAJOR QUADRANGLE (MC-13)</span>
            <span className="text-[10px] text-gray-400">| PLANETARY SCALE: 1:2,500,000</span>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-mars-border text-white text-[10px] font-mono shadow-2xl space-y-1">
            <div className="text-mars-sand font-bold mb-1">REGIONAL STATUS LEGEND</div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>ACTIVE SURFACE BASE (OCTAVIA)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>EXPEDITION READY (ROVER / HOPPER)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>ORBITAL SURVEY COMPLETE</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span>DEEP HIGH-VOLTAGE VOLCANIC ZONE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Drawer: Regional Scientific Inspector & Expedition Planner */}
      <div className="w-96 bg-mars-panel border-l border-mars-border flex flex-col overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-mars-border bg-black/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-mars-orange font-bold">
              {selectedRegion.code} • {selectedRegion.quadrangle}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
              selectedRegion.status === 'active' 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                : selectedRegion.status === 'expedition_ready'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                : 'bg-sky-950 text-sky-300 border border-sky-500/50'
            }`}>
              {selectedRegion.status.replace('_', ' ')}
            </span>
          </div>

          <h3 className="text-lg font-bold font-display text-white mt-1">
            {selectedRegion.name}
          </h3>
          <p className="text-xs text-mars-sand font-mono">
            {selectedRegion.subtitle}
          </p>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center space-x-1 mt-3 bg-black/60 p-1 rounded-xl border border-mars-border/60 text-xs font-mono">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-mars-orange/20 text-white font-bold border border-mars-orange/40'
                  : 'text-mars-dust hover:text-white'
              }`}
            >
              GEOLOGY
            </button>
            <button
              onClick={() => setActiveTab('expedition')}
              className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                activeTab === 'expedition'
                  ? 'bg-mars-orange/20 text-white font-bold border border-mars-orange/40'
                  : 'text-mars-dust hover:text-white'
              }`}
            >
              EXPEDITION
            </button>
            <button
              onClick={() => setActiveTab('datasets')}
              className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                activeTab === 'datasets'
                  ? 'bg-mars-orange/20 text-white font-bold border border-mars-orange/40'
                  : 'text-mars-dust hover:text-white'
              }`}
            >
              DATASETS
            </button>
          </div>
        </div>

        {/* Tab 1: Regional Geological Overview */}
        {activeTab === 'overview' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {/* Environmental Profile Grid */}
            <div className="grid grid-cols-2 gap-2 bg-black/50 p-2.5 rounded-xl border border-mars-border/50 text-[11px]">
              <div>
                <span className="text-mars-dust block text-[10px]">ATMOSPHERIC PRESSURE</span>
                <span className="text-white font-bold">{selectedRegion.environmentalProfile.surfacePressurePa} Pa</span>
              </div>
              <div>
                <span className="text-mars-dust block text-[10px]">AVG TEMPERATURE</span>
                <span className="text-white font-bold">{selectedRegion.environmentalProfile.temperatureCelsius}°C</span>
              </div>
              <div>
                <span className="text-mars-dust block text-[10px]">MOLA ELEVATION</span>
                <span className="text-white font-bold">{selectedRegion.molaDatumElevation}m</span>
              </div>
              <div>
                <span className="text-mars-dust block text-[10px]">RADIATION LEVEL</span>
                <span className="text-amber-300 font-bold">{selectedRegion.environmentalProfile.radiationMsvYear} mSv/yr</span>
              </div>
            </div>

            {/* Geological Summary */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-mars-orange uppercase flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Geological Profile ({selectedRegion.geologicalEra})</span>
              </h4>
              <p className="text-gray-300 font-sans text-xs leading-relaxed">
                {selectedRegion.geologicalSummary}
              </p>
            </div>

            {/* Scientific Significance */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-emerald-400 uppercase flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Astrobiological & Scientific Merit</span>
              </h4>
              <p className="text-gray-300 font-sans text-xs leading-relaxed">
                {selectedRegion.scientificSignificance}
              </p>
            </div>

            {/* Key Features Bullet List */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold text-white uppercase">Primary Target Formations:</h4>
              <div className="space-y-1">
                {selectedRegion.keyGeologicalFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start space-x-2 text-gray-300 text-[11px]">
                    <span className="text-mars-orange font-bold">›</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Expedition Planner & Route Logistics */}
        {activeTab === 'expedition' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {activeRoute ? (
              <>
                {/* Route Header Card */}
                <div className="bg-mars-orange/10 border border-mars-orange/40 p-3 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-mars-orange font-bold text-[11px]">
                    <span>{activeRoute.name}</span>
                    <span>{activeRoute.distanceKm} KM</span>
                  </div>
                  <div className="text-gray-300 text-[11px]">
                    Elevation Delta: <span className="text-white font-bold">{activeRoute.elevationDeltaMeters > 0 ? `+${activeRoute.elevationDeltaMeters}` : activeRoute.elevationDeltaMeters}m MOLA</span>
                  </div>
                </div>

                {/* Transit Options Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-white font-bold text-xs uppercase flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-mars-sand" />
                    <span>Transit Mode Estimates:</span>
                  </h4>

                  <div className="bg-black/60 p-2.5 rounded-xl border border-mars-border space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-mars-sand flex items-center space-x-1">
                        <Navigation className="w-3 h-3 text-mars-orange" />
                        <span>Manned Rover Traverse:</span>
                      </span>
                      <span className="text-white font-bold">~{selectedRegion.transitTimeRoverHours} Hours</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span>Battery Consumption:</span>
                      <span className="text-amber-300 font-bold">{activeRoute.requiredRoverBatteryKwh} kWh</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span>Oxygen Reserve Required:</span>
                      <span className="text-emerald-300 font-bold">{activeRoute.requiredOxygenSupplyKg} kg O2</span>
                    </div>
                  </div>

                  <div className="bg-black/60 p-2.5 rounded-xl border border-mars-border space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-mars-sand flex items-center space-x-1">
                        <Rocket className="w-3 h-3 text-purple-400" />
                        <span>Suborbital Hopper Flight:</span>
                      </span>
                      <span className="text-white font-bold">~{selectedRegion.transitTimeHopperMinutes} Minutes</span>
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Direct ballistic trajectory avoiding hazardous canyon talus.
                    </div>
                  </div>
                </div>

                {/* Hazard Warnings */}
                <div className="space-y-1.5">
                  <h4 className="text-amber-400 font-bold text-xs uppercase flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Environmental Hazards & Advisories:</span>
                  </h4>
                  <div className="space-y-1 bg-amber-950/20 border border-amber-500/30 p-2.5 rounded-xl text-[11px]">
                    {activeRoute.hazardWarnings.map((warn, i) => (
                      <div key={i} className="flex items-start space-x-2 text-amber-200">
                        <span className="text-amber-500 font-bold">!</span>
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulation Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleSimulateExpedition(activeRoute)}
                    disabled={simulationActive}
                    className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      simulationActive
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                        : 'bg-mars-orange hover:bg-orange-600 text-white shadow-lg'
                    }`}
                  >
                    {simulationActive ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>EXPEDITION TRAVERSE SIMULATED</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4" />
                        <span>SIMULATE EXPEDITION ROUTE</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <span>Selected region is current base location.</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Authentic Datasets & Instruments */}
        {activeTab === 'datasets' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            <h4 className="text-white font-bold text-xs uppercase flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-mars-orange" />
              <span>Calibrated Satellite Datasets:</span>
            </h4>
            <div className="space-y-2">
              {selectedRegion.datasetsUsed.map((ds, i) => (
                <div key={i} className="bg-black/50 p-2.5 rounded-xl border border-mars-border/60 text-gray-300 text-[11px]">
                  <span className="text-mars-orange font-bold block mb-0.5">SOURCE #{i + 1}</span>
                  <span>{ds}</span>
                </div>
              ))}
            </div>

            <h4 className="text-white font-bold text-xs uppercase mt-4">Corroborating Spacecraft Missions:</h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedRegion.keyMissions.map((mis, i) => (
                <span key={i} className="px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-[10px] text-white">
                  {mis}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
