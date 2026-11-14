import * as THREE from 'three';
import { OutpostStructure, OutpostStructureType } from '../../types/outpost';
import { JezeroTerrain } from '../terrain/JezeroTerrain';

export class OutpostManager {
  public group: THREE.Group;
  public safeZoneRadius = 25; // meters
  public structures: OutpostStructure[] = [];
  public structureMeshes: Map<string, THREE.Group> = new Map();
  private safeZoneRing: THREE.Mesh;

  constructor(scene: THREE.Scene, terrain: JezeroTerrain, savedStructures?: OutpostStructure[]) {
    this.group = new THREE.Group();

    // 1. Safe zone beacon ring on the ground
    const ringGeom = new THREE.RingGeometry(this.safeZoneRadius - 0.5, this.safeZoneRadius, 64);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    this.safeZoneRing = new THREE.Mesh(ringGeom, ringMat);
    this.safeZoneRing.position.y = 0.05;
    this.group.add(this.safeZoneRing);

    // 2. Build structures
    if (savedStructures && savedStructures.length > 0) {
      for (const s of savedStructures) {
        this.spawnStructure(s.type, s.position.x, s.position.z, s.rotationY, terrain, s.id, s.name);
      }
    } else {
      this.buildInitialStructures(terrain);
    }

    scene.add(this.group);
  }

  private buildInitialStructures(terrain: JezeroTerrain) {
    // A. Main Habitat Dome
    this.spawnStructure('habitat_core', 0, 0, 0, terrain, 'outpost_hab_core', 'Octavia Base Habitat Core Mk I');

    // B. Solar Array 1 & 2
    this.spawnStructure('solar_array', 14, 6, -Math.PI / 6, terrain, 'outpost_solar_01', 'Tracking Solar Array Alpha');
    this.spawnStructure('solar_array', 14, -6, -Math.PI / 6, terrain, 'outpost_solar_02', 'Tracking Solar Array Beta');

    // C. Battery Bank
    this.spawnStructure('battery_bank', -8, 10, 0, terrain, 'outpost_battery_01', 'Cryo-Stabilized Battery Cell Alpha');

    // D. Communications Dish
    this.spawnStructure('comm_dish', -10, -8, 0, terrain, 'outpost_comm_01', 'High-Gain Deep Space Antenna');
  }

