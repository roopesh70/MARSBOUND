import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { JezeroTerrain } from './terrain/JezeroTerrain';
import { MarsAtmosphere } from './environment/MarsAtmosphere';
import { OutpostManager } from './outpost/OutpostManager';
import { AstronautController } from './player/AstronautController';
import { ScannerSystem } from './player/ScannerBeam';
import { MarsRover } from './rover/MarsRover';
import { DustDevilSystem } from './environment/DustDevils';
import { BuildModeSystem } from './outpost/BuildModeSystem';
import { CoordinateService } from '../services/coordinateService';
import { MarsCoordinates, MarsSolTime, EnvironmentalConditions } from '../types/mars';
import { SuitResources } from '../types/survival';
import { DiscoveryRecord } from '../types/discovery';
import { OutpostStructureType, OutpostStructure } from '../types/outpost';
import { audioService } from '../services/audioService';

export interface GameTelemetry {
  position: { x: number; y: number; z: number };
  coordinates: MarsCoordinates;
  heading: number;
  nearestPoi: DiscoveryRecord | null;
  nearestPoiDistance: number;
  suit: SuitResources;
  environment: EnvironmentalConditions;
  solTime: MarsSolTime;
  isPointerLocked: boolean;
  isNearBoundary: boolean;
  isDrivingRover: boolean;
  roverSpeedKmh: number;
  roverBattery: number;
  isNearRover: boolean;
  isBuildModeActive: boolean;
  isValidBuildPlacement: boolean;
  isFlashlightOn: boolean;
  totalPowerGen: number;
  totalPowerCon: number;
  totalBatteryWh: number;
  inputs: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    sprint: boolean;
  };
}

interface MarsCanvasProps {
  onTelemetryUpdate: (telemetry: GameTelemetry) => void;
  onOpenDiscovery: (poi: DiscoveryRecord) => void;
  isPaused: boolean;
  activeScanSignal: number;
  onPointerLockChange: (locked: boolean) => void;
  controllerRefOut?: React.MutableRefObject<AstronautController | null>;
  isBuildMode: boolean;
  selectedBuildType: OutpostStructureType;
  buildRotateSignal: number;
  onStructurePlaced: (structure: OutpostStructure) => void;
  roverMountSignal: number;
  flashlightSignal?: number;
  savedStructures?: OutpostStructure[];
}

