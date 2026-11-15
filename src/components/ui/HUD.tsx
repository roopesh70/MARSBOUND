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
  MapPin,
  Lock,
  Unlock,
  FlaskConical,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { RimfaxEchogramWidget } from './RimfaxEchogramWidget';

interface HUDProps {
  telemetry: GameTelemetry | null;
  mission: Mission;
  onOpenMap: () => void;
  onOpenMission: () => void;
  onOpenJournal: () => void;
  onOpenProvenance: () => void;
  onOpenLibrary?: () => void;
  onOpenScienceLab?: () => void;
  researchPoints?: number;
  onDeployCoreDrill?: () => void;
  onOpenRimfaxRadar?: () => void;
  isDrilling?: boolean;
  onOpenSettings: () => void;
  onScan: () => void;
  onRequestPointerLock: () => void;
  onUnlockPointer?: () => void;
  isPointerLocked?: boolean;
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
  onOpenLibrary,
  onOpenScienceLab,
  researchPoints = 0,
  onDeployCoreDrill,
  onOpenRimfaxRadar,
  isDrilling = false,
  onOpenSettings,
  onScan,
  onRequestPointerLock,
  onUnlockPointer,
  isPointerLocked,
  onToggleBuildMode,
  onToggleRover,
  onToggleLight,
  customWaypoint = null,
  structures = [],
  onClearCustomWaypoint
}) => {
  if (!telemetry) return null;

  const isTouchDevice = typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth < 1024);
  const effectiveIsLocked = isPointerLocked ?? telemetry.isPointerLocked;

  const currentObjective = mission.objectives[mission.currentObjectiveIndex];
  const targetPoi = currentObjective?.targetDiscoveryId
    ? JEZERO_DISCOVERIES.find((p) => p.id === currentObjective.targetDiscoveryId)
    : null;

  let targetWorldPos: { x: number; z: number } | null = null;
  if (targetPoi) {
    targetWorldPos = { x: targetPoi.worldPosition.x, z: targetPoi.worldPosition.z };
  } else if (currentObjective?.type === 'return_outpost') {
    targetWorldPos = { x: 0, z: 0 };
  } else if (currentObjective?.targetRegionId === 'neretva_vallis') {
    targetWorldPos = { x: -220, z: -110 };
  } else if (currentObjective?.type === 'visit_library') {
    targetWorldPos = { x: 26, z: -26 };
  } else if (currentObjective?.type === 'analyze_sample' || currentObjective?.type === 'unlock_tech') {
    targetWorldPos = { x: -18, z: -16 };
  } else if (currentObjective?.type === 'radar_sounding' || currentObjective?.type === 'deep_core_drill') {
    targetWorldPos = { x: -80, z: -45 };
  }

  let targetDistance: number | null = null;
  let targetDirectionStr: string = '';
  if (targetWorldPos && telemetry) {
    const dx = targetWorldPos.x - telemetry.position.x;
    const dz = targetWorldPos.z - telemetry.position.z;
    targetDistance = Math.round(Math.hypot(dx, dz));
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
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* 1. Immersive EVA Astronaut Helmet Visor Glass & Gold UV Glare (or Rover Cockpit Canopy) */}
      {!telemetry.isDrivingRover ? (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Outer Curved Helmet Bezel Vignette */}
          <div
            className="absolute inset-0 opacity-35"
            style={{
              background: 'radial-gradient(ellipse 110% 88% at 50% 50%, transparent 68%, rgba(6, 4, 3, 0.45) 88%, rgba(3, 2, 2, 0.85) 100%)'
            }}
          />
          {/* Polycarbonate Gold UV Protection Reflection Rim at Upper Brow */}
          <div
            className="absolute top-0 left-0 right-0 h-28 opacity-25"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.08) 60%, transparent 100%)'
            }}
          />
          {/* Subtle Curved Visor Optical Contour Highlights */}
          <svg className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M 5,2 C 30,8 70,8 95,2" fill="none" stroke="#fbbf24" strokeWidth="0.35" />
            <path d="M 10,98 C 30,94 70,94 90,98" fill="none" stroke="#60a5fa" strokeWidth="0.25" opacity="0.6" />
          </svg>
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Rover Reinforced Cockpit Windshield Tint & Pillar Frame Vignette */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: 'radial-gradient(ellipse 120% 95% at 50% 50%, transparent 75%, rgba(15, 23, 42, 0.5) 95%, rgba(2, 6, 23, 0.85) 100%)'
            }}
          />
          {/* Upper Windshield Tint Strip */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-cyan-950/20 to-transparent opacity-40" />
        </div>
      )}

      {/* Top Bar: Compass, Time & Coordinates */}
      <div className="flex items-start justify-between w-full pointer-events-auto gap-2">
        <div className="space-y-1 md:space-y-2">
          <CoordinateDisplay 
            coordinates={telemetry.coordinates} 
            solTime={telemetry.solTime} 
            regionName={telemetry.activeRegionName}
          />
          
          {/* Mission Mini-Objective Tracker */}
          {currentObjective && !mission.completed ? (
            <div 
              onClick={onOpenMission}
              className="bg-black/80 backdrop-blur-md px-2.5 py-1.5 md:px-3.5 md:py-2.5 rounded-lg md:rounded-xl border border-mars-orange/60 text-[10px] md:text-xs font-mono max-w-[230px] sm:max-w-xs md:max-w-md cursor-pointer hover:bg-black/95 transition-all shadow-2xl pointer-events-auto ring-1 ring-mars-orange/30 group"
            >
              <div className="flex items-center justify-between text-mars-orange font-bold text-[8.5px] md:text-[10px] uppercase gap-1">
                <div className="flex items-center space-x-1 md:space-x-1.5 truncate">
                  <Target className="w-3 h-3 md:w-3.5 md:h-3.5 animate-pulse shrink-0" />
                  <span className="truncate">STEP {mission.currentObjectiveIndex + 1}/{mission.objectives.length} • {mission.code}</span>
                </div>
                {targetDistance !== null && (
                  <span className="text-amber-300 bg-amber-950/60 px-1.5 py-0.2 md:px-2 md:py-0.5 rounded border border-amber-500/40 font-bold shrink-0 text-[8px] md:text-[10px]">
                    {targetDistance}m [{targetDirectionStr}]
                  </span>
                )}
              </div>
              <div className="text-white font-semibold text-[10px] md:text-xs mt-0.5 md:mt-1 truncate group-hover:text-amber-200 transition-colors">
                {currentObjective.title}
              </div>
              <div className="text-[9px] md:text-[11px] text-mars-dust mt-0.5 line-clamp-1">
                {currentObjective.description}
              </div>
            </div>
          ) : mission.completed ? (
            <div
              onClick={onOpenMission}
              className="bg-emerald-950/80 backdrop-blur-md px-2.5 py-1.5 md:px-3.5 md:py-2.5 rounded-lg md:rounded-xl border border-emerald-500/60 text-[10px] md:text-xs font-mono max-w-[230px] sm:max-w-xs md:max-w-md cursor-pointer hover:bg-emerald-900/80 transition-all shadow-2xl pointer-events-auto ring-1 ring-emerald-500/40 group animate-in fade-in"
            >
              <div className="flex items-center justify-between text-emerald-400 font-bold text-[8.5px] md:text-[10px] uppercase gap-1">
                <div className="flex items-center space-x-1 md:space-x-1.5 truncate">
                  <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">EXPEDITION ACCOMPLISHED</span>
                </div>
                <span className="text-emerald-300 bg-emerald-900/70 px-1.5 py-0.2 md:px-2 md:py-0.5 rounded border border-emerald-500/50 font-bold shrink-0 text-[8px] md:text-[10px]">
                  +{mission.rewards.researchPointsReward} RP
                </span>
              </div>
              <div className="text-white font-semibold text-[10px] md:text-xs mt-0.5 md:mt-1 truncate group-hover:text-emerald-200 transition-colors">
                {mission.title}
              </div>
              <div className="text-[9px] md:text-[11px] text-emerald-300/80 mt-0.5 truncate">
                {isTouchDevice ? 'Tap to view all expeditions' : 'Press [O] to view all expeditions'}
              </div>
            </div>
          ) : null}

          {/* Custom Waypoint Distance Tracker */}
          {customWaypoint && (
            <div className="flex items-center space-x-1.5 md:space-x-2 bg-pink-950/85 backdrop-blur-md px-2 py-1 md:px-3.5 md:py-1.5 rounded-lg md:rounded-xl border border-pink-500/70 text-[9px] md:text-xs font-mono text-pink-200 shadow-xl pointer-events-auto max-w-fit">
              <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-pink-400 animate-bounce shrink-0" />
              <span className="font-bold">{customWaypoint.label || 'NAV PIN'}:</span>
              <span className="text-white font-bold">{Math.round(Math.hypot(customWaypoint.x - telemetry.position.x, customWaypoint.z - telemetry.position.z))}m</span>
              {onClearCustomWaypoint && (
                <button
                  onClick={onClearCustomWaypoint}
                  className="ml-1 text-[8px] md:text-[9px] px-1 md:px-1.5 py-0.5 rounded bg-pink-900 hover:bg-pink-800 text-pink-100 cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>
          )}

          {/* Active Rover Mode Bar */}
          {telemetry.isDrivingRover && (
            <div className="flex items-center space-x-1.5 md:space-x-3 bg-cyan-950/80 backdrop-blur-md border border-cyan-500/70 px-2.5 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-mono shadow-2xl max-w-fit">
              <Car className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-400 animate-pulse shrink-0" />
              <div className="flex items-center space-x-1.5 md:space-x-3">
                <div className="flex items-center space-x-1">
                  <Gauge className="w-3 h-3 md:w-3.5 md:h-3.5 text-cyan-300" />
                  <span className="text-white font-bold">{telemetry.roverSpeedKmh.toFixed(0)} KM/H</span>
                </div>
                <div className="h-2.5 md:h-3 w-px bg-cyan-700" />
                <div className="flex items-center space-x-1">
                  <Battery className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-bold">{telemetry.roverBattery.toFixed(0)}%</span>
                </div>
                <button
                  onClick={onToggleRover}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black px-1.5 md:px-2.5 py-0.5 rounded text-[8.5px] md:text-[10px] font-bold uppercase transition-colors cursor-pointer ml-1"
                >
                  {isTouchDevice ? 'DISMOUNT' : 'DISMOUNT [E]'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end space-y-1.5 md:space-y-2 pointer-events-auto">
          <Compass heading={telemetry.heading} />

          {/* Real-time Circular Radar Mini-Map */}
          <MiniMap
            playerPosition={telemetry.position}
            roverPosition={telemetry.roverPosition}
            playerHeading={telemetry.heading}
            isDrivingRover={telemetry.isDrivingRover}
            activeTargetPoiId={currentObjective?.targetDiscoveryId}
            customWaypoint={customWaypoint}
            structures={structures}
            onOpenFullMap={onOpenMap}
          />

          {/* Boundary alert if approaching exploration perimeter */}
          {telemetry.isNearBoundary && (
            <div className="flex items-center space-x-1 md:space-x-1.5 bg-amber-950/80 border border-amber-500/60 text-amber-300 px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-[9px] md:text-xs font-mono animate-pulse shadow-lg">
              <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-amber-400 shrink-0" />
              <span>APPROACHING PERIMETER</span>
            </div>
          )}

          {/* Rover mount prompt when walking near rover */}
          {telemetry.isNearRover && !telemetry.isDrivingRover && (
            <button
              onClick={onToggleRover}
              className="flex items-center space-x-1.5 md:space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-[9px] md:text-xs font-bold px-2.5 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-cyan-400 shadow-2xl hover:scale-105 transition-all cursor-pointer animate-bounce pointer-events-auto"
            >
              <Car className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
              <span>{isTouchDevice ? 'TAP TO BOARD MARS ROVER' : 'PRESS [E] TO BOARD MARS ROVER'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mars Archival Library Proximity Prompt */}
      {telemetry.isNearLibrary && !telemetry.isDrivingRover && (
        <div className="fixed bottom-20 md:bottom-28 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-2 md:space-x-3 bg-slate-950/95 border border-cyan-400/80 text-cyan-200 px-3 py-2 md:px-6 md:py-3.5 rounded-xl md:rounded-2xl shadow-[0_0_35px_rgba(56,189,248,0.4)] backdrop-blur-md animate-pulse pointer-events-auto max-w-[92vw] md:max-w-none">
          <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 shrink-0" />
          <div className="font-mono text-[9.5px] md:text-xs">
            <span className="font-bold text-white block truncate">MARS ARCHIVAL LIBRARY</span>
            <span className="text-cyan-300">
              {isTouchDevice ? (
                'Tap ENTER to open repository'
              ) : (
                <>
                  Press <span className="bg-cyan-900/90 text-white px-1.5 py-0.5 rounded border border-cyan-400 font-bold">[L]</span> or click to enter
                </>
              )}
            </span>
          </div>
          {onOpenLibrary && (
            <button
              onClick={onOpenLibrary}
              className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-[9px] md:text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              ENTER
            </button>
          )}
        </div>
      )}

      {/* Field Science Laboratory Proximity Prompt */}
      {telemetry.isNearScienceLab && !telemetry.isDrivingRover && (
        <div className="fixed bottom-20 md:bottom-28 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-2 md:space-x-3 bg-slate-950/95 border border-emerald-400/80 text-emerald-200 px-3 py-2 md:px-6 md:py-3.5 rounded-xl md:rounded-2xl shadow-[0_0_35px_rgba(16,185,129,0.4)] backdrop-blur-md animate-pulse pointer-events-auto max-w-[92vw] md:max-w-none">
          <FlaskConical className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 shrink-0" />
          <div className="font-mono text-[9.5px] md:text-xs">
            <span className="font-bold text-white block truncate">SCIENCE LAB • CHEMIN / PIXL</span>
            <span className="text-emerald-300">
              {isTouchDevice ? (
                'Tap ENTER LAB to analyze mineral samples'
              ) : (
                <>
                  Press <span className="bg-emerald-900/90 text-white px-1.5 py-0.5 rounded border border-emerald-400 font-bold">[K]</span> or click to analyze
                </>
              )}
            </span>
          </div>
          {onOpenScienceLab && (
            <button
              onClick={onOpenScienceLab}
              className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-mono font-bold text-[9px] md:text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              ENTER LAB
            </button>
          )}
        </div>
      )}

      {/* Center Reticle & Targeting Scanner (hidden when driving rover for clear view) */}
      {!telemetry.isDrivingRover && (
        <ScannerReticle
          nearestPoi={telemetry.nearestPoi}
          distance={telemetry.nearestPoiDistance}
          onScan={onScan}
          battery={telemetry.suit.battery}
        />
      )}

      {/* Active Rover Subsurface Radar (RIMFAX) Echogram Widget */}
      {telemetry.isDrivingRover && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-in fade-in slide-in-from-bottom duration-300">
          <RimfaxEchogramWidget
            telemetry={telemetry.rimfax}
            speedKmh={telemetry.roverSpeedKmh}
            onDeployCoreDrill={onDeployCoreDrill || (() => {})}
            onOpenFullRadar={onOpenRimfaxRadar || (() => {})}
            isDrilling={isDrilling}
          />
        </div>
      )}

      {/* Pointer Lock Help Banner if mouse unlocked (Desktop only) */}
      {!effectiveIsLocked && !isTouchDevice && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto text-center space-y-2">
          <button
            onClick={onRequestPointerLock}
            className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-black/85 backdrop-blur-md border border-mars-orange text-white font-mono text-xs font-bold shadow-2xl hover:bg-mars-surface hover:border-mars-glow transition-all cursor-pointer animate-pulse"
          >
            <MousePointer className="w-4 h-4 text-mars-orange" />
            <span>CLICK TO LOCK MOUSE LOOK (OR DRAG TO LOOK)</span>
          </button>
          <div className="text-[11px] font-mono text-mars-dust/80 bg-black/60 px-3 py-1 rounded-lg border border-mars-border inline-block">
            Use [W, A, S, D] to walk/drive • [Space] to Hop • [Shift] to Sprint • [Esc] or [Alt] to Unlock Mouse • [B] to Build
          </div>
        </div>
      )}

      {/* Bottom Bar: Action buttons on left & Survival gauges on right */}
      <div className="flex items-end justify-between w-full pointer-events-auto">
        <div className="flex flex-col space-y-2">
          {/* Real-time WASD input state indicators (Desktop keyboard only) */}
          {!isTouchDevice && (
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
                T
              </span>
              <span className="px-1.5 py-0.5 rounded border text-[10px] font-bold bg-cyan-950 border-cyan-500 text-cyan-300">
                L
              </span>
            </div>
          )}

          {/* Navigation Hotbar (Desktop only - Mobile has dedicated Touch Action Drawer) */}
          {!isTouchDevice && (
            <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-mars-border/80 text-xs font-mono shadow-2xl">
              {telemetry.isDrivingRover && (
                <button
                  onClick={onOpenRimfaxRadar}
                  title="RIMFAX Subsurface Radar Tomography Terminal [U]"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="font-bold">RADAR [U]</span>
                </button>
              )}

              <button
                onClick={onOpenScienceLab}
                title="Field Science Laboratory & CheMin/PIXL Spectrometer [K]"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all cursor-pointer"
              >
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">LAB [K]</span>
                {researchPoints > 0 && (
                  <span className="bg-emerald-500/30 text-emerald-200 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-400/50">
                    {researchPoints} RP
                  </span>
                )}
              </button>

              <button
                onClick={onOpenLibrary}
                title="Mars Archival Library & Research Facility [L]"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-cyan-950/70 hover:bg-orange-900 text-orange-300 border border-orange-500/50 shadow-[0_0_12px_rgba(251,146,60,0.25)] transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-orange-400" />
                <span className="font-bold">LIBRARY [L]</span>
              </button>

              <button
                onClick={onToggleLight}
                title="Toggle Flashlight / Rover Headlights [T]"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                  telemetry.isFlashlightOn
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                    : 'bg-mars-surface border-mars-border text-mars-dust hover:text-white'
                }`}
              >
                <Lightbulb className={`w-4 h-4 ${telemetry.isFlashlightOn ? 'text-amber-300 animate-pulse' : 'text-mars-sand'}`} />
                <span>LIGHT [T]</span>
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
                <span>JOURNAL</span>
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
                onClick={effectiveIsLocked ? onUnlockPointer : onRequestPointerLock}
                title={effectiveIsLocked ? 'Unlock Mouse Pointer [Esc / Alt]' : 'Lock Mouse Look [Click]'}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                  effectiveIsLocked
                    ? 'bg-mars-surface hover:bg-white/10 text-mars-dust hover:text-white border-mars-border'
                    : 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 ring-1 ring-emerald-400/50 hover:bg-emerald-900/80'
                }`}
              >
                {effectiveIsLocked ? (
                  <>
                    <Unlock className="w-4 h-4 text-mars-orange" />
                    <span className="hidden sm:inline">UNLOCK [ESC]</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline font-bold">LOCK LOOK</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenSettings}
                title="Simulator Settings"
                className="p-2 rounded-lg bg-mars-surface hover:bg-white/10 text-white border border-mars-border transition-colors cursor-pointer"
              >
                <SettingsIcon className="w-4 h-4 text-mars-sand" />
              </button>
            </div>
          )}
        </div>

        {/* Survival Status Component */}
        <SurvivalStatus suit={telemetry.suit} environment={telemetry.environment} />
      </div>
    </div>
  );
};
