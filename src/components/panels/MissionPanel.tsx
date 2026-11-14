import React from 'react';
import { Mission } from '../../types/mission';
import { X, CheckCircle, Circle, Target, Award, Compass } from 'lucide-react';

interface MissionPanelProps {
  mission: Mission;
  allMissions: Mission[];
  onSelectMission: (missionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenMap: () => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({
  mission,
  allMissions,
  onSelectMission,
  isOpen,
  onClose,
  onOpenMap
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-mars-surface border border-mars-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mars-border/80 bg-mars-panel/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-mars-orange/20 rounded-lg text-mars-orange border border-mars-orange/40">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-mars-sand uppercase">
                RESEARCH EXPEDITIONS & OBJECTIVES • {mission.code}
              </span>
              <h2 className="text-lg font-bold font-display text-white">
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

        {/* Mission Switcher Tabs */}
        <div className="flex items-center space-x-2 px-6 pt-4 pb-2 bg-mars-surface border-b border-mars-border/50 font-mono text-xs overflow-x-auto">
          {allMissions.map((m, idx) => {
            const isSelected = m.id === mission.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMission(m.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-mars-orange/20 border-mars-orange text-white font-bold ring-1 ring-mars-orange/40'
                    : 'bg-mars-surface border-mars-border/60 text-mars-dust hover:text-white hover:bg-white/5'
                }`}
              >
                <span>MISSION 0{idx + 1}</span>
                {m.completed && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs">
          {/* Briefing */}
          <div className="bg-mars-panel/70 p-4 rounded-xl border border-mars-border/70 space-y-2">
            <span className="text-[11px] text-mars-sand font-bold tracking-wider uppercase block">
              EXPEDITION BRIEFING • SOL {mission.solInitiated}
            </span>
            <p className="text-gray-300 font-sans text-xs leading-relaxed">
              {mission.briefing}
            </p>
          </div>

          {/* Objectives List */}
          <div className="space-y-3">
            <span className="text-[11px] text-mars-sand font-bold tracking-wider uppercase block">
              ORDERED OBJECTIVES
            </span>
            <div className="space-y-2.5">
              {mission.objectives.map((obj, index) => {
                const isCurrent = index === mission.currentObjectiveIndex && !mission.completed;
                return (
                  <div
                    key={obj.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                      obj.completed
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : isCurrent
                        ? 'bg-mars-orange/15 border-mars-orange text-white ring-1 ring-mars-orange/40'
                        : 'bg-mars-surface border-mars-border/60 text-mars-dust/60'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {obj.completed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className={`w-4 h-4 ${isCurrent ? 'text-mars-orange animate-pulse' : 'text-mars-border'}`} />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="font-bold flex items-center justify-between">
                        <span>{obj.title}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-mars-orange/30 text-mars-orange px-2 py-0.5 rounded border border-mars-orange/40 animate-pulse">
                            IN PROGRESS
                          </span>
                        )}
                        {obj.completed && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 font-sans">
                        {obj.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mission Rewards */}
          <div className="p-4 rounded-xl bg-black/40 border border-mars-border space-y-2">
            <div className="flex items-center space-x-2 text-mars-sand font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>COMPLETION SCIENTIFIC GRANTS</span>
            </div>
            <div className="text-[11px] text-gray-300 space-y-1">
              <div>• Journal: <span className="text-white">{mission.rewards.journalEntryTitle}</span></div>
              {mission.rewards.unlockedTool && (
                <div>• Tool: <span className="text-white">{mission.rewards.unlockedTool}</span></div>
              )}
              <div>• Archive: <span className="text-white">{mission.rewards.scientificDataGrant}</span></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-mars-border/80 bg-mars-panel/90 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenMap();
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-mars-surface hover:bg-white/10 border border-mars-border text-mars-sand hover:text-white font-mono text-xs transition-colors"
          >
            <Compass className="w-4 h-4 text-mars-orange" />
            <span>LOCATE ON TACTICAL MAP [M]</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-mars-orange hover:bg-mars-rust text-white font-mono text-xs font-bold transition-all"
          >
            RESUME EXPEDITION
          </button>
        </div>
      </div>
    </div>
  );
};