export const MarsCanvas: React.FC<MarsCanvasProps> = ({
  onTelemetryUpdate,
  onOpenDiscovery,
  isPaused,
  activeScanSignal,
  onPointerLockChange,
  controllerRefOut,
  isBuildMode,
  selectedBuildType,
  buildRotateSignal,
  onStructurePlaced,
  roverMountSignal,
  flashlightSignal = 0,
  savedStructures
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AstronautController | null>(null);
  const scannerRef = useRef<ScannerSystem | null>(null);
  const roverRef = useRef<MarsRover | null>(null);
  const buildSystemRef = useRef<BuildModeSystem | null>(null);
  const outpostRef = useRef<OutpostManager | null>(null);
  const isFlashlightOnRef = useRef<boolean>(true); // Flashlight active by default for clear night visibility

  // Keep references to dynamic props to avoid tearing down Three.js on every re-render
  const propsRef = useRef({
    onTelemetryUpdate,
    onOpenDiscovery,
    onPointerLockChange,
    onStructurePlaced,
    isPaused,
    isBuildMode,
    selectedBuildType
  });

  useEffect(() => {
    propsRef.current = {
      onTelemetryUpdate,
      onOpenDiscovery,
      onPointerLockChange,
      onStructurePlaced,
      isPaused,
      isBuildMode,
      selectedBuildType
    };

    if (buildSystemRef.current) {
      if (isBuildMode) {
        buildSystemRef.current.activate();
        buildSystemRef.current.setStructureType(selectedBuildType);
      } else {
        buildSystemRef.current.deactivate();
      }
    }
  }, [isBuildMode, selectedBuildType, isPaused, onTelemetryUpdate, onOpenDiscovery, onPointerLockChange, onStructurePlaced]);

  // Handle build rotation
  useEffect(() => {
    if (buildRotateSignal > 0 && buildSystemRef.current) {
      buildSystemRef.current.rotatePreview(Math.PI / 4); // Rotate 45 degrees
      audioService.playClick();
    }
  }, [buildRotateSignal]);

  // Handle rover mount / dismount toggle
  useEffect(() => {
    if (roverMountSignal > 0 && roverRef.current && controllerRef.current) {
      const rover = roverRef.current;
      const controller = controllerRef.current;
      const dist = rover.distanceTo({ x: controller.position.x, z: controller.position.z });

      if (rover.isOccupied) {
        // Dismount
        rover.isOccupied = false;
        controller.position.set(rover.position.x + 2.5, rover.position.y, rover.position.z);
        audioService.playClick();
      } else if (dist < 6.5) {
        // Mount
        rover.isOccupied = true;
        audioService.playClick();
      }
    }
  }, [roverMountSignal]);

  // Handle flashlight / torch toggle signal
  useEffect(() => {
    if (flashlightSignal > 0) {
      if (roverRef.current && roverRef.current.isOccupied) {
        const newState = roverRef.current.toggleHeadlights();
        isFlashlightOnRef.current = newState;
      } else {
        isFlashlightOnRef.current = !isFlashlightOnRef.current;
      }
      audioService.playClick();
    }
  }, [flashlightSignal]);

  // Survival state refs
  const suitState = useRef<SuitResources>({
    oxygen: 100,
    oxygenMax: 100,
    oxygenDepletionRatePerSec: 0.18,
    battery: 100,
    batteryMax: 100,
    batteryPassiveDrainPerSec: 0.08,
    scannerBatteryCost: 12,
    suitHealth: 100,
    suitTemperatureCelsius: 20.5,
    radiationDoseAccumulatedmSv: 0.24,
    isInSafeZone: true,
    isSprinting: false,
    isSuffocating: false,
    isBatteryDepleted: false
  });

  // Sol time tracking ref
  const solTimeState = useRef<MarsSolTime>({
    sol: 142,
    hour: 10,
    minute: 45,
    second: 0,
    timeMultiplier: 30,
    isPaused: false
  });

  // Environmental conditions in Jezero (MEDA calibrated)
  const envConditions = useRef<EnvironmentalConditions>({
    surfacePressurePa: 614,
    temperatureCelsius: -28,
    dustOpticalDepthTau: 0.38,
    windSpeedMs: 4.8,
    windDirectionDegrees: 215,
    solarIrradianceWm2: 440,
    uvIndex: 7.2
  });

  // Handle Scan action signal
  useEffect(() => {
    if (activeScanSignal > 0 && scannerRef.current && controllerRef.current) {
      if (suitState.current.battery >= suitState.current.scannerBatteryCost) {
        suitState.current.battery = Math.max(0, suitState.current.battery - suitState.current.scannerBatteryCost);
        scannerRef.current.triggerScan(controllerRef.current.camera);
        audioService.playScanBeep();

        if (controllerRef.current.nearestPoi && controllerRef.current.nearestPoiDistance <= 22) {
          audioService.playDiscoveryFound();
          propsRef.current.onOpenDiscovery(controllerRef.current.nearestPoi);
        }
      } else {
        audioService.playWarningBeep();
      }
    }
  }, [activeScanSignal]);

  // MOUNT THREE.JS SCENE ONCE
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 800);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);

    // 3. Build Subsystems
    const terrain = new JezeroTerrain({ size: 600, segments: 120 });
    scene.add(terrain.mesh);
    scene.add(terrain.rocksMesh);

    const atmosphere = new MarsAtmosphere(scene);
    const outpost = new OutpostManager(scene, terrain, savedStructures);
    outpostRef.current = outpost;

    const rover = new MarsRover(scene, terrain, { x: -8, z: 18 });
    roverRef.current = rover;

    const dustDevils = new DustDevilSystem(scene);

    const controller = new AstronautController(camera, renderer.domElement, { x: 0, z: 12 });
    controllerRef.current = controller;
    if (controllerRefOut) {
      controllerRefOut.current = controller;
    }

    const scanner = new ScannerSystem(scene, terrain);
    scannerRef.current = scanner;

    const buildSystem = new BuildModeSystem(scene, outpost, terrain);
    buildSystemRef.current = buildSystem;

    // 3.1 Astronaut Helmet Flashlight & Ambient Glow
    const helmetSpotlight = new THREE.SpotLight(0xfffaed, 4.5, 75, Math.PI / 4, 0.35, 1.2);
    const helmetSpotlightTarget = new THREE.Object3D();
    scene.add(helmetSpotlightTarget);
    helmetSpotlight.target = helmetSpotlightTarget;
    scene.add(helmetSpotlight);

    const suitAmbientPoint = new THREE.PointLight(0xfffaed, 0.9, 14, 1.5);
    scene.add(suitAmbientPoint);

    // Listen for pointer lock changes
    const onLockChange = () => {
      const locked = document.pointerLockElement === renderer.domElement;
      controller.isLocked = locked;
      propsRef.current.onPointerLockChange(locked);
    };
    document.addEventListener('pointerlockchange', onLockChange);

    // Direct click on canvas to lock pointer or place building
    const onCanvasClick = () => {
      if (propsRef.current.isBuildMode && buildSystem.isActive) {
        const placed = buildSystem.placeCurrentStructure();
        if (placed) {
          propsRef.current.onStructurePlaced(placed);
        }
      } else {
        controller.lockPointer();
      }
    };
    renderer.domElement.addEventListener('click', onCanvasClick);

    // Resize Handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // 4. Game Animation Loop
    let lastTime = performance.now();
    let animFrameId: number;
    let telemetryThrottleTimer = 0;

    const animate = (now: number) => {
      animFrameId = requestAnimationFrame(animate);

      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const currentlyPaused = propsRef.current.isPaused;

      if (!currentlyPaused) {
        if (rover.isOccupied) {
          // Driving Rover Mode
          helmetSpotlight.intensity = 0;
          suitAmbientPoint.intensity = 0;
          rover.setHeadlights(isFlashlightOnRef.current);

          const roverInputs = {
            forward: controller.moveForward,
            backward: controller.moveBackward,
            left: controller.moveLeft,
            right: controller.moveRight,
            brake: !controller.isGrounded // Space key
          };

          rover.update(delta, terrain, roverInputs);
          audioService.updateRoverEngine(Math.abs(rover.velocity) / rover.maxSpeed, true);

          // Position 3rd-person camera following the rover
          const cameraOffsetDist = 8.5;
          const cameraHeight = 3.8;
          const targetCamX = rover.position.x + Math.sin(rover.rotationY) * cameraOffsetDist;
          const targetCamZ = rover.position.z + Math.cos(rover.rotationY) * cameraOffsetDist;
          const targetCamY = terrain.getElevationAt(targetCamX, targetCamZ) + cameraHeight;

          camera.position.set(targetCamX, Math.max(rover.position.y + 1.5, targetCamY), targetCamZ);
          camera.lookAt(rover.position.x, rover.position.y + 1.2, rover.position.z);

          // Sync astronaut position with rover
          controller.position.copy(rover.position);

          // Rover cabin provides life-support oxygen replenishment!
          suitState.current.oxygen = Math.min(suitState.current.oxygenMax, suitState.current.oxygen + delta * 5);
        } else {
          // Normal Astronaut EVA Mode
          const isTorchActive = isFlashlightOnRef.current;
          helmetSpotlight.intensity = isTorchActive ? 4.5 : 0;
          suitAmbientPoint.intensity = isTorchActive ? 0.9 : 0;

          helmetSpotlight.position.copy(camera.position);
          suitAmbientPoint.position.copy(camera.position);

          const forwardDir = new THREE.Vector3();
          camera.getWorldDirection(forwardDir);
          helmetSpotlightTarget.position.copy(camera.position).add(forwardDir.multiplyScalar(30));

          audioService.updateRoverEngine(0, false);
          rover.update(delta, terrain, { forward: false, backward: false, left: false, right: false, brake: true });
          controller.update(delta, terrain);

          // Resource consumption / recharge logic
          const inSafeZone = outpost.isInSafeZone(controller.position.x, controller.position.z);
          suitState.current.isInSafeZone = inSafeZone;

          if (inSafeZone) {
            suitState.current.oxygen = Math.min(suitState.current.oxygenMax, suitState.current.oxygen + delta * 15);
            suitState.current.battery = Math.min(suitState.current.batteryMax, suitState.current.battery + delta * 20);
            suitState.current.suitHealth = Math.min(100, suitState.current.suitHealth + delta * 10);
          } else {
            suitState.current.oxygen = Math.max(0, suitState.current.oxygen - delta * suitState.current.oxygenDepletionRatePerSec);
            suitState.current.battery = Math.max(0, suitState.current.battery - delta * suitState.current.batteryPassiveDrainPerSec);

            if (suitState.current.oxygen <= 0) {
              suitState.current.isSuffocating = true;
              suitState.current.suitHealth = Math.max(0, suitState.current.suitHealth - delta * 4);
            } else {
              suitState.current.isSuffocating = false;
            }
          }
        }

        // Update environment & systems
        atmosphere.update(now * 0.001, scene);
        outpost.update(now * 0.001);
        scanner.update(delta, now * 0.001);
        dustDevils.update(delta, terrain, { x: controller.position.x, z: controller.position.z });

        // Update Build Mode Preview
        if (propsRef.current.isBuildMode && buildSystem.isActive) {
          const forwardDir = new THREE.Vector3();
          camera.getWorldDirection(forwardDir);
          forwardDir.y = 0;
          forwardDir.normalize();
          buildSystem.update(controller.position, forwardDir);
        }

        // Advance Mars Sol Clock
        const solSecs = delta * solTimeState.current.timeMultiplier;
        solTimeState.current.second += solSecs;
        if (solTimeState.current.second >= 60) {
          const addedMinutes = Math.floor(solTimeState.current.second / 60);
          solTimeState.current.second %= 60;
          solTimeState.current.minute += addedMinutes;
          if (solTimeState.current.minute >= 60) {
            solTimeState.current.hour += Math.floor(solTimeState.current.minute / 60);
            solTimeState.current.minute %= 60;
            if (solTimeState.current.hour >= 24) {
              solTimeState.current.sol += 1;
              solTimeState.current.hour %= 24;
            }
          }
        }

        // Diurnal Temperature shift
        const hourOfDay = solTimeState.current.hour + solTimeState.current.minute / 60;
        envConditions.current.temperatureCelsius = Math.round(-65 + Math.sin(((hourOfDay - 6) / 24) * Math.PI * 2) * 45);
      }

      // Render Scene
      renderer.render(scene, camera);

      // Throttle telemetry update to React (10 times per second)
      telemetryThrottleTimer += delta;
      if (telemetryThrottleTimer >= 0.1) {
        telemetryThrottleTimer = 0;
        const activeX = rover.isOccupied ? rover.position.x : controller.position.x;
        const activeY = rover.isOccupied ? rover.position.y : controller.position.y;
        const activeZ = rover.isOccupied ? rover.position.z : controller.position.z;

        const coords = CoordinateService.localToMars(activeX, activeY, activeZ);
        const distToRover = rover.distanceTo({ x: controller.position.x, z: controller.position.z });

        propsRef.current.onTelemetryUpdate({
          position: { x: activeX, y: activeY, z: activeZ },
          coordinates: coords,
          heading: rover.isOccupied ? Math.round((-rover.rotationY * (180 / Math.PI)) % 360) : controller.getHeadingDegrees(),
          nearestPoi: controller.nearestPoi,
          nearestPoiDistance: controller.nearestPoiDistance,
          suit: { ...suitState.current },
          environment: { ...envConditions.current },
          solTime: { ...solTimeState.current },
          isPointerLocked: controller.isLocked || document.pointerLockElement === renderer.domElement,
          isNearBoundary: controller.isNearBoundary,
          isDrivingRover: rover.isOccupied,
          roverSpeedKmh: rover.getSpeedKmh(),
          roverBattery: rover.battery,
          isNearRover: distToRover < 6.5,
          isBuildModeActive: buildSystem.isActive,
          isValidBuildPlacement: buildSystem.isValidPlacement,
          isFlashlightOn: isFlashlightOnRef.current,
          totalPowerGen: outpost.getTotalPowerGeneration(),
          totalPowerCon: outpost.getTotalPowerConsumption(),
          totalBatteryWh: outpost.getTotalBatteryStorage(),
          inputs: {
            forward: controller.moveForward,
            backward: controller.moveBackward,
            left: controller.moveLeft,
            right: controller.moveRight,
            sprint: controller.isSprinting
          }
        });
      }
    };

    animFrameId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      document.removeEventListener('pointerlockchange', onLockChange);
      renderer.domElement.removeEventListener('click', onCanvasClick);
      window.removeEventListener('resize', onResize);
      audioService.updateRoverEngine(0, false);
      controller.destroy();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-crosshair" />;
};
