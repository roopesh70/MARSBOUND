import * as THREE from 'three';

export interface TerrainConfig {
  size: number; // e.g. 600 meters across
  segments: number; // e.g. 140x140
}

/**
 * Procedurally generates high-frequency normal and roughness maps
 * capturing wind-blown Martian sand ripples, fine pebble gravel, and rock fissures.
 */
function createProceduralMarsTextures(): {
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const width = 512;
  const height = 512;
  const heightData = new Float32Array(width * height);

  // 1. Generate multi-frequency heightmap (eolian ripples + micro-gravel)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;

      // Primary wind ripple waves (~15 degree prevailing tilt)
      const rippleAngle = 0.26; // radians
      const rx = u * Math.cos(rippleAngle) - v * Math.sin(rippleAngle);
      const ry = u * Math.sin(rippleAngle) + v * Math.cos(rippleAngle);

      let h = Math.sin(rx * Math.PI * 32) * 0.35;
      h += Math.sin(rx * Math.PI * 64 + ry * 12) * 0.15;

      // Secondary fine pebble noise
      const pebble = (Math.sin(x * 1.8) * Math.cos(y * 1.8) + Math.sin(x * 3.4 + y * 2.1)) * 0.25;
      h += pebble;

      // Micro rock fissures / cracked regolith crust
      const crack = Math.abs(Math.sin(u * 40) * Math.sin(v * 40));
      h += (1.0 - Math.min(1.0, crack * 2.5)) * 0.25;

      heightData[y * width + x] = h;
    }
  }

  // 2. Generate Normal Map (Sobel filter over heightmap)
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = width;
  normalCanvas.height = height;
  const normalCtx = normalCanvas.getContext('2d')!;
  const normalImg = normalCtx.createImageData(width, height);

  const roughnessCanvas = document.createElement('canvas');
  roughnessCanvas.width = width;
  roughnessCanvas.height = height;
  const roughnessCtx = roughnessCanvas.getContext('2d')!;
  const roughnessImg = roughnessCtx.createImageData(width, height);

  const getH = (x: number, y: number) => {
    const px = (x + width) % width;
    const py = (y + height) % height;
    return heightData[py * width + px];
  };

  const normalStrength = 2.4;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Sobel horizontal and vertical gradients
      const dx = (getH(x + 1, y) - getH(x - 1, y)) * normalStrength;
      const dy = (getH(x, y + 1) - getH(x, y - 1)) * normalStrength;
      const dz = 1.0;

      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = ((-dx / len) * 0.5 + 0.5) * 255;
      const ny = ((-dy / len) * 0.5 + 0.5) * 255;
      const nz = ((dz / len) * 0.5 + 0.5) * 255;

      normalImg.data[idx] = nx;
      normalImg.data[idx + 1] = ny;
      normalImg.data[idx + 2] = nz;
      normalImg.data[idx + 3] = 255;

      // Roughness: high for dry dust (220-255), slightly smoother for exposed basalt rock (180)
      const hVal = heightData[y * width + x];
      const rVal = Math.min(255, Math.max(170, Math.round(210 + hVal * 40)));
      roughnessImg.data[idx] = rVal;
      roughnessImg.data[idx + 1] = rVal;
      roughnessImg.data[idx + 2] = rVal;
      roughnessImg.data[idx + 3] = 255;
    }
  }

  normalCtx.putImageData(normalImg, 0, 0);
  roughnessCtx.putImageData(roughnessImg, 0, 0);

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(45, 45);

  const roughnessMap = new THREE.CanvasTexture(roughnessCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(45, 45);

  return { normalMap, roughnessMap };
}

export class JezeroTerrain {
  public mesh: THREE.Mesh;
  public craterRimMesh: THREE.Mesh;
  public rocksMesh: THREE.Group;
  private size: number;
  private segments: number;

