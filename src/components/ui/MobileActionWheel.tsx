import React from 'react';
import {
  X,
  Compass,
  Car,
  Scan,
  FlaskConical,
  Radio,
  Drill,
  Hammer,
  BookOpen,
  Target,
  FileText,
  Lightbulb,
  Settings,
  Sparkles
} from 'lucide-react';

interface MobileActionWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMap: () => void;
  onToggleRover: () => void;
  isDrivingRover?: boolean;
  isNearRover?: boolean;
  onScan: () => void;
  onOpenScienceLab: () => void;
  onOpenRimfaxRadar: () => void;
  onDeployCoreDrill: () => void;
  onToggleBuildMode: () => void;
  onOpenLibrary: () => void;
  onOpenMission: () => void;
  onOpenJournal: () => void;
  onToggleLight: () => void;
  onOpenSettings: () => void;
  isFlashlightOn?: boolean;
}

export const MobileActionWheel: React.FC<MobileActionWheelProps> = ({
  isOpen,
  onClose,
  onOpenMap,
  onToggleRover,
  isDrivingRover = false,
  isNearRover = false,
  onScan,
  onOpenScienceLab,
  onOpenRimfaxRadar,
  onDeployCoreDrill,
  onToggleBuildMode,
  onOpenLibrary,
  onOpenMission,
  onOpenJournal,
  onToggleLight,
  onOpenSettings,
  isFlashlightOn = false
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'map',
      label: 'Tactical Map',
      shortcut: 'M',
      icon: <Compass className="w-5 h-5 text-mars-orange" />,
      onClick: onOpenMap,
      color: 'border-mars-orange/60 bg-mars-orange/15 text-white'
    },
    {
      id: 'scan',
      label: 'Spectrometer',
      shortcut: 'F',
      icon: <Scan className="w-5 h-5 text-cyan-400" />,
      onClick: onScan,
      color: 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200'
    },
    {
      id: 'rover',
      label: isDrivingRover ? 'Exit Rover' : (isNearRover ? 'Board Rover' : 'Call Rover'),
      shortcut: 'E',
      icon: <Car className={`w-5 h-5 ${isDrivingRover ? 'text-amber-400 animate-pulse' : 'text-amber-300'}`} />,
      onClick: onToggleRover,
      color: isDrivingRover
        ? 'border-amber-400 bg-amber-950/60 text-amber-200 ring-1 ring-amber-400'
        : 'border-amber-500/50 bg-black/50 text-white'
    },
    {
      id: 'lab',
      label: 'Science Lab',
      shortcut: 'K',
      icon: <FlaskConical className="w-5 h-5 text-emerald-400" />,
      onClick: onOpenScienceLab,
      color: 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200'
    },
    {
      id: 'radar',
      label: 'RIMFAX Radar',
      shortcut: 'U',
      icon: <Radio className="w-5 h-5 text-sky-400" />,
      onClick: onOpenRimfaxRadar,
      color: 'border-sky-500/60 bg-sky-950/40 text-sky-200'
    },
    {
      id: 'drill',
      label: 'Core Drill',
      shortcut: 'G',
      icon: <Drill className="w-5 h-5 text-yellow-400" />,
      onClick: onDeployCoreDrill,
      color: 'border-yellow-500/60 bg-yellow-950/40 text-yellow-200'
    },
    {
      id: 'build',
      label: 'Build Outpost',
      shortcut: 'B',
      icon: <Hammer className="w-5 h-5 text-orange-400" />,
      onClick: onToggleBuildMode,
      color: 'border-orange-500/60 bg-orange-950/40 text-orange-200'
    },
    {
      id: 'library',
      label: 'NASA Library',
      shortcut: 'L',
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      onClick: onOpenLibrary,
      color: 'border-purple-500/60 bg-purple-950/40 text-purple-200'
    },
    {
      id: 'missions',
      label: 'Missions',
      shortcut: 'O',
      icon: <Target className="w-5 h-5 text-rose-400" />,
      onClick: onOpenMission,
      color: 'border-rose-500/60 bg-rose-950/40 text-rose-200'
    },
    {
      id: 'journal',
      label: 'Journal',
      shortcut: 'J',
      icon: <FileText className="w-5 h-5 text-indigo-400" />,
      onClick: onOpenJournal,
      color: 'border-indigo-500/60 bg-indigo-950/40 text-indigo-200'
    },
    {
      id: 'light',
      label: isFlashlightOn ? 'Light [ON]' : 'Light [OFF]',
      shortcut: 'T',
      icon: <Lightbulb className={`w-5 h-5 ${isFlashlightOn ? 'text-amber-300' : 'text-gray-400'}`} />,
      onClick: onToggleLight,
      color: isFlashlightOn ? 'border-amber-400/80 bg-amber-950/50 text-amber-200' : 'border-gray-600 bg-black/40 text-gray-300'
    },
    {
      id: 'settings',
      label: 'Settings & Time',
      shortcut: 'C',
      icon: <Settings className="w-5 h-5 text-mars-sand" />,
      onClick: onOpenSettings,
      color: 'border-mars-border bg-black/50 text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-mars-surface border border-mars-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-mars-border/80 bg-mars-panel/90">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-mars-orange" />
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              EVA QUICK ACTION DIAL
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-mars-dust hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Grid (Oversized touch tap targets) */}
        <div className="p-4 grid grid-cols-3 gap-2.5 overflow-y-auto font-mono text-xs">
          {actions.map((act) => (
            <button
              key={act.id}
              onClick={() => {
                onClose();
                act.onClick();
              }}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all active:scale-95 cursor-pointer shadow-md ${act.color}`}
            >
              <div>{act.icon}</div>
              <span className="font-bold text-[11px] text-center leading-tight">
                {act.label}
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-black/50 text-mars-sand/80 font-bold border border-white/10">
                [{act.shortcut}]
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-mars-border/80 bg-mars-panel/90 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-mars-surface hover:bg-white/10 border border-mars-border text-mars-dust font-mono text-xs font-bold transition-all"
          >
            RESUME SURFACE EVA
          </button>
        </div>
      </div>
    </div>
  );
};
