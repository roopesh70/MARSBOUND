import React from 'react';
import { GameTelemetry } from '../../game/MarsCanvas';
import { Mission } from '../../types/mission';
import { JEZERO_DISCOVERIES } from '../../data/discoveries';
import { OutpostStructure } from '../../types/outpost';
import { Compass } from './Compass';
import { CoordinateDisplay } from './CoordinateDisplay';
import { SurvivalStatus } from './SurvivalStatus';
import { ScannerReticle } from './ScannerReticle';
import { MiniMap } from './MiniMap';
import { 
  Navigation, 
  BookOpen, 
  Target, 
  Database, 
  Settings as SettingsIcon, 
  AlertTriangle, 
  MousePointer, 
  Car, 
  Hammer,
  Gauge,
  Battery,
  Lightbulb,
  MapPin
} from 'lucide-react';

interface HUDProps {
  telemetry: GameTelemetry | null;
  mission: Mission;
  onOpenMap: () => void;
  onOpenMission: () => void;
  onOpenJournal: () => void;
  onOpenProvenance: () => void;
  onOpenSettings: () => void;
  onScan: () => void;
  onRequestPointerLock: () => void;
  onToggleBuildMode: () => void;
  onToggleRover: () => void;
  onToggleLight?: () => void;
  customWaypoint?: { x: number; z: number; label?: string } | null;
  structures?: OutpostStructure[];
  onClearCustomWaypoint?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  telemetry,
  mission,
  onOpenMap,
  onOpenMission,
  onOpenJournal,
  onOpenProvenance,
  onOpenSettings,
  onScan,
  onRequestPointerLock,
  onToggleBuildMode,
  onToggleRover,
  onToggleLight,
  customWaypoint = null,
  structures = [],
  onClearCustomWaypoint
}) => {
  if (!telemetry) return null;

  const currentObjective = mission.objectives[mission.currentObjectiveIndex];
  const targetPoi = currentObjective?.targetDiscoveryId
    ? JEZERO_DISCOVERIES.find((p) => p.id === currentObjective.targetDiscoveryId)
    : null;

  let targetDistance: number | null = null;
  let targetDirectionStr: string = '';
  if (targetPoi && telemetry) {
    const dx = targetPoi.worldPosition.x - telemetry.position.x;
    const dz = targetPoi.worldPosition.z - telemetry.position.z;
    targetDistance = Math.round(Math.sqrt(dx * dx + dz * dz));
    const angleRad = Math.atan2(dx, -dz);
    let deg = Math.round((angleRad * (180 / Math.PI)) % 360);
    if (deg < 0) deg += 360;
    const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    targetDirectionStr = cardinals[Math.round(deg / 45)];
  }

  const { forward, backward, left, right, sprint } = telemetry.inputs || {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 md:p-6 overflow-hidden">
      {/* Top Bar: Compass, Time & Coordinates */}
      <div className="flex items-start justify-between w-full pointer-events-auto">
        <div className="space-y-2">
          <CoordinateDisplay coordinates={telemetry.coordinates} solTime={telemetry.solTime} />
          
          {/* Mission Mini-Objective Tracker */}
          {currentObjective && !mission.completed && (
            <div 
              onClick={onOpenMission}
              className="bg-black/80 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-mars-orange/60 text-xs font-mono max-w-md cursor-pointer hover:bg-black/95 transition-all shadow-2xl pointer-events-auto ring-1 ring-mars-orange/30 group"
            >
              <div className="flex items-center justify-between text-mars-orange font-bold text-[10px] uppercase">
                <div className="flex items-center space-x-1.5">
                  <Target className="w-3.5 h-3.5 animate-pulse" />
                  <span>MISSION STEP {mission.currentObjectiveIndex + 1}/{mission.objectives.length}</span>
                </div>
                {targetDistance !== null && (
                  <span className="text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 font-bold">
                    {targetDistance}m [{targetDirectionStr}]
                  </span>
                )}
              </div>
              <div className="text-white font-semibold text-xs mt-1 truncate group-hover:text-amber-200 transition-colors">
                {currentObjective.title}
              </div>
              <div className="text-[11px] text-mars-dust mt-0.5 line-clamp-1">
                {currentObjective.description}
              </div>
            </div>
          )}

          {/* Custom Waypoint Distance Tracker */}
          {customWaypoint && (
            <div className="flex items-center space-x-2 bg-pink-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-pink-500/70 text-xs font-mono text-pink-200 shadow-xl pointer-events-auto">
              <MapPin className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
              <span className="font-bold">{customWaypoint.label || 'NAV PIN'}:</span>
              <span className="text-white font-bold">{Math.round(Math.hypot(customWaypoint.x - telemetry.position.x, customWaypoint.z - telemetry.position.z))}m</span>
              {onClearCustomWaypoint && (
                <button
                  onClick={onClearCustomWaypoint}
                  className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-pink-900 hover:bg-pink-800 text-pink-100 cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>
          )}

          {/* Active Rover Mode Bar */}
          {telemetry.isDrivingRover && (
            <div className="flex items-center space-x-3 bg-cyan-950/80 backdrop-blur-md border border-cyan-500/70 px-4 py-2 rounded-xl text-xs font-mono shadow-2xl">
              <Car className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Gauge className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="text-white font-bold">{telemetry.roverSpeedKmh.toFixed(0)} KM/H</span>
                </div>
                <div className="h-3 w-px bg-cyan-700" />
                <div className="flex items-center space-x-1">
                  <Battery className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-bold">{telemetry.roverBattery.toFixed(0)}%</span>
                </div>
                <button
                  onClick={onToggleRover}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ml-1"
                >
                  DISMOUNT [E]
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2 pointer-events-auto">
          <Compass heading={telemetry.heading} />

          {/* Real-time Circular Radar Mini-Map */}
          <MiniMap
            playerPosition={telemetry.position}
            playerHeading={telemetry.heading}
            isDrivingRover={telemetry.isDrivingRover}
            activeTargetPoiId={currentObjective?.targetDiscoveryId}
            customWaypoint={customWaypoint}
            structures={structures}
            onOpenFullMap={onOpenMap}
          />

          {/* Boundary alert if approaching exploration perimeter */}
          {telemetry.isNearBoundary && (
            <div className="flex items-center space-x-1.5 bg-amber-950/80 border border-amber-500/60 text-amber-300 px-3 py-1 rounded-lg text-xs font-mono animate-pulse shadow-lg">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>APPROACHING EXPEDITION PERIMETER</span>
            </div>
          )}

          {/* Rover mount prompt when walking near rover */}
          {telemetry.isNearRover && !telemetry.isDrivingRover && (
            <button
              onClick={onToggleRover}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-xs font-bold px-4 py-2 rounded-xl border border-cyan-400 shadow-2xl hover:scale-105 transition-all cursor-pointer animate-bounce pointer-events-auto"
            >
              <Car className="w-4 h-4" />
              <span>PRESS [E] TO BOARD MARS ROVER</span>
            </button>
          )}
        </div>
      </div>

      {/* Center Reticle & Targeting Scanner (hidden when driving rover for clear view) */}
      {!telemetry.isDrivingRover && (
        <ScannerReticle
          nearestPoi={telemetry.nearestPoi}
          distance={telemetry.nearestPoiDistance}
          onScan={onScan}
          battery={telemetry.suit.battery}
        />
      )}

      {/* Pointer Lock Help Banner if mouse unlocked */}
      {!telemetry.isPointerLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto text-center space-y-2">
          <button
            onClick={onRequestPointerLock}
            className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-black/85 backdrop-blur-md border border-mars-orange text-white font-mono text-xs font-bold shadow-2xl hover:bg-mars-surface hover:border-mars-glow transition-all cursor-pointer animate-pulse"
          >
            <MousePointer className="w-4 h-4 text-mars-orange" />
            <span>CLICK TO LOCK MOUSE LOOK (OR DRAG TO LOOK)</span>
          </button>
          <div className="text-[11px] font-mono text-mars-dust/80 bg-black/60 px-3 py-1 rounded-lg border border-mars-border inline-block">
            Use [W, A, S, D] to walk/drive • [Space] to Hop • [Shift] to Sprint • [B] to Build
          </div>
        </div>
      )}

      {/* Bottom Bar: Action buttons on left & Survival gauges on right */}
      <div className="flex items-end justify-between w-full pointer-events-auto">
        <div className="flex flex-col space-y-2">
          {/* Real-time WASD input state indicators */}
          <div className="flex items-center space-x-1.5 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-mars-border/80 text-[11px] font-mono text-mars-dust w-fit shadow-lg">
            <span className="text-mars-sand font-bold text-[10px] mr-1">CONTROLS:</span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${forward ? 'bg-mars-orange text-white border-mars-glow' : 'bg-mars-surface border-mars-border text-mars-sand'}`}>
              W
            </span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${left ? 'bg-mars-orange text-white border-mars-glow' : 'bg-mars-surface border-mars-border text-mars-sand'}`}>
              A
            </span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${backward ? 'bg-mars-orange text-white border-mars-glow' : 'bg-mars-surface border-mars-border text-mars-sand'}`}>
              S
            </span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${right ? 'bg-mars-orange text-white border-mars-glow' : 'bg-mars-surface border-mars-border text-mars-sand'}`}>
              D
            </span>
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${sprint ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-mars-surface border-mars-border text-mars-sand'}`}>
              SHIFT
            </span>
            <span className="px-2 py-0.5 rounded border text-[10px] font-bold bg-mars-surface border-mars-border text-mars-sand">
              SPACE
            </span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${telemetry.isFlashlightOn ? 'bg-amber-500 text-black border-amber-300' : 'bg-mars-surface border-mars-border text-mars-sand'}`}>
              L
            </span>
          </div>

          {/* Navigation Hotbar */}
          <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-mars-border/80 text-xs font-mono shadow-2xl">
            <button
              onClick={onToggleLight}
              title="Toggle Flashlight / Rover Headlights [L]"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                telemetry.isFlashlightOn
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                  : 'bg-mars-surface border-mars-border text-mars-dust hover:text-white'
              }`}
            >
              <Lightbulb className={`w-4 h-4 ${telemetry.isFlashlightOn ? 'text-amber-300 animate-pulse' : 'text-mars-sand'}`} />
              <span>LIGHT [L]</span>
            </button>

            <button
              onClick={onOpenMap}
              title="Tactical GIS Map [M]"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-mars-surface hover:bg-white/10 text-white border border-mars-border transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-mars-orange" />
              <span>MAP [M]</span>
            </button>

            <button
              onClick={onOpenMission}
              title="Mission Briefing & Objectives [O]"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-mars-surface hover:bg-white/10 text-white border border-mars-border transition-colors cursor-pointer"
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>MISSIONS</span>
            </button>

            <button
              onClick={onToggleBuildMode}
              title="Outpost Base Build Mode [B]"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-mars-surface hover:bg-white/10 text-white border border-mars-border transition-colors cursor-pointer"
            >
              <Hammer className="w-4 h-4 text-amber-400" />
              <span>BUILD [B]</span>
            </button>

            <button
              onClick={onOpenJournal}
              title="Research Journal & Samples [J]"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-mars-surface hover:bg-white/10 text-white border border-mars-border transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>JOURNAL [J]</span>
            </button>

            <button
              onClick={onOpenProvenance}
              title="NASA Science Data Provenance [R]"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-mars-surface hover:bg-white/10 text-white border border-mars-border transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">PROVENANCE</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="Simulator Settings"
              className="p-2 rounded-lg bg-mars-surface hover:bg-white/10 text-white border border-mars-border transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4 text-mars-sand" />
            </button>
          </div>
        </div>

        {/* Survival Status Component */}
        <SurvivalStatus suit={telemetry.suit} environment={telemetry.environment} />
      </div>
    </div>
  );
};
