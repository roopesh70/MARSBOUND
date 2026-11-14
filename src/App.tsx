import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MarsCanvas, GameTelemetry } from './game/MarsCanvas';
import { HUD } from './components/ui/HUD';
import { TacticalMapModal } from './components/panels/TacticalMapModal';
import { DiscoveryModal } from './components/panels/DiscoveryModal';
import { MissionPanel } from './components/panels/MissionPanel';
import { JournalPanel } from './components/panels/JournalPanel';
import { ProvenanceRegistryModal } from './components/panels/ProvenanceRegistryModal';
import { SettingsModal } from './components/panels/SettingsModal';
import { OutpostBuildModal } from './components/panels/OutpostBuildModal';
import { LandingIntro } from './components/intro/LandingIntro';
import { JEZERO_DISCOVERIES } from './data/discoveries';
import { ALL_MISSIONS } from './data/missions';
import { DiscoveryRecord } from './types/discovery';
import { Mission } from './types/mission';
import { OutpostStructureType, OutpostStructure } from './types/outpost';
import { AstronautController } from './game/player/AstronautController';
import { StorageService } from './services/storageService';
import { audioService } from './services/audioService';
import { CheckCircle2 } from 'lucide-react';

type ActiveModal = 'none' | 'intro' | 'map' | 'discovery' | 'mission' | 'journal' | 'provenance' | 'settings';

