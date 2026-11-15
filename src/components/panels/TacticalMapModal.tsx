import React, { useState, useRef, useMemo } from 'react';
import { MarsCoordinates } from '../../types/mars';
import { ALL_DISCOVERIES } from '../../data/discoveries';
import { OutpostStructure } from '../../types/outpost';
import { DiscoveryRecord } from '../../types/discovery';
import { 
  X, 
  Layers, 
  Eye, 
  Navigation, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MapPin, 
  Ruler, 
  LocateFixed, 
  Crosshair, 
  Mountain, 
  ShieldAlert, 
  ChevronRight,
  Sun,
  Sparkles,
  Search,
  Compass,
  Info,
  HelpCircle
} from 'lucide-react';
import { CoordinateService } from '../../services/coordinateService';
import { audioService } from '../../services/audioService';

interface TacticalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerPosition: { x: number; y: number; z: number };
  roverPosition?: { x: number; y: number; z: number };
  playerCoordinates: MarsCoordinates;
  playerHeading: number;
  onSelectPoi: (id: string) => void;
  activeObjectiveTargetId?: string;
  isDrivingRover?: boolean;
  structures?: OutpostStructure[];
  customWaypoint?: { x: number; z: number; label?: string } | null;
  onSetCustomWaypoint?: (wp: { x: number; z: number; label?: string } | null) => void;
  gpsTrail?: { x: number; z: number; isRover: boolean }[];
}