  constructor(config: TerrainConfig = { size: 600, segments: 140 }) {
    this.size = config.size;
    this.segments = config.segments;

    const { normalMap, roughnessMap } = createProceduralMarsTextures();

    // 1. Playable Crater Floor Geometry
    const geometry = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    // NASA Jezero color palette: calibrated Mastcam-Z & HiRISE tones
    const baseMarsColor = new THREE.Color('#9e4828'); // Iron oxide hematite regolith
    const darkBasaltColor = new THREE.Color('#4d2618'); // Volcanic floor bedrock
    const dustSandColor = new THREE.Color('#c67242'); // Wind-blown fine silica/sulfate dust
    const clayDeltaColor = new THREE.Color('#8b4c32'); // Smectite aqueous clays
    const anorthositePaleColor = new THREE.Color('#bc907e'); // Ancient crust clasts
    const sulfurVeinColor = new THREE.Color('#d9aa84'); // Sulfate/carbonate mineral crust

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = this.calculateHeight(x, z);
      pos.setY(i, y);

      // Procedural biome blending based on geological region, slope, and elevation
      const col = new THREE.Color();
      const normHeight = (y + 12) / 36;

      if (x < -50 && z < -40) {
        // Delta Scarp & fan apron: fine clay mudstone with mineral veins
        const veinNoise = Math.sin(x * 0.18 + z * 0.12) * Math.cos(z * 0.22);
        if (veinNoise > 0.6) {
          col.copy(sulfurVeinColor);
        } else {
          col.copy(clayDeltaColor).lerp(darkBasaltColor, Math.sin(x * 0.08) * 0.25 + 0.35);
        }
      } else if (y > 9.5) {
        // High steep ridges & Kodiak Butte: exposed cliff rock strata
        const strataBand = (Math.sin(y * 1.8) + 1) * 0.5;
        col.copy(darkBasaltColor).lerp(baseMarsColor, strataBand * 0.45);
      } else if (x > 40 && z < -70) {
        // Séítah dunes: golden-orange active eolian sand waves
        const duneRipple = (Math.sin(x * 0.32 + z * 0.22) + 1) * 0.22;
        col.copy(dustSandColor).lerp(baseMarsColor, duneRipple);
      } else {
        // Crater floor plains: volcanic bedrock slabs dusted with reddish sand
        const slabNoise = Math.sin(x * 0.15) * Math.cos(z * 0.15);
        if (slabNoise > 0.4) {
          col.copy(darkBasaltColor).lerp(anorthositePaleColor, 0.15);
        } else {
          const ripple = (Math.sin(x * 0.18 + z * 0.09) + 1) * 0.18;
          col.copy(baseMarsColor).lerp(dustSandColor, normHeight * 0.5 + ripple);
        }
      }

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const terrainMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.92,
      roughnessMap: roughnessMap,
      metalness: 0.06,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.85, 0.85)
    });

    this.mesh = new THREE.Mesh(geometry, terrainMaterial);
    this.mesh.receiveShadow = true;

    // 2. 360° Distant Jezero Crater Rim Mountains (45km geological enclosure)
    this.craterRimMesh = this.createCraterRimMountains();

    // 3. Multi-type rock and boulder scatter (Ventifacts, Basalt Boulders, Flat Sedimentary Slabs)
    this.rocksMesh = this.createVariedRockScatter(380);
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
      y += (mesaFactor ** 0.6) * 23;
    }

    // 4. Delta Scarp Outcrop Feature at (-85, -65)
    const distToScarp = Math.sqrt((x + 85) ** 2 + (z + 65) ** 2);
    if (distToScarp < 42) {
      const scarpFactor = (1 - distToScarp / 42);
      y += scarpFactor * 9.0;
    }

    // 5. Belva Impact Crater Feature at (-180, -175)
    const distToBelva = Math.sqrt((x + 180) ** 2 + (z + 175) ** 2);
    if (distToBelva < 55) {
      if (distToBelva < 38) {
        // Deep bowl crater floor
        const craterDepression = (1 - distToBelva / 38);
        y -= (craterDepression ** 1.5) * 13;
      } else {
        // Raised impact ejecta rim
        const rimFactor = Math.sin(((distToBelva - 38) / 17) * Math.PI);
        y += rimFactor * 5.2;
      }
    }

    // 6. Séítah Eolian Megaripple Dunes at (75, -115)
    const distToSeitah = Math.sqrt((x - 75) ** 2 + (z + 115) ** 2);
    if (distToSeitah < 60) {
      const duneWave = Math.sin(x * 0.35 + z * 0.25) * 2.1;
      y += duneWave * (1 - distToSeitah / 60);
    }

    // 7. Flatten around Outpost Habitat Center (0, 0) for stable base building
    const distToCenter = Math.sqrt(x * x + z * z);
    if (distToCenter < 25) {
      const flatWeight = (distToCenter / 25);
      y *= (flatWeight * flatWeight);
    }

    // 8. Neretva Vallis Inflow Canyon Gorge Corridor (-170, -130) to (-295, -260)
    // Fluvial breach carved through the crater rim wall
    if (x < -150 && z < -110) {
      const p0x = -170;
      const p0z = -130;
      const dx = -125;
      const dz = -130;
      const lenSq = dx * dx + dz * dz;
      const t = Math.max(0, Math.min(1.2, ((x - p0x) * dx + (z - p0z) * dz) / lenSq));
      const projX = p0x + t * dx;
      const projZ = p0z + t * dz;
      const distToCanyonCenter = Math.sqrt((x - projX) ** 2 + (z - projZ) ** 2);

      if (distToCanyonCenter < 52) {
        // Within 22m width: smooth, scoured canyon floor with dry ripple ridges
        if (distToCanyonCenter < 22) {
          const canyonFloorRipple = Math.sin(x * 0.45 + z * 0.45) * 0.45;
          // Carve down 4m - 7m relative to rising rim
          y -= (1 - distToCanyonCenter / 22) * 5.8 + canyonFloorRipple;
        } else {
          // Flanking 22m sheer canyon walls rising up to the highland rim
          const wallFraction = (distToCanyonCenter - 22) / 30; // 0 to 1
          const wallCliffs = Math.sin(wallFraction * (Math.PI / 2)) * 16.5;
          y += wallCliffs;
        }
      }
    }

    return y;
  }

  /**
   * Fast height check for character physics collision and footstep grounding
   */
  public getElevationAt(x: number, z: number): number {
    return this.calculateHeight(x, z);
  }

  /**
   * Generates a 360° circular mountain chain enclosing the Jezero Crater basin,
   * complete with jagged Noachian peaks and the dramatic Neretva Vallis river breach.
   */
  private createCraterRimMountains(): THREE.Mesh {
    const segments = 120;
    const innerRadius = 310;
    const outerRadius = 850;
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments, 16);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const rimBaseColor = new THREE.Color('#6c321d');
    const rimPeakColor = new THREE.Color('#461d12');
    const hazeColor = new THREE.Color('#bf6d47');

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);

      // Radial fraction from inner to outer edge
      const radialFrac = (dist - innerRadius) / (outerRadius - innerRadius);

      // Angular mountain ridges with multi-frequency peaks
      let mountainHeight = 0;
      mountainHeight += Math.sin(angle * 7) * 24;
      mountainHeight += Math.cos(angle * 13 + 1.2) * 14;
      mountainHeight += Math.sin(angle * 23) * 8;
      mountainHeight += Math.sin(angle * 37) * 4;

      // Base elevation profile (peaks rise at ~65% radius, then slope into distant horizon)
      const ridgeProfile = Math.sin(radialFrac * Math.PI);
      let y = (65 + mountainHeight) * ridgeProfile;

      // Carve the dramatic Neretva Vallis River Gorge Breach (Northwest angle ~ -2.45 to -1.95 radians)
      const breachDist = Math.abs(angle - (-2.22));
      if (breachDist < 0.38) {
        const breachFactor = Math.cos((breachDist / 0.38) * (Math.PI / 2));
        y *= (1.0 - breachFactor * 0.94); // Passable gap through the crater rim wall
      }

      pos.setY(i, y - 5);

      // Color blending: mountain base matches ground, peaks are dark basalt, blended with haze
      const peakFactor = Math.max(0, Math.min(1, y / 80));
      const col = new THREE.Color().copy(rimBaseColor).lerp(rimPeakColor, peakFactor);
      col.lerp(hazeColor, radialFrac * 0.55); // Atmospheric distance scattering haze

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      metalness: 0.04,
      flatShading: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
  }

  /**
   * Creates a multi-type boulder scatter across the Martian surface:
   * 1. Rounded weathered basalt boulders
   * 2. Wind-faceted sharp ventifacts
   * 3. Flat sedimentary slab stones
   */
  private createVariedRockScatter(totalCount: number): THREE.Group {
    const group = new THREE.Group();

    // Type 1: Rounded Weathered Basalt Boulders
    const basaltGeom = new THREE.DodecahedronGeometry(0.85, 1);
    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0x542918,
      roughness: 0.94,
      metalness: 0.06,
      flatShading: true
    });
    const basaltCount = Math.floor(totalCount * 0.5);
    const basaltInstanced = new THREE.InstancedMesh(basaltGeom, basaltMat, basaltCount);

    // Type 2: Wind-Faceted Sharp Ventifacts (Wind-sculpted angular rocks)
    const ventifactGeom = new THREE.TetrahedronGeometry(0.7, 1);
    const ventifactMat = new THREE.MeshStandardMaterial({
      color: 0x6e3621,
      roughness: 0.88,
      metalness: 0.08,
      flatShading: true
    });
    const ventifactCount = Math.floor(totalCount * 0.3);
    const ventifactInstanced = new THREE.InstancedMesh(ventifactGeom, ventifactMat, ventifactCount);

    // Type 3: Flat Sedimentary Riverbed Slabs (Topset & mudstone fragments)
    const slabGeom = new THREE.CylinderGeometry(0.9, 1.1, 0.25, 7);
    const slabMat = new THREE.MeshStandardMaterial({
      color: 0x82462e,
      roughness: 0.92,
      metalness: 0.05,
      flatShading: true
    });
    const slabCount = Math.floor(totalCount * 0.2);
    const slabInstanced = new THREE.InstancedMesh(slabGeom, slabMat, slabCount);

    const dummy = new THREE.Object3D();

    const populateInstances = (
      mesh: THREE.InstancedMesh,
      count: number,
      scaleMin: number,
      scaleMax: number,
      ySquash: number
    ) => {
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * (this.size * 0.88);
        const z = (Math.random() - 0.5) * (this.size * 0.88);

        // Keep habitat base area clean
        if (Math.sqrt(x * x + z * z) < 22) continue;

        const y = this.calculateHeight(x, z);

        dummy.position.set(x, y + 0.2, z);
        const scale = scaleMin + Math.random() * (scaleMax - scaleMin);
        dummy.scale.set(scale, scale * ySquash, scale);
        dummy.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI
        );
        dummy.updateMatrix();

        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    };

    populateInstances(basaltInstanced, basaltCount, 0.45, 1.6, 0.75);
    populateInstances(ventifactInstanced, ventifactCount, 0.35, 1.2, 0.95);
    populateInstances(slabInstanced, slabCount, 0.6, 1.9, 0.35);

    group.add(basaltInstanced);
    group.add(ventifactInstanced);
    group.add(slabInstanced);

    return group;
  }
}
