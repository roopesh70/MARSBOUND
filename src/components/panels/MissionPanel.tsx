import React from 'react';
import { Mission } from '../../types/mission';
import {
  X,
  CheckCircle,
  Circle,
  Target,
  Award,
  Compass,
  FlaskConical,
  Radio,
  BookOpen,
  Hammer,
  Sunset,
  Sparkles,
  ChevronRight,
  Clock
} from 'lucide-react';

interface MissionPanelProps {
  mission: Mission;
  allMissions: Mission[];
  onSelectMission: (missionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenMap: () => void;
  onOpenScienceLab?: () => void;
  onOpenLibrary?: () => void;
  onOpenRimfaxRadar?: () => void;
  onToggleBuildMode?: () => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({
  mission,
  allMissions,
  onSelectMission,
  isOpen,
  onClose,
  onOpenMap,
  onOpenScienceLab,
  onOpenLibrary,
  onOpenRimfaxRadar,
  onToggleBuildMode
}) => {
  if (!isOpen) return null;

  const completedCount = allMissions.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / allMissions.length) * 100);

  const getObjectiveIcon = (type: string, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;

    const className = `w-4 h-4 shrink-0 ${isCurrent ? 'text-mars-orange animate-pulse' : 'text-mars-border'}`;

    switch (type) {
      case 'analyze_sample':
      case 'unlock_tech':
        return <FlaskConical className={className} />;
      case 'radar_sounding':
      case 'deep_core_drill':
        return <Radio className={className} />;
      case 'visit_library':
        return <BookOpen className={className} />;
      case 'build_structure':
        return <Hammer className={className} />;
      case 'observe_sunset':
        return <Sunset className={className} />;
      default:
        return <Circle className={className} />;
    }
  };

  const getTierColor = (tier: string) => {
    if (tier.includes('TIER 1')) return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
    if (tier.includes('TIER 2')) return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
    if (tier.includes('TIER 3')) return 'bg-orange-950/80 text-orange-300 border-orange-500/40';
    return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
  };