  public spawnStructure(
    type: OutpostStructureType,
    x: number,
    z: number,
    rotY: number,
    terrain: JezeroTerrain,
    existingId?: string,
    existingName?: string
  ): OutpostStructure {
    const y = terrain.getElevationAt(x, z);
    let mesh: THREE.Group;
    let powerGen = 0;
    let powerCon = 0;
    let batCap = 0;
    let name = existingName || 'Outpost Node';
    let desc = '';

    switch (type) {
      case 'habitat_core':
        mesh = this.createHabitatMesh();
        powerCon = 1200;
        batCap = 5000;
        name = existingName || 'Secondary Habitat Module';
        desc = 'Pressurized inflatable habitat module with life support airlock.';
        break;
      case 'solar_array':
        mesh = this.createSolarArrayMesh();
        powerGen = 2400;
        name = existingName || `Solar Array ${this.structures.length + 1}`;
        desc = 'Dual-axis triple-junction photovoltaic panels (+2,400W).';
        break;
      case 'battery_bank':
        mesh = this.createBatteryBankMesh();
        batCap = 20000;
        name = existingName || `Cryo-Battery Cell ${this.structures.length + 1}`;
        desc = 'Solid-state storage buffer (+20,000 Wh).';
        break;
      case 'comm_dish':
        mesh = this.createCommDishMesh();
        powerCon = 350;
        name = existingName || 'Auxiliary Comms Uplink';
        desc = 'High-gain dish for Mars orbital telemetry.';
        break;
      case 'science_lab':
      default:
        mesh = this.createScienceLabMesh();
        powerCon = 800;
        name = existingName || 'Surface Science Laboratory';
        desc = 'Modular field research bay for geological spectroscopy.';
        break;
    }

    mesh.position.set(x, y, z);
    mesh.rotation.y = rotY;
    this.group.add(mesh);

    const structureRecord: OutpostStructure = {
      id: existingId || `struct_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      name,
      position: { x, y, z },
      rotationY: rotY,
      placedAtSol: 142,
      powerGenerationWatts: powerGen,
      powerConsumptionWatts: powerCon,
      batteryCapacityWattHours: batCap,
      providesO2Recharge: type === 'habitat_core',
      providesBatteryRecharge: true,
      description: desc
    };

    this.structureMeshes.set(structureRecord.id, mesh);
    this.structures.push(structureRecord);
    return structureRecord;
  }

  public createHabitatMesh(): THREE.Group {
    const group = new THREE.Group();
    const domeGeom = new THREE.SphereGeometry(6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.35,
      metalness: 0.25
    });
    const dome = new THREE.Mesh(domeGeom, domeMat);
    dome.castShadow = true;
    dome.receiveShadow = true;
    group.add(dome);

    const collarGeom = new THREE.CylinderGeometry(6.1, 6.3, 1.2, 32);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    const collar = new THREE.Mesh(collarGeom, collarMat);
    collar.position.y = 0.6;
    collar.castShadow = true;
    group.add(collar);

    const airlockGeom = new THREE.BoxGeometry(2.5, 2.5, 4);
    const airlockMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.4 });
    const airlock = new THREE.Mesh(airlockGeom, airlockMat);
    airlock.position.set(0, 1.25, 6.2);
    airlock.castShadow = true;
    group.add(airlock);

    const doorGeom = new THREE.PlaneGeometry(1.6, 2.2);
    const doorMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const door = new THREE.Mesh(doorGeom, doorMat);
    door.position.set(0, 1.25, 8.21);
    group.add(door);

    return group;
  }

  public createSolarArrayMesh(): THREE.Group {
    const group = new THREE.Group();
    const mastGeom = new THREE.CylinderGeometry(0.18, 0.25, 3.5, 12);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8 });
    const mast = new THREE.Mesh(mastGeom, mastMat);
    mast.position.y = 1.75;
    mast.castShadow = true;
    group.add(mast);

    const panelGeom = new THREE.BoxGeometry(5.5, 2.8, 0.1);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1d3557,
      roughness: 0.2,
      metalness: 0.85
    });
    const panel = new THREE.Mesh(panelGeom, panelMat);
    panel.position.set(0, 3.4, 0);
    panel.rotation.x = -Math.PI / 5;
    panel.castShadow = true;
    group.add(panel);

    return group;
  }

  public createBatteryBankMesh(): THREE.Group {
    const group = new THREE.Group();
    const boxGeom = new THREE.BoxGeometry(2.5, 2, 1.8);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x3a404a, metalness: 0.6 });
    const box = new THREE.Mesh(boxGeom, boxMat);
    box.position.y = 1;
    box.castShadow = true;
    group.add(box);

    const ledGeom = new THREE.BoxGeometry(2.2, 0.15, 0.1);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const led = new THREE.Mesh(ledGeom, ledMat);
    led.position.set(0, 1.6, 0.91);
    group.add(led);

    return group;
  }

  public createCommDishMesh(): THREE.Group {
    const group = new THREE.Group();
    const mastGeom = new THREE.CylinderGeometry(0.15, 0.3, 4, 12);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8 });
    const mast = new THREE.Mesh(mastGeom, mastMat);
    mast.position.y = 2;
    mast.castShadow = true;
    group.add(mast);

    const dishGeom = new THREE.SphereGeometry(2.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 3);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.6, side: THREE.DoubleSide });
    const dish = new THREE.Mesh(dishGeom, dishMat);
    dish.position.set(0, 4.2, 0);
    dish.rotation.x = Math.PI / 4;
    dish.rotation.y = -Math.PI / 3;
    dish.castShadow = true;
    group.add(dish);

    return group;
  }

  public createScienceLabMesh(): THREE.Group {
    const group = new THREE.Group();
    const labGeom = new THREE.CylinderGeometry(2.8, 2.8, 3.2, 8);
    const labMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5 });
    const lab = new THREE.Mesh(labGeom, labMat);
    lab.position.y = 1.6;
    lab.castShadow = true;
    group.add(lab);

    // Science observation dome top
    const obsGeom = new THREE.SphereGeometry(1.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const obsMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9 });
    const obs = new THREE.Mesh(obsGeom, obsMat);
    obs.position.y = 3.2;
    group.add(obs);

    return group;
  }

  public getTotalPowerGeneration(): number {
    return this.structures.reduce((acc, s) => acc + s.powerGenerationWatts, 0);
  }

  public getTotalPowerConsumption(): number {
    return this.structures.reduce((acc, s) => acc + s.powerConsumptionWatts, 0);
  }

  public getTotalBatteryStorage(): number {
    return this.structures.reduce((acc, s) => acc + s.batteryCapacityWattHours, 0);
  }

  public isInSafeZone(x: number, z: number): boolean {
    const distSq = x * x + z * z;
    return distSq <= (this.safeZoneRadius * this.safeZoneRadius);
  }

  public dismantleStructure(structureId: string): OutpostStructure | null {
    // Protected core habitat cannot be dismantled
    if (structureId === 'outpost_hab_core') {
      return null;
    }

    const index = this.structures.findIndex((s) => s.id === structureId);
    if (index === -1) return null;

    const removed = this.structures[index];
    this.structures.splice(index, 1);

    const mesh = this.structureMeshes.get(structureId);
    if (mesh) {
      this.group.remove(mesh);
      mesh.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          if (m.geometry) m.geometry.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else if (m.material) {
            m.material.dispose();
          }
        }
      });
      this.structureMeshes.delete(structureId);
    }

    return removed;
  }

  public findTargetStructure(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    maxDistance = 16
  ): { structure: OutpostStructure; mesh: THREE.Group; distance: number } | null {
    let closest: { structure: OutpostStructure; mesh: THREE.Group; distance: number } | null = null;
    let minD = maxDistance;

    const normDir = direction.clone().normalize();

    for (const structure of this.structures) {
      const mesh = this.structureMeshes.get(structure.id);
      if (!mesh) continue;

      // Vector from player to structure center
      const toStructure = new THREE.Vector3(
        structure.position.x - origin.x,
        structure.position.y - origin.y,
        structure.position.z - origin.z
      );

      const forwardDist = toStructure.dot(normDir);
      if (forwardDist < 1.0 || forwardDist > maxDistance) continue; // Behind or too far

      // Perpendicular distance to the look ray
      const projected = normDir.clone().multiplyScalar(forwardDist);
      const perpDist = toStructure.clone().sub(projected).length();

      // Radius tolerance based on structure size
      const tolerance = structure.type === 'habitat_core' ? 6.2 : structure.type === 'solar_array' ? 4.2 : 3.5;

      if (perpDist <= tolerance && forwardDist < minD) {
        minD = forwardDist;
        closest = { structure, mesh, distance: forwardDist };
      }
    }

    return closest;
  }

  public update(time: number) {
    const alpha = 0.5 + Math.sin(time * 2.5) * 0.25;
    (this.safeZoneRing.material as THREE.MeshBasicMaterial).opacity = alpha;
  }
}
