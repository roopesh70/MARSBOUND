import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AstronautController } from '../../game/player/AstronautController';
import { ArrowUp, Zap, Scan, Menu, Car, Radio } from 'lucide-react';

interface MobileTouchControlsProps {
  controller: AstronautController | null;
  onOpenActionWheel: () => void;
  onScan: () => void;
  isDrivingRover?: boolean;
  onToggleRover?: () => void;
  onOpenRimfaxRadar?: () => void;
  onDeployCoreDrill?: () => void;
  isActionWheelOpen?: boolean;
}

export const MobileTouchControls: React.FC<MobileTouchControlsProps> = ({
  controller,
  onOpenActionWheel,
  onScan,
  isDrivingRover = false,
  onToggleRover,
  onOpenRimfaxRadar,
  isActionWheelOpen = false
}) => {
  const [isSprinting, setIsSprinting] = useState(false);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });

  const joystickOriginRef = useRef<{ x: number; y: number } | null>(null);
  const joystickTouchIdRef = useRef<number | null>(null);
  const lookTouchIdRef = useRef<number | null>(null);
  const lastLookPosRef = useRef<{ x: number; y: number } | null>(null);

  // Sync sprint state to controller
  const toggleSprint = useCallback(() => {
    setIsSprinting((prev) => {
      const next = !prev;
      if (controller) {
        controller.isSprinting = next;
      }
      return next;
    });
  }, [controller]);

  // Jump / Hop
  const handleJump = useCallback(() => {
    if (controller) {
      controller.jump();
    }
  }, [controller]);

  // Touch listener handlers
  useEffect(() => {
    if (isActionWheelOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const screenWidth = window.innerWidth;

        // Skip any touch on interactive UI elements (buttons, modals, inputs, links)
        const target = touch.target as HTMLElement;
        if (target && target.closest('button, [role="button"], a, input, select, textarea, .pointer-events-auto')) {
          continue;
        }

        // Left half of screen (Joystick zone)
        if (touch.clientX < screenWidth * 0.45 && joystickTouchIdRef.current === null) {
          joystickTouchIdRef.current = touch.identifier;
          joystickOriginRef.current = { x: touch.clientX, y: touch.clientY };
          setJoystickActive(true);
          setJoystickPos({ x: 0, y: 0 });
          if (e.cancelable) e.preventDefault();
        }
        // Right half of screen (Look around zone)
        else if (touch.clientX >= screenWidth * 0.45 && lookTouchIdRef.current === null) {
          lookTouchIdRef.current = touch.identifier;
          lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };
          if (e.cancelable) e.preventDefault();
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      let handled = false;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];

        // Process Joystick Touch Move
        if (touch.identifier === joystickTouchIdRef.current && joystickOriginRef.current) {
          handled = true;
          const maxRadius = 45; // max joystick travel in pixels
          const dx = touch.clientX - joystickOriginRef.current.x;
          const dy = touch.clientY - joystickOriginRef.current.y;
          const dist = Math.hypot(dx, dy);

          const clampedDist = Math.min(dist, maxRadius);
          const angle = Math.atan2(dy, dx);
          const knobX = Math.cos(angle) * clampedDist;
          const knobY = Math.sin(angle) * clampedDist;

          setJoystickPos({ x: knobX, y: knobY });

          // Normalized input (-1 to 1)
          const normX = knobX / maxRadius;
          const normY = knobY / maxRadius;

          if (controller) {
            controller.setVirtualMoveInput(normX, normY, isSprinting);
          }
        }

        // Process Look Touch Move
        if (touch.identifier === lookTouchIdRef.current && lastLookPosRef.current) {
          handled = true;
          const deltaX = touch.clientX - lastLookPosRef.current.x;
          const deltaY = touch.clientY - lastLookPosRef.current.y;
          lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };

          if (controller) {
            controller.rotateCamera(deltaX, deltaY);
          }
        }
      }
      if (handled && e.cancelable) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];

        if (touch.identifier === joystickTouchIdRef.current) {
          joystickTouchIdRef.current = null;
          joystickOriginRef.current = null;
          setJoystickActive(false);
          setJoystickPos({ x: 0, y: 0 });

          if (controller) {
            controller.setVirtualMoveInput(0, 0, false);
          }
        }

        if (touch.identifier === lookTouchIdRef.current) {
          lookTouchIdRef.current = null;
          lastLookPosRef.current = null;
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [controller, isSprinting, isActionWheelOpen]);

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-30">
      {/* 1. Virtual Joystick Indicator (Bottom Left) */}
      <div className="absolute bottom-5 left-5 pointer-events-auto">
        <div
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 transition-all flex items-center justify-center backdrop-blur-sm ${
            joystickActive
              ? 'border-mars-orange bg-black/40 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
              : 'border-white/20 bg-black/20'
          }`}
        >
          {/* Outer Ring Cardinal Compass Crosshairs */}
          <div className="absolute top-1 w-1.5 h-1.5 bg-mars-sand/40 rounded-full" />
          <div className="absolute bottom-1 w-1.5 h-1.5 bg-mars-sand/40 rounded-full" />
          <div className="absolute left-1 w-1.5 h-1.5 bg-mars-sand/40 rounded-full" />
          <div className="absolute right-1 w-1.5 h-1.5 bg-mars-sand/40 rounded-full" />

          {/* Floating Joystick Knob */}
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center shadow-lg transition-transform ${
              joystickActive
                ? 'bg-mars-orange border-white text-white scale-110 shadow-[0_0_12px_rgba(249,115,22,0.6)]'
                : 'bg-white/15 border-white/30 text-white/40'
            }`}
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`
            }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white/40" />
          </div>
        </div>

        <div className="text-[8.5px] font-mono font-bold text-center mt-1 text-mars-sand/60">
          {isDrivingRover ? 'STEER / DRIVE' : 'MOVE'}
        </div>
      </div>

      {/* 2. Ergonomic 2x2 Thumb Cluster (Bottom Right) */}
      <div className="absolute bottom-5 right-5 pointer-events-auto grid grid-cols-2 gap-2">
        {/* Top-Left: EVA Action Tools Menu */}
        <button
          onClick={onOpenActionWheel}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black/60 hover:bg-black/80 border border-mars-orange/70 text-white shadow-lg flex flex-col items-center justify-center active:scale-90 transition-all cursor-pointer backdrop-blur-sm"
          title="EVA Tools Drawer"
        >
          <Menu className="w-4 h-4 text-mars-orange" />
          <span className="text-[7.5px] font-mono font-bold uppercase mt-0.5">TOOLS</span>
        </button>

        {/* Top-Right: Sprint / Turbo Toggle */}
        <button
          onClick={toggleSprint}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex flex-col items-center justify-center active:scale-90 transition-all cursor-pointer shadow-lg backdrop-blur-sm ${
            isSprinting
              ? 'bg-amber-500 text-black border-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)]'
              : 'bg-black/60 text-mars-dust border-white/20'
          }`}
          title={isDrivingRover ? 'Toggle Rover Turbo' : 'Toggle Sprint'}
        >
          <Zap className={`w-4 h-4 ${isSprinting ? 'text-black' : 'text-amber-400'}`} />
          <span className="text-[7.5px] font-mono font-bold uppercase mt-0.5">
            {isDrivingRover ? 'TURBO' : 'SPRINT'}
          </span>
        </button>

        {/* Bottom-Left: Rover Radar OR Astronaut Spectrometer Scan */}
        {isDrivingRover ? (
          <button
            onClick={onOpenRimfaxRadar}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 shadow-lg flex flex-col items-center justify-center active:scale-90 transition-all cursor-pointer backdrop-blur-sm"
            title="Subsurface RIMFAX Radar"
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="text-[7.5px] font-mono font-bold uppercase mt-0.5">RADAR</span>
          </button>
        ) : (
          <button
            onClick={onScan}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 shadow-lg flex flex-col items-center justify-center active:scale-90 transition-all cursor-pointer backdrop-blur-sm"
            title="Spectrometer Scan"
          >
            <Scan className="w-4 h-4 text-cyan-400" />
            <span className="text-[7.5px] font-mono font-bold uppercase mt-0.5">SCAN</span>
          </button>
        )}

        {/* Bottom-Right: Hop (Astronaut) OR Exit / Dismount (Rover) */}
        {!isDrivingRover ? (
          <button
            onClick={handleJump}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-mars-red to-mars-orange border-2 border-white/80 text-white shadow-xl flex flex-col items-center justify-center active:scale-90 transition-all cursor-pointer ring-2 ring-mars-orange/40"
            title="Low-gravity Hop"
          >
            <ArrowUp className="w-5 h-5 text-white" />
            <span className="text-[8px] font-mono font-bold uppercase">HOP</span>
          </button>
        ) : (
          <button
            onClick={onToggleRover}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-amber-600 to-mars-orange border-2 border-white text-white shadow-xl flex flex-col items-center justify-center active:scale-90 transition-all cursor-pointer ring-2 ring-amber-400/50"
            title="Dismount Mars Rover"
          >
            <Car className="w-4 h-4 text-white" />
            <span className="text-[7.5px] font-mono font-bold uppercase mt-0.5">EXIT</span>
          </button>
        )}
      </div>
    </div>
  );
};
