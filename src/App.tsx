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
import { MarsLibraryModal } from './components/panels/MarsLibraryModal';
import { ScienceLabModal } from './components/panels/ScienceLabModal';
import { RimfaxRadarModal } from './components/panels/RimfaxRadarModal';
import { LandingIntro } from './components/intro/LandingIntro';
import { ALL_DISCOVERIES } from './data/discoveries';
import { ALL_MISSIONS } from './data/missions';
import { DiscoveryRecord } from './types/discovery';
import { Mission } from './types/mission';
import { OutpostStructureType, OutpostStructure, BuildToolMode } from './types/outpost';
import { AstronautController } from './game/player/AstronautController';
import { StorageService } from './services/storageService';
import { audioService } from './services/audioService';
import { rimfaxService } from './services/rimfaxService';
import { CheckCircle2 } from 'lucide-react';
import { useMobileDetection } from './hooks/useMobileDetection';
import { RotateDevicePrompt } from './components/ui/RotateDevicePrompt';
import { MobileTouchControls } from './components/ui/MobileTouchControls';
import { MobileActionWheel } from './components/ui/MobileActionWheel';

type ActiveModal = 'none' | 'intro' | 'map' | 'discovery' | 'mission' | 'journal' | 'provenance' | 'settings' | 'library' | 'science_lab' | 'rimfax';

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
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const controllerRef = useRef<AstronautController | null>(null);

  // Mobile detection & Touch UI states
  const { isTouchDevice, isMobile, isPortrait } = useMobileDetection();
  const [isPortraitPromptDismissed, setIsPortraitPromptDismissed] = useState(false);
  const [isActionWheelOpen, setIsActionWheelOpen] = useState(false);

  // Build mode states
  const [isBuildMode, setIsBuildMode] = useState(false);
  const [buildToolMode, setBuildToolMode] = useState<BuildToolMode>('construct');
  const [selectedBuildType, setSelectedBuildType] = useState<OutpostStructureType>('solar_array');
  const [buildRotateSignal, setBuildRotateSignal] = useState(0);
  const [structures, setStructures] = useState<OutpostStructure[]>([]);

  // Missions states
  const [missions, setMissions] = useState<Mission[]>(ALL_MISSIONS);
  const [activeMissionId, setActiveMissionId] = useState<string>(ALL_MISSIONS[0].id);

  // Saved discoveries, samples & scientific research
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [collectedSamples, setCollectedSamples] = useState<{
    id: string;
    discoveryId: string;
    sampleName: string;
    timestamp: string;
    sol: number;
    notes: string;
  }[]>([]);
  const [researchPoints, setResearchPoints] = useState<number>(0);
  const [analyzedSampleIds, setAnalyzedSampleIds] = useState<string[]>([]);
  const [unlockedTechIds, setUnlockedTechIds] = useState<string[]>([]);
  const [isDrilling, setIsDrilling] = useState<boolean>(false);

  // Martian celestial & time warp states
  const [solTimeOverride, setSolTimeOverride] = useState<{ hour: number; minute?: number } | null>(null);
  const [solSpeedMultiplier, setSolSpeedMultiplier] = useState<number>(30);

  // Load saved state on mount
  useEffect(() => {
    const saved = StorageService.load();
    if (saved) {
      setDiscoveredIds(saved.discoveredIds || []);
      setCollectedSamples(saved.collectedSamples || []);
      setResearchPoints(saved.researchPoints || 0);
      setAnalyzedSampleIds(saved.analyzedSampleIds || []);
      setUnlockedTechIds(saved.unlockedTechIds || []);
      if (saved.structures && saved.structures.length > 0) {
        setStructures(saved.structures);
      }
      if (saved.allMissions && saved.allMissions.length > 0) {
        const merged = ALL_MISSIONS.map((m) => {
          const found = saved.allMissions?.find((sm) => sm.id === m.id);
          if (!found) return m;
          return {
            ...m,
            completed: found.completed,
            currentObjectiveIndex: found.currentObjectiveIndex,
            objectives: m.objectives.map((obj, idx) => ({
              ...obj,
              completed: found.objectives[idx]?.completed ?? false
            }))
          };
        });
        setMissions(merged);
      }
      if (saved.activeMissionId) {
        setActiveMissionId(saved.activeMissionId);
      }
    }
  }, []);

  const activeMission = missions.find((m) => m.id === activeMissionId) || missions[0];

  // Helper to mark mission objectives completed with audio & toast feedback
  const completeObjective = useCallback((missionId: string, objectiveIndex: number) => {
    setMissions((currentMissions) => {
      let changed = false;
      let toastMessage = '';
      let earnedRp = 0;
      let nextActiveId: string | null = null;

      const updated = currentMissions.map((m) => {
        if (m.id !== missionId) return m;

        if (m.objectives[objectiveIndex] && !m.objectives[objectiveIndex].completed) {
          const objs = [...m.objectives];
          objs[objectiveIndex] = { ...objs[objectiveIndex], completed: true };
          changed = true;

          const nextIdx = objs.findIndex((o) => !o.completed);
          const allDone = nextIdx === -1;

          if (allDone && !m.completed) {
            earnedRp = m.rewards.researchPointsReward;
            toastMessage = `🏆 EXPEDITION ACCOMPLISHED: ${m.title.toUpperCase()} (+${earnedRp} RP)`;
            // Search for next incomplete expedition
            const nextMission = currentMissions.find((other) => other.id !== m.id && !other.completed);
            if (nextMission) {
              nextActiveId = nextMission.id;
            }
          } else {
            toastMessage = `✦ OBJECTIVE COMPLETED: ${objs[objectiveIndex].title}`;
          }

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
        setTimeout(() => setMissionToast((prev) => (prev === toastMessage ? null : prev)), 5000);

        if (earnedRp > 0) {
          setResearchPoints((prev) => prev + earnedRp);
        }

        if (nextActiveId) {
          setActiveMissionId(nextActiveId);
        }

        return updated;
      }
      return currentMissions;
    });
  }, []);

  const handleToggleLight = useCallback(() => {
    setFlashlightSignal((prev) => prev + 1);
  }, []);

  // Automatically release pointer lock and reset inputs whenever a menu/modal is open or build mode is active
  useEffect(() => {
    if (activeModal !== 'none' || isBuildMode) {
      controllerRef.current?.unlockPointer();
      controllerRef.current?.resetInputs();
      setIsPointerLocked(false);
    }
  }, [activeModal, isBuildMode]);

  const closeActiveModal = useCallback((lockPointer = false) => {
    setActiveModal('none');
    audioService.playClick();
    if (lockPointer) {
      controllerRef.current?.lockPointer();
    } else {
      controllerRef.current?.unlockPointer();
      setIsPointerLocked(false);
    }
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
        // Field Science Laboratory Toggle [K]: press K to open or close!
        case 'KeyK':
          if (!isBuildMode) {
            if (activeModal === 'science_lab') {
              closeActiveModal(false);
            } else if (activeModal === 'none') {
              setActiveModal('science_lab');
              completeObjective('mission_02_laboratory_assay', 0);
              audioService.playClick();
            }
          }
          break;

        // Mars Archival Library Toggle [L]: press L to open or close!
        case 'KeyL':
          if (!isBuildMode) {
            if (activeModal === 'library') {
              closeActiveModal(false);
            } else if (activeModal === 'none') {
              setActiveModal('library');
              completeObjective('mission_06_cheyava_astrobiology', 0);
              audioService.playClick();
            }
          }
          break;

        // Flashlight / Torch Toggle [T]
        case 'KeyT':
          handleToggleLight();
          break;

        // Tactical Map Toggle [M]: press M to open, press M again to close!
        case 'KeyM':
          if (!isBuildMode) {
            if (activeModal === 'map') {
              closeActiveModal(false);
            } else if (activeModal === 'none') {
              handleToggleMap();
            }
          }
          break;

        // Research Journal Toggle [J]: press J to open, press J again to close!
        case 'KeyJ':
          if (!isBuildMode) {
            if (activeModal === 'journal') {
              closeActiveModal(false);
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
              closeActiveModal(false);
            } else if (activeModal === 'none') {
              setActiveModal('mission');
              audioService.playClick();
            }
          }
          break;

        // Base Build Mode Toggle [B]: press B to open, press B again to close!
        case 'KeyB':
          if (activeModal === 'none') {
            setIsBuildMode((prev) => {
              const next = !prev;
              if (next) {
                completeObjective('mission_04_expand_outpost', 0);
              }
              return next;
            });
            audioService.playClick();
          }
          break;

        // Rover Mount/Dismount [E] or Enter Nearby Lab / Library
        case 'KeyE':
          if (activeModal === 'none' && !isBuildMode) {
            if (telemetry?.isNearScienceLab) {
              setActiveModal('science_lab');
              completeObjective('mission_02_laboratory_assay', 0);
              audioService.playClick();
            } else if (telemetry?.isNearLibrary) {
              setActiveModal('library');
              completeObjective('mission_06_cheyava_astrobiology', 0);
              audioService.playClick();
            } else {
              setRoverSignal((prev) => prev + 1);
              completeObjective('mission_03_rimfax_subsurface', 0);
            }
          }
          break;

        // Provenance Registry Toggle [R]: press R to open, press R again to close!
        case 'KeyR':
          if (isBuildMode) {
            setBuildRotateSignal((prev) => prev + 1);
          } else if (activeModal === 'provenance') {
            closeActiveModal(false);
          } else if (activeModal === 'none') {
            setActiveModal('provenance');
            audioService.playClick();
          }
          break;

        // Spectrometer Scanner / Discovery Scan Toggle [F]: press F to scan, or press F to close discovery modal!
        case 'KeyF':
          if (activeModal === 'discovery') {
            closeActiveModal(false);
          } else if (activeModal === 'none' && !isBuildMode) {
            setScanSignal((prev) => prev + 1);
          }
          break;

        // RIMFAX Subsurface Radar Tomography Modal [U]: press U to open/close when driving rover!
        case 'KeyU':
          if (!isBuildMode) {
            if (activeModal === 'rimfax') {
              closeActiveModal(false);
            } else if (activeModal === 'none' && telemetry?.isDrivingRover) {
              setActiveModal('rimfax');
              completeObjective('mission_03_rimfax_subsurface', 1);
              audioService.playClick();
            }
          }
          break;

        // Subsurface Core Coring Drill [G]: press G to drill when driving rover near reflectors!
        case 'KeyG':
          if (activeModal === 'none' && telemetry?.isDrivingRover && !isBuildMode) {
            handleDeployCoreDrill();
          }
          break;

        // Universal Close Keys & Mouse Unlock: Escape, Alt, C, or X
        case 'Escape':
        case 'AltLeft':
        case 'AltRight':
          if (e.code.startsWith('Alt')) {
            e.preventDefault();
          }
          if (isBuildMode) {
            setIsBuildMode(false);
            audioService.playClick();
          } else if (activeModal !== 'none' && activeModal !== 'intro') {
            closeActiveModal(false);
          } else if (activeModal === 'none') {
            // In active gameplay: reliably toggle/unlock mouse pointer
            if (document.pointerLockElement) {
              controllerRef.current?.unlockPointer();
              setIsPointerLocked(false);
              audioService.playClick();
            } else if (e.code.startsWith('Alt')) {
              controllerRef.current?.lockPointer();
              audioService.playClick();
            }
          }
          break;

        case 'KeyC':
          if (isBuildMode) {
            setIsBuildMode(false);
            audioService.playClick();
          } else if (activeModal !== 'none' && activeModal !== 'intro') {
            closeActiveModal(false);
          }
          break;

        case 'KeyX':
          if (isBuildMode) {
            setBuildToolMode((prev) => (prev === 'construct' ? 'dismantle' : 'construct'));
            audioService.playClick();
          } else if (activeModal !== 'none' && activeModal !== 'intro') {
            closeActiveModal(false);
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

    // MISSION 01: Delta Scarp Reconnaissance
    if (t.nearestPoi?.id === 'poi_delta_scarp' && t.nearestPoiDistance <= 35) {
      completeObjective('mission_01_geological_outcrop', 1);
    }
    const m1 = missions.find((m) => m.id === 'mission_01_geological_outcrop');
    if (m1?.objectives[3].completed && !m1.objectives[4].completed && (t.suit.isInSafeZone || Math.hypot(t.position.x, t.position.z) <= 25)) {
      completeObjective('mission_01_geological_outcrop', 4);
    }

    // MISSION 02: Laboratory Assay
    if (t.isNearScienceLab) {
      completeObjective('mission_02_laboratory_assay', 0);
    }

    // MISSION 03: RIMFAX Subsurface Tomography
    if (t.isDrivingRover) {
      completeObjective('mission_03_rimfax_subsurface', 0);
      completeObjective('mission_03_rimfax_subsurface', 1);
      if (t.rimfax.nearbyAnomaly) {
        completeObjective('mission_03_rimfax_subsurface', 2);
      }
    }

    // MISSION 04: Expand Outpost
    if (isBuildMode) {
      completeObjective('mission_04_expand_outpost', 0);
    }
    if (t.totalPowerGen >= 4800) {
      completeObjective('mission_04_expand_outpost', 3);
    }
    const m4 = missions.find((m) => m.id === 'mission_04_expand_outpost');
    if (m4?.objectives[3].completed && !m4.objectives[4].completed && t.suit.isInSafeZone) {
      completeObjective('mission_04_expand_outpost', 4);
    }

    // MISSION 05: Neretva Vallis Megaflood
    if (t.nearestPoi?.id === 'poi_kodiak_butte' && t.nearestPoiDistance <= 60) {
      completeObjective('mission_05_neretva_expedition', 0);
    }
    if (t.activeRegionId === 'neretva_vallis' || (t.position.x < -195 && t.position.z < -140)) {
      completeObjective('mission_05_neretva_expedition', 1);
    }
    if (t.nearestPoi?.id === 'poi_neretva_canyon' && t.nearestPoiDistance <= 40) {
      completeObjective('mission_05_neretva_expedition', 2);
    }
    const m5 = missions.find((m) => m.id === 'mission_05_neretva_expedition');
    if (m5?.objectives[3].completed && !m5.objectives[4].completed && (t.suit.isInSafeZone || Math.hypot(t.position.x, t.position.z) <= 28)) {
      completeObjective('mission_05_neretva_expedition', 4);
    }

    // MISSION 06: Cheyava Falls Astrobiology
    if (t.isNearLibrary) {
      completeObjective('mission_06_cheyava_astrobiology', 0);
    }
    if (t.nearestPoi?.id === 'poi_cheyava_falls' && t.nearestPoiDistance <= 45) {
      completeObjective('mission_06_cheyava_astrobiology', 1);
    }
    const m6 = missions.find((m) => m.id === 'mission_06_cheyava_astrobiology');
    if (m6?.objectives[3].completed && !m6.objectives[4].completed) {
      const hour = t.solTime.hour + t.solTime.minute / 60;
      if (hour >= 17.0 && hour <= 18.85) {
        completeObjective('mission_06_cheyava_astrobiology', 4);
      }
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
        allMissions: missions,
        activeMissionId,
        structures: updated,
        sol: telemetry?.solTime.sol || 142,
        suitOxygen: telemetry?.suit.oxygen || 100,
        suitBattery: telemetry?.suit.battery || 100,
        playerPosition: telemetry?.position || { x: 0, y: 0, z: 0 }
      });
      return updated;
    });

    // Advance Mission 04 Construction Objectives
    if (newStructure.type === 'solar_array') {
      completeObjective('mission_04_expand_outpost', 1);
    } else if (newStructure.type === 'battery_bank') {
      completeObjective('mission_04_expand_outpost', 2);
    }
  }, [discoveredIds, collectedSamples, activeMission, missions, activeMissionId, telemetry, completeObjective]);

  // Handle structure dismantling in Dismantle Mode
  const handleStructureDismantled = useCallback((dismantled: OutpostStructure) => {
    setStructures((prev) => {
      const updated = prev.filter((s) => s.id !== dismantled.id);
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

    setMissionToast(`RECYCLED: ${dismantled.name.toUpperCase()} (MATERIALS RECLAIMED)`);
  }, [discoveredIds, collectedSamples, activeMission, telemetry]);

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
      completeObjective('mission_05_neretva_expedition', 0);
    }
    if (poi.id === 'poi_neretva_canyon') {
      completeObjective('mission_05_neretva_expedition', 1);
      completeObjective('mission_05_neretva_expedition', 2);
    }
    if (poi.id === 'poi_cheyava_falls') {
      completeObjective('mission_06_cheyava_astrobiology', 1);
      completeObjective('mission_06_cheyava_astrobiology', 2);
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
    if (poi.id === 'poi_neretva_canyon') {
      completeObjective('mission_05_neretva_expedition', 3);
    }
    if (poi.id === 'poi_cheyava_falls') {
      completeObjective('mission_06_cheyava_astrobiology', 3);
    }
  }, [telemetry, completeObjective]);

  // Handle sample XRD/XRF spectroscopy in the Science Lab
  const handleSampleAnalyzed = useCallback((sampleId: string, pointsAwarded: number) => {
    setResearchPoints((prev) => {
      const newRp = prev + pointsAwarded;
      setAnalyzedSampleIds((prevAnalyzed) => {
        const newAnalyzed = prevAnalyzed.includes(sampleId) ? prevAnalyzed : [...prevAnalyzed, sampleId];
        StorageService.save({
          version: 1,
          discoveredIds,
          collectedSamples,
          analyzedSampleIds: newAnalyzed,
          researchPoints: newRp,
          unlockedTechIds,
          mission: activeMission,
          allMissions: missions,
          activeMissionId,
          structures,
          sol: telemetry?.solTime.sol || 142,
          suitOxygen: telemetry?.suit.oxygen || 100,
          suitBattery: telemetry?.suit.battery || 100,
          playerPosition: telemetry?.position || { x: 0, y: 0, z: 0 }
        });
        return newAnalyzed;
      });
      return newRp;
    });

    completeObjective('mission_02_laboratory_assay', 1);
    completeObjective('mission_02_laboratory_assay', 2);

    setMissionToast(`✦ GEOCHEMICAL ASSAY COMPLETE: +${pointsAwarded} RESEARCH POINTS!`);
    setTimeout(() => setMissionToast((prev) => (prev?.includes('ASSAY') ? null : prev)), 4500);
  }, [discoveredIds, collectedSamples, unlockedTechIds, activeMission, missions, activeMissionId, structures, telemetry, completeObjective]);

  // Handle tech tree research upgrade in the Science Lab
  const handleUnlockTech = useCallback((techId: string, costRP: number) => {
    setResearchPoints((prev) => {
      const newRp = Math.max(0, prev - costRP);
      setUnlockedTechIds((prevTechs) => {
        const newTechs = prevTechs.includes(techId) ? prevTechs : [...prevTechs, techId];
        StorageService.save({
          version: 1,
          discoveredIds,
          collectedSamples,
          analyzedSampleIds,
          researchPoints: newRp,
          unlockedTechIds: newTechs,
          mission: activeMission,
          allMissions: missions,
          activeMissionId,
          structures,
          sol: telemetry?.solTime.sol || 142,
          suitOxygen: telemetry?.suit.oxygen || 100,
          suitBattery: telemetry?.suit.battery || 100,
          playerPosition: telemetry?.position || { x: 0, y: 0, z: 0 }
        });
        return newTechs;
      });
      return newRp;
    });

    completeObjective('mission_02_laboratory_assay', 3);

    setMissionToast(`✦ TECH UPGRADE RESEARCHED: SYSTEMS ENHANCED!`);
    setTimeout(() => setMissionToast((prev) => (prev?.includes('TECH UPGRADE') ? null : prev)), 4500);
  }, [discoveredIds, collectedSamples, analyzedSampleIds, activeMission, missions, activeMissionId, structures, telemetry, completeObjective]);

  // Handle RIMFAX Subsurface Core Drilling from the Rover
  const handleDeployCoreDrill = useCallback(() => {
    if (isDrilling || !telemetry?.isDrivingRover) return;

    setIsDrilling(true);
    audioService.playCoreDrill();

    setTimeout(() => {
      setIsDrilling(false);
      const anom = telemetry.rimfax.nearbyAnomaly;
      const sampleName = anom ? anom.drillableSampleName : `Subsurface Core (${telemetry.rimfax.activeStratumName})`;
      const sampleNotes = anom ? anom.drillableSampleNotes : `Deep-core extracted at -3.5m depth via RIMFAX GPR guidance.`;
      const sampleDiscoveryId = anom ? anom.id : (telemetry.activeRegionId === 'neretva_vallis' ? 'poi_neretva_canyon' : 'poi_delta_scarp');
      const bonusRp = anom ? anom.baseResearchPoints : 250;

      if (anom) {
        rimfaxService.recordDrilledAnomaly(anom.id);
      }

      completeObjective('mission_03_rimfax_subsurface', 3);
      completeObjective('mission_03_rimfax_subsurface', 4);

      const newSample = {
        id: `subsurface_core_${Date.now()}`,
        discoveryId: sampleDiscoveryId,
        sampleName,
        timestamp: new Date().toISOString(),
        sol: telemetry.solTime.sol || 142,
        notes: sampleNotes
      };

      setCollectedSamples((prev) => {
        const updated = [...prev, newSample];
        StorageService.save({
          version: 1,
          discoveredIds,
          collectedSamples: updated,
          analyzedSampleIds,
          researchPoints: researchPoints + bonusRp,
          unlockedTechIds,
          mission: activeMission,
          allMissions: missions,
          activeMissionId,
          structures,
          sol: telemetry.solTime.sol || 142,
          suitOxygen: telemetry.suit.oxygen || 100,
          suitBattery: telemetry.suit.battery || 100,
          playerPosition: telemetry.position || { x: 0, y: 0, z: 0 }
        });
        return updated;
      });

      setResearchPoints((prev) => prev + bonusRp);
      audioService.playSampleCollect();
      setMissionToast(`✦ SUBSURFACE CORE EXTRACTED: ${sampleName.toUpperCase()} (+${bonusRp} RP)!`);
      setTimeout(() => setMissionToast((prev) => (prev?.includes('SUBSURFACE') ? null : prev)), 5000);
    }, 2400);
  }, [isDrilling, telemetry, discoveredIds, analyzedSampleIds, researchPoints, unlockedTechIds, activeMission, missions, activeMissionId, structures, completeObjective]);

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
    setResearchPoints(0);
    setAnalyzedSampleIds([]);
    setUnlockedTechIds([]);
    setStructures([]);
    setMissions(ALL_MISSIONS);
    setActiveModal('none');
  };

  const discoveredPoisList = ALL_DISCOVERIES.filter((p) => discoveredIds.includes(p.id));

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
        onOpenLibrary={() => {
          setActiveModal('library');
          completeObjective('mission_06_cheyava_astrobiology', 0);
          audioService.playClick();
        }}
        onOpenScienceLab={() => {
          setActiveModal('science_lab');
          completeObjective('mission_02_laboratory_assay', 0);
          audioService.playClick();
        }}
        unlockedTechIds={unlockedTechIds}
        isPaused={activeModal !== 'none'}
        activeScanSignal={scanSignal}
        onScanMiss={(msg) => {
          setMissionToast(msg);
          setTimeout(() => setMissionToast((prev) => (prev === msg ? null : prev)), 3500);
        }}
        onPointerLockChange={(locked) => {
          setIsPointerLocked(locked);
          setTelemetry((prev) => (prev ? { ...prev, isPointerLocked: locked } : null));
        }}
        controllerRefOut={controllerRef}
        isBuildMode={isBuildMode}
        buildToolMode={buildToolMode}
        selectedBuildType={selectedBuildType}
        buildRotateSignal={buildRotateSignal}
        onStructurePlaced={handleStructurePlaced}
        onStructureDismantled={handleStructureDismantled}
        roverMountSignal={roverSignal}
        flashlightSignal={flashlightSignal}
        savedStructures={structures}
        solTimeOverride={solTimeOverride}
        solTimeSpeedMultiplier={solSpeedMultiplier}
      />

      {/* Main Astronaut HUD (visible during active gameplay when not in build mode) */}
      {activeModal === 'none' && !isBuildMode && (
        <HUD
          telemetry={telemetry}
          isPointerLocked={isPointerLocked}
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
          onOpenLibrary={() => {
            audioService.playClick();
            setActiveModal('library');
            completeObjective('mission_06_cheyava_astrobiology', 0);
          }}
          onOpenScienceLab={() => {
            audioService.playClick();
            setActiveModal('science_lab');
            completeObjective('mission_02_laboratory_assay', 0);
          }}
          researchPoints={researchPoints}
          onDeployCoreDrill={handleDeployCoreDrill}
          onOpenRimfaxRadar={() => {
            audioService.playClick();
            setActiveModal('rimfax');
            completeObjective('mission_03_rimfax_subsurface', 1);
          }}
          isDrilling={isDrilling}
          onOpenSettings={() => {
            audioService.playClick();
            setActiveModal('settings');
          }}
          onScan={() => setScanSignal((prev) => prev + 1)}
          onRequestPointerLock={() => {
            controllerRef.current?.lockPointer();
          }}
          onUnlockPointer={() => {
            controllerRef.current?.unlockPointer();
            setIsPointerLocked(false);
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

      {/* Mobile Landscape Orientation Advisory */}
      {isMobile && isPortrait && !isPortraitPromptDismissed && (
        <RotateDevicePrompt onDismiss={() => setIsPortraitPromptDismissed(true)} />
      )}

      {/* Mobile Dual-Touch Controls (Thumbstick + Camera Drag + Action Buttons) */}
      {isTouchDevice && activeModal === 'none' && !isBuildMode && (
        <MobileTouchControls
          controller={controllerRef.current}
          controllerRef={controllerRef}
          onOpenActionWheel={() => {
            setIsActionWheelOpen(true);
            audioService.playClick();
          }}
          onScan={() => setScanSignal((prev) => prev + 1)}
          isDrivingRover={telemetry?.isDrivingRover}
          onToggleRover={() => setRoverSignal((prev) => prev + 1)}
          onOpenRimfaxRadar={() => {
            if (telemetry?.isDrivingRover) {
              setActiveModal('rimfax');
              completeObjective('mission_03_rimfax_subsurface', 1);
              audioService.playClick();
            } else {
              setMissionToast('MOUNT MARS ROVER TO ENGAGE RIMFAX GPR');
            }
          }}
          isActionWheelOpen={isActionWheelOpen}
        />
      )}

      {/* Mobile EVA Action Wheel & Drawer */}
      <MobileActionWheel
        isOpen={isActionWheelOpen}
        onClose={() => setIsActionWheelOpen(false)}
        onOpenMap={handleOpenMap}
        onToggleRover={() => {
          setRoverSignal((prev) => prev + 1);
        }}
        isDrivingRover={telemetry?.isDrivingRover}
        isNearRover={telemetry?.isNearRover}
        onScan={() => setScanSignal((prev) => prev + 1)}
        onOpenScienceLab={() => {
          setActiveModal('science_lab');
          completeObjective('mission_02_laboratory_assay', 0);
          audioService.playClick();
        }}
        onOpenRimfaxRadar={() => {
          if (telemetry?.isDrivingRover) {
            setActiveModal('rimfax');
            completeObjective('mission_03_rimfax_subsurface', 1);
            audioService.playClick();
          } else {
            setMissionToast('MOUNT MARS ROVER TO ENGAGE RIMFAX GPR');
          }
        }}
        onDeployCoreDrill={handleDeployCoreDrill}
        onToggleBuildMode={() => {
          setIsBuildMode(true);
          completeObjective('mission_04_expand_outpost', 0);
          audioService.playClick();
        }}
        onOpenLibrary={() => {
          setActiveModal('library');
          completeObjective('mission_06_cheyava_astrobiology', 0);
          audioService.playClick();
        }}
        onOpenMission={() => {
          setActiveModal('mission');
          audioService.playClick();
        }}
        onOpenJournal={() => {
          setActiveModal('journal');
          audioService.playClick();
        }}
        onToggleLight={handleToggleLight}
        onOpenSettings={() => {
          setActiveModal('settings');
          audioService.playClick();
        }}
        isFlashlightOn={telemetry?.isFlashlightOn}
      />

      {/* Outpost Build Mode Overlay (active when pressing B) */}
      <OutpostBuildModal
        isActive={isBuildMode}
        selectedType={selectedBuildType}
        buildToolMode={buildToolMode}
        targetedStructure={telemetry?.targetedDismantleStructure}
        isValidPlacement={telemetry?.isValidBuildPlacement || false}
        onSelectType={(type) => {
          setSelectedBuildType(type);
          setBuildToolMode('construct');
          audioService.playClick();
        }}
        onToggleToolMode={(mode) => {
          setBuildToolMode(mode);
          audioService.playClick();
        }}
        onRotate={() => setBuildRotateSignal((prev) => prev + 1)}
        onClose={() => {
          setIsBuildMode(false);
          setBuildToolMode('construct');
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
        roverPosition={telemetry?.roverPosition || { x: 14, y: 0, z: 10 }}
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
          const target = ALL_DISCOVERIES.find((p) => p.id === id);
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
        onOpenScienceLab={() => {
          closeActiveModal(false);
          setActiveModal('science_lab');
          completeObjective('mission_02_laboratory_assay', 0);
          audioService.playClick();
        }}
        onOpenLibrary={() => {
          closeActiveModal(false);
          setActiveModal('library');
          completeObjective('mission_06_cheyava_astrobiology', 0);
          audioService.playClick();
        }}
        onOpenRimfaxRadar={() => {
          closeActiveModal(false);
          if (telemetry?.isDrivingRover) {
            setActiveModal('rimfax');
            completeObjective('mission_03_rimfax_subsurface', 1);
            audioService.playClick();
          } else {
            setMissionToast('MOUNT MARS ROVER TO ENGAGE RIMFAX GPR');
          }
        }}
        onToggleBuildMode={() => {
          closeActiveModal(false);
          setIsBuildMode(true);
          completeObjective('mission_04_expand_outpost', 0);
          audioService.playClick();
        }}
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

      {/* NASA Mars Archival Library & Research Facility */}
      <MarsLibraryModal
        isOpen={activeModal === 'library'}
        onClose={closeActiveModal}
      />

      {/* Field Science & Geochemistry Laboratory (CheMin / PIXL Spectrometer & Tech Tree) */}
      <ScienceLabModal
        isOpen={activeModal === 'science_lab'}
        onClose={closeActiveModal}
        collectedSamples={collectedSamples}
        analyzedSampleIds={analyzedSampleIds}
        researchPoints={researchPoints}
        unlockedTechIds={unlockedTechIds}
        onSampleAnalyzed={handleSampleAnalyzed}
        onUnlockTech={handleUnlockTech}
      />

      {/* RIMFAX Ground-Penetrating Subsurface Radar Tomography Modal */}
      <RimfaxRadarModal
        isOpen={activeModal === 'rimfax'}
        onClose={closeActiveModal}
        telemetry={telemetry?.rimfax || rimfaxService.getTelemetry({ x: 0, z: 0 })}
        roverPosition={telemetry?.roverPosition || { x: 0, y: 0, z: 0 }}
        onDeployCoreDrill={handleDeployCoreDrill}
        isDrilling={isDrilling}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={closeActiveModal}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onResetSave={handleResetSave}
        currentSolHour={telemetry?.solTime ? telemetry.solTime.hour + telemetry.solTime.minute / 60 : 10.75}
        onSetSolTime={(hour, minute) => {
          setSolTimeOverride({ hour, minute: minute ?? 0 });
          audioService.playClick();
        }}
        solSpeedMultiplier={solSpeedMultiplier}
        onSetSolSpeedMultiplier={(speed) => {
          setSolSpeedMultiplier(speed);
          audioService.playClick();
        }}
      />
    </div>
  );
};

export default App;
