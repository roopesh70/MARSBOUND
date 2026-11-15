import * as THREE from 'three';

/**
 * Mars Atmospheric Simulation & Photorealistic Solar System
 * 
 * Accurately models the famous Martian "Blue Sunset" (forward Mie scattering by fine ferric oxide dust),
 * the smaller angular diameter of the Sun at 1.52 AU (~0.35°), the characteristic butterscotch day sky,
 * diurnal solar path synchronized with Local Mean Solar Time (LMST), and the ultra-thin night sky.
 */
export class MarsAtmosphere {
  public group: THREE.Group;
  public sunLight: THREE.DirectionalLight;
  public ambientLight: THREE.AmbientLight;
  public phobosMesh: THREE.Mesh;
  public deimosMesh: THREE.Mesh;
  public dustParticles: THREE.Points;
  public windDriftParticles: THREE.Points;
  public starfield: THREE.Points;
  public milkyWayMesh: THREE.Mesh;
  public earthMesh: THREE.Group;

  // Solar Optical Assembly
  public sunGroup: THREE.Group;
  public sunDiscMesh: THREE.Mesh;
  public sunInnerCoronaMesh: THREE.Mesh;
  public blueSunsetAureoleMesh: THREE.Mesh;
  public crepuscularRaysMesh: THREE.Mesh;

  // Celestial Sky Dome with Mie Scattering Shader
  public skyDomeMesh: THREE.Mesh;
  private skyShaderMat: THREE.ShaderMaterial;

  // NASA Planetary Color Palette
  private skyColorDayZenith = new THREE.Color('#b56947'); // Warm butterscotch / salmon zenith
  private skyColorDayHorizon = new THREE.Color('#df936c'); // Bright dusty ochre horizon
  private skyColorSunsetZenith = new THREE.Color('#221019'); // Dusky purple / russet zenith
  private skyColorSunsetHorizon = new THREE.Color('#6b291a'); // Deep terracotta horizon
  private skyColorNight = new THREE.Color('#020104'); // Deep cosmic black space

  private fogColorDay = new THREE.Color('#bf6d47');
  private fogColorSunset = new THREE.Color('#431c16');
  private fogColorNight = new THREE.Color('#030205');

  // Forward Mie scattering blue sunset palette
  private sunsetBlueGlow = new THREE.Color('#38bdf8'); // Vibrant forward-scattered cyan/blue
  private sunsetDeepBlue = new THREE.Color('#0284c7');
  private daySunWhite = new THREE.Color('#fffef5'); // Crisp Martian solar disc

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();

    // 1. Ambient Light (Diffused scattering through thin dust atmosphere)
    this.ambientLight = new THREE.AmbientLight(0xd47a52, 0.6);
    this.group.add(this.ambientLight);