export const TacticalMapModal: React.FC<TacticalMapModalProps> = ({
  isOpen,
  onClose,
  playerPosition,
  roverPosition,
  playerCoordinates,
  playerHeading,
  onSelectPoi,
  activeObjectiveTargetId,
  isDrivingRover = false,
  structures = [],
  customWaypoint = null,
  onSetCustomWaypoint,
  gpsTrail = []
}) => {
  // Help Guide state
  const [showGuide, setShowGuide] = useState(false);

  // Scientific GIS Layer states
  const [activeLayer, setActiveLayer] = useState<'hirise' | 'elevation' | 'crism' | 'themis' | 'slope'>('hirise');
  
  // Layer visibility toggles
  const [showTraverse, setShowTraverse] = useState(true);
  const [showGpsTrail, setShowGpsTrail] = useState(true);
  const [showIsobars, setShowIsobars] = useState(true);
  const [showOutpostGrid, setShowOutpostGrid] = useState(true);

  // Pan & Zoom Engine State
  const [zoom, setZoom] = useState<number>(1.0); // 1.0x to 4.0x
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 }); // percentage offset
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; initialPanX: number; initialPanY: number }>({
    clientX: 0,
    clientY: 0,
    initialPanX: 0,
    initialPanY: 0
  });

  // Interactive Tools: 'inspect' | 'waypoint' | 'ruler'
  const [activeTool, setActiveTool] = useState<'inspect' | 'waypoint' | 'ruler'>('inspect');
  const [rulerPoints, setRulerPoints] = useState<{ start: { x: number; z: number } | null; end: { x: number; z: number } | null }>({
    start: null,
    end: null
  });

  // Selected POI for detailed inspector drawer
  const [inspectedPoi, setInspectedPoi] = useState<DiscoveryRecord | null>(null);

  // Hover state for interactive name badge & highlighted pin
  const [hoveredPoi, setHoveredPoi] = useState<DiscoveryRecord | null>(null);
  const [hoveredStructureId, setHoveredStructureId] = useState<string | null>(null);

  // Right sidebar tab: 'layers' | 'discoveries'
  const [sidebarTab, setSidebarTab] = useState<'layers' | 'discoveries'>('layers');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapFrameRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ clientX: number; clientY: number; initialPanX: number; initialPanY: number; initialDist?: number }>({
    clientX: 0,
    clientY: 0,
    initialPanX: 0,
    initialPanY: 0
  });

  // Hover handlers for discovery POI markers
  const handlePoiMouseEnter = (poi: DiscoveryRecord) => {
    setHoveredPoi(poi);
  };

  const handlePoiMouseLeave = () => {
    setHoveredPoi(null);
  };

  // Center and focus map on any specific discovery
  const handleFocusPoi = (poi: DiscoveryRecord) => {
    const px = toSvgX(poi.worldPosition.x);
    const py = toSvgY(poi.worldPosition.z);
    setPan({
      x: 50 - px,
      y: 50 - py
    });
    setZoom((prev) => Math.max(2.0, prev));
    setInspectedPoi(poi);
    audioService.playClick();
  };

  // Filtered discoveries for directory list
  const filteredDiscoveries = useMemo(() => {
    if (!searchQuery.trim()) return ALL_DISCOVERIES;
    const q = searchQuery.toLowerCase();
    return ALL_DISCOVERIES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Sort POIs so hovered and inspected are rendered last (on top z-index in SVG)
  const sortedPois = useMemo(() => {
    return [...ALL_DISCOVERIES].sort((a, b) => {
      if (a.id === hoveredPoi?.id || a.id === inspectedPoi?.id) return 1;
      if (b.id === hoveredPoi?.id || b.id === inspectedPoi?.id) return -1;
      if (a.id === activeObjectiveTargetId) return 1;
      if (b.id === activeObjectiveTargetId) return -1;
      return 0;
    });
  }, [hoveredPoi?.id, inspectedPoi?.id, activeObjectiveTargetId]);

  if (!isOpen) return null;

  // Coordinate Conversion Functions:
  // Local bounds: [-320m, +320m] in X and Z (covers the full 600m world, Octavia base, and Neretva gorge breach)
  const MAP_SPAN = 320;
  const MAP_TOTAL = MAP_SPAN * 2; // 640m across
  const toSvgX = (x: number) => ((x + MAP_SPAN) / MAP_TOTAL) * 100;
  const toSvgY = (z: number) => ((z + MAP_SPAN) / MAP_TOTAL) * 100;

  const toWorldX = (svgXPercent: number) => (svgXPercent / 100) * MAP_TOTAL - MAP_SPAN;
  const toWorldZ = (svgYPercent: number) => (svgYPercent / 100) * MAP_TOTAL - MAP_SPAN;

  const playerSvgX = toSvgX(playerPosition.x);
  const playerSvgY = toSvgY(playerPosition.z);

  const roverSvgX = roverPosition ? toSvgX(roverPosition.x) : toSvgX(14);
  const roverSvgY = roverPosition ? toSvgY(roverPosition.z) : toSvgY(10);
  const distToRover = roverPosition ? Math.round(Math.hypot(roverPosition.x - playerPosition.x, roverPosition.z - playerPosition.z)) : 16;

  // Pan & Zoom calculations for SVG viewBox (Smooth continuous Google Maps style)
  const viewBoxSize = 100 / zoom;
  const centerX = 50 - pan.x;
  const centerY = 50 - pan.y;
  const minX = centerX - viewBoxSize / 2;
  const minY = centerY - viewBoxSize / 2;

  // Zoom handlers (supports smooth zoom from 0.35x macro regional out to 4.0x tactical detail)
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(4.0, Number((prev * 1.35).toFixed(2))));
    audioService.playClick();
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.35, Number((prev / 1.35).toFixed(2))));
    audioService.playClick();
  };

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    audioService.playClick();
  };

  const handleRecenterPlayer = () => {
    setPan({
      x: 50 - playerSvgX,
      y: 50 - playerSvgY
    });
    setZoom((prev) => Math.max(1.5, prev));
    audioService.playClick();
  };

  // Drag to pan map handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      dragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = (e.clientX - dragStartRef.current.clientX) * 0.15;
    const deltaY = (e.clientY - dragStartRef.current.clientY) * 0.15;
    setPan({
      x: dragStartRef.current.initialPanX + deltaX,
      y: dragStartRef.current.initialPanY + deltaY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag & pinch-to-zoom handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y
      };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current.initialDist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = (touch.clientX - touchStartRef.current.clientX) * 0.18;
      const deltaY = (touch.clientY - touchStartRef.current.clientY) * 0.18;
      setPan({
        x: touchStartRef.current.initialPanX + deltaX,
        y: touchStartRef.current.initialPanY + deltaY
      });
    } else if (e.touches.length === 2 && touchStartRef.current.initialDist) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = newDist / touchStartRef.current.initialDist;
      if (ratio > 1.04) {
        setZoom((prev) => Math.min(4.0, Number((prev * 1.025).toFixed(2))));
      } else if (ratio < 0.96) {
        setZoom((prev) => Math.max(0.35, Number((prev / 1.025).toFixed(2))));
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(4.0, Number((prev * 1.15).toFixed(2))));
    } else {
      setZoom((prev) => Math.max(0.35, Number((prev / 1.15).toFixed(2))));
    }
  };

  // Click on Map viewport
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) return;

    const svgRect = e.currentTarget.getBoundingClientRect();
    const clickFractionX = (e.clientX - svgRect.left) / svgRect.width;
    const clickFractionY = (e.clientY - svgRect.top) / svgRect.height;

    // Convert click fraction within current viewBox to 0-100% SVG coordinates
    const clickedSvgX = minX + clickFractionX * viewBoxSize;
    const clickedSvgY = minY + clickFractionY * viewBoxSize;

    const worldX = toWorldX(clickedSvgX);
    const worldZ = toWorldZ(clickedSvgY);

    if (activeTool === 'waypoint') {
      if (onSetCustomWaypoint) {
        onSetCustomWaypoint({
          x: Math.round(worldX),
          z: Math.round(worldZ),
          label: `WAYPOINT (${Math.round(worldX)}m, ${Math.round(worldZ)}m)`
        });
        audioService.playClick();
      }
    } else if (activeTool === 'ruler') {
      if (!rulerPoints.start || (rulerPoints.start && rulerPoints.end)) {
        setRulerPoints({ start: { x: worldX, z: worldZ }, end: null });
        audioService.playClick();
      } else {
        setRulerPoints((prev) => ({ ...prev, end: { x: worldX, z: worldZ } }));
        audioService.playDiscoveryFound();
      }
    }
  };

  // Ruler Distance calculation
  const rulerDistance = rulerPoints.start && rulerPoints.end
    ? Math.round(Math.hypot(rulerPoints.end.x - rulerPoints.start.x, rulerPoints.end.z - rulerPoints.start.z))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-1 sm:p-2 md:p-6 animate-in fade-in select-none">
      <div className="relative w-full max-w-6xl bg-mars-surface border border-mars-border rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[98vh] max-h-[98vh]">
        
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-2.5 py-1.5 md:px-6 md:py-3.5 border-b border-mars-border/80 bg-mars-panel/90">
          <div className="flex items-center space-x-2 md:space-x-3 truncate">
            <div className="p-1.5 md:p-2 bg-mars-orange/20 rounded-lg md:rounded-xl text-mars-orange border border-mars-orange/40 shrink-0">
              <Navigation className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-1.5 md:space-x-2">
                <h2 className="text-xs md:text-lg font-bold font-display text-white tracking-wider truncate">
                  JEZERO CRATER TACTICAL GIS
                </h2>
                <span className="text-[9px] md:text-[10px] font-mono bg-mars-border px-1.5 py-0.2 rounded text-mars-sand uppercase hidden sm:inline">
                  MRO / HiRISE
                </span>
                <span className="text-[9px] md:text-[10px] font-mono bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-1.5 py-0.2 rounded shrink-0">
                  GPS LIVE
                </span>
              </div>
              <p className="text-[9px] md:text-xs font-mono text-mars-sand truncate">
                POS: {CoordinateService.formatCoordinates(playerCoordinates)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 md:space-x-3 shrink-0">
            {/* Mobile Layers Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
              className={`md:hidden flex items-center space-x-1 px-2 py-1 rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                isMobileSidebarOpen
                  ? 'bg-mars-orange text-white border-mars-orange shadow-md'
                  : 'bg-black/60 border-mars-border text-mars-orange hover:bg-white/10'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>LAYERS</span>
            </button>
            {/* Quick Zoom Presets (Google Maps style) */}
            <div className="flex items-center space-x-1 bg-black/60 p-1 rounded-xl border border-mars-border/80 text-xs font-mono">
              <button
                onClick={() => {
                  setZoom(2.0);
                  audioService.playClick();
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  zoom >= 1.6
                    ? 'bg-cyan-500/25 border border-cyan-400 text-white font-bold'
                    : 'text-mars-sand hover:text-white'
                }`}
                title="Zoom into local Tactical details (2X)"
              >
                TACTICAL (2X)
              </button>
              <button
                onClick={() => {
                  setZoom(1.0);
                  audioService.playClick();
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  zoom >= 0.75 && zoom < 1.6
                    ? 'bg-mars-orange/25 border border-mars-orange text-white font-bold'
                    : 'text-mars-sand hover:text-white'
                }`}
                title="Full Jezero Crater 600m exploration play area (1X)"
              >
                CRATER (1X)
              </button>
              <button
                onClick={() => {
                  setZoom(0.35);
                  audioService.playClick();
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  zoom < 0.75
                    ? 'bg-purple-500/25 border border-purple-400 text-white font-bold'
                    : 'text-mars-sand hover:text-white'
                }`}
                title="Zoom out to surrounding regional geography (0.4X)"
              >
                REGIONAL (0.4X)
              </button>
            </div>

            <button
              onClick={() => {
                setShowGuide((prev) => !prev);
                audioService.playClick();
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                showGuide
                  ? 'bg-cyan-500/30 border-cyan-400 text-white shadow-lg'
                  : 'bg-black/40 border-mars-border text-cyan-300 hover:text-white hover:bg-white/10'
              }`}
              title="Open Map Legend & Orientation Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>MAP GUIDE</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-mars-dust hover:text-white hover:bg-white/10 border border-mars-border/50 transition-all cursor-pointer"
              title="Close Tactical Map [M / Esc / C]"
            >
              <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-mars-sand hidden sm:inline">M / Esc</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Unified Map Viewport + Tactical Control Panel */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Main Map Viewport */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className={`flex-1 bg-[#0c0503] relative overflow-hidden flex items-center justify-center p-1 sm:p-2 md:p-3 cursor-${
              isDragging ? 'grabbing' : activeTool === 'waypoint' ? 'crosshair' : activeTool === 'ruler' ? 'crosshair' : 'grab'
            }`}
          >
            {/* Map Canvas Frame */}
            <div
              ref={mapFrameRef}
              className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border border-mars-border/80 shadow-2xl bg-[#140b07]"
            >
              
              {/* GIS LAYER 1: HiRISE True-Color Surface Ortho */}
              <div 
                className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
                  activeLayer === 'hirise' ? 'opacity-95' : 'opacity-30'
                }`}
                style={{
                  background: 'radial-gradient(circle at 45% 40%, #a85333 0%, #8b3e23 35%, #5e2816 65%, #3a160b 88%, #200c06 100%)'
                }}
              />

              {/* GIS LAYER 2: MOLA Topography Heatmap */}
              {activeLayer === 'elevation' && (
                <div 
                  className="absolute inset-0 opacity-80 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #1e003a 0%, #003366 22%, #008855 45%, #d4a017 70%, #b22222 92%, #550000 100%)',
                    mixBlendMode: 'screen'
                  }}
                />
              )}

              {/* GIS LAYER 3: CRISM Hyperspectral Minerals */}
              {activeLayer === 'crism' && (
                <div 
                  className="absolute inset-0 opacity-85 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `
                      radial-gradient(circle at 35% 35%, rgba(56, 189, 248, 0.75) 0%, transparent 40%),
                      radial-gradient(circle at 65% 65%, rgba(251, 191, 36, 0.7) 0%, transparent 45%),
                      radial-gradient(circle at 55% 25%, rgba(168, 85, 247, 0.65) 0%, transparent 35%),
                      radial-gradient(circle at 20% 70%, rgba(34, 197, 94, 0.6) 0%, transparent 35%)
                    `
                  }}
                />
              )}

              {/* GIS LAYER 4: THEMIS Thermal Inertia */}
              {activeLayer === 'themis' && (
                <div 
                  className="absolute inset-0 opacity-80 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(45deg, rgba(6, 182, 212, 0.7) 0%, rgba(245, 158, 11, 0.6) 50%, rgba(14, 116, 144, 0.8) 100%)',
                    mixBlendMode: 'color-dodge'
                  }}
                />
              )}

              {/* GIS LAYER 5: Slope Hazard Safety */}
              {activeLayer === 'slope' && (
                <div 
                  className="absolute inset-0 opacity-75 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: 'repeating-linear-gradient(45deg, rgba(34, 197, 94, 0.25) 0px, rgba(34, 197, 94, 0.25) 20px, rgba(239, 68, 68, 0.35) 20px, rgba(239, 68, 68, 0.35) 30px, rgba(245, 158, 11, 0.3) 30px, rgba(245, 158, 11, 0.3) 45px)'
                  }}
                />
              )}

              {/* MAIN VECTOR SVG MAP (Interactive Pan & Zoom ViewBox) */}
              <svg
                onClick={handleMapClick}
                viewBox={`${minX} ${minY} ${viewBoxSize} ${viewBoxSize}`}
                className="absolute inset-0 w-full h-full"
              >
                <defs>
                  {/* Grid pattern */}
                  <pattern id="tacticalGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
                  </pattern>
                </defs>

                {/* Coordinate Grid Background */}
                <rect width="100%" height="100%" fill="url(#tacticalGrid)" />

                {/* Topographic Contour Isobars */}
                {showIsobars && (
                  <g opacity="0.35" stroke="#ffffff" strokeWidth="0.35" fill="none">
                    {/* -2580m crater floor depression */}
                    <ellipse cx={toSvgX(40)} cy={toSvgY(-30)} rx="35" ry="25" strokeDasharray="1 1" />
                    {/* -2550m delta apron */}
                    <path d={`M ${toSvgX(-20)} ${toSvgY(-120)} Q ${toSvgX(-60)} ${toSvgY(-40)} ${toSvgX(-120)} ${toSvgY(30)}`} />
                    {/* -2520m delta scarp contour */}
                    <path d={`M ${toSvgX(-70)} ${toSvgY(-140)} Q ${toSvgX(-110)} ${toSvgY(-50)} ${toSvgX(-160)} ${toSvgY(40)}`} />
                    {/* -2480m fan crest contour */}
                    <path d={`M ${toSvgX(-120)} ${toSvgY(-180)} Q ${toSvgX(-160)} ${toSvgY(-80)} ${toSvgX(-210)} ${toSvgY(60)}`} />
                    {/* Kodiak Butte Mesa Outline */}
                    <polygon points={`${toSvgX(-175)},${toSvgY(85)} ${toSvgX(-145)},${toSvgY(88)} ${toSvgX(-148)},${toSvgY(108)} ${toSvgX(-178)},${toSvgY(105)}`} stroke="#f59e0b" strokeWidth="0.6" fill="rgba(245, 158, 11, 0.08)" />
                    {/* Belva Crater Rim Circle */}
                    <circle cx={toSvgX(-180)} cy={toSvgY(-175)} r="18" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="2 1" />
                  </g>
                )}

                {/* Outpost 55m Base Boundary Safe Zone */}
                {showOutpostGrid && (
                  <g>
                    <circle
                      cx={toSvgX(0)}
                      cy={toSvgY(0)}
                      r={(55 / MAP_TOTAL) * 100}
                      fill="rgba(52, 211, 153, 0.08)"
                      stroke="#34d399"
                      strokeWidth="0.8"
                      strokeDasharray="2 1"
                    />
                    <text
                      x={toSvgX(0)}
                      y={toSvgY(0) - (55 / MAP_TOTAL) * 100 - 1.5}
                      fill="#34d399"
                      fontSize="2.4"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      OCTAVIA BASE PERIMETER (O2 RECHARGE)
                    </text>
                  </g>
                )}

                {/* Permanent Mars Archival Library Facility Landmark */}
                {showOutpostGrid && (
                  <g
                    transform={`translate(${toSvgX(26)}, ${toSvgY(-26)})`}
                    className="cursor-pointer"
                  >
                    <title>MARS ARCHIVAL LIBRARY & RESEARCH REPOSITORY (NASA OPEN DATA)</title>
                    <circle
                      r="2.5"
                      fill="#0284c7"
                      stroke="#38bdf8"
                      strokeWidth="0.8"
                    />
                    <circle
                      r="4.5"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="0.4"
                      strokeDasharray="1 1"
                    />
                    <text
                      y="-3.5"
                      fill="#38bdf8"
                      fontSize="2.0"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      ★ MARS LIBRARY
                    </text>
                  </g>
                )}

                {/* Placed Outpost Base Structures (Clean Hover-Only Badges to Prevent Overlaps) */}
                {showOutpostGrid && structures.map((s) => {
                  const sx = toSvgX(s.position.x);
                  const sy = toSvgY(s.position.z);
                  const isHovered = hoveredStructureId === s.id;

                  // Distinct colors based on structure type:
                  // Solar = Amber, Battery = Cyan, Comms = Purple, Lab = Rose, Hab = Emerald
                  const structColor =
                    s.type === 'solar_array' ? '#f59e0b' :
                    s.type === 'battery_bank' ? '#06b6d4' :
                    s.type === 'comm_dish' ? '#a855f7' :
                    s.type === 'science_lab' ? '#ec4899' :
                    '#10b981'; // habitat_core

                  const badgeText = s.name;
                  const labelWidth = Math.max(16, badgeText.length * 1.45 + 3.5);

                  return (
                    <g
                      key={s.id}
                      transform={`translate(${sx}, ${sy})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredStructureId(s.id)}
                      onMouseLeave={() => setHoveredStructureId(null)}
                    >
                      {/* Generous hit area for effortless hover */}
                      <circle cx="0" cy="0" r="4.5" fill="transparent" />
                      <circle
                        cx="0"
                        cy="0"
                        r={isHovered ? 2.4 : 1.6}
                        fill={structColor}
                        stroke="#ffffff"
                        strokeWidth={isHovered ? 0.6 : 0.35}
                        className={isHovered ? 'animate-pulse' : ''}
                      />
                      <circle cx="0" cy="0" r="0.6" fill="#ffffff" />
                      {isHovered && (
                        <g pointerEvents="none" className="transition-all duration-150">
                          <rect
                            x={-labelWidth / 2}
                            y="-6.2"
                            width={labelWidth}
                            height="3.6"
                            rx="1.1"
                            fill="rgba(6, 10, 18, 0.96)"
                            stroke={structColor}
                            strokeWidth="0.35"
                          />
                          <text
                            x="0"
                            y="-3.8"
                            fill="#ffffff"
                            fontSize="1.8"
                            fontFamily="monospace"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            {badgeText}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Historical Perseverance Traverse Route */}
                {showTraverse && (
                  <polyline
                    points={`${toSvgX(0)},${toSvgY(0)} ${toSvgX(30)},${toSvgY(-40)} ${toSvgX(75)},${toSvgY(-115)} ${toSvgX(-40)},${toSvgY(-60)} ${toSvgX(-85)},${toSvgY(-65)} ${toSvgX(-140)},${toSvgY(-120)}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="0.8"
                    strokeDasharray="1.5 1"
                  />
                )}

                {/* Real-time Player Breadcrumb GPS Trail */}
                {showGpsTrail && gpsTrail.length > 1 && (
                  <polyline
                    points={gpsTrail.map((p) => `${toSvgX(p.x)},${toSvgY(p.z)}`).join(' ')}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="0.7"
                    strokeDasharray="1 1"
                    opacity="0.85"
                  />
                )}

                {/* Ruler Measurement Vector Line */}
                {rulerPoints.start && rulerPoints.end && (
                  <g>
                    <line
                      x1={toSvgX(rulerPoints.start.x)}
                      y1={toSvgY(rulerPoints.start.z)}
                      x2={toSvgX(rulerPoints.end.x)}
                      y2={toSvgY(rulerPoints.end.z)}
                      stroke="#06b6d4"
                      strokeWidth="0.9"
                      strokeDasharray="2 1"
                    />
                    <circle cx={toSvgX(rulerPoints.start.x)} cy={toSvgY(rulerPoints.start.z)} r="1.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="0.4" />
                    <circle cx={toSvgX(rulerPoints.end.x)} cy={toSvgY(rulerPoints.end.z)} r="1.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="0.4" />
                    <text
                      x={(toSvgX(rulerPoints.start.x) + toSvgX(rulerPoints.end.x)) / 2}
                      y={(toSvgY(rulerPoints.start.z) + toSvgY(rulerPoints.end.z)) / 2 - 1.5}
                      fill="#22d3ee"
                      fontSize="2.6"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                      className="drop-shadow"
                    >
                      {rulerDistance}m
                    </text>
                  </g>
                )}

                {/* Custom Waypoint Navigation Beacon Pin */}
                {customWaypoint && (
                  <g>
                    {/* Trajectory guide line from player to waypoint */}
                    <line
                      x1={playerSvgX}
                      y1={playerSvgY}
                      x2={toSvgX(customWaypoint.x)}
                      y2={toSvgY(customWaypoint.z)}
                      stroke="#ec4899"
                      strokeWidth="0.7"
                      strokeDasharray="1.5 1"
                      opacity="0.8"
                    />
                    <circle
                      cx={toSvgX(customWaypoint.x)}
                      cy={toSvgY(customWaypoint.z)}
                      r="4"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="0.8"
                      className="animate-ping"
                      opacity="0.75"
                    />
                    <circle
                      cx={toSvgX(customWaypoint.x)}
                      cy={toSvgY(customWaypoint.z)}
                      r="2"
                      fill="#ec4899"
                      stroke="#ffffff"
                      strokeWidth="0.5"
                    />
                    <text
                      x={toSvgX(customWaypoint.x)}
                      y={toSvgY(customWaypoint.z) - 2.8}
                      fill="#f472b6"
                      fontSize="2.4"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      ★ {customWaypoint.label || 'NAV WAYPOINT'} ({Math.round(Math.hypot(customWaypoint.x - playerPosition.x, customWaypoint.z - playerPosition.z))}m)
                    </text>
                  </g>
                )}

                {/* All 15 Scientific Discovery POIs (Rendered with Hover Detection & No-Overlap Labels) */}
                {sortedPois.map((poi) => {
                  const px = toSvgX(poi.worldPosition.x);
                  const py = toSvgY(poi.worldPosition.z);
                  const isTarget = activeObjectiveTargetId === poi.id;
                  const isInspected = inspectedPoi?.id === poi.id;
                  const isHovered = hoveredPoi?.id === poi.id;
                  const shortName = poi.name.split(' (')[0].split(' — ')[0];
                  
                  // Label pill is shown when hovered, inspected, or active mission target (prevents clutter & overlaps)
                  const showLabel = isHovered || isInspected || isTarget;
                  const labelWidth = Math.max(14, shortName.length * 1.45 + 3.5);

                  return (
                    <g
                      key={poi.id}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedPoi(poi);
                        audioService.playClick();
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onSelectPoi(poi.id);
                      }}
                      onMouseEnter={() => handlePoiMouseEnter(poi)}
                      onMouseLeave={handlePoiMouseLeave}
                    >
                      {/* Generous invisible hit-circle (r=5.5) so clicking & hovering is effortless without overlaps */}
                      <circle cx={px} cy={py} r="5.5" fill="transparent" />

                      {/* Active Mission Target Outer Spin Ring */}
                      {isTarget && (
                        <circle
                          cx={px}
                          cy={py}
                          r="6.5"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="0.8"
                          strokeDasharray="1.5 1"
                          className="animate-spin"
                          opacity="0.9"
                          pointerEvents="none"
                        />
                      )}

                      {/* Hover or Inspected Glow Halo */}
                      {(isHovered || isInspected) && (
                        <circle
                          cx={px}
                          cy={py}
                          r={isTarget ? 7 : 5}
                          fill="rgba(56, 189, 248, 0.25)"
                          stroke={isTarget ? '#fbbf24' : '#38bdf8'}
                          strokeWidth="0.6"
                          className="animate-pulse"
                          pointerEvents="none"
                        />
                      )}

                      {/* Main Beacon Ring: White + Cyan/Blue (Distinctive NASA Discovery Symbol) */}
                      <circle
                        cx={px}
                        cy={py}
                        r={isTarget ? 3.2 : isHovered || isInspected ? 2.8 : 2.2}
                        fill={isTarget ? '#b45309' : isInspected ? '#0284c7' : isHovered ? '#0369a1' : '#080d1a'}
                        stroke={isTarget ? '#fbbf24' : isHovered || isInspected ? '#ffffff' : '#38bdf8'}
                        strokeWidth={isHovered || isInspected || isTarget ? 0.9 : 0.6}
                        pointerEvents="none"
                      />

                      {/* Center Core Dot: Crisp White / Gold */}
                      <circle
                        cx={px}
                        cy={py}
                        r={isTarget ? 1.2 : isHovered || isInspected ? 1.1 : 0.8}
                        fill={isTarget ? '#fef08a' : isHovered || isInspected ? '#ffffff' : '#38bdf8'}
                        pointerEvents="none"
                      />

                      {/* Sleek High-Contrast Name Pill: shown cleanly on hover / target / inspect / zoom */}
                      {showLabel && (
                        <g pointerEvents="none" className="transition-all duration-150">
                          <rect
                            x={px - labelWidth / 2}
                            y={py - 6.2}
                            width={labelWidth}
                            height="3.6"
                            rx="1.1"
                            fill="rgba(6, 10, 18, 0.95)"
                            stroke={isTarget ? '#f59e0b' : isHovered || isInspected ? '#38bdf8' : 'rgba(56, 189, 248, 0.45)'}
                            strokeWidth="0.35"
                          />
                          <text
                            x={px}
                            y={py - 3.8}
                            fill={isTarget ? '#fde047' : isHovered || isInspected ? '#ffffff' : '#93c5fd'}
                            fontSize="1.9"
                            fontFamily="monospace"
                            fontWeight="bold"
                            textAnchor="middle"
                            className="select-none"
                          >
                            {shortName}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* EXTENDED REGIONAL GEOGRAPHY (Revealed seamlessly when zooming out Google-Maps style) */}
                {zoom < 1.2 && (
                  <g className="transition-opacity duration-300" opacity={Math.min(0.9, (1.2 - zoom) * 1.8)}>
                    {/* 45-km Jezero Crater Circular Mountain Rim */}
                    <circle
                      cx="50"
                      cy="50"
                      r="58"
                      fill="none"
                      stroke="#853d24"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      opacity="0.8"
                    />
                    <text
                      x="50"
                      y="-11"
                      fill="#d97706"
                      fontSize="3.6"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      JEZERO CRATER RIM MOUNTAINS (45 KM DIAMETER)
                    </text>

                    {/* Neretva Vallis 100-km Inflow Valley Corridor (Carved through western rim) */}
                    <path
                      d={`M ${toSvgX(-210)} ${toSvgY(-155)} Q ${toSvgX(-380)} ${toSvgY(-260)} ${toSvgX(-560)} ${toSvgY(-340)}`}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="3.2"
                      strokeDasharray="3 1.5"
                      opacity="0.85"
                    />
                    <text
                      x={toSvgX(-380)}
                      y={toSvgY(-285)}
                      fill="#c084fc"
                      fontSize="3.6"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      ◀ NERETVA VALLIS (100 KM ANCIENT RIVER CANYON)
                    </text>

                    {/* Nili Fossae Ancient Highland Grabens & Carbonates (Northwest) */}
                    <g opacity="0.75">
                      <path
                        d={`M ${toSvgX(-480)} ${toSvgY(-380)} Q ${toSvgX(-300)} ${toSvgY(-500)} ${toSvgX(-120)} ${toSvgY(-560)}`}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2.2"
                        strokeDasharray="4 2"
                      />
                      <path
                        d={`M ${toSvgX(-520)} ${toSvgY(-350)} Q ${toSvgX(-340)} ${toSvgY(-470)} ${toSvgX(-160)} ${toSvgY(-530)}`}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="1.6"
                        strokeDasharray="4 2"
                      />
                      <text
                        x={toSvgX(-340)}
                        y={toSvgY(-515)}
                        fill="#34d399"
                        fontSize="3.8"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        NILI FOSSAE TECTONIC FAULTS & CARBONATES (185 KM NW)
                      </text>
                    </g>

                    {/* Isidis Planitia Giant Lowland Impact Basin (East of Jezero) */}
                    <g opacity="0.7">
                      <ellipse
                        cx={toSvgX(450)}
                        cy={toSvgY(50)}
                        rx="140"
                        ry="180"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.4"
                        strokeDasharray="5 2.5"
                      />
                      <text
                        x={toSvgX(350)}
                        y={toSvgY(50)}
                        fill="#818cf8"
                        fontSize="3.8"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        ISIDIS PLANITIA LOWLAND BASIN (-3,800m) ▶
                      </text>
                    </g>

                    {/* Syrtis Major Basaltic Shield Volcano (Southwest) */}
                    <g opacity="0.7">
                      <circle
                        cx={toSvgX(-320)}
                        cy={toSvgY(460)}
                        r="85"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2.2"
                        strokeDasharray="5 2"
                      />
                      <text
                        x={toSvgX(-320)}
                        y={toSvgY(440)}
                        fill="#f87171"
                        fontSize="3.8"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        ▼ SYRTIS MAJOR VOLCANIC SHIELD (+450m)
                      </text>
                    </g>
                  </g>
                )}

                {/* Independent Rover Vehicle Marker (when player is on foot) */}
                {!isDrivingRover && (
                  <g>
                    <circle
                      cx={roverSvgX}
                      cy={roverSvgY}
                      r={4.2 * (zoom < 1.0 ? Math.min(2.5, 1.0 / zoom) : 1.0)}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="0.6"
                      strokeDasharray="1.5 1"
                      className="animate-pulse"
                      opacity="0.8"
                    />
                    <rect
                      x={roverSvgX - 2.2 * (zoom < 1.0 ? Math.min(2.5, 1.0 / zoom) : 1.0)}
                      y={roverSvgY - 1.6 * (zoom < 1.0 ? Math.min(2.5, 1.0 / zoom) : 1.0)}
                      width={4.4 * (zoom < 1.0 ? Math.min(2.5, 1.0 / zoom) : 1.0)}
                      height={3.2 * (zoom < 1.0 ? Math.min(2.5, 1.0 / zoom) : 1.0)}
                      rx="0.6"
                      fill="#0891b2"
                      stroke="#ffffff"
                      strokeWidth="0.5"
                    />
                    <text
                      x={roverSvgX}
                      y={roverSvgY + 4.2 * (zoom < 1.0 ? Math.min(2.5, 1.0 / zoom) : 1.0)}
                      fill="#67e8f9"
                      fontSize={2.1 * (zoom < 1.0 ? Math.min(2.2, 1.0 / zoom) : 1.0)}
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ROVER ({distToRover}m)
                    </text>
                  </g>
                )}

                {/* Astronaut / Rover Player Marker (Smoothly scaled so YOU are always clearly visible) */}
                <g>
                  {/* Radar pulse wave */}
                  <circle
                    cx={playerSvgX}
                    cy={playerSvgY}
                    r={4.5 * (zoom < 1.0 ? Math.min(2.5, 1.0 / zoom) : 1.0)}
                    fill="rgba(239, 68, 68, 0.2)"
                    stroke={isDrivingRover ? '#06b6d4' : '#ef4444'}
                    strokeWidth="0.6"
                    strokeDasharray="1 1"
                    className="animate-pulse"
                  />
                  {/* Player dot */}
                  <circle
                    cx={playerSvgX}
                    cy={playerSvgY}
                    r={2.2 * (zoom < 1.0 ? Math.min(2.5, 1.0 / zoom) : 1.0)}
                    fill={isDrivingRover ? '#0891b2' : '#ef4444'}
                    stroke="#ffffff"
                    strokeWidth="0.6"
                  />
                  {/* Direction pointer arrow */}
                  <line
                    x1={playerSvgX}
                    y1={playerSvgY}
                    x2={playerSvgX + Math.sin((playerHeading * Math.PI) / 180) * 3.8 * (zoom < 1.0 ? Math.min(2.5, 1.0 / zoom) : 1.0)}
                    y2={playerSvgY - Math.cos((playerHeading * Math.PI) / 180) * 3.8 * (zoom < 1.0 ? Math.min(2.5, 1.0 / zoom) : 1.0)}
                    stroke="#ffffff"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                  />
                  <text
                    x={playerSvgX}
                    y={playerSvgY + 3.6 * (zoom < 1.0 ? Math.min(2.5, 1.0 / zoom) : 1.0)}
                    fill={isDrivingRover ? '#67e8f9' : '#fca5a5'}
                    fontSize={2.2 * (zoom < 1.0 ? Math.min(2.2, 1.0 / zoom) : 1.0)}
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {isDrivingRover ? 'ROVER' : 'YOU'}
                  </text>
                </g>

                {/* Cardinal Directions HUD Markings */}
                <g opacity="0.8" fill="#f59e0b" fontSize="2.6" fontFamily="monospace" fontWeight="bold">
                  <text x="50" y="3.8" textAnchor="middle">▲ NORTH (N)</text>
                  <text x="50" y="98.2" textAnchor="middle">▼ SOUTH (S)</text>
                  <text x="3.5" y="50" textAnchor="start">◀ WEST (W - DELTA)</text>
                  <text x="96.5" y="50" textAnchor="end">EAST (E - DUNES) ▶</text>
                </g>

                {/* Major Landmark Watermark Labels */}
                <g opacity="0.32" fill="#ffffff" fontFamily="monospace" fontWeight="bold">
                  <text x={toSvgX(-120)} y={toSvgY(-70)} fontSize="3.0" textAnchor="middle">
                    WESTERN RIVER DELTA FAN
                  </text>
                  <text x={toSvgX(-180)} y={toSvgY(-175)} fontSize="2.8" textAnchor="middle" fill="#38bdf8">
                    BELVA IMPACT CRATER
                  </text>
                  <text x={toSvgX(-160)} y={toSvgY(95)} fontSize="2.8" textAnchor="middle" fill="#f59e0b">
                    KODIAK BUTTE MESA
                  </text>
                  <text x={toSvgX(75)} y={toSvgY(-115)} fontSize="2.8" textAnchor="middle" fill="#fb923c">
                    SÉÍTAH AEOLIAN DUNES
                  </text>
                  <text x={toSvgX(-225)} y={toSvgY(-160)} fontSize="2.6" textAnchor="middle" fill="#a855f7">
                    ➜ NERETVA VALLIS CANYON PASS
                  </text>
                </g>

                {/* Dynamic Multi-tier Scale Bar (Adapts smoothly across all zoom levels) */}
                {(() => {
                  let scaleDist = 100;
                  let scaleLabel = '100 METERS';
                  if (zoom >= 2.0) {
                    scaleDist = 50;
                    scaleLabel = '50 METERS';
                  } else if (zoom >= 0.8) {
                    scaleDist = 100;
                    scaleLabel = '100 METERS';
                  } else if (zoom >= 0.45) {
                    scaleDist = 500;
                    scaleLabel = '500 METERS';
                  } else {
                    scaleDist = 2000;
                    scaleLabel = '2 KILOMETERS';
                  }
                  const barWidth = (scaleDist / MAP_TOTAL) * 100;
                  return (
                    <g transform={`translate(${toSvgX(160)}, ${toSvgY(255)})`}>
                      <line x1="0" y1="0" x2={barWidth} y2="0" stroke="#ffffff" strokeWidth="0.8" />
                      <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#ffffff" strokeWidth="0.8" />
                      <line x1={barWidth} y1="-1.5" x2={barWidth} y2="1.5" stroke="#ffffff" strokeWidth="0.8" />
                      <text x={barWidth / 2} y="-1.8" fill="#ffffff" fontSize="2.2" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {scaleLabel}
                      </text>
                    </g>
                  );
                })()}
              </svg>

              {/* Beginner-Friendly Quick Map Guide Overlay */}
              {showGuide && (
                <div className="absolute inset-4 bg-black/95 backdrop-blur-xl border border-cyan-500 rounded-2xl p-6 text-white font-sans z-30 shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Compass className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-bold text-lg font-mono text-cyan-300">HOW TO READ & USE THE MAP</h3>
                    </div>
                    <button
                      onClick={() => setShowGuide(false)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                      <div className="font-bold text-red-400 flex items-center space-x-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-ping" />
                        <span>🔴 YOU (Astronaut)</span>
                      </div>
                      <p className="text-gray-300">
                        The red pulsing circle shows your exact location. The white line points in the direction your helmet is facing.
                      </p>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                      <div className="font-bold text-cyan-400 flex items-center space-x-1.5">
                        <span className="w-3 h-3 rounded-md bg-cyan-500 inline-block" />
                        <span>🚙 ROVER VEHICLE</span>
                      </div>
                      <p className="text-gray-300">
                        Shows where your rover is currently parked and your exact distance to it. Walk toward this icon to mount your vehicle!
                      </p>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                      <div className="font-bold text-emerald-400 flex items-center space-x-1.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                        <span>🟢 OCTAVIA BASE (0, 0)</span>
                      </div>
                      <p className="text-gray-300">
                        The center of the map. Inside the green circular perimeter, your spacesuit oxygen automatically recharges at 100%.
                      </p>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                      <div className="font-bold text-amber-400 flex items-center space-x-1.5">
                        <span className="w-3 h-3 rotate-45 bg-amber-500 inline-block" />
                        <span>🟡 / 🔵 DISCOVERY SITES</span>
                      </div>
                      <p className="text-gray-300">
                        Authentic NASA discoveries and collectable rock samples. Click any diamond to inspect historical NASA photos and data.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-xs font-mono text-cyan-200 space-y-1">
                    <div className="font-bold text-white uppercase">Controls & Shortcuts:</div>
                    <div>• <b>Click & Drag</b> on the map to pan around.</div>
                    <div>• <b>Scroll Wheel</b> or <b>[+] / [-]</b> buttons to zoom in and out.</div>
                    <div>• Click <b>RECENTER</b> (crosshair icon) to snap the camera back to your astronaut.</div>
                    <div>• Click <b>SET PIN</b> to drop a custom pink GPS waypoint on the radar.</div>
                  </div>
                </div>
              )}

              {/* Viewport Floating Zoom Controls */}
              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md p-1.5 rounded-xl border border-mars-border text-white flex items-center space-x-1 shadow-2xl font-mono text-xs">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-mars-sand hover:text-white transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-mars-sand hover:text-white transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-mars-border" />
                <button
                  onClick={handleRecenterPlayer}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-mars-orange hover:text-white transition-colors cursor-pointer"
                  title="Recenter on Player"
                >
                  <LocateFixed className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetView}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-mars-sand hover:text-white transition-colors cursor-pointer"
                  title="Reset Zoom & Pan"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="px-2 text-[10px] text-mars-dust font-bold">
                  {zoom.toFixed(1)}X • {zoom <= 0.5 ? 'REGIONAL' : zoom <= 1.2 ? 'CRATER' : 'TACTICAL'}
                </span>
              </div>

              {/* Interactive Tool Selector Bar */}
              <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md p-1 rounded-xl border border-mars-border text-white flex items-center space-x-1 shadow-2xl font-mono text-[11px]">
                <button
                  onClick={() => {
                    setActiveTool('inspect');
                    audioService.playClick();
                  }}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeTool === 'inspect'
                      ? 'bg-mars-orange/25 border border-mars-orange text-white font-bold'
                      : 'text-mars-dust hover:text-white'
                  }`}
                  title="Inspect POIs & Outcrops"
                >
                  <Crosshair className="w-3.5 h-3.5 text-mars-orange" />
                  <span>INSPECT</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTool('waypoint');
                    audioService.playClick();
                  }}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeTool === 'waypoint'
                      ? 'bg-pink-950/80 border border-pink-500 text-pink-300 font-bold'
                      : 'text-mars-dust hover:text-white'
                  }`}
                  title="Click map to drop custom navigation waypoint"
                >
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  <span>SET PIN</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTool('ruler');
                    setRulerPoints({ start: null, end: null });
                    audioService.playClick();
                  }}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeTool === 'ruler'
                      ? 'bg-cyan-950/80 border border-cyan-500 text-cyan-300 font-bold'
                      : 'text-mars-dust hover:text-white'
                  }`}
                  title="Measure distance between two points"
                >
                  <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                  <span>MEASURE</span>
                </button>
              </div>

              {/* Waypoint Active Banner with Clear Button */}
              {customWaypoint && (
                <div className="absolute top-14 right-3 bg-pink-950/85 backdrop-blur-md border border-pink-500/70 p-2 rounded-xl text-[10px] font-mono text-pink-200 flex items-center space-x-2 shadow-2xl">
                  <MapPin className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
                  <span>
                    NAV PIN: {customWaypoint.x}m, {customWaypoint.z}m ({Math.round(Math.hypot(customWaypoint.x - playerPosition.x, customWaypoint.z - playerPosition.z))}m away)
                  </span>
                  {onSetCustomWaypoint && (
                    <button
                      onClick={() => onSetCustomWaypoint(null)}
                      className="ml-2 px-1.5 py-0.5 bg-pink-900 hover:bg-pink-800 text-white rounded border border-pink-400/50 cursor-pointer"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              )}

              {/* Ruler Results Banner */}
              {activeTool === 'ruler' && (
                <div className="absolute top-14 left-3 bg-cyan-950/90 backdrop-blur-md border border-cyan-500 p-2.5 rounded-xl text-[11px] font-mono text-cyan-200 shadow-2xl space-y-1">
                  <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                    <Ruler className="w-4 h-4" />
                    <span>TRAVERSE MEASUREMENT RULER</span>
                  </div>
                  {rulerDistance !== null ? (
                    <div className="text-[10px] space-y-0.5 text-white">
                      <div>Ground Distance: <span className="font-bold text-amber-300">{rulerDistance} meters</span></div>
                      <div>Estimated EVA Time: ~{Math.round(rulerDistance / 5.5)} seconds (O2 Cost: ~{((rulerDistance / 5.5) * 0.18).toFixed(1)}%)</div>
                      <div>Estimated Rover Time: ~{Math.round(rulerDistance / 16.5)} seconds (Speed: 60 km/h)</div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-cyan-400">
                      Click first point, then click second point on the map.
                    </div>
                  )}
                </div>
              )}

              {/* Tactical POI Inspector Drawer (if a POI is clicked) */}
              {inspectedPoi && (
                <div className="absolute bottom-3 right-3 w-80 bg-black/90 backdrop-blur-md border border-mars-orange rounded-xl p-3.5 text-xs font-mono shadow-2xl space-y-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-mars-orange font-bold uppercase block">
                        {inspectedPoi.region} • SOL {inspectedPoi.observationDate?.split(' ')[0] || '142'}
                      </span>
                      <h4 className="font-bold text-white text-sm">
                        {inspectedPoi.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => setInspectedPoi(null)}
                      className="text-mars-dust hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-300 font-sans line-clamp-2">
                    {inspectedPoi.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-mars-sand pt-1 border-t border-mars-border/50">
                    <span>DISTANCE: <strong className="text-white">{Math.round(Math.hypot(inspectedPoi.worldPosition.x - playerPosition.x, inspectedPoi.worldPosition.z - playerPosition.z))}m</strong></span>
                    <span>ELEV: <strong className="text-white">{inspectedPoi.coordinates.elevation}m</strong></span>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    {onSetCustomWaypoint && (
                      <button
                        onClick={() => {
                          onSetCustomWaypoint({
                            x: inspectedPoi.worldPosition.x,
                            z: inspectedPoi.worldPosition.z,
                            label: inspectedPoi.name
                          });
                          audioService.playClick();
                          onClose();
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-[10px] flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>NAVIGATE HERE</span>
                      </button>
                    )}
                    <button
                      onClick={() => onSelectPoi(inspectedPoi.id)}
                      className="flex-1 py-1.5 rounded-lg bg-mars-surface hover:bg-white/10 text-white border border-mars-border font-bold text-[10px] flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>DOSSIER</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Map Legend & Scale Bar Overlay */}
              <div className="absolute bottom-3 left-3 bg-black/90 backdrop-blur-md p-3 rounded-xl border border-mars-border text-[10px] font-mono space-y-1.5 shadow-2xl max-w-[240px]">
                <div className="text-[10px] font-bold text-mars-sand uppercase tracking-wider border-b border-mars-border/50 pb-1 flex items-center justify-between">
                  <span>MAP SYMBOLOGY & KEY</span>
                  <Info className="w-3 h-3 text-cyan-400" />
                </div>
                
                {/* Scientific Discovery Marker Explanation */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex items-center justify-center w-3 h-3">
                    <span className="w-3 h-3 rounded-full border border-sky-400 bg-sky-950/80" />
                    <span className="absolute w-1 h-1 rounded-full bg-white" />
                  </div>
                  <span className="text-sky-300 font-bold">NASA Discovery (Cyan Ring)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative flex items-center justify-center w-3 h-3">
                    <span className="w-3 h-3 rounded-full border border-white bg-red-600" />
                  </div>
                  <span className="text-white">Astronaut / Rover GPS</span>
                </div>

                {activeObjectiveTargetId && (
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full border-2 border-amber-400 bg-amber-500/20 animate-pulse" />
                    <span className="text-amber-300 font-bold">Active Objective Target</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full border border-dashed border-emerald-400 bg-emerald-950/40" />
                  <span className="text-emerald-300">Base Safe Zone (55m O2)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative flex items-center justify-center w-3 h-3">
                    <span className="w-2.5 h-2.5 rounded-sm border border-white bg-amber-500" />
                    <span className="absolute w-1 h-1 rounded-sm bg-white" />
                  </div>
                  <span className="text-amber-200">Base Modules (Solar, Hab, Battery)</span>
                </div>

                {customWaypoint && (
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full border border-pink-400 bg-pink-500 animate-ping" />
                    <span className="text-pink-300 font-bold">Custom Nav Pin</span>
                  </div>
                )}

                <div className="text-[9px] text-gray-400 pt-1 border-t border-mars-border/40">
                  Tip: Toggle Base Modules via "Outpost Grid (55m)" checkbox on right
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Scientific GIS Layers & Discovery Directory */}
          <div className={`${
            isMobileSidebarOpen ? 'flex absolute inset-y-0 right-0 z-30 shadow-2xl' : 'hidden'
          } md:flex w-72 md:w-80 bg-mars-panel border-l border-mars-border p-3 md:p-4 flex flex-col justify-between overflow-y-auto font-mono text-xs`}>
            <div className="space-y-3">
              {/* Sidebar Tab Switcher */}
              <div className="flex items-center p-1 bg-black/50 rounded-xl border border-mars-border text-xs">
                <button
                  onClick={() => {
                    setSidebarTab('layers');
                    audioService.playClick();
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    sidebarTab === 'layers'
                      ? 'bg-mars-orange text-white shadow-md'
                      : 'text-mars-dust hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>GIS LAYERS</span>
                </button>
                <button
                  onClick={() => {
                    setSidebarTab('discoveries');
                    audioService.playClick();
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    sidebarTab === 'discoveries'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-mars-dust hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>SITES ({ALL_DISCOVERIES.length})</span>
                </button>
              </div>

              {sidebarTab === 'layers' ? (
                <>
                  <h3 className="text-xs font-bold text-mars-sand tracking-wider uppercase flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-mars-orange" />
                    <span>SCIENTIFIC GIS LAYERS</span>
                  </h3>

                  {/* 5 Layer Selectors */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveLayer('hirise');
                        audioService.playClick();
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        activeLayer === 'hirise'
                          ? 'bg-mars-orange/20 border-mars-orange text-white ring-1 ring-mars-orange/40'
                          : 'bg-mars-surface border-mars-border text-mars-dust hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center space-x-1.5">
                          <Eye className="w-3.5 h-3.5 text-mars-orange" />
                          <span>HiRISE Surface Ortho</span>
                        </div>
                        <div className="text-[10px] text-mars-sand/70">Photorealistic visible light relief</div>
                      </div>
                      <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/40">
                        0.25M
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveLayer('elevation');
                        audioService.playClick();
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        activeLayer === 'elevation'
                          ? 'bg-mars-orange/20 border-mars-orange text-white ring-1 ring-mars-orange/40'
                          : 'bg-mars-surface border-mars-border text-mars-dust hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center space-x-1.5">
                          <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                          <span>MOLA Elevation Heatmap</span>
                        </div>
                        <div className="text-[10px] text-mars-sand/70">Topographic relief from -2580m</div>
                      </div>
                      <span className="text-[9px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/40">
                        MOLA
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveLayer('crism');
                        audioService.playClick();
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        activeLayer === 'crism'
                          ? 'bg-mars-orange/20 border-mars-orange text-white ring-1 ring-mars-orange/40'
                          : 'bg-mars-surface border-mars-border text-mars-dust hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <span>CRISM Hyperspectral</span>
                        </div>
                        <div className="text-[10px] text-mars-sand/70">Clays, Carbonates, Olivine</div>
                      </div>
                      <span className="text-[9px] bg-purple-950 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/40">
                        SPECTRUM
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveLayer('themis');
                        audioService.playClick();
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        activeLayer === 'themis'
                          ? 'bg-mars-orange/20 border-mars-orange text-white ring-1 ring-mars-orange/40'
                          : 'bg-mars-surface border-mars-border text-mars-dust hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center space-x-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <span>THEMIS Thermal Inertia</span>
                        </div>
                        <div className="text-[10px] text-mars-sand/70">Trafficability & bedrock density</div>
                      </div>
                      <span className="text-[9px] bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/40">
                        THEMIS
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveLayer('slope');
                        audioService.playClick();
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        activeLayer === 'slope'
                          ? 'bg-mars-orange/20 border-mars-orange text-white ring-1 ring-mars-orange/40'
                          : 'bg-mars-surface border-mars-border text-mars-dust hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center space-x-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                          <span>Slope Hazard Safety</span>
                        </div>
                        <div className="text-[10px] text-mars-sand/70">Steep terrain EVA hazard filter</div>
                      </div>
                      <span className="text-[9px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-500/40">
                        HAZARD
                      </span>
                    </button>
                  </div>

                  {/* Layer Overlay Toggles */}
                  <div className="pt-2 border-t border-mars-border/50 space-y-2">
                    <span className="text-[10px] font-bold text-mars-sand uppercase tracking-wider block">
                      VECTOR OVERLAYS
                    </span>
                    
                    <label className="flex items-center justify-between p-2 rounded-lg bg-mars-surface border border-mars-border/50 cursor-pointer">
                      <span className="text-gray-300">Historical Traverse</span>
                      <input
                        type="checkbox"
                        checked={showTraverse}
                        onChange={(e) => setShowTraverse(e.target.checked)}
                        className="accent-mars-orange cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-mars-surface border border-mars-border/50 cursor-pointer">
                      <span className="text-gray-300">Live GPS Breadcrumbs</span>
                      <input
                        type="checkbox"
                        checked={showGpsTrail}
                        onChange={(e) => setShowGpsTrail(e.target.checked)}
                        className="accent-mars-orange cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-mars-surface border border-mars-border/50 cursor-pointer">
                      <span className="text-gray-300">Topographic Isobars</span>
                      <input
                        type="checkbox"
                        checked={showIsobars}
                        onChange={(e) => setShowIsobars(e.target.checked)}
                        className="accent-mars-orange cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-mars-surface border border-mars-border/50 cursor-pointer">
                      <span className="text-gray-300">Outpost Grid (55m)</span>
                      <input
                        type="checkbox"
                        checked={showOutpostGrid}
                        onChange={(e) => setShowOutpostGrid(e.target.checked)}
                        className="accent-mars-orange cursor-pointer"
                      />
                    </label>
                  </div>
                </>
              ) : (
                /* DISCOVERIES DIRECTORY TAB (15 Sites) */
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-mars-sand tracking-wider uppercase flex items-center space-x-1.5">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      <span>DISCOVERY SITES ({ALL_DISCOVERIES.length})</span>
                    </h3>
                    <span className="text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                      CATALOG
                    </span>
                  </div>

                  {/* Search / Filter Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-mars-dust absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sites or minerals..."
                      className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-mars-border rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  {/* Scrollable Directory of All 15 Discoveries */}
                  <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                    {filteredDiscoveries.map((poi) => {
                      const dist = Math.round(Math.hypot(poi.worldPosition.x - playerPosition.x, poi.worldPosition.z - playerPosition.z));
                      const isInspected = inspectedPoi?.id === poi.id;
                      const isTarget = activeObjectiveTargetId === poi.id;

                      return (
                        <div
                          key={poi.id}
                          onClick={() => handleFocusPoi(poi)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col space-y-1 ${
                            isInspected
                              ? 'bg-cyan-950/80 border-cyan-400 ring-1 ring-cyan-400/50'
                              : isTarget
                              ? 'bg-amber-950/60 border-amber-400'
                              : 'bg-mars-surface border-mars-border hover:bg-white/5 hover:border-mars-sand/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase">
                              {poi.category} • SOL {poi.observationDate?.split(' ')[0] || '0'}
                            </span>
                            <span className="text-[10px] text-amber-300 font-bold">
                              {dist}m away
                            </span>
                          </div>

                          <div className="font-bold text-white text-xs leading-snug">
                            {poi.name}
                          </div>

                          <div className="flex items-center space-x-1.5 pt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFocusPoi(poi);
                              }}
                              className="flex-1 py-1 px-2 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-500/40 text-[10px] font-bold flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <Crosshair className="w-3 h-3" />
                              <span>LOCATE</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectPoi(poi.id);
                              }}
                              className="flex-1 py-1 px-2 rounded bg-mars-panel hover:bg-white/10 text-white border border-mars-border text-[10px] font-bold flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3 text-cyan-400" />
                              <span>DOSSIER</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom NASA Reference Link */}
            <div className="pt-4 border-t border-mars-border/50">
              <a
                href="https://trek.nasa.gov/mars/"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-gradient-to-r from-mars-orange/20 to-amber-600/20 hover:from-mars-orange/30 hover:to-amber-600/30 text-white font-bold border border-mars-orange/40 transition-all text-[11px]"
              >
                <span>OPEN NASA MARS TREK (JPL)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
