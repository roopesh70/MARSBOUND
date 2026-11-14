import React, { useState } from 'react';
import { JEZERO_DISCOVERIES } from '../../data/discoveries';
import { OutpostStructure } from '../../types/outpost';
import { Maximize2, Minimize2, Navigation, Compass } from 'lucide-react';

interface MiniMapProps {
  playerPosition: { x: number; y: number; z: number };
  playerHeading: number;
  isDrivingRover?: boolean;
  activeTargetPoiId?: string;
  customWaypoint?: { x: number; z: number; label?: string } | null;
  structures?: OutpostStructure[];
  onOpenFullMap: () => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  playerPosition,
  playerHeading,
  isDrivingRover = false,
  activeTargetPoiId,
  customWaypoint,
  structures = [],
  onOpenFullMap
}) => {
  const [zoomRangeMeters, setZoomRangeMeters] = useState<number>(160); // 80m, 160m, 320m
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Radar display properties
  const radarRadius = 80; // pixels
  const center = { x: 90, y: 90 };

  // Convert relative world coordinates to radar pixels
  // Center is player position
  const toRadarPos = (worldX: number, worldZ: number) => {
    const dx = worldX - playerPosition.x;
    const dz = worldZ - playerPosition.z;

    const scale = radarRadius / zoomRangeMeters;
    const px = center.x + dx * scale;
    const py = center.y + dz * scale; // In world, +Z is south, -Z is north

    // Calculate distance from center to clamp within circular boundary
    const distFromCenter = Math.hypot(px - center.x, py - center.y);
    const isInside = distFromCenter <= radarRadius;

    // Clamped position along border if outside
    const angle = Math.atan2(py - center.y, px - center.x);
    const clampedPx = center.x + Math.cos(angle) * (radarRadius - 4);
    const clampedPy = center.y + Math.sin(angle) * (radarRadius - 4);

    return {
      x: isInside ? px : clampedPx,
      y: isInside ? py : clampedPy,
      isClamped: !isInside,
      distanceMeters: Math.round(Math.hypot(dx, dz))
    };
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="flex items-center space-x-1.5 bg-black/85 backdrop-blur-md border border-mars-border/80 hover:border-mars-orange text-mars-sand hover:text-white px-3 py-1.5 rounded-xl text-xs font-mono shadow-2xl transition-all cursor-pointer pointer-events-auto"
        title="Expand Mini-Map Radar"
      >
        <Navigation className="w-3.5 h-3.5 text-mars-orange" />
        <span>RADAR HUD</span>
      </button>
    );
  }

  return (
    <div className="relative bg-black/85 backdrop-blur-md border border-mars-border/80 rounded-2xl p-2.5 shadow-2xl font-mono text-[10px] pointer-events-auto select-none ring-1 ring-white/5 transition-all">
      {/* Mini-map Header */}
      <div className="flex items-center justify-between px-1 pb-1.5 border-b border-mars-border/50 text-mars-dust mb-1">
        <div className="flex items-center space-x-1.5 text-mars-sand font-bold">
          <Compass className="w-3 h-3 text-mars-orange" />
          <span>RADAR • {zoomRangeMeters}M</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setZoomRangeMeters((prev) => (prev === 80 ? 160 : prev === 160 ? 320 : 80))}
            className="px-1.5 py-0.5 rounded bg-mars-surface hover:bg-white/10 text-mars-sand hover:text-white border border-mars-border/50 text-[9px] transition-colors cursor-pointer"
            title="Cycle Radar Zoom Range"
          >
            {zoomRangeMeters}m
          </button>
          <button
            onClick={onOpenFullMap}
            className="p-1 rounded bg-mars-surface hover:bg-white/10 text-mars-sand hover:text-white border border-mars-border/50 transition-colors cursor-pointer"
            title="Open Full Tactical GIS Map [M]"
          >
            <Maximize2 className="w-3 h-3 text-cyan-400" />
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded bg-mars-surface hover:bg-white/10 text-mars-sand hover:text-white border border-mars-border/50 transition-colors cursor-pointer"
            title="Minimize Radar"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Circular Radar Screen */}
      <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden border border-mars-border/80 bg-gradient-to-b from-[#130906] to-[#070302] shadow-inner flex items-center justify-center">
        {/* Radar Sweep Rotating Line */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-40 animate-spin"
          style={{
            animationDuration: '4s',
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(245, 158, 11, 0.35) 60deg, transparent 65deg)'
          }}
        />

        <svg className="w-full h-full pointer-events-none">
          <defs>
            <radialGradient id="radarGridGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22110c" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0b0503" stopOpacity="0.95" />
            </radialGradient>
          </defs>

          {/* Background */}
          <circle cx={center.x} cy={center.y} r={radarRadius} fill="url(#radarGridGlow)" />

          {/* Concentric Range Rings */}
          <circle
            cx={center.x}
            cy={center.y}
            r={radarRadius * 0.33}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <circle
            cx={center.x}
            cy={center.y}
            r={radarRadius * 0.66}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <circle
            cx={center.x}
            cy={center.y}
            r={radarRadius - 1}
            fill="none"
            stroke="rgba(245, 158, 11, 0.4)"
            strokeWidth="1.2"
          />

          {/* Crosshairs */}
          <line
            x1={center.x - radarRadius}
            y1={center.y}
            x2={center.x + radarRadius}
            y2={center.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.8"
          />
          <line
            x1={center.x}
            y1={center.y - radarRadius}
            x2={center.x}
            y2={center.y + radarRadius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.8"
          />

          {/* North Tag */}
          <text
            x={center.x}
            y={center.y - radarRadius + 10}
            fill="#f59e0b"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
            fontWeight="bold"
          >
            N
          </text>

          {/* Base Safe Zone Circle (at world 0,0) */}
          {(() => {
            const basePos = toRadarPos(0, 0);
            const scale = radarRadius / zoomRangeMeters;
            const safeZoneRadiusPx = 25 * scale;
            return (
              <g>
                <circle
                  cx={basePos.x}
                  cy={basePos.y}
                  r={Math.max(4, safeZoneRadiusPx)}
                  fill="rgba(52, 211, 153, 0.12)"
                  stroke="#34d399"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                />
                <circle cx={basePos.x} cy={basePos.y} r="2.5" fill="#34d399" />
              </g>
            );
          })()}

          {/* Outpost Structures Blips */}
          {structures.map((s) => {
            const pos = toRadarPos(s.position.x, s.position.z);
            if (pos.isClamped) return null;
            return (
              <circle
                key={s.id}
                cx={pos.x}
                cy={pos.y}
                r="2"
                fill="#38bdf8"
                opacity="0.8"
              />
            );
          })}

          {/* Mars Archival Library Building Blip */}
          {(() => {
            const libPos = toRadarPos(26, -26);
            return (
              <g key="mini_mars_library">
                <title>MARS ARCHIVAL LIBRARY & RESEARCH FACILITY ({libPos.distanceMeters}m away)</title>
                <circle
                  cx={libPos.x}
                  cy={libPos.y}
                  r="3.5"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                />
                {!libPos.isClamped && (
                  <text
                    x={libPos.x + 4.5}
                    y={libPos.y + 2.5}
                    fill="#38bdf8"
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    LIB
                  </text>
                )}
              </g>
            );
          })()}

          {/* POI Blips */}
          {JEZERO_DISCOVERIES.map((poi) => {
            const pos = toRadarPos(poi.worldPosition.x, poi.worldPosition.z);
            const isTarget = activeTargetPoiId === poi.id;

            return (
              <g key={poi.id}>
                <title>{poi.name} ({pos.distanceMeters}m away)</title>
                {isTarget && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="6.5"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    className="animate-ping"
                    opacity="0.8"
                  />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isTarget ? 3.5 : 2}
                  fill={isTarget ? '#fbbf24' : '#38bdf8'}
                  stroke={isTarget ? '#ffffff' : '#0c0706'}
                  strokeWidth="0.8"
                  opacity={pos.isClamped ? 0.6 : 1}
                />
              </g>
            );
          })}

          {/* Custom Waypoint Pin if set */}
          {customWaypoint && (() => {
            const pos = toRadarPos(customWaypoint.x, customWaypoint.z);
            return (
              <g>
                {/* Guide line from center to waypoint */}
                <line
                  x1={center.x}
                  y1={center.y}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="#ec4899"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.7"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="7"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
                <circle cx={pos.x} cy={pos.y} r="3" fill="#ec4899" stroke="#ffffff" strokeWidth="1" />
              </g>
            );
          })()}

          {/* Player Center Blip & Heading Cone */}
          {(() => {
            const rad = (playerHeading * Math.PI) / 180;
            const arrowLen = 10;
            const tipX = center.x + Math.sin(rad) * arrowLen;
            const tipY = center.y - Math.cos(rad) * arrowLen;

            return (
              <g>
                {/* Heading view cone */}
                <line
                  x1={center.x}
                  y1={center.y}
                  x2={tipX}
                  y2={tipY}
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Player dot */}
                <circle
                  cx={center.x}
                  cy={center.y}
                  r="4"
                  fill={isDrivingRover ? '#06b6d4' : '#ef4444'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </g>
            );
          })()}
        </svg>

        {/* Hover / Status pill overlay */}
        <div className="absolute bottom-1 text-[8.5px] font-mono text-mars-sand/80 bg-black/60 px-2 py-0.5 rounded-full border border-mars-border/40 pointer-events-none">
          {isDrivingRover ? 'ROVER TRANSIT' : 'EVA ON FOOT'}
        </div>
      </div>

      {/* Mini-map Footer Quick Actions */}
      <div className="mt-1.5 flex items-center justify-between text-[9px] text-mars-dust px-1">
        <span>[M] FULL GIS MAP</span>
        <button
          onClick={onOpenFullMap}
          className="text-mars-orange hover:text-white font-bold flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <span>EXPAND</span>
          <Maximize2 className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};
