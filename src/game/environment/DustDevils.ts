import * as THREE from 'three';
import { JezeroTerrain } from '../terrain/JezeroTerrain';
import { audioService } from '../../services/audioService';

interface Vortex {
  mesh: THREE.Points;
  x: number;
  z: number;
  vx: number;
  vz: number;
  rotSpeed: number;
  height: number;
}

export class DustDevilSystem {
  public group: THREE.Group;
  private vortices: Vortex[] = [];
  private lastGustTime = 0;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();

    // Create 3 active roaming dust devils in Jezero Crater
    const initialPositions = [
      { x: -50, z: -80, vx: 1.2, vz: 0.8 },
      { x: 90, z: 40, vx: -0.9, vz: 1.4 },
      { x: -110, z: 90, vx: 1.1, vz: -1.1 }
    ];

    for (const init of initialPositions) {
      const vortex = this.createVortex(init.x, init.z, init.vx, init.vz);
      this.vortices.push(vortex);
      this.group.add(vortex.mesh);
    }

    scene.add(this.group);
  }

  private createVortex(x: number, z: number, vx: number, vz: number): Vortex {
    const particleCount = 280;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const height = 32;

    for (let i = 0; i < particleCount; i++) {
      const hFraction = i / particleCount;
      const y = hFraction * height;
      // Inverted cone: narrow base on ground, wider funnel aloft
      const radius = 0.8 + hFraction * 4.5;
      const angle = Math.random() * Math.PI * 2;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xe07a4a,
      size: 0.85,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Points(geom, mat);
    mesh.position.set(x, 0, z);

    return {
      mesh,
      x,
      z,
      vx,
      vz,
      rotSpeed: 4.5 + Math.random() * 2,
      height
    };
  }

  public update(delta: number, terrain: JezeroTerrain, playerPos: { x: number; z: number }) {
    const now = performance.now();

    for (const v of this.vortices) {
      // 1. Drift vortex across terrain
      v.x += v.vx * delta * 2.5;
      v.z += v.vz * delta * 2.5;

      // Bounce at boundary
      if (Math.abs(v.x) > 230) v.vx *= -1;
      if (Math.abs(v.z) > 230) v.vz *= -1;

      // Keep base grounded to terrain height
      const groundY = terrain.getElevationAt(v.x, v.z);
      v.mesh.position.set(v.x, groundY, v.z);

      // 2. Fast spinning vortex particles
      v.mesh.rotation.y += v.rotSpeed * delta;

      // Swirl internal particle positions
      const positions = v.mesh.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < positions.count; i++) {
        let py = positions.getY(i) + delta * 2.2;
        if (py > v.height) py = 0;
        positions.setY(i, py);
      }
      positions.needsUpdate = true;

      // 3. Proximity check with player
      const distToPlayer = Math.sqrt((v.x - playerPos.x) ** 2 + (v.z - playerPos.z) ** 2);
      if (distToPlayer < 12 && now - this.lastGustTime > 3500) {
        this.lastGustTime = now;
        audioService.playDustDevilGust();
      }
    }
  }
}
