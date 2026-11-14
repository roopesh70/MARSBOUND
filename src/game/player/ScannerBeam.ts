import * as THREE from 'three';
import { JEZERO_DISCOVERIES } from '../../data/discoveries';
import { JezeroTerrain } from '../terrain/JezeroTerrain';

export class ScannerSystem {
  public group: THREE.Group;
  private scanCone: THREE.Mesh;
  private isScanning = false;
  private scanTimer = 0;
  private poiMarkers: THREE.Group[] = [];

  constructor(scene: THREE.Scene, terrain: JezeroTerrain) {
    this.group = new THREE.Group();

    // 1. Scanner Projection Cone
    const coneGeom = new THREE.ConeGeometry(5, 14, 16, 1, true);
    coneGeom.rotateX(-Math.PI / 2); // Point forward along -Z
    coneGeom.translate(0, 0, -7);

    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    this.scanCone = new THREE.Mesh(coneGeom, coneMat);
    this.group.add(this.scanCone);

    // 2. Build In-World 3D Hologram Markers for POIs
    for (const poi of JEZERO_DISCOVERIES) {
      const markerGroup = new THREE.Group();
      const markerY = terrain.getElevationAt(poi.worldPosition.x, poi.worldPosition.z);
      markerGroup.position.set(poi.worldPosition.x, markerY, poi.worldPosition.z);

      // Rotating diamond / crystal
      const markerGeom = new THREE.OctahedronGeometry(1.2, 0);
      const markerMat = new THREE.MeshBasicMaterial({
        color: poi.category === 'spacecraft' ? 0xfbbf24 : 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      const diamond = new THREE.Mesh(markerGeom, markerMat);
      diamond.position.y = 2.4;
      markerGroup.add(diamond);

      // Vertical guide beam
      const beamGeom = new THREE.CylinderGeometry(0.04, 0.04, 5, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: poi.category === 'spacecraft' ? 0xfbbf24 : 0x38bdf8,
        transparent: true,
        opacity: 0.45
      });
      const beam = new THREE.Mesh(beamGeom, beamMat);
      beam.position.y = 2.5;
      markerGroup.add(beam);

      this.poiMarkers.push(markerGroup);
      this.group.add(markerGroup);
    }

    scene.add(this.group);
  }

  public triggerScan(camera: THREE.Camera) {
    this.isScanning = true;
    this.scanTimer = 1.2; // 1.2 seconds active beam pulse
    this.scanCone.position.copy(camera.position);
    this.scanCone.quaternion.copy(camera.quaternion);
    (this.scanCone.material as THREE.MeshBasicMaterial).opacity = 0.55;
  }

  public update(delta: number, time: number) {
    // Animate POI markers (rotation & gentle float)
    for (let i = 0; i < this.poiMarkers.length; i++) {
      const marker = this.poiMarkers[i];
      const diamond = marker.children[0];
      if (diamond) {
        diamond.rotation.y += delta * 1.5;
        diamond.position.y = 2.4 + Math.sin(time * 3 + i) * 0.3;
      }
    }

    // Animate active scan beam
    if (this.isScanning) {
      this.scanTimer -= delta;
      const progress = 1 - (this.scanTimer / 1.2);
      this.scanCone.scale.set(1 + progress * 0.8, 1 + progress * 0.8, 1 + progress * 0.5);
      (this.scanCone.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - progress) * 0.6);

      if (this.scanTimer <= 0) {
        this.isScanning = false;
        (this.scanCone.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }
  }
}
