import * as THREE from 'three';

export class MarsAtmosphere {
  public group: THREE.Group;
  public sunLight: THREE.DirectionalLight;
  public ambientLight: THREE.AmbientLight;
  public phobosMesh: THREE.Mesh;
  public deimosMesh: THREE.Mesh;
  public dustParticles: THREE.Points;

  private skyColorDay = new THREE.Color('#d9825b');
  private skyColorNight = new THREE.Color('#0a0608');
  private fogColorDay = new THREE.Color('#bf6d47');
  private fogColorNight = new THREE.Color('#0f0b0c');

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();

    // 1. Atmosphere ambient light (Mars diffused reddish dust scattering)
    this.ambientLight = new THREE.AmbientLight(0xd47a52, 0.65);
    this.group.add(this.ambientLight);

    // 2. Solar directional light (Sun is ~43% as bright on Mars as on Earth due to 1.52 AU distance)
    this.sunLight = new THREE.DirectionalLight(0xfff1e0, 1.4);
    this.sunLight.position.set(120, 180, 80);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 450;
    this.sunLight.shadow.camera.left = -180;
    this.sunLight.shadow.camera.right = 180;
    this.sunLight.shadow.camera.top = 180;
    this.sunLight.shadow.camera.bottom = -180;
    this.group.add(this.sunLight);

    // 3. Distance Fog (Martian dust haze, tau ~ 0.4)
    scene.fog = new THREE.FogExp2(this.fogColorDay.getHex(), 0.0035);
    scene.background = this.skyColorDay;

    // 4. Mars Moon: Phobos (larger, irregular asteroid shape)
    const phobosGeom = new THREE.DodecahedronGeometry(3.5, 1);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0x8c827a });
    this.phobosMesh = new THREE.Mesh(phobosGeom, moonMat);
    this.phobosMesh.position.set(-200, 160, -220);
    this.group.add(this.phobosMesh);

    // 5. Mars Moon: Deimos (smaller, distant point-like moon)
    const deimosGeom = new THREE.SphereGeometry(1.4, 8, 8);
    this.deimosMesh = new THREE.Mesh(deimosGeom, moonMat);
    this.deimosMesh.position.set(240, 190, -180);
    this.group.add(this.deimosMesh);

    // 6. Floating atmospheric dust particle cloud
    const dustCount = 600;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 300;
      dustPositions[i * 3 + 1] = Math.random() * 40;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xdf9473,
      size: 0.6,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.dustParticles = new THREE.Points(dustGeom, dustMat);
    this.group.add(this.dustParticles);

    scene.add(this.group);
  }

  public update(time: number, scene: THREE.Scene) {
    // Subtle dust motion
    const positions = this.dustParticles.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      let x = positions.getX(i) + 0.04; // Gentle wind drift
      if (x > 150) x = -150;
      positions.setX(i, x);
    }
    positions.needsUpdate = true;

    // Slow orbital motion of Phobos (Phobos orbits Mars 3 times per sol!)
    this.phobosMesh.position.x = -220 * Math.cos(time * 0.05);
    this.phobosMesh.position.z = -220 * Math.sin(time * 0.05);

    // Day/night solar cycle based on time
    const sunAngle = (time * 0.02) % (Math.PI * 2);
    this.sunLight.position.x = Math.cos(sunAngle) * 200;
    this.sunLight.position.y = Math.sin(sunAngle) * 160 + 20;

    const isDay = this.sunLight.position.y > 0;
    const dayFactor = Math.max(0, Math.min(1, this.sunLight.position.y / 80));

    // Interpolate ambient light and fog colors
    this.ambientLight.intensity = THREE.MathUtils.lerp(0.15, 0.7, dayFactor);
    this.sunLight.intensity = isDay ? THREE.MathUtils.lerp(0.2, 1.4, dayFactor) : 0;

    const currentSky = this.skyColorNight.clone().lerp(this.skyColorDay, dayFactor);
    const currentFog = this.fogColorNight.clone().lerp(this.fogColorDay, dayFactor);

    scene.background = currentSky;
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.copy(currentFog);
    }
  }
}
