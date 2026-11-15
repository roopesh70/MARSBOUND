import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AstronautController } from '../../game/player/AstronautController';
import { ArrowUp, Zap, Scan, Menu } from 'lucide-react';

interface MobileTouchControlsProps {
  controller: AstronautController | null;
  onOpenActionWheel: () => void;
  onScan: () => void;
  isDrivingRover?: boolean;
}

export const MobileTouchControls: React.FC<MobileTouchControlsProps> = ({
  controller,
  onOpenActionWheel,
  onScan,
  isDrivingRover = false
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
    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const screenWidth = window.innerWidth;

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
          // Verify we aren't tapping an interactive HUD button
          const target = touch.target as HTMLElement;
          if (target && target.closest('button, [role="button"], a, input')) {
            continue;
          }
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
  }, [controller, isSprinting]);

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-30">
      {/* 1. Virtual Joystick Indicator (Bottom Left) */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <div
          className={`w-28 h-28 rounded-full border-2 transition-all flex items-center justify-center backdrop-blur-sm ${
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
            className={`w-12 h-12 rounded-full border flex items-center justify-center shadow-lg transition-transform ${
              joystickActive
                ? 'bg-mars-orange border-white text-white scale-110 shadow-[0_0_12px_rgba(249,115,22,0.6)]'
                : 'bg-white/15 border-white/30 text-white/40'
            }`}
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`
            }}
          >
            <div className="w-4 h-4 rounded-full bg-white/40" />
          </div>
        </div>

        <div className="text-[9px] font-mono font-bold text-center mt-1 text-mars-sand/60">
          {isDrivingRover ? 'STEER / DRIVE' : 'MOVE'}
        </div>
      </div>

      {/* 2. Right Action Buttons Cluster (Bottom Right) */}
      <div className="absolute bottom-8 right-8 pointer-events-auto flex items-end space-x-3">
        {/* EVA Tools Wheel Button */}
        <button
          onClick={onOpenActionWheel}
          className="w-14 h-14 rounded-2xl bg-mars-orange hover:bg-mars-rust border-2 border-white/60 text-white shadow-2xl flex flex-col items-center justify-center active:scale-95 transition-all cursor-pointer ring-2 ring-mars-orange/40"
          title="EVA Action Dial"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[8px] font-mono font-bold uppercase mt-0.5">TOOLS</span>
        </button>

        {/* Raman Spectrometer Quick Scan Button */}
        <button
          onClick={onScan}
          className="w-12 h-12 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 shadow-xl flex flex-col items-center justify-center active:scale-95 transition-all cursor-pointer"
          title="Spectrometer Scan [F]"
        >
          <Scan className="w-4 h-4 text-cyan-400" />
          <span className="text-[8px] font-mono font-bold uppercase mt-0.5">SCAN</span>
        </button>

        {/* Sprint / Fast Hike Toggle Button */}
        <button
          onClick={toggleSprint}
          className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center active:scale-95 transition-all cursor-pointer shadow-xl ${
            isSprinting
              ? 'bg-amber-500 text-black border-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)]'
              : 'bg-black/60 text-mars-dust border-mars-border'
          }`}
          title="Toggle Sprint / Hike"
        >
          <Zap className={`w-4 h-4 ${isSprinting ? 'text-black' : 'text-amber-400'}`} />
          <span className="text-[8px] font-mono font-bold uppercase mt-0.5">SPRINT</span>
        </button>

        {/* Hop / Low-Gravity Jump Button */}
        {!isDrivingRover && (
          <button
            onClick={handleJump}
            className="w-14 h-14 rounded-2xl bg-mars-surface/90 hover:bg-white/20 border-2 border-mars-orange text-white shadow-2xl flex flex-col items-center justify-center active:scale-95 transition-all cursor-pointer"
            title="Low-gravity Hop [Space]"
          >
            <ArrowUp className="w-5 h-5 text-mars-orange" />
            <span className="text-[8px] font-mono font-bold uppercase mt-0.5">HOP</span>
          </button>
        )}
      </div>
    </div>
  );
};