  const currentObj = mission.objectives[mission.currentObjectiveIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-mars-surface border border-mars-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-mars-border/80 bg-mars-panel/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-mars-orange/20 rounded-xl text-mars-orange border border-mars-orange/40">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold text-mars-sand uppercase tracking-wider">
                  NASA EXPEDITIONS DIRECTORY • {mission.code}
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getTierColor(mission.tier)}`}>
                  {mission.tier}
                </span>
              </div>
              <h2 className="text-base font-bold font-display text-white tracking-wide">
                {mission.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-mars-dust hover:text-white hover:bg-white/10 border border-mars-border/50 transition-all cursor-pointer"
            title="Close Missions [O / Esc / C]"
          >
            <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-mars-sand">O / Esc</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Progress & Expedition Tabs */}
        <div className="bg-mars-surface/80 border-b border-mars-border/60 p-3 space-y-2 font-mono text-xs">
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-[11px] text-mars-sand px-1">
            <span>EXPEDITION PROGRAM PROGRESS</span>
            <span className="text-white font-bold">
              {completedCount} OF {allMissions.length} COMPLETED ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-mars-border/40">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-mars-orange to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Mission Switcher Tabs */}
          <div className="flex items-center space-x-2 pt-1 overflow-x-auto pb-1 scrollbar-thin">
            {allMissions.map((m, idx) => {
              const isSelected = m.id === mission.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectMission(m.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-mars-orange/20 border-mars-orange text-white font-bold ring-1 ring-mars-orange/40 shadow-lg'
                      : m.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-950/40'
                      : 'bg-black/40 border-mars-border/60 text-mars-dust hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>EXP-0{idx + 1}</span>
                  {m.completed ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] text-mars-sand/60">({m.objectives.filter(o => o.completed).length}/{m.objectives.length})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 font-mono text-xs">
          {/* Briefing Card */}
          <div className="bg-mars-panel/70 p-4 rounded-xl border border-mars-border/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-mars-sand font-bold tracking-wider uppercase">
              <span>EXPEDITION BRIEFING • SOL {mission.solInitiated}</span>
              <div className="flex items-center space-x-1 text-gray-400 font-normal">
                <Clock className="w-3 h-3 text-mars-dust" />
                <span>{mission.estimatedDuration}</span>
              </div>
            </div>
            <p className="text-gray-300 font-sans text-xs leading-relaxed">
              {mission.briefing}
            </p>
          </div>

          {/* Objectives List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-mars-sand font-bold tracking-wider uppercase">
              <span>SEQUENTIAL OBJECTIVES</span>
              <span>
                {mission.objectives.filter((o) => o.completed).length} / {mission.objectives.length} DONE
              </span>
            </div>

            <div className="space-y-2.5">
              {mission.objectives.map((obj, index) => {
                const isCurrent = index === mission.currentObjectiveIndex && !mission.completed;
                return (
                  <div
                    key={obj.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3.5 ${
                      obj.completed
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 shadow-sm'
                        : isCurrent
                        ? 'bg-mars-orange/15 border-mars-orange text-white ring-1 ring-mars-orange/50 shadow-md'
                        : 'bg-black/30 border-mars-border/50 text-mars-dust/60'
                    }`}
                  >
                    <div className="mt-0.5">
                      {getObjectiveIcon(obj.type, obj.completed, isCurrent)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="font-bold flex items-center justify-between text-xs">
                        <span className={obj.completed ? 'line-through opacity-80' : ''}>
                          {index + 1}. {obj.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-mars-orange/30 text-amber-300 px-2 py-0.5 rounded border border-mars-orange/40 font-bold animate-pulse">
                            ACTIVE
                          </span>
                        )}
                        {obj.completed && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                            DONE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                        {obj.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mission Completion Rewards Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/20 via-black/40 to-mars-panel/50 border border-amber-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                <Award className="w-4 h-4 text-amber-400" />
                <span>EXPEDITION COMPLETION GRANTS</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-amber-950/80 text-amber-300 border border-amber-500/50 px-2.5 py-0.5 rounded-full font-bold text-xs shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>+{mission.rewards.researchPointsReward} RESEARCH POINTS</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-gray-300 pt-1">
              <div className="p-2 rounded-lg bg-black/40 border border-mars-border/60">
                <span className="text-mars-sand font-bold block text-[10px]">RESEARCH DOSSIER:</span>
                <span className="text-white truncate block">{mission.rewards.journalEntryTitle}</span>
              </div>
              {mission.rewards.unlockedTool && (
                <div className="p-2 rounded-lg bg-black/40 border border-mars-border/60">
                  <span className="text-cyan-400 font-bold block text-[10px]">TOOL / BIT GRANT:</span>
                  <span className="text-white truncate block">{mission.rewards.unlockedTool}</span>
                </div>
              )}
              <div className="p-2 rounded-lg bg-black/40 border border-mars-border/60">
                <span className="text-emerald-400 font-bold block text-[10px]">ARCHIVE TELEMETRY:</span>
                <span className="text-white truncate block">{mission.rewards.scientificDataGrant}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Action Shortcuts */}
        <div className="p-4 border-t border-mars-border/80 bg-mars-panel/90 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenMap();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-mars-surface hover:bg-white/10 border border-mars-border text-mars-sand hover:text-white font-mono text-xs transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-mars-orange" />
              <span>MAP [M]</span>
            </button>

            {/* Contextual Jump Buttons */}
            {currentObj?.type === 'analyze_sample' || currentObj?.type === 'unlock_tech' ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenScienceLab?.();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-300 font-mono text-xs transition-colors cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                <span>OPEN SCIENCE LAB [K]</span>
              </button>
            ) : null}

            {currentObj?.type === 'radar_sounding' || currentObj?.type === 'deep_core_drill' ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenRimfaxRadar?.();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/50 text-amber-300 font-mono text-xs transition-colors cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>OPEN RIMFAX RADAR [U]</span>
              </button>
            ) : null}

            {currentObj?.type === 'visit_library' ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenLibrary?.();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/50 text-purple-300 font-mono text-xs transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>OPEN ARCHIVE LIBRARY [L]</span>
              </button>
            ) : null}

            {currentObj?.type === 'build_structure' ? (
              <button
                onClick={() => {
                  onClose();
                  onToggleBuildMode?.();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-950/60 hover:bg-orange-900/60 border border-orange-500/50 text-orange-300 font-mono text-xs transition-colors cursor-pointer"
              >
                <Hammer className="w-3.5 h-3.5 text-orange-400" />
                <span>ENTER BUILD MODE [B]</span>
              </button>
            ) : null}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onSelectMission(mission.id);
                onClose();
              }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-mars-orange hover:bg-mars-rust text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-lg"
            >
              <span>TRACK EXPEDITION</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
