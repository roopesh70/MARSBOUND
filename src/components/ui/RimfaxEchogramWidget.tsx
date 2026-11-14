import React, { useEffect, useRef } from 'react';
import { RimfaxRadarTelemetry } from '../../types/rimfax';
import { rimfaxService } from '../../services/rimfaxService';
import { Activity, Drill, Radio, ChevronUp, AlertCircle } from 'lucide-react';

interface RimfaxEchogramWidgetProps {
  telemetry: RimfaxRadarTelemetry;
  speedKmh: number;
  onDeployCoreDrill: () => void;
  onOpenFullRadar: () => void;
  isDrilling: boolean;
}

export const RimfaxEchogramWidget: React.FC<RimfaxEchogramWidgetProps> = ({
  telemetry,
  speedKmh,
  onDeployCoreDrill,
  onOpenFullRadar,
  isDrilling
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render the real-time scrolling radargram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const slices = rimfaxService.getSlices();

    // 1. Dark Radar Background
    ctx.fillStyle = '#060a10';
    ctx.fillRect(0, 0, width, height);

    // 2. Depth Grid Lines (0m to -10m at 2m intervals)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const y = (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.font = '8px monospace';
      ctx.fillText(`-${(i * 2).toFixed(0)}m`, 4, y - 2);
    }

    if (slices.length === 0) {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('AWAITING TRAVERSE RADAR SOUNDING DATA...', width / 2, height / 2);
      return;
    }

    // 3. Render Synthetic Echogram Column Slices
    const colWidth = Math.max(2, width / Math.max(slices.length, 60));
    const startX = Math.max(0, width - slices.length * colWidth);

    slices.forEach((slice, sIdx) => {
      const x = startX + sIdx * colWidth;

      for (let d = 0; d < slice.reflectivityAtDepth.length; d++) {
        const y = (d / slice.reflectivityAtDepth.length) * height;
        const cellHeight = height / slice.reflectivityAtDepth.length;
        const refDb = slice.reflectivityAtDepth[d];

        // Normalize dB (-40 to 0) into color palette
        const norm = Math.max(0, Math.min(1, (refDb + 38) / 38));

        let fillStyle = '#0a1420';
        if (norm > 0.85) {
          fillStyle = '#ef4444'; // Extreme reflector (red)
        } else if (norm > 0.65) {
          fillStyle = '#f59e0b'; // High reflector (amber)
        } else if (norm > 0.45) {
          fillStyle = '#10b981'; // Moderate reflector (emerald)
        } else if (norm > 0.25) {
          fillStyle = '#0284c7'; // Weak reflector (cyan)
        } else if (norm > 0.1) {
          fillStyle = '#1e293b'; // Stratum boundary (dark slate)
        }

        ctx.fillStyle = fillStyle;
        ctx.fillRect(x, y, colWidth + 0.5, cellHeight + 0.5);
      }

      // Draw anomaly highlight marker if detected in this slice
      if (slice.activeAnomaly) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.fillRect(x, 0, colWidth, 3);
      }
    });

    // 4. Scanning Sweep Beam Indicator at the right edge
    const sweepX = width - 1;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sweepX, 0);
    ctx.lineTo(sweepX, height);
    ctx.stroke();

  }, [telemetry, speedKmh]);

  const anomaly = telemetry.nearbyAnomaly;

  return (
    <div className="flex flex-col bg-slate-950/90 border border-cyan-500/50 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.25)] backdrop-blur-md overflow-hidden pointer-events-auto font-mono text-xs w-[340px] sm:w-[420px]">
      
      {/* Widget Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-cyan-950/70 border-b border-cyan-500/40">
        <div className="flex items-center space-x-2 text-cyan-300">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold tracking-wider text-[11px]">RIMFAX SUBSURFACE RADAR</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-gray-400 bg-black/50 px-1.5 py-0.5 rounded border border-cyan-500/30">
            ε_r = {telemetry.currentDielectricConstant.toFixed(1)}
          </span>
          <button
            onClick={onOpenFullRadar}
            title="Expand Full Radar Tomography Terminal [U]"
            className="flex items-center space-x-1 text-[10px] text-cyan-300 hover:text-white bg-cyan-900/60 hover:bg-cyan-800 px-2 py-0.5 rounded border border-cyan-400/40 transition-colors cursor-pointer"
          >
            <span>FULL [U]</span>
            <ChevronUp className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Real-time Scrolling Radargram Screen */}
      <div className="relative w-full h-24 bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          width={420}
          height={96}
          className="w-full h-full object-cover"
        />

        {/* Live Depth Reticle */}
        <div className="absolute top-1.5 right-2 text-[9px] text-cyan-300 bg-black/75 px-1.5 py-0.5 rounded border border-cyan-500/30 font-mono">
          SCAN DEPTH: 0 to -10m
        </div>

        {/* Subsurface Stratum Label */}
        <div className="absolute bottom-1.5 left-2 text-[9px] text-slate-300 bg-black/80 px-2 py-0.5 rounded border border-slate-700 font-mono flex items-center space-x-1">
          <Activity className="w-2.5 h-2.5 text-emerald-400" />
          <span>{telemetry.activeStratumName}</span>
        </div>
      </div>

      {/* Subsurface Anomaly Alert & Core Drilling Prompt */}
      {anomaly && (
        <div className="p-2.5 bg-gradient-to-r from-red-950/80 via-amber-950/70 to-black border-t border-amber-500/50 flex flex-col space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-amber-300 font-bold flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>REFLECTOR ANOMALY DETECTED</span>
            </span>
            <span className="text-[10px] text-amber-200 bg-amber-900/80 px-1.5 py-0.5 rounded border border-amber-400/50 font-bold">
              DEPTH -{anomaly.targetDepthMeters}m
            </span>
          </div>

          <div className="text-white text-[11px] font-sans font-semibold leading-tight line-clamp-1">
            {anomaly.name}
          </div>

          <div className="text-[10px] text-gray-300 font-mono line-clamp-1">
            {anomaly.dielectricContrast}
          </div>

          <button
            onClick={onDeployCoreDrill}
            disabled={isDrilling}
            className={`w-full py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
              isDrilling
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 border border-amber-300'
            }`}
          >
            <Drill className={`w-3.5 h-3.5 ${isDrilling ? 'animate-spin' : ''}`} />
            <span>
              {isDrilling
                ? 'DRILLING ROTARY DEEP CORE (-' + anomaly.targetDepthMeters + 'm)...'
                : 'EXTRACT PRISTINE CORE [G] (+' + anomaly.baseResearchPoints + ' RP)'}
            </span>
          </button>
        </div>
      )}

      {/* General Coring option in rich stratigraphy when no special anomaly */}
      {!anomaly && (
        <div className="px-3 py-1.5 bg-black/60 border-t border-cyan-500/20 flex items-center justify-between text-[10px] text-gray-400">
          <span className="line-clamp-1">{telemetry.activeFormation}</span>
          <span className="text-cyan-400 font-mono shrink-0">150-1200 MHz UWB</span>
        </div>
      )}
    </div>
  );
};
