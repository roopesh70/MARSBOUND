import * as THREE from 'three';

export class MarsAtmosphere {
  public group: THREE.Group;
  public sunLight: THREE.DirectionalLight;
  public ambientLight: THREE.AmbientLight;
  public phobosMesh: THREE.Mesh;
  public deimosMesh: THREE.Mesh;
  public dustParticles: THREE.Points;
  public windDriftParticles: THREE.Points;
  public sunHaloMesh: THREE.Mesh;
  public starfield: THREE.Points;
  public milkyWayMesh: THREE.Mesh;
  public earthMesh: THREE.Group;

  // NASA-calibrated atmospheric day/night colors
  private skyColorDay = new THREE.Color('#d9825b'); // Butterscotch / salmon day sky
  private skyColorSunset = new THREE.Color('#6f3928'); // Deep ochre horizon
  private skyColorNight = new THREE.Color('#050305'); // Deep black space (minimal atmosphere)
  private fogColorDay = new THREE.Color('#bf6d47');
  private fogColorSunset = new THREE.Color('#4a2218');
  private fogColorNight = new THREE.Color('#070406');

  // Blue sunset glow colors (forward Mie scattering by iron oxide dust)
  private sunsetBlueGlow = new THREE.Color('#38bdf8');
  private daySunWhite = new THREE.Color('#fffbf0');

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();

    // 1. Atmospheric Ambient Light (Mars diffused reddish dust scattering)
    this.ambientLight = new THREE.AmbientLight(0xd47a52, 0.65);
    this.group.add(this.ambientLight);

    // 2. Solar Directional Light
    this.sunLight = new THREE.DirectionalLight(0xfff1e0, 1.4);
    this.sunLight.position.set(120, 180, 80);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 500;
    this.sunLight.shadow.camera.left = -200;
    this.sunLight.shadow.camera.right = 200;
    this.sunLight.shadow.camera.top = 200;
    this.sunLight.shadow.camera.bottom = -200;
    this.group.add(this.sunLight);

    // 3. Dynamic Sun Disk & Famous Martian Blue Sunset Halo
    const sunGeom = new THREE.PlaneGeometry(16, 16);
    const sunHaloMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    this.sunHaloMesh = new THREE.Mesh(sunGeom, sunHaloMat);
    this.sunHaloMesh.position.copy(this.sunLight.position);
    this.group.add(this.sunHaloMesh);

    // 4. Distance Fog
    scene.fog = new THREE.FogExp2(this.fogColorDay.getHex(), 0.0028);
    scene.background = this.skyColorDay;

