import React from 'react';
import { EvidenceType } from '../../types/mars';
import { Eye, Layers, Cpu, Gamepad2, History } from 'lucide-react';

interface EvidenceBadgeProps {
  type: EvidenceType;
  showTooltip?: boolean;
}

const BADGE_CONFIG: Record<
  EvidenceType,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode; tooltip: string }
> = {
  observed: {
    label: 'OBSERVED',
    bg: 'bg-emerald-950/80',
    text: 'text-emerald-400',
    border: 'border-emerald-500/50',
    icon: <Eye className="w-3.5 h-3.5 mr-1 text-emerald-400" />,
    tooltip: 'Direct physical measurement or imaging collected by a spacecraft or rover instrument at a documented time and location.'
  },
  derived: {
    label: 'DERIVED',
    bg: 'bg-cyan-950/80',
    text: 'text-cyan-400',
    border: 'border-cyan-500/50',
    icon: <Layers className="w-3.5 h-3.5 mr-1 text-cyan-400" />,
    tooltip: 'Mathematically processed or extracted from raw sensor data, such as slopes calculated from elevation rasters or mineral band depth ratios.'
  },
  modelled: {
    label: 'MODELLED',
    bg: 'bg-purple-950/80',
    text: 'text-purple-400',
    border: 'border-purple-500/50',
    icon: <Cpu className="w-3.5 h-3.5 mr-1 text-purple-400" />,
    tooltip: 'Generated using planetary scientific simulations or climate models rather than continuous point observations.'
  },
  gameplay_simulation: {
    label: 'SIMULATION',
    bg: 'bg-amber-950/80',
    text: 'text-amber-400',
    border: 'border-amber-500/50',
    icon: <Gamepad2 className="w-3.5 h-3.5 mr-1 text-amber-400" />,
    tooltip: 'Tuned gameplay abstraction designed for fun exploration; not a verified aerospace engineering life-support benchmark.'
  },
  historical_record: {
    label: 'HISTORICAL',
    bg: 'bg-blue-950/80',
    text: 'text-blue-400',
    border: 'border-blue-500/50',
    icon: <History className="w-3.5 h-3.5 mr-1 text-blue-400" />,
    tooltip: 'Archival mission observation recording past conditions or historic touchdown states; not a live active weather sensor.'
  }
};

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ type, showTooltip = true }) => {
  const config = BADGE_CONFIG[type] || BADGE_CONFIG.observed;

  return (
    <span
      title={showTooltip ? config.tooltip : undefined}
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-semibold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border} shadow-sm cursor-help`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