    // 2. Solar Directional Light (Crisp, high-contrast shadows due to low air dispersion)
    const isMobileDevice = typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth < 1024);
    const shadowMapRes = isMobileDevice ? 1024 : 2048;

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.45);
    this.sunLight.position.set(0, 200, 0);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = shadowMapRes;
    this.sunLight.shadow.mapSize.height = shadowMapRes;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 650;
    this.sunLight.shadow.camera.left = -220;
    this.sunLight.shadow.camera.right = 220;
    this.sunLight.shadow.camera.top = 220;
    this.sunLight.shadow.camera.bottom = -220;
    this.sunLight.shadow.bias = -0.0003;
    this.group.add(this.sunLight);

    // 3. Precision Solar Optical Assembly
    // On Mars (1.52 AU), the Sun's angular diameter is ~0.35° (compared to 0.53° on Earth).
    // At R = 420m, true physical disk diameter is ~2.55 meters.
    this.sunGroup = new THREE.Group();

    // A. Intense White Solar Core Disk (Sharp limb with soft limb darkening)
    const sunDiscTex = this.createSolarDiscTexture();
    const sunDiscMat = new THREE.MeshBasicMaterial({
      map: sunDiscTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    this.sunDiscMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), sunDiscMat);
    this.sunDiscMesh.renderOrder = -47;
    this.sunGroup.add(this.sunDiscMesh);

    // B. Inner High-Energy Corona Flare (~1.2° diameter)
    const innerCoronaTex = this.createInnerCoronaTexture();
    const innerCoronaMat = new THREE.MeshBasicMaterial({
      map: innerCoronaTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    this.sunInnerCoronaMesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), innerCoronaMat);
    this.sunInnerCoronaMesh.renderOrder = -48;
    this.sunGroup.add(this.sunInnerCoronaMesh);

    // C. The Famous Martian Forward Mie-Scattering Blue Sunset Aureole (~25° wide)
    // As seen by Curiosity (Sol 956) and Spirit (Sol 489), this wide halo turns luminous cyan/blue at twilight
    const blueAureoleTex = this.createBlueSunsetAureoleTexture();
    const blueAureoleMat = new THREE.MeshBasicMaterial({
      map: blueAureoleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    this.blueSunsetAureoleMesh = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), blueAureoleMat);
    this.blueSunsetAureoleMesh.position.z = -2; // Slightly behind disk
    this.blueSunsetAureoleMesh.renderOrder = -50;
    this.sunGroup.add(this.blueSunsetAureoleMesh);

    // D. Subtle Crepuscular Optical Rays
    const raysTex = this.createCrepuscularRayTexture();
    const raysMat = new THREE.MeshBasicMaterial({
      map: raysTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.0,
      side: THREE.DoubleSide
    });
    this.crepuscularRaysMesh = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), raysMat);
    this.crepuscularRaysMesh.renderOrder = -49;
    this.sunGroup.add(this.crepuscularRaysMesh);

    this.group.add(this.sunGroup);

    // 4. Photorealistic Atmospheric Celestial Sky Dome
    this.skyShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uSunPosition: { value: new THREE.Vector3(0, 1, 0) },
        uSunElevation: { value: 1.0 },
        uZenithColor: { value: new THREE.Color(this.skyColorDayZenith) },
        uHorizonColor: { value: new THREE.Color(this.skyColorDayHorizon) },
        uSunsetBlueGlow: { value: new THREE.Color(this.sunsetBlueGlow) },
        uSunsetFactor: { value: 0.0 },
        uDayFactor: { value: 1.0 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        uniform vec3 uSunPosition;
        uniform float uSunElevation;
        uniform vec3 uZenithColor;
        uniform vec3 uHorizonColor;
        uniform vec3 uSunsetBlueGlow;
        uniform float uSunsetFactor;
        uniform float uDayFactor;

        void main() {
          vec3 viewDir = normalize(vWorldPosition);
          float heightFactor = clamp(viewDir.y * 1.6 + 0.1, 0.0, 1.0);

          // Vertical atmospheric dust gradient: Horizon ochre vs. Zenith butterscotch
          vec3 skyColor = mix(uHorizonColor, uZenithColor, pow(heightFactor, 0.75));

          // Forward Mie scattering around the setting/rising sun
          float cosTheta = dot(viewDir, uSunPosition);
          if (cosTheta > 0.0 && uSunElevation > -0.2) {
            // Tight scattering core & wider forward aureole
            float miePeak = pow(max(0.0, cosTheta), 24.0) * 1.6;
            float mieBroad = pow(max(0.0, cosTheta), 4.5) * 0.55;

            // At sunset/sunrise, blue light is forward-scattered by ferric oxide dust nanograins
            vec3 aureoleColor = mix(vec3(0.95, 0.96, 1.0), uSunsetBlueGlow, uSunsetFactor);
            skyColor += aureoleColor * (miePeak + mieBroad) * (0.25 + 0.85 * uSunsetFactor) * uDayFactor;
          }

          // Anti-solar horizon darkening at twilight
          if (cosTheta < -0.2 && uSunsetFactor > 0.3) {
            skyColor = mix(skyColor, vec3(0.18, 0.08, 0.12), (1.0 - cosTheta) * 0.25 * uSunsetFactor);
          }

          // Darken below the ground horizon
          if (viewDir.y < -0.02) {
            skyColor = mix(skyColor, vec3(0.02, 0.01, 0.01), clamp(-viewDir.y * 12.0, 0.0, 1.0));
          }

          gl_FragColor = vec4(skyColor * uDayFactor, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    });

    const skyGeom = new THREE.SphereGeometry(485, 48, 32);
    this.skyDomeMesh = new THREE.Mesh(skyGeom, this.skyShaderMat);
    this.skyDomeMesh.renderOrder = -100;
    this.group.add(this.skyDomeMesh);

    // 5. Distance Fog
    scene.fog = new THREE.FogExp2(this.fogColorDay.getHex(), 0.0028);

    // 6. Starfield: 3,200 stars brilliant through Mars' ultra-thin atmosphere
    const starCount = 3200;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.94 + 0.06);
      const radius = 450 + Math.random() * 25;

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.cos(phi);
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const starType = Math.random();
      const col = new THREE.Color();
      if (starType > 0.85) col.setHex(0xa5f3fc); // Blue-white
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
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.starfield = new THREE.Points(starGeom, starMat);
    this.starfield.renderOrder = -90;
    this.group.add(this.starfield);

    // 7. Milky Way Galactic Plane
    this.milkyWayMesh = this.createMilkyWayBand();
    this.milkyWayMesh.renderOrder = -85;
    this.group.add(this.milkyWayMesh);

    // 8. Earth as the "Evening Star" (Pale Blue Dot + Moon companion)
    this.earthMesh = this.createEarthEveningStar();
    this.earthMesh.renderOrder = -65;
    this.group.add(this.earthMesh);

    // 9. Mars Moons: Phobos & Deimos
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0x9e948c,
      roughness: 0.9,
      metalness: 0.1
    });

    const phobosGeom = new THREE.DodecahedronGeometry(4.2, 1);
    this.phobosMesh = new THREE.Mesh(phobosGeom, moonMat);
    this.phobosMesh.position.set(-220, 160, -220);
    this.phobosMesh.castShadow = true;
    this.phobosMesh.renderOrder = -70;
    this.group.add(this.phobosMesh);

    const deimosGeom = new THREE.SphereGeometry(1.6, 8, 8);
    this.deimosMesh = new THREE.Mesh(deimosGeom, moonMat);
    this.deimosMesh.position.set(260, 200, -190);
    this.deimosMesh.renderOrder = -70;
    this.group.add(this.deimosMesh);

    // 10. Floating Atmospheric Dust & Low-Altitude Dune Drifts
    const isMobileDust = typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth < 1024);
    const dustCount = isMobileDust ? 340 : 850;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 360;
      dustPositions[i * 3 + 1] = Math.random() * 50;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 360;
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

    this.windDriftParticles = this.createLowAltitudeWindDrifts();
    this.group.add(this.windDriftParticles);

    scene.add(this.group);
  }

  /**
   * Procedural texture for the sharp, intense white-cyan Martian solar disk
   */
  private createSolarDiscTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const cx = 128;
    const cy = 128;
    const r = 120;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.55, 'rgba(240, 249, 255, 0.95)');
    grad.addColorStop(0.72, 'rgba(224, 242, 254, 0.55)');
    grad.addColorStop(0.9, 'rgba(186, 230, 253, 0.15)');
    grad.addColorStop(1.0, 'rgba(186, 230, 253, 0.0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Inner corona flare surrounding the solar disk
   */
  private createInnerCoronaTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    const cx = 256;
    const cy = 256;
    const r = 240;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.2, 'rgba(224, 242, 254, 0.65)');
    grad.addColorStop(0.45, 'rgba(125, 211, 252, 0.35)');
    grad.addColorStop(0.75, 'rgba(56, 189, 248, 0.08)');
    grad.addColorStop(1.0, 'rgba(56, 189, 248, 0.0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * The Famous Martian Blue Sunset Aureole (Forward Mie Scattering by Iron Oxide Dust)
   */
  private createBlueSunsetAureoleTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    const cx = 256;
    const cy = 256;
    const r = 250;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.98)');
    grad.addColorStop(0.18, 'rgba(186, 230, 253, 0.85)');
    grad.addColorStop(0.38, 'rgba(56, 189, 248, 0.65)'); // Signature vibrant blue
    grad.addColorStop(0.62, 'rgba(2, 132, 199, 0.3)');
    grad.addColorStop(0.82, 'rgba(88, 28, 135, 0.1)'); // Transition to dusk violet
    grad.addColorStop(1.0, 'rgba(88, 28, 135, 0.0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Atmospheric Crepuscular Ray Texture
   */
  private createCrepuscularRayTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    const cx = 256;
    const cy = 256;
    ctx.clearRect(0, 0, 512, 512);

    // Draw soft radial spoke rays
    const rayCount = 18;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const rayWidth = 0.06 + Math.random() * 0.05;
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 250);
      grad.addColorStop(0.0, 'rgba(224, 242, 254, 0.45)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.18)');
      grad.addColorStop(1.0, 'rgba(56, 189, 248, 0.0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 250, angle - rayWidth, angle + rayWidth);
      ctx.closePath();
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  private createMilkyWayBand(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.3, 'rgba(56, 89, 148, 0.25)');
    grad.addColorStop(0.5, 'rgba(186, 140, 215, 0.45)');
    grad.addColorStop(0.7, 'rgba(56, 89, 148, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 128);

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
      opacity: 0.0,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    return new THREE.Mesh(geom, mat);
  }

  private createEarthEveningStar(): THREE.Group {
    const group = new THREE.Group();

    const earthGeom = new THREE.SphereGeometry(1.4, 16, 16);
    const earthMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });
    const earth = new THREE.Mesh(earthGeom, earthMat);
    group.add(earth);

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

    const moonGeom = new THREE.SphereGeometry(0.35, 8, 8);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xd1d5db });
    const moon = new THREE.Mesh(moonGeom, moonMat);
    moon.position.set(2.2, 0.8, 0);
    group.add(moon);

    group.position.set(-280, 190, 220);
    return group;
  }

  private createLowAltitudeWindDrifts(): THREE.Points {
    const count = 450;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 320;
      positions[i * 3 + 1] = 0.4 + Math.random() * 2.8;
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

  /**
   * Main Atmospheric Render Update Loop
   * Synchronized with true Martian Local Mean Solar Time (LMST)
   */
  public update(time: number, scene: THREE.Scene, camera?: THREE.Camera, solHour?: number) {
    // 1. Dust particle drifts
    const dustPos = this.dustParticles.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < dustPos.count; i++) {
      let x = dustPos.getX(i) + 0.05;
      if (x > 175) x = -175;
      dustPos.setX(i, x);
    }
    dustPos.needsUpdate = true;

    const driftPos = this.windDriftParticles.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < driftPos.count; i++) {
      let x = driftPos.getX(i) + 0.35;
      let z = driftPos.getZ(i) + 0.12;
      if (x > 160) x = -160;
      if (z > 160) z = -160;
      driftPos.setX(i, x);
      driftPos.setZ(i, z);
    }
    driftPos.needsUpdate = true;

    // 2. Phobos orbital transit (Phobos orbits Mars in 7.6 hours)
    this.phobosMesh.position.x = -240 * Math.cos(time * 0.04);
    this.phobosMesh.position.z = -240 * Math.sin(time * 0.04);

    // 3. Solar Coordinates synchronized with Local Mean Solar Time (LMST)
    // 06:00 = Sunrise in East (+X)
    // 12:00 = Zenith Peak (South-Zenith +Y, +Z)
    // 18:15 = Blue Sunset in West (-X)
    // 00:00 = Night Nadir below ground (-Y)
    const effectiveHour = typeof solHour === 'number' ? solHour : ((time * 0.15) % 24);
    const solarAngle = ((effectiveHour - 6.0) / 24.0) * Math.PI * 2;

    const solarDistance = 420; // Radius on celestial sphere
    // Solar trajectory inclined 18.4° South (latitude of Jezero Crater)
    const latRad = 18.4 * (Math.PI / 180);
    const sunX = -Math.sin(solarAngle) * solarDistance;
    const sunY = Math.cos(solarAngle) * Math.cos(latRad) * solarDistance;
    const sunZ = Math.cos(solarAngle) * Math.sin(latRad) * solarDistance;

    this.sunLight.position.set(sunX, sunY, sunZ);
    this.sunGroup.position.copy(this.sunLight.position);

    if (camera) {
      this.sunGroup.lookAt(camera.position);
      this.earthMesh.lookAt(camera.position);
      // Keep sky dome centered on camera to eliminate parallax clipping
      this.skyDomeMesh.position.copy(camera.position);
    }

    // Normalized sun elevation above horizon (-1 to 1)
    const normalizedElev = sunY / solarDistance;

    // Day Factor: 0 at night, 1 at midday
    const dayFactor = THREE.MathUtils.clamp((normalizedElev + 0.12) / 0.5, 0.0, 1.0);

    // Sunset/Sunrise Factor: peaks sharply when the sun is near the horizon (-0.08 to +0.22 elev)
    // On Mars, sunset/sunrise blue glow is most intense between 05:15 - 06:30 and 17:30 - 18:45
    const distToHorizon = Math.abs(normalizedElev - 0.04);
    const sunsetFactor = THREE.MathUtils.clamp(1.0 - (distToHorizon / 0.22), 0.0, 1.0);

    // 4. Update Directional & Ambient Solar Lighting
    if (dayFactor > 0.01) {
      this.sunLight.visible = true;
      // At midday: bright crisp white-warm sunlight; at sunset: cool cyan-tinted low-angle light
      const sunLightCol = new THREE.Color().copy(this.daySunWhite).lerp(this.sunsetBlueGlow, sunsetFactor * 0.65);
      this.sunLight.color.copy(sunLightCol);
      this.sunLight.intensity = THREE.MathUtils.lerp(0.0, 1.45, Math.pow(dayFactor, 0.7));

      // Ambient light: warm dusty terracotta at noon, deep twilight russet at sunset
      const ambCol = new THREE.Color().copy(this.skyColorDayHorizon).lerp(this.skyColorSunsetHorizon, sunsetFactor);
      this.ambientLight.color.copy(ambCol);
      this.ambientLight.intensity = THREE.MathUtils.lerp(0.08, 0.62, dayFactor);
    } else {
      this.sunLight.visible = false;
      this.sunLight.intensity = 0;
      this.ambientLight.color.setHex(0x0f172a); // Deep starlight / moonlight
      this.ambientLight.intensity = 0.08;
    }

    // 5. Update Optical Solar Disc & Forward Mie Scattering Blue Aureole
    const sunVisible = normalizedElev > -0.15;
    this.sunGroup.visible = sunVisible;

    if (sunVisible) {
      // Disc limb color: brilliant white during day, pale cyan-white during sunset
      const discMat = this.sunDiscMesh.material as THREE.MeshBasicMaterial;
      discMat.color.copy(this.daySunWhite).lerp(this.sunsetBlueGlow, sunsetFactor * 0.4);
      discMat.opacity = THREE.MathUtils.lerp(0.0, 1.0, (normalizedElev + 0.15) / 0.2);

      // Inner Corona Flare
      const coronaMat = this.sunInnerCoronaMesh.material as THREE.MeshBasicMaterial;
      coronaMat.color.copy(this.daySunWhite).lerp(this.sunsetBlueGlow, sunsetFactor * 0.85);
      coronaMat.opacity = THREE.MathUtils.lerp(0.4, 0.95, sunsetFactor) * discMat.opacity;

      // Martian Blue Sunset Aureole: expands and intensifies dramatically at the horizon!
      const aureoleMat = this.blueSunsetAureoleMesh.material as THREE.MeshBasicMaterial;
      aureoleMat.color.copy(this.sunsetBlueGlow);
      // Low opacity during daytime, blazing intense blue forward-scattering at sunset/sunrise
      aureoleMat.opacity = THREE.MathUtils.lerp(0.12, 0.92, Math.pow(sunsetFactor, 1.2)) * discMat.opacity;
      const aureoleScale = THREE.MathUtils.lerp(0.7, 1.35, sunsetFactor);
      this.blueSunsetAureoleMesh.scale.set(aureoleScale, aureoleScale, 1.0);

      // Crepuscular rays visible only during sunrise and sunset
      const raysMat = this.crepuscularRaysMesh.material as THREE.MeshBasicMaterial;
      raysMat.opacity = Math.pow(sunsetFactor, 2.0) * 0.45;
      raysMat.color.copy(this.sunsetBlueGlow);
      this.crepuscularRaysMesh.rotation.z = time * 0.02;
    }

    // 6. Update Sky Dome Shader Uniforms
    const currentZenith = new THREE.Color().copy(this.skyColorSunsetZenith).lerp(this.skyColorDayZenith, dayFactor);
    if (dayFactor < 0.2) {
      currentZenith.lerp(this.skyColorNight, 1.0 - dayFactor / 0.2);
    }
    const currentHorizon = new THREE.Color().copy(this.skyColorSunsetHorizon).lerp(this.skyColorDayHorizon, dayFactor);
    if (dayFactor < 0.2) {
      currentHorizon.lerp(this.skyColorNight, 1.0 - dayFactor / 0.2);
    }

    this.skyShaderMat.uniforms.uSunPosition.value.copy(this.sunLight.position).normalize();
    this.skyShaderMat.uniforms.uSunElevation.value = normalizedElev;
    this.skyShaderMat.uniforms.uZenithColor.value.copy(currentZenith);
    this.skyShaderMat.uniforms.uHorizonColor.value.copy(currentHorizon);
    this.skyShaderMat.uniforms.uSunsetBlueGlow.value.copy(this.sunsetBlueGlow);
    this.skyShaderMat.uniforms.uSunsetFactor.value = sunsetFactor;
    this.skyShaderMat.uniforms.uDayFactor.value = dayFactor;

    // 7. Distance Fog Interpolation
    const currentFog = new THREE.Color();
    if (dayFactor > 0.35) {
      currentFog.copy(this.fogColorSunset).lerp(this.fogColorDay, (dayFactor - 0.35) / 0.65);
    } else {
      currentFog.copy(this.fogColorNight).lerp(this.fogColorSunset, dayFactor / 0.35);
    }
    // Blend in blue fog near sunset
    if (sunsetFactor > 0.4) {
      currentFog.lerp(this.sunsetDeepBlue, (sunsetFactor - 0.4) * 0.35);
    }

    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.copy(currentFog);
    }

    // 8. Stars & Celestial Deep Space (Brilliant through Mars' ultra-thin atmosphere at night)
    const starMat = this.starfield.material as THREE.PointsMaterial;
    const nightFactor = Math.pow(1.0 - dayFactor, 1.8);
    starMat.opacity = nightFactor * 0.95;
    (this.milkyWayMesh.material as THREE.MeshBasicMaterial).opacity = nightFactor * 0.72;

    const earthMat = (this.earthMesh.children[1] as THREE.Mesh).material as THREE.MeshBasicMaterial;
    earthMat.opacity = nightFactor * 0.9;
  }
}
