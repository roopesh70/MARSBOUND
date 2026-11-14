import * as THREE from 'three';
import { OutpostStructureType, OutpostStructure, BuildToolMode } from '../../types/outpost';
import { OutpostManager } from './OutpostManager';
import { JezeroTerrain } from '../terrain/JezeroTerrain';
import { audioService } from '../../services/audioService';

export class BuildModeSystem {
  public group: THREE.Group;
  public isActive = false;
  public mode: BuildToolMode = 'construct';
  public selectedType: OutpostStructureType = 'solar_array';
  public previewMesh: THREE.Group | null = null;
  public currentRotationY = 0;
  public isValidPlacement = false;

  // Dismantle targeting
  public targetedStructure: OutpostStructure | null = null;
  private dismantleIndicator: THREE.Group;
  private dismantleIndicatorMat: THREE.MeshBasicMaterial;

  private outpostManager: OutpostManager;
  private terrain: JezeroTerrain;
  private previewMatValid: THREE.MeshBasicMaterial;
  private previewMatInvalid: THREE.MeshBasicMaterial;

  constructor(scene: THREE.Scene, outpostManager: OutpostManager, terrain: JezeroTerrain) {
    this.outpostManager = outpostManager;
    this.terrain = terrain;
    this.group = new THREE.Group();

    this.previewMatValid = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });

    this.previewMatInvalid = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });

    // Holographic dismantle targeting bracket & base ring
    this.dismantleIndicatorMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    this.dismantleIndicator = new THREE.Group();
    const boxGeom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMesh = new THREE.Mesh(boxGeom, this.dismantleIndicatorMat);
    this.dismantleIndicator.add(boxMesh);

    const ringGeom = new THREE.RingGeometry(0.8, 1.0, 32);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeom, this.dismantleIndicatorMat);
    ringMesh.position.y = -0.55;
    this.dismantleIndicator.add(ringMesh);

    this.dismantleIndicator.visible = false;
    this.group.add(this.dismantleIndicator);

    scene.add(this.group);
  }

  public setMode(mode: BuildToolMode) {
    this.mode = mode;
    if (mode === 'construct') {
      this.dismantleIndicator.visible = false;
      this.rebuildPreview();
    } else {
      if (this.previewMesh) {
        this.previewMesh.visible = false;
      }
    }
  }

  public setStructureType(type: OutpostStructureType) {
    this.selectedType = type;
    this.mode = 'construct';
    this.rebuildPreview();
  }

  public activate() {
    this.isActive = true;
    if (this.mode === 'construct') {
      this.rebuildPreview();
    }
  }

  public deactivate() {
    this.isActive = false;
    this.targetedStructure = null;
    this.dismantleIndicator.visible = false;
    if (this.previewMesh) {
      this.group.remove(this.previewMesh);
      this.previewMesh = null;
    }
  }

  private rebuildPreview() {
    if (this.previewMesh) {
      this.group.remove(this.previewMesh);
      this.previewMesh = null;
    }

    if (!this.isActive) return;

    let baseGroup: THREE.Group;
    switch (this.selectedType) {
      case 'habitat_core':
        baseGroup = this.outpostManager.createHabitatMesh();
        break;
      case 'solar_array':
        baseGroup = this.outpostManager.createSolarArrayMesh();
        break;
      case 'battery_bank':
        baseGroup = this.outpostManager.createBatteryBankMesh();
        break;
      case 'comm_dish':
        baseGroup = this.outpostManager.createCommDishMesh();
        break;
      case 'science_lab':
      default:
        baseGroup = this.outpostManager.createScienceLabMesh();
        break;
    }

    // Apply holographic wireframe material to preview
    baseGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = this.previewMatValid;
      }
    });

    this.previewMesh = baseGroup;
    this.group.add(this.previewMesh);
  }

  public update(playerPos: THREE.Vector3, cameraDir: THREE.Vector3) {
    if (!this.isActive) return;

    if (this.mode === 'dismantle') {
      if (this.previewMesh) {
        this.previewMesh.visible = false;
      }

      // Find structure in line of sight
      const target = this.outpostManager.findTargetStructure(playerPos, cameraDir, 16);
      if (target) {
        this.targetedStructure = target.structure;
        this.dismantleIndicator.visible = true;
        this.dismantleIndicator.position.set(
          target.structure.position.x,
          target.structure.position.y + (target.structure.type === 'habitat_core' ? 3.0 : 1.5),
          target.structure.position.z
        );

        const s = target.structure.type === 'habitat_core' ? 6.5 : target.structure.type === 'solar_array' ? 4.8 : 3.8;
        this.dismantleIndicator.scale.set(s, s * 0.7, s);

        const isProtected = target.structure.id === 'outpost_hab_core';
        this.dismantleIndicatorMat.color.setHex(isProtected ? 0xef4444 : 0xf59e0b);
      } else {
        this.targetedStructure = null;
        this.dismantleIndicator.visible = false;
      }
      return;
    }

    // Construction Mode
    this.dismantleIndicator.visible = false;
    if (!this.previewMesh) return;
    this.previewMesh.visible = true;

    // Place preview 8 meters in front of the astronaut
    const targetX = playerPos.x + cameraDir.x * 8;
    const targetZ = playerPos.z + cameraDir.z * 8;
    const groundY = this.terrain.getElevationAt(targetX, targetZ);

    this.previewMesh.position.set(targetX, groundY, targetZ);
    this.previewMesh.rotation.y = this.currentRotationY;

    // Validation: within outpost construction zone (< 55 meters from base)
    const distFromBase = Math.sqrt(targetX * targetX + targetZ * targetZ);
    this.isValidPlacement = distFromBase <= 55;

    const targetMat = this.isValidPlacement ? this.previewMatValid : this.previewMatInvalid;
    this.previewMesh.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = targetMat;
      }
    });
  }

  public dismantleTargetedStructure(): OutpostStructure | null {
    if (!this.isActive || this.mode !== 'dismantle' || !this.targetedStructure) {
      return null;
    }

    if (this.targetedStructure.id === 'outpost_hab_core') {
      audioService.playWarningBeep();
      return null;
    }

    const removed = this.outpostManager.dismantleStructure(this.targetedStructure.id);
    if (removed) {
      audioService.playDismantle();
      this.targetedStructure = null;
      this.dismantleIndicator.visible = false;
    }
    return removed;
  }

  public placeCurrentStructure(): OutpostStructure | null {
    if (!this.isActive || this.mode !== 'construct' || !this.previewMesh || !this.isValidPlacement) return null;

    const x = this.previewMesh.position.x;
    const z = this.previewMesh.position.z;
    const rot = this.currentRotationY;

    const placed = this.outpostManager.spawnStructure(
      this.selectedType,
      x,
      z,
      rot,
      this.terrain
    );

    audioService.playBuildPlace();
    return placed;
  }

  public rotatePreview(deltaRad: number) {
    this.currentRotationY += deltaRad;
  }
}
