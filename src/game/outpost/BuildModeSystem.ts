import * as THREE from 'three';
import { OutpostStructureType, OutpostStructure } from '../../types/outpost';
import { OutpostManager } from './OutpostManager';
import { JezeroTerrain } from '../terrain/JezeroTerrain';
import { audioService } from '../../services/audioService';

export class BuildModeSystem {
  public group: THREE.Group;
  public isActive = false;
  public selectedType: OutpostStructureType = 'solar_array';
  public previewMesh: THREE.Group | null = null;
  public currentRotationY = 0;
  public isValidPlacement = false;

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

    scene.add(this.group);
  }

  public setStructureType(type: OutpostStructureType) {
    this.selectedType = type;
    this.rebuildPreview();
  }

  public activate() {
    this.isActive = true;
    this.rebuildPreview();
  }

  public deactivate() {
    this.isActive = false;
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
    if (!this.isActive || !this.previewMesh) return;

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

  public placeCurrentStructure(): OutpostStructure | null {
    if (!this.isActive || !this.previewMesh || !this.isValidPlacement) return null;

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
