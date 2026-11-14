import * as THREE from 'three';

export interface TerrainConfig {
  size: number; // e.g. 800 meters across
  segments: number; // e.g. 128x128
}

export class JezeroTerrain {
  public mesh: THREE.Mesh;
  public rocksMesh: THREE.InstancedMesh;
  private size: number;
  private segments: number;

  constructor(config: TerrainConfig = { size: 600, segments: 120 }) {
    this.size = config.size;
    this.segments = config.segments;

    const geometry = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const baseMarsColor = new THREE.Color('#944326');
    const rockColor = new THREE.Color('#5e2c1a');
    const dustSandColor = new THREE.Color('#be683b');
    const clayDeltaColor = new THREE.Color('#884e35');

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = this.calculateHeight(x, z);
      pos.setY(i, y);

      // Vertex coloring based on slope and feature type
      const t = (y + 10) / 35;
      const col = new THREE.Color();
      if (x < -40 && z < -30) {
        // Delta clay region
        col.copy(clayDeltaColor).lerp(rockColor, Math.sin(x * 0.1) * 0.2 + 0.3);
      } else if (y > 10) {
        // High steep ridges / Kodiak butte
        col.copy(rockColor).lerp(baseMarsColor, 0.4);
      } else {
        // Sandy crater floor with dust ripples
        const ripple = (Math.sin(x * 0.2 + z * 0.1) + 1) * 0.15;
        col.copy(baseMarsColor).lerp(dustSandColor, t + ripple);
      }

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.92,
      metalness: 0.08,
      flatShading: true
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.receiveShadow = true;

    // Create instanced scatter rocks and boulders
    this.rocksMesh = this.createRockScatter(250);
  }

  /**
   * Procedural terrain function replicating the Jezero Crater landscape:
   * - Kodiak Butte mesa at (-160, 95)
   * - Delta Scarp front at (-85, -65)
   * - Belva impact crater at (-180, -175)
   * - Séítah dune ripples at (75, -115)
   * - Flat landing floor around (0, 0)
   */
  public calculateHeight(x: number, z: number): number {
    let y = 0;

    // 1. Regional gentle crater slope towards northwest delta
    y += (-x * 0.02) + (-z * 0.015);

    // 2. Base undulation (low frequency rolling plains)
    y += Math.sin(x * 0.012) * Math.cos(z * 0.012) * 3.5;
    y += Math.sin(x * 0.03 + 1.2) * Math.cos(z * 0.025 + 0.8) * 1.5;

    // 3. Kodiak Butte Mesa Feature at (-160, 95)
    const distToKodiak = Math.sqrt((x + 160) ** 2 + (z - 95) ** 2);
    if (distToKodiak < 45) {
      // Steep mesa walls with flat topset
      const mesaFactor = Math.cos((distToKodiak / 45) * (Math.PI / 2));
      y += (mesaFactor ** 0.6) * 22;
    }

    // 4. Delta Scarp Outcrop Feature at (-85, -65)
    const distToScarp = Math.sqrt((x + 85) ** 2 + (z + 65) ** 2);
    if (distToScarp < 40) {
      const scarpFactor = (1 - distToScarp / 40);
      y += scarpFactor * 8.5;
    }

    // 5. Belva Impact Crater Feature at (-180, -175)
    const distToBelva = Math.sqrt((x + 180) ** 2 + (z + 175) ** 2);
    if (distToBelva < 55) {
      if (distToBelva < 38) {
        // Deep bowl crater floor
        const craterDepression = (1 - distToBelva / 38);
        y -= (craterDepression ** 1.5) * 12;
      } else {
        // Raised impact ejecta rim
        const rimFactor = Math.sin(((distToBelva - 38) / 17) * Math.PI);
        y += rimFactor * 5.0;
      }
    }

    // 6. Séítah Eolian Megaripple Dunes at (75, -115)
    const distToSeitah = Math.sqrt((x - 75) ** 2 + (z + 115) ** 2);
    if (distToSeitah < 60) {
      // Dune wave ripple frequency
      const duneWave = Math.sin(x * 0.35 + z * 0.25) * 1.8;
      y += duneWave * (1 - distToSeitah / 60);
    }

    // 7. Flatten around Outpost Habitat Center (0, 0) for stable base building
    const distToCenter = Math.sqrt(x * x + z * z);
    if (distToCenter < 25) {
      const flatWeight = (distToCenter / 25);
      y *= (flatWeight * flatWeight);
    }

    return y;
  }

  /**
   * Fast height check for character physics collision and footstep grounding
   */
  public getElevationAt(x: number, z: number): number {
    return this.calculateHeight(x, z);
  }

  private createRockScatter(count: number): THREE.InstancedMesh {
    const rockGeom = new THREE.DodecahedronGeometry(0.8, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x5a2b1a,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true
    });

    const instancedMesh = new THREE.InstancedMesh(rockGeom, rockMat, count);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      // Distribute randomly across the terrain
      const x = (Math.random() - 0.5) * (this.size * 0.85);
      const z = (Math.random() - 0.5) * (this.size * 0.85);

      // Keep habitat pad clean
      if (Math.sqrt(x * x + z * z) < 18) continue;

      const y = this.calculateHeight(x, z);

      dummy.position.set(x, y + 0.3, z);
      const scale = 0.4 + Math.random() * 1.4;
      dummy.scale.set(scale, scale * (0.6 + Math.random() * 0.5), scale);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.updateMatrix();

      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;
    return instancedMesh;
  }
}
