import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AstronautController } from '../../game/player/AstronautController';
import { ArrowUp, Zap, Scan, Menu, Car, Radio } from 'lucide-react';

interface MobileTouchControlsProps {
  controller?: AstronautController | null;
  controllerRef?: React.MutableRefObject<AstronautController | null>;
  onOpenActionWheel: () => void;
  onScan: () => void;
  isDrivingRover?: boolean;
  onToggleRover?: () => void;
  onOpenRimfaxRadar?: () => void;
  onDeployCoreDrill?: () => void;
  isActionWheelOpen?: boolean;
}

export const MobileTouchControls: React.FC<MobileTouchControlsProps> = ({
  controller = null,
  controllerRef,
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

  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const joystickOriginRef = useRef<{ x: number; y: number } | null>(null);
  const joystickTouchIdRef = useRef<number | null>(null);
  const lookTouchIdRef = useRef<number | null>(null);
  const lastLookPosRef = useRef<{ x: number; y: number } | null>(null);

  // Keep references fresh so event handlers never see stale closures
  const internalControllerRef = useRef<AstronautController | null>(controller);
  useEffect(() => {
    internalControllerRef.current = controller;
  }, [controller]);

  const isSprintingRef = useRef(isSprinting);
  useEffect(() => {
    isSprintingRef.current = isSprinting;
  }, [isSprinting]);

  const getActiveController = useCallback((): AstronautController | null => {
    return controllerRef?.current || internalControllerRef.current || controller;
  }, [controller, controllerRef]);

  // Sync sprint state to controller
  const toggleSprint = useCallback(() => {
    setIsSprinting((prev) => {
      const next = !prev;
      const ctrl = getActiveController();
      if (ctrl) {
        ctrl.isSprinting = next;
      }
      return next;
    });
  }, [getActiveController]);

  // Jump / Hop
  const handleJump = useCallback(() => {
    const ctrl = getActiveController();
    if (ctrl) {
      ctrl.jump();
    }
  }, [getActiveController]);

  // Update virtual joystick input
  const applyJoystickInput = useCallback((clientX: number, clientY: number, originX: number, originY: number) => {
    const maxRadius = 45; // max joystick travel in pixels
    const dx = clientX - originX;
    const dy = clientY - originY;
    const dist = Math.hypot(dx, dy);

    const clampedDist = Math.min(dist, maxRadius);
    const angle = dist > 0 ? Math.atan2(dy, dx) : 0;
    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setJoystickPos({ x: knobX, y: knobY });

    // Normalized input (-1.0 to 1.0)
    const normX = clampedDist > 0 ? knobX / maxRadius : 0;
    const normY = clampedDist > 0 ? knobY / maxRadius : 0;

    const ctrl = getActiveController();
    if (ctrl) {
      ctrl.setVirtualMoveInput(normX, normY, isSprintingRef.current);
    }
  }, [getActiveController]);

  const resetJoystick = useCallback(() => {
    joystickTouchIdRef.current = null;
    joystickOriginRef.current = null;
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });

    const ctrl = getActiveController();
    if (ctrl) {
      ctrl.setVirtualMoveInput(0, 0, false);
    }
  }, [getActiveController]);

  // Direct joystick touch handlers (guaranteed responsiveness on the joystick element)
  const handleJoystickTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (isActionWheelOpen) return;
    e.stopPropagation();

    const touch = e.changedTouches[0];
    if (!touch) return;

    joystickTouchIdRef.current = touch.identifier;

    // Use center of the joystick ring as origin
    if (joystickBaseRef.current) {
      const rect = joystickBaseRef.current.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      joystickOriginRef.current = { x: originX, y: originY };
      setJoystickActive(true);
      applyJoystickInput(touch.clientX, touch.clientY, originX, originY);
    } else {
      joystickOriginRef.current = { x: touch.clientX, y: touch.clientY };
      setJoystickActive(true);
      setJoystickPos({ x: 0, y: 0 });
    }
  }, [isActionWheelOpen, applyJoystickInput]);

  // Global touch listener for look around & flexible area joystick
  useEffect(() => {
    if (isActionWheelOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const screenWidth = window.innerWidth;
        const target = touch.target as HTMLElement;

        // Skip touches on interactive buttons/links (never intercept menu or hotbar clicks!)
        if (target && target.closest('button, [role="button"], a, input, select, textarea')) {
          continue;
        }

        // Check if touch is on or inside the joystick element
        const isInsideJoystick = joystickBaseRef.current && (joystickBaseRef.current === target || joystickBaseRef.current.contains(target));

        // Left half of screen (Joystick zone)
        if ((isInsideJoystick || touch.clientX < screenWidth * 0.45) && joystickTouchIdRef.current === null) {
          joystickTouchIdRef.current = touch.identifier;

          let originX = touch.clientX;
          let originY = touch.clientY;

          if (joystickBaseRef.current) {
            const rect = joystickBaseRef.current.getBoundingClientRect();
            // If touch is near the base ring, snap origin to the ring center for ideal ergonomics
            if (isInsideJoystick || Math.hypot(touch.clientX - (rect.left + rect.width / 2), touch.clientY - (rect.top + rect.height / 2)) < 80) {
              originX = rect.left + rect.width / 2;
              originY = rect.top + rect.height / 2;
            }
          }

          joystickOriginRef.current = { x: originX, y: originY };
          setJoystickActive(true);
          applyJoystickInput(touch.clientX, touch.clientY, originX, originY);

          if (e.cancelable) e.preventDefault();
        }
        // Right half of screen (Camera look zone)
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

        // Process Joystick Move
        if (touch.identifier === joystickTouchIdRef.current && joystickOriginRef.current) {
          handled = true;
          applyJoystickInput(touch.clientX, touch.clientY, joystickOriginRef.current.x, joystickOriginRef.current.y);
        }

        // Process Camera Look Move
        if (touch.identifier === lookTouchIdRef.current && lastLookPosRef.current) {
          handled = true;
          const deltaX = touch.clientX - lastLookPosRef.current.x;
          const deltaY = touch.clientY - lastLookPosRef.current.y;
          lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };

          const ctrl = getActiveController();
          if (ctrl) {
            ctrl.rotateCamera(deltaX, deltaY);
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
          resetJoystick();
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
  }, [isActionWheelOpen, applyJoystickInput, resetJoystick, getActiveController]);

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-30 touch-none">
      {/* 1. Virtual Joystick Indicator (Bottom Left) */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleJoystickTouchStart}
        className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 pointer-events-auto touch-none cursor-pointer p-2"
      >
        <div
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 transition-all flex items-center justify-center backdrop-blur-sm ${
            joystickActive
              ? 'border-mars-orange bg-black/60 shadow-[0_0_20px_rgba(249,115,22,0.6)] scale-105'
              : 'border-white/30 bg-black/30'
          }`}
        >
          {/* Outer Ring Cardinal Crosshairs */}
          <div className="absolute top-1.5 w-1.5 h-1.5 bg-mars-sand/50 rounded-full" />
          <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-mars-sand/50 rounded-full" />
          <div className="absolute left-1.5 w-1.5 h-1.5 bg-mars-sand/50 rounded-full" />
          <div className="absolute right-1.5 w-1.5 h-1.5 bg-mars-sand/50 rounded-full" />

          {/* Floating Joystick Knob */}
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center shadow-2xl transition-transform ${
              joystickActive
                ? 'bg-mars-orange border-white text-white scale-110 shadow-[0_0_15px_rgba(249,115,22,0.8)]'
                : 'bg-white/20 border-white/40 text-white/50'
            }`}
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`
            }}
          >
            <div className="w-4 h-4 rounded-full bg-white/60 shadow-sm" />
          </div>
        </div>

        <div className={`text-[8.5px] font-mono font-bold text-center mt-1 uppercase tracking-wider transition-colors ${
          joystickActive ? 'text-mars-orange font-black' : 'text-mars-sand/70'
        }`}>
          {isDrivingRover ? 'STEER / DRIVE' : 'MOVE'}
        </div>
      </div>

      {/* 2. Ergonomic 2x2 Thumb Cluster (Bottom Right) */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-auto grid grid-cols-2 gap-2 touch-none">
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