export const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal>('intro');
  const [telemetry, setTelemetry] = useState<GameTelemetry | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<DiscoveryRecord | null>(null);
  const [scanSignal, setScanSignal] = useState(0);
  const [roverSignal, setRoverSignal] = useState(0);
  const [flashlightSignal, setFlashlightSignal] = useState(0);
  const [missionToast, setMissionToast] = useState<string | null>(null);
  const [customWaypoint, setCustomWaypoint] = useState<{ x: number; z: number; label?: string } | null>(null);
  const [gpsTrail, setGpsTrail] = useState<{ x: number; z: number; isRover: boolean }[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const controllerRef = useRef<AstronautController | null>(null);

  // Build mode states
  const [isBuildMode, setIsBuildMode] = useState(false);
  const [selectedBuildType, setSelectedBuildType] = useState<OutpostStructureType>('solar_array');
  const [buildRotateSignal, setBuildRotateSignal] = useState(0);
  const [structures, setStructures] = useState<OutpostStructure[]>([]);

  // Missions states
  const [missions, setMissions] = useState<Mission[]>(ALL_MISSIONS);
  const [activeMissionId, setActiveMissionId] = useState<string>(ALL_MISSIONS[0].id);

  // Saved discoveries & samples
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [collectedSamples, setCollectedSamples] = useState<{
    id: string;
    discoveryId: string;
    sampleName: string;
    timestamp: string;
    sol: number;
    notes: string;
  }[]>([]);

  // Load saved state on mount
  useEffect(() => {
    const saved = StorageService.load();
    if (saved) {
      setDiscoveredIds(saved.discoveredIds || []);
      setCollectedSamples(saved.collectedSamples || []);
      if (saved.structures && saved.structures.length > 0) {
        setStructures(saved.structures);
      }
    }
  }, []);

  const activeMission = missions.find((m) => m.id === activeMissionId) || missions[0];

  // Helper to mark mission objectives completed with audio & toast feedback
  const completeObjective = useCallback((missionId: string, objectiveIndex: number) => {
    setMissions((currentMissions) => {
      let changed = false;
      let toastMessage = '';

      const updated = currentMissions.map((m) => {
        if (m.id !== missionId) return m;

        if (m.objectives[objectiveIndex] && !m.objectives[objectiveIndex].completed) {
          const objs = [...m.objectives];
          objs[objectiveIndex] = { ...objs[objectiveIndex], completed: true };
          changed = true;
          toastMessage = `✦ OBJECTIVE COMPLETED: ${objs[objectiveIndex].title}`;

          const nextIdx = objs.findIndex((o) => !o.completed);
          const allDone = nextIdx === -1;
          return {
            ...m,
            objectives: objs,
            currentObjectiveIndex: allDone ? objs.length - 1 : nextIdx,
            completed: allDone
          };
        }
        return m;
      });

      if (changed) {
        audioService.playDiscoveryFound();
        setMissionToast(toastMessage);
        setTimeout(() => setMissionToast((prev) => (prev === toastMessage ? null : prev)), 4500);
        return updated;
      }
      return currentMissions;
    });
  }, []);

  const handleToggleLight = useCallback(() => {
    setFlashlightSignal((prev) => prev + 1);
  }, []);

  const closeActiveModal = useCallback(() => {
    setActiveModal('none');
    audioService.playClick();
    controllerRef.current?.lockPointer();
  }, []);

  const handleToggleMap = useCallback(() => {
    setActiveModal((prev) => {
      const next = prev === 'map' ? 'none' : 'map';
      if (next === 'map') {
        completeObjective('mission_01_geological_outcrop', 0);
      }
      return next;
    });
    audioService.playClick();
  }, [completeObjective]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'KeyL':
        case 'KeyT':
          handleToggleLight();
          break;

        // Tactical Map Toggle [M]: press M to open, press M again to close!
        case 'KeyM':
          if (!isBuildMode) {
            if (activeModal === 'map') {
              closeActiveModal();
            } else if (activeModal === 'none') {
              handleToggleMap();
            }
          }
          break;

        // Research Journal Toggle [J]: press J to open, press J again to close!
        case 'KeyJ':
          if (!isBuildMode) {
            if (activeModal === 'journal') {
              closeActiveModal();
            } else if (activeModal === 'none') {
              setActiveModal('journal');
              audioService.playClick();
            }
          }
          break;

        // Missions Panel Toggle [O]: press O to open, press O again to close!
        case 'KeyO':
          if (!isBuildMode) {
            if (activeModal === 'mission') {
              closeActiveModal();
            } else if (activeModal === 'none') {
              setActiveModal('mission');
              audioService.playClick();
            }
          }
          break;

        // Base Build Mode Toggle [B]: press B to open, press B again to close!
        case 'KeyB':
          if (activeModal === 'none') {
            setIsBuildMode((prev) => !prev);
            audioService.playClick();
          }
          break;

        // Rover Mount/Dismount [E]
        case 'KeyE':
          if (activeModal === 'none' && !isBuildMode) {
            setRoverSignal((prev) => prev + 1);
          }
          break;

        // Provenance Registry Toggle [R]: press R to open, press R again to close!
        case 'KeyR':
          if (isBuildMode) {
            setBuildRotateSignal((prev) => prev + 1);
          } else if (activeModal === 'provenance') {
            closeActiveModal();
          } else if (activeModal === 'none') {
            setActiveModal('provenance');
            audioService.playClick();
          }
          break;

        // Spectrometer Scanner / Discovery Scan Toggle [F]: press F to scan, or press F to close discovery modal!
        case 'KeyF':
          if (activeModal === 'discovery') {
            closeActiveModal();
          } else if (activeModal === 'none' && !isBuildMode) {
            setScanSignal((prev) => prev + 1);
          }
          break;

        // Universal Close Keys: Escape, C, or X immediately closes whatever panel or modal is open!
        case 'Escape':
        case 'KeyC':
        case 'KeyX':
          if (isBuildMode) {
            setIsBuildMode(false);
            audioService.playClick();
          } else if (activeModal !== 'none' && activeModal !== 'intro') {
            closeActiveModal();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, isBuildMode, handleToggleLight, handleToggleMap, closeActiveModal]);

  // Handle telemetry updates & check mission objective triggers across missions
  const handleTelemetryUpdate = useCallback((t: GameTelemetry) => {
    setTelemetry(t);

    // Update GPS Breadcrumb Trail (sample every 3.5m)
    setGpsTrail((prev) => {
      const last = prev[prev.length - 1];
      if (!last || Math.hypot(t.position.x - last.x, t.position.z - last.z) >= 3.5) {
        const updated = [...prev, { x: t.position.x, z: t.position.z, isRover: t.isDrivingRover }];
        return updated.length > 350 ? updated.slice(updated.length - 350) : updated;
      }
      return prev;
    });

    // MISSION 01: Delta Scarp
    if (t.nearestPoi?.id === 'poi_delta_scarp' && t.nearestPoiDistance <= 35) {
      completeObjective('mission_01_geological_outcrop', 1);
    }
    const m1 = missions.find((m) => m.id === 'mission_01_geological_outcrop');
    if (m1?.objectives[3].completed && !m1.objectives[4].completed && (t.suit.isInSafeZone || Math.hypot(t.position.x, t.position.z) <= 25)) {
      completeObjective('mission_01_geological_outcrop', 4);
    }

    // MISSION 02: Kodiak Butte Rover Expedition
    if (t.isDrivingRover) {
      completeObjective('mission_02_kodiak_expedition', 0);
    }
    if (t.nearestPoi?.id === 'poi_kodiak_butte' && t.nearestPoiDistance <= 45) {
      completeObjective('mission_02_kodiak_expedition', 1);
    }
    const m2 = missions.find((m) => m.id === 'mission_02_kodiak_expedition');
    if (m2?.objectives[3].completed && !m2.objectives[4].completed && (t.suit.isInSafeZone || Math.hypot(t.position.x, t.position.z) <= 25)) {
      completeObjective('mission_02_kodiak_expedition', 4);
    }

    // MISSION 03: Expand Outpost
    if (isBuildMode) {
      completeObjective('mission_03_expand_outpost', 0);
    }
    if (t.totalPowerGen >= 4800) {
      completeObjective('mission_03_expand_outpost', 2);
    }
  }, [missions, isBuildMode, completeObjective]);

  // Handle structure placement in Build Mode
  const handleStructurePlaced = useCallback((newStructure: OutpostStructure) => {
    setStructures((prev) => {
      const updated = [...prev, newStructure];
      // Save state to local storage
      StorageService.save({
        version: 1,
        discoveredIds,
        collectedSamples,
        mission: activeMission,
        structures: updated,
        sol: telemetry?.solTime.sol || 142,
        suitOxygen: telemetry?.suit.oxygen || 100,
        suitBattery: telemetry?.suit.battery || 100,
        playerPosition: telemetry?.position || { x: 0, y: 0, z: 0 }
      });
      return updated;
    });

    // Advance Mission 03 Objective 1
    completeObjective('mission_03_expand_outpost', 1);
  }, [discoveredIds, collectedSamples, activeMission, telemetry, completeObjective]);

  // Triggered when player opens discovery from scan or map
  const handleOpenDiscovery = useCallback((poi: DiscoveryRecord) => {
    setSelectedPoi(poi);
    setActiveModal('discovery');

    setDiscoveredIds((prev) => {
      if (!prev.includes(poi.id)) {
        return [...prev, poi.id];
      }
      return prev;
    });

    // Advance mission scanning objectives
    if (poi.id === 'poi_delta_scarp') {
      completeObjective('mission_01_geological_outcrop', 1);
      completeObjective('mission_01_geological_outcrop', 2);
    }
    if (poi.id === 'poi_kodiak_butte') {
      completeObjective('mission_02_kodiak_expedition', 1);
      completeObjective('mission_02_kodiak_expedition', 2);
    }
  }, [completeObjective]);

  // Handle simulated sample collection
  const handleCollectSample = useCallback((poi: DiscoveryRecord) => {
    if (!poi.sampleCollectable || !poi.sampleName) return;

    audioService.playSampleCollect();

    setCollectedSamples((prev) => [
      ...prev,
      {
        id: `sample_${Date.now()}`,
        discoveryId: poi.id,
        sampleName: poi.sampleName || 'Martian Specimen',
        timestamp: new Date().toISOString(),
        sol: telemetry?.solTime.sol || 142,
        notes: `Extracted from ${poi.name} during EVA. Rich in ${poi.mineralSignatures?.join(', ') || 'mineral silicates'}.`
      }
    ]);

    // Advance mission sampling objectives
    if (poi.id === 'poi_delta_scarp') {
      completeObjective('mission_01_geological_outcrop', 3);
    }
    if (poi.id === 'poi_kodiak_butte') {
      completeObjective('mission_02_kodiak_expedition', 3);
    }
  }, [telemetry, completeObjective]);

  const handleOpenMap = useCallback(() => {
    handleToggleMap();
  }, [handleToggleMap]);

  const handleStartGame = () => {
    audioService.init();
    setActiveModal('none');
    controllerRef.current?.lockPointer();
  };

  const handleResetSave = () => {
    StorageService.clear();
    setDiscoveredIds([]);
    setCollectedSamples([]);
    setStructures([]);
    setMissions(ALL_MISSIONS);
    setActiveModal('none');
  };

  const discoveredPoisList = JEZERO_DISCOVERIES.filter((p) => discoveredIds.includes(p.id));

  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden font-sans">
      {/* Objective Completion Toast Banner */}
      {missionToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-3 bg-emerald-950/95 backdrop-blur-md border border-emerald-400 text-emerald-200 px-6 py-3.5 rounded-2xl shadow-2xl font-mono text-xs font-bold animate-in fade-in slide-in-from-top duration-300 pointer-events-none ring-1 ring-emerald-400/50">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
          <span>{missionToast}</span>
        </div>
      )}

      {/* 3D WebGL Mars Surface Canvas */}
      <MarsCanvas
        onTelemetryUpdate={handleTelemetryUpdate}
        onOpenDiscovery={handleOpenDiscovery}
        isPaused={activeModal !== 'none'}
        activeScanSignal={scanSignal}
        onPointerLockChange={() => {}}
        controllerRefOut={controllerRef}
        isBuildMode={isBuildMode}
        selectedBuildType={selectedBuildType}
        buildRotateSignal={buildRotateSignal}
        onStructurePlaced={handleStructurePlaced}
        roverMountSignal={roverSignal}
        flashlightSignal={flashlightSignal}
        savedStructures={structures}
      />

      {/* Main Astronaut HUD (visible during active gameplay when not in build mode) */}
      {activeModal === 'none' && !isBuildMode && (
        <HUD
          telemetry={telemetry}
          mission={activeMission}
          onOpenMap={handleOpenMap}
          onOpenMission={() => {
            audioService.playClick();
            setActiveModal('mission');
          }}
          onOpenJournal={() => {
            audioService.playClick();
            setActiveModal('journal');
          }}
          onOpenProvenance={() => {
            audioService.playClick();
            setActiveModal('provenance');
          }}
          onOpenSettings={() => {
            audioService.playClick();
            setActiveModal('settings');
          }}
          onScan={() => setScanSignal((prev) => prev + 1)}
          onRequestPointerLock={() => {
            controllerRef.current?.lockPointer();
          }}
          onToggleBuildMode={() => {
            setIsBuildMode(true);
            audioService.playClick();
          }}
          onToggleRover={() => {
            setRoverSignal((prev) => prev + 1);
          }}
          onToggleLight={handleToggleLight}
          customWaypoint={customWaypoint}
          structures={structures}
          onClearCustomWaypoint={() => setCustomWaypoint(null)}
        />
      )}

      {/* Outpost Build Mode Overlay (active when pressing B) */}
      <OutpostBuildModal
        isActive={isBuildMode}
        selectedType={selectedBuildType}
        isValidPlacement={telemetry?.isValidBuildPlacement || false}
        onSelectType={(type) => {
          setSelectedBuildType(type);
          audioService.playClick();
        }}
        onRotate={() => setBuildRotateSignal((prev) => prev + 1)}
        onClose={() => {
          setIsBuildMode(false);
          audioService.playClick();
          controllerRef.current?.lockPointer();
        }}
        totalPowerGen={telemetry?.totalPowerGen || 4800}
        totalPowerCon={telemetry?.totalPowerCon || 1550}
        totalBatteryWh={telemetry?.totalBatteryWh || 25000}
      />

      {/* Intro Modal on First Launch */}
      {activeModal === 'intro' && (
        <LandingIntro
          onStart={handleStartGame}
          onOpenProvenance={() => setActiveModal('provenance')}
        />
      )}

      {/* Tactical GIS Map Modal */}
      <TacticalMapModal
        isOpen={activeModal === 'map'}
        onClose={closeActiveModal}
        playerPosition={telemetry?.position || { x: 0, y: 0, z: 0 }}
        playerCoordinates={telemetry?.coordinates || {
          latitude: 18.4447,
          longitude: 77.4508,
          elevation: -2574,
          datum: 'MOLA Mars Areoid',
          crs: 'Planetocentric'
        }}
        playerHeading={telemetry?.heading || 0}
        activeObjectiveTargetId={activeMission.objectives[activeMission.currentObjectiveIndex]?.targetDiscoveryId}
        isDrivingRover={telemetry?.isDrivingRover}
        structures={structures}
        customWaypoint={customWaypoint}
        onSetCustomWaypoint={setCustomWaypoint}
        gpsTrail={gpsTrail}
        onSelectPoi={(id) => {
          const target = JEZERO_DISCOVERIES.find((p) => p.id === id);
          if (target) {
            handleOpenDiscovery(target);
          }
        }}
      />

      {/* Scientific Discovery Modal */}
      <DiscoveryModal
        poi={selectedPoi}
        isOpen={activeModal === 'discovery'}
        onClose={closeActiveModal}
        onCollectSample={handleCollectSample}
        isSampleCollected={
          !!selectedPoi && collectedSamples.some((s) => s.discoveryId === selectedPoi.id)
        }
      />

      {/* Mission Briefing & Objectives Panel with Multiple Missions */}
      <MissionPanel
        mission={activeMission}
        allMissions={missions}
        onSelectMission={(id) => setActiveMissionId(id)}
        isOpen={activeModal === 'mission'}
        onClose={closeActiveModal}
        onOpenMap={handleOpenMap}
      />

      {/* Research Journal & Samples Panel */}
      <JournalPanel
        isOpen={activeModal === 'journal'}
        onClose={closeActiveModal}
        discoveredPois={discoveredPoisList}
        collectedSamples={collectedSamples}
        onSelectPoi={(poi) => {
          setSelectedPoi(poi);
          setActiveModal('discovery');
        }}
      />

      {/* NASA Open Data & Provenance Registry */}
      <ProvenanceRegistryModal
        isOpen={activeModal === 'provenance'}
        onClose={closeActiveModal}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={closeActiveModal}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onResetSave={handleResetSave}
      />
    </div>
  );
};

export default App;