    // 5. Starfield: 2,800+ stars visible through Mars's ultra-thin atmosphere
    const starCount = 2800;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Distribute along celestial hemisphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.95 + 0.05); // Above ground
      const radius = 450 + Math.random() * 50;

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.cos(phi);
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Star spectral variations: blue-white, yellow, orange
      const starType = Math.random();
      const col = new THREE.Color();
      if (starType > 0.85) col.setHex(0x93c5fd); // Blue-white
      else if (starType > 0.5) col.setHex(0xffffff); // White
      else if (starType > 0.2) col.setHex(0xfef08a); // Pale yellow
      else col.setHex(0xfba267); // Red giant

      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.starfield = new THREE.Points(starGeom, starMat);
    this.group.add(this.starfield);

    // 6. Milky Way Galactic Plane Band
    this.milkyWayMesh = this.createMilkyWayBand();
    this.group.add(this.milkyWayMesh);

    // 7. Earth as the "Evening Star" (Pale Blue Dot + Moon companion)
    this.earthMesh = this.createEarthEveningStar();
    this.group.add(this.earthMesh);

    // 8. Mars Moons: Phobos & Deimos
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0x9e948c,
      roughness: 0.9,
      metalness: 0.1
    });

    const phobosGeom = new THREE.DodecahedronGeometry(4.2, 1);
    this.phobosMesh = new THREE.Mesh(phobosGeom, moonMat);
    this.phobosMesh.position.set(-220, 160, -220);
    this.phobosMesh.castShadow = true;
    this.group.add(this.phobosMesh);

    const deimosGeom = new THREE.SphereGeometry(1.6, 8, 8);
    this.deimosMesh = new THREE.Mesh(deimosGeom, moonMat);
    this.deimosMesh.position.set(260, 200, -190);
    this.group.add(this.deimosMesh);

    // 9. Floating Airborne Dust Particles (Atmospheric suspension)
    const dustCount = 800;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 350;
      dustPositions[i * 3 + 1] = Math.random() * 45;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 350;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xdf9473,
      size: 0.65,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.dustParticles = new THREE.Points(dustGeom, dustMat);
    this.group.add(this.dustParticles);

    // 10. Low-Altitude Wind-Blown Ground Dust Drifts (skimming the dunes)
    this.windDriftParticles = this.createLowAltitudeWindDrifts();
    this.group.add(this.windDriftParticles);

    scene.add(this.group);
  }

  /**
   * Creates a textured procedural Milky Way band arching across the night sky
   */
  private createMilkyWayBand(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Galactic core gradient: purple/blue nebular dust lane
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.3, 'rgba(56, 89, 148, 0.25)');
    grad.addColorStop(0.5, 'rgba(186, 140, 215, 0.45)');
    grad.addColorStop(0.7, 'rgba(56, 89, 148, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 128);

    // Dust lane rifts
    ctx.fillStyle = 'rgba(10, 5, 8, 0.5)';
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * 512;
      const ry = 40 + Math.random() * 48;
      ctx.beginPath();
      ctx.ellipse(rx, ry, 15 + Math.random() * 25, 4 + Math.random() * 8, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    const geom = new THREE.CylinderGeometry(460, 460, 180, 48, 1, true);
    geom.rotateX(Math.PI / 4);
    geom.rotateZ(Math.PI / 6);

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.65,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    return new THREE.Mesh(geom, mat);
  }

  /**
   * Earth as the "Evening Star" visible from the surface of Mars
   */
  private createEarthEveningStar(): THREE.Group {
    const group = new THREE.Group();

    // Pale Blue Dot
    const earthGeom = new THREE.SphereGeometry(1.4, 16, 16);
    const earthMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });
    const earth = new THREE.Mesh(earthGeom, earthMat);
    group.add(earth);

    // Atmospheric halo glow
    const glowGeom = new THREE.PlaneGeometry(8, 8);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    group.add(glow);

    // Tiny Moon companion
    const moonGeom = new THREE.SphereGeometry(0.35, 8, 8);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xd1d5db });
    const moon = new THREE.Mesh(moonGeom, moonMat);
    moon.position.set(2.2, 0.8, 0);
    group.add(moon);

    // Position in south-west sky
    group.position.set(-280, 190, 220);
    return group;
  }

  /**
   * Low-altitude horizontal dust streaks that skim across the dunes
   */
  private createLowAltitudeWindDrifts(): THREE.Points {
    const count = 450;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 320;
      positions[i * 3 + 1] = 0.4 + Math.random() * 2.8; // Skimming ground
      positions[i * 3 + 2] = (Math.random() - 0.5) * 320;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xdf845d,
      size: 1.1,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    return new THREE.Points(geom, mat);
  }

  public update(time: number, scene: THREE.Scene, camera?: THREE.Camera) {
    // 1. Gentle atmospheric dust drifting
    const dustPos = this.dustParticles.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < dustPos.count; i++) {
      let x = dustPos.getX(i) + 0.05;
      if (x > 175) x = -175;
      dustPos.setX(i, x);
    }
    dustPos.needsUpdate = true;

    // 2. Fast wind-skimming ground drifts (simulating prevailing wind)
    const driftPos = this.windDriftParticles.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < driftPos.count; i++) {
      let x = driftPos.getX(i) + 0.35; // Fast horizontal wind
      let z = driftPos.getZ(i) + 0.12;
      if (x > 160) x = -160;
      if (z > 160) z = -160;
      driftPos.setX(i, x);
      driftPos.setZ(i, z);
    }
    driftPos.needsUpdate = true;

    // 3. Phobos orbital transit (Phobos orbits Mars in 7.6 hours)
    this.phobosMesh.position.x = -240 * Math.cos(time * 0.04);
    this.phobosMesh.position.z = -240 * Math.sin(time * 0.04);

    // 4. Solar position & Day/Night/Sunset cycle
    const sunAngle = (time * 0.02) % (Math.PI * 2);
    this.sunLight.position.x = Math.cos(sunAngle) * 220;
    this.sunLight.position.y = Math.sin(sunAngle) * 170 + 15;
    this.sunHaloMesh.position.copy(this.sunLight.position);

    if (camera) {
      this.sunHaloMesh.lookAt(camera.position);
      this.earthMesh.lookAt(camera.position);
    }

    const sunElev = this.sunLight.position.y;
    const dayFactor = Math.max(0, Math.min(1, (sunElev + 10) / 70));
    const sunsetFactor = Math.max(0, 1.0 - Math.abs(sunElev - 15) / 30);

    // Ambient light intensity
    this.ambientLight.intensity = THREE.MathUtils.lerp(0.08, 0.72, dayFactor);

    // 5. Authentic Martian Blue Sunset Effect:
    // When the sun is low near the horizon, the halo turns vibrant cyan-blue!
    const haloMat = this.sunHaloMesh.material as THREE.MeshBasicMaterial;
    if (sunElev > 0) {
      haloMat.color.copy(this.daySunWhite).lerp(this.sunsetBlueGlow, sunsetFactor * 0.9);
      haloMat.opacity = THREE.MathUtils.lerp(0.5, 0.95, sunsetFactor);
    } else {
      haloMat.opacity = 0;
    }

    // Sky & Fog color transitions
    const currentSky = new THREE.Color();
    const currentFog = new THREE.Color();

    if (dayFactor > 0.4) {
      currentSky.copy(this.skyColorSunset).lerp(this.skyColorDay, (dayFactor - 0.4) / 0.6);
      currentFog.copy(this.fogColorSunset).lerp(this.fogColorDay, (dayFactor - 0.4) / 0.6);
    } else {
      currentSky.copy(this.skyColorNight).lerp(this.skyColorSunset, dayFactor / 0.4);
      currentFog.copy(this.fogColorNight).lerp(this.fogColorSunset, dayFactor / 0.4);
    }

    scene.background = currentSky;
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.copy(currentFog);
    }

    // Stars & Milky Way opacity (fade out during day, brilliant at night)
    const starMat = this.starfield.material as THREE.PointsMaterial;
    const nightFactor = 1.0 - dayFactor;
    starMat.opacity = nightFactor * 0.9;
    (this.milkyWayMesh.material as THREE.MeshBasicMaterial).opacity = nightFactor * 0.6;
    (this.earthMesh.children[1] as THREE.Mesh).material = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: nightFactor * 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }
}
