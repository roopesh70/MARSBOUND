import * as THREE from 'three';
import { JezeroTerrain } from '../terrain/JezeroTerrain';

export class MarsLibraryBuilding {
  public group: THREE.Group;
  public position: THREE.Vector3;
  public entrancePosition: THREE.Vector3;
  public interactionRadius = 8.5; // meters

  // Animated elements - Exterior
  private holoMarsSphere: THREE.Mesh;
  private holoOrbitRing1: THREE.Mesh;
  private holoOrbitRing2: THREE.Mesh;
  private satelliteDish1: THREE.Group;
  private satelliteDish2: THREE.Group;
  private terminalPromptMesh: THREE.Mesh;
  private beaconLight: THREE.PointLight;
  private timeAccumulator = 0;

  // Animated elements - Interior
  private interiorHoloMars: THREE.Mesh | null = null;
  private interiorHoloGrid: THREE.Mesh | null = null;
  private interiorOrbitRing1: THREE.Mesh | null = null;
  private interiorOrbitRing2: THREE.Mesh | null = null;
  private interiorMoonPhobos: THREE.Mesh | null = null;
  private interiorMoonDeimos: THREE.Mesh | null = null;
  private vitrineSpecimen: THREE.Mesh | null = null;
  private vitrineLaserRing: THREE.Mesh | null = null;
  private interiorPromptMesh: THREE.Mesh | null = null;
  private floatingHudCards: THREE.Group[] = [];
  private serverLeds: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene, terrain: JezeroTerrain, coords = { x: 26, z: -26 }) {
    this.group = new THREE.Group();
    const groundY = terrain.getElevationAt(coords.x, coords.z);
    this.position = new THREE.Vector3(coords.x, groundY, coords.z);
    this.group.position.copy(this.position);

    // Orient grand entrance toward the spacious open base courtyard at (0, 10), completely clear of outpost buildings
    const targetCourtyard = { x: 0, z: 10 };
    const angleFacingCourtyard = Math.atan2(targetCourtyard.x - coords.x, targetCourtyard.z - coords.z);
    this.group.rotation.y = angleFacingCourtyard;

    // Entrance global coordinates (at the foot of the ground stairs)
    const localEntranceOffset = new THREE.Vector3(0, 0, 15.2);
    localEntranceOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleFacingCourtyard);
    this.entrancePosition = new THREE.Vector3(
      this.position.x + localEntranceOffset.x,
      this.position.y,
      this.position.z + localEntranceOffset.z
    );

    // 1. Shared High-Tech Materials
    const titaniumDarkMat = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      metalness: 0.85,
      roughness: 0.35
    });

    const titaniumLightMat = new THREE.MeshStandardMaterial({
      color: 0xd8e0e8,
      metalness: 0.65,
      roughness: 0.28
    });

    const solarGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0f2d59,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.88
    });

    const cyanEmissiveMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8
    });

    // 2. Foundation: Octagonal Multi-Tier Plinth & Deep Subterranean Anchor
    const baseGeom = new THREE.CylinderGeometry(10, 11.2, 3.8, 8);
    const baseMesh = new THREE.Mesh(baseGeom, titaniumDarkMat);
    baseMesh.position.y = -0.7; // Extends down to y = -2.6m to guarantee no floating plinth gaps
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);

    const subPlinthGeom = new THREE.CylinderGeometry(8.5, 9.8, 0.6, 8);
    const subPlinth = new THREE.Mesh(subPlinthGeom, titaniumLightMat);
    subPlinth.position.y = 1.5;
    subPlinth.castShadow = true;
    this.group.add(subPlinth);

    // 3. Grand Entrance Staircase & Elevated Landing Deck
    const landingDeckGeom = new THREE.BoxGeometry(5.2, 0.4, 2.2);
    const landingDeck = new THREE.Mesh(landingDeckGeom, titaniumLightMat);
    landingDeck.position.set(0, 1.6, 6.0);
    landingDeck.castShadow = true;
    landingDeck.receiveShadow = true;
    this.group.add(landingDeck);

    // Subterranean foundation depth for all stairs so steps anchor deep into bedrock
    const subterraneanDepth = 2.5; // meters underground

    // 9-Step Open Architectural Grand Staircase (climbing from ground lz = 13.8 to deck lz = 6.8, height 0 to 1.8m)
    const numSteps = 9;
    const stairStartLz = 13.8;
    const stairEndLz = 6.8;
    const totalRun = stairStartLz - stairEndLz; // 7.0m
    const stepDepth = totalRun / numSteps; // ~0.777m
    const totalRise = 1.8; // Climbs from ground 0m to deck 1.8m
    const stepHeightIncrement = totalRise / numSteps; // 0.20m standard rise

    for (let i = 0; i < numSteps; i++) {
      const stepIndex = i;
      const stepTopY = (stepIndex + 1) * stepHeightIncrement;
      const stepLz = stairStartLz - (stepIndex + 0.5) * stepDepth;
      const blockHeight = stepTopY + subterraneanDepth;

      // Solid step block extending down into bedrock (no floating underside)
      const stepGeom = new THREE.BoxGeometry(5.0, blockHeight, stepDepth + 0.05);
      const stepMesh = new THREE.Mesh(stepGeom, titaniumDarkMat);
      stepMesh.position.set(0, (stepTopY - subterraneanDepth) / 2, stepLz);
      stepMesh.castShadow = true;
      stepMesh.receiveShadow = true;
      this.group.add(stepMesh);

      // Metallic anti-slip tread plate top
      const plateGeom = new THREE.BoxGeometry(4.9, 0.03, stepDepth - 0.04);
      const plateMesh = new THREE.Mesh(plateGeom, titaniumLightMat);
      plateMesh.position.set(0, stepTopY + 0.015, stepLz);
      this.group.add(plateMesh);

      // Illuminated Neon Cyan Edge Bar on step lip (fully visible!)
      const neonLipGeom = new THREE.BoxGeometry(4.8, 0.04, 0.05);
      const neonLip = new THREE.Mesh(neonLipGeom, cyanEmissiveMat);
      neonLip.position.set(0, stepTopY + 0.02, stepLz + stepDepth / 2 - 0.01);
      this.group.add(neonLip);

      // Handrail Stanchions (every 2 steps and top step)
      if (i % 2 === 0 || i === numSteps - 1) {
        const postGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8);
        const postL = new THREE.Mesh(postGeom, titaniumLightMat);
        postL.position.set(-2.55, stepTopY + 0.45, stepLz);
        this.group.add(postL);

        const postR = new THREE.Mesh(postGeom, titaniumLightMat);
        postR.position.set(2.55, stepTopY + 0.45, stepLz);
        this.group.add(postR);
      }
    }

    // Ground Transition Apron Wedge (sloping seamlessly into the red regolith from lz = 13.8 to 15.2)
    const apronGeom = new THREE.BoxGeometry(5.2, 0.9, 1.4);
    apronGeom.rotateX(-0.1);
    const apronMesh = new THREE.Mesh(apronGeom, titaniumDarkMat);
    apronMesh.position.set(0, -0.3, 14.5);
    apronMesh.castShadow = true;
    apronMesh.receiveShadow = true;
    this.group.add(apronMesh);

    const apronPlateGeom = new THREE.BoxGeometry(5.0, 0.04, 1.35);
    apronPlateGeom.rotateX(-0.1);
    const apronPlate = new THREE.Mesh(apronPlateGeom, titaniumLightMat);
    apronPlate.position.set(0, -0.02, 14.5);
    this.group.add(apronPlate);

    const apronGlowGeom = new THREE.BoxGeometry(4.8, 0.04, 0.06);
    const apronGlow = new THREE.Mesh(apronGlowGeom, cyanEmissiveMat);
    apronGlow.position.set(0, -0.1, 15.15);
    this.group.add(apronGlow);

    // Continuous Sloped Illuminated Handrails (Left & Right - fully open and visible from the sides)
    const handrailLength = Math.hypot(totalRun, totalRise) + 0.8;
    const handrailAngle = Math.atan2(totalRise, totalRun);
    const handrailGeom = new THREE.CylinderGeometry(0.05, 0.05, handrailLength, 12);
    handrailGeom.rotateX(-Math.PI / 2 + handrailAngle);

    const handrailCenterY = totalRise / 2 + 0.9;
    const handrailCenterLz = (stairStartLz + stairEndLz) / 2;

    const handrailL = new THREE.Mesh(handrailGeom, cyanEmissiveMat);
    handrailL.position.set(-2.55, handrailCenterY, handrailCenterLz);
    this.group.add(handrailL);

    const handrailR = new THREE.Mesh(handrailGeom, cyanEmissiveMat);
    handrailR.position.set(2.55, handrailCenterY, handrailCenterLz);
    this.group.add(handrailR);

    // Welcoming Light Pylons at the Foot of the Stairs (lz = 15.0)
    const pylonGeom = new THREE.BoxGeometry(0.35, 1.8 + subterraneanDepth, 0.35);
    const pylonL = new THREE.Mesh(pylonGeom, titaniumDarkMat);
    pylonL.position.set(-2.85, (0.9 - subterraneanDepth) / 2, 15.0);
    this.group.add(pylonL);

    const pylonR = new THREE.Mesh(pylonGeom, titaniumDarkMat);
    pylonR.position.set(2.85, (0.9 - subterraneanDepth) / 2, 15.0);
    this.group.add(pylonR);

    // Glowing beacons atop light pylons
    const pylonBeaconGeom = new THREE.SphereGeometry(0.14, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pylonBeaconL = new THREE.Mesh(pylonBeaconGeom, beaconMat);
    pylonBeaconL.position.set(-2.85, 1.05, 15.0);
    this.group.add(pylonBeaconL);

    const pylonBeaconR = new THREE.Mesh(pylonBeaconGeom, beaconMat);
    pylonBeaconR.position.set(2.85, 1.05, 15.0);
    this.group.add(pylonBeaconR);
    pylonBeaconR.position.set(2.95, 1.25, 20.2);
    this.group.add(pylonBeaconR);

    // 4. Main Archival Rotunda Exterior Cylinder
    const rotundaGeom = new THREE.CylinderGeometry(7.2, 7.6, 5.2, 32);
    const rotunda = new THREE.Mesh(rotundaGeom, titaniumLightMat);
    rotunda.position.y = 4.4;
    rotunda.castShadow = true;
    rotunda.receiveShadow = true;
    this.group.add(rotunda);

    // Observation Panorama Window Band (Exterior)
    const windowBandGeom = new THREE.CylinderGeometry(7.25, 7.25, 1.4, 32, 1, true);
    const windowBandMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0369a1,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.9
    });
    const windowBand = new THREE.Mesh(windowBandGeom, windowBandMat);
    windowBand.position.y = 4.8;
    this.group.add(windowBand);

    // Vertical Structural Reinforcement Columns (12 columns)
    const colGeom = new THREE.BoxGeometry(0.4, 5.4, 0.5);
    for (let c = 0; c < 12; c++) {
      const angle = (c / 12) * Math.PI * 2;
      const col = new THREE.Mesh(colGeom, titaniumDarkMat);
      col.position.set(Math.cos(angle) * 7.4, 4.4, Math.sin(angle) * 7.4);
      col.rotation.y = -angle;
      col.castShadow = true;
      this.group.add(col);
    }

    // 5. Crown Geodesic Observatory Dome
    const domeGeom = new THREE.SphereGeometry(5.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeom, solarGlassMat);
    dome.position.y = 7.0;
    dome.castShadow = true;
    this.group.add(dome);

    // Geodesic Wireframe Trusses
    const domeWireframe = new THREE.Mesh(
      domeGeom,
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.35 })
    );
    domeWireframe.position.y = 7.01;
    this.group.add(domeWireframe);

    // Dome Pinnacle Collar
    const collarGeom = new THREE.CylinderGeometry(1.4, 1.8, 0.6, 16);
    const collar = new THREE.Mesh(collarGeom, titaniumDarkMat);
    collar.position.y = 12.8;
    this.group.add(collar);

    // 6. Rotating Holographic 3D Mars Globe above Exterior Dome
    const holoGroup = new THREE.Group();
    holoGroup.position.y = 14.8;

    const sphereGeom = new THREE.SphereGeometry(1.6, 24, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    this.holoMarsSphere = new THREE.Mesh(sphereGeom, sphereMat);
    holoGroup.add(this.holoMarsSphere);

    const coreGeom = new THREE.SphereGeometry(1.45, 24, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xa84323,
      emissive: 0xef4444,
      emissiveIntensity: 0.4,
      roughness: 0.8
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    holoGroup.add(core);

    const ring1Geom = new THREE.RingGeometry(2.2, 2.28, 48);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    this.holoOrbitRing1 = new THREE.Mesh(ring1Geom, ring1Mat);
    this.holoOrbitRing1.rotation.x = Math.PI / 2.3;
    holoGroup.add(this.holoOrbitRing1);

    const ring2Geom = new THREE.RingGeometry(2.9, 2.98, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    this.holoOrbitRing2 = new THREE.Mesh(ring2Geom, ring2Mat);
    this.holoOrbitRing2.rotation.x = Math.PI / 1.8;
    this.holoOrbitRing2.rotation.y = 0.3;
    holoGroup.add(this.holoOrbitRing2);

    this.group.add(holoGroup);

    this.beaconLight = new THREE.PointLight(0x38bdf8, 2.5, 18, 1.2);
    this.beaconLight.position.set(0, 15.0, 0);
    this.group.add(this.beaconLight);

    // 7. Dual Deep Space Satellite Uplink Dishes
    this.satelliteDish1 = this.createSatelliteDish();
    this.satelliteDish1.position.set(-5.5, 7.2, -3.2);
    this.satelliteDish1.rotation.y = -Math.PI / 3;
    this.group.add(this.satelliteDish1);

    this.satelliteDish2 = this.createSatelliteDish();
    this.satelliteDish2.position.set(5.5, 7.2, -3.2);
    this.satelliteDish2.rotation.y = Math.PI / 3;
    this.group.add(this.satelliteDish2);

    // 8. Front Airlock Entrance Portal & Open Gateway Corridor
    const airlockBoxGeom = new THREE.BoxGeometry(3.6, 3.4, 2.2);
    const airlockBox = new THREE.Mesh(airlockBoxGeom, titaniumDarkMat);
    airlockBox.position.set(0, 2.8, 6.8);
    airlockBox.castShadow = true;
    this.group.add(airlockBox);

    // Glowing Cyan Archway Frame around Exterior Portal
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 0.1), cyanEmissiveMat);
    archTop.position.set(0, 3.9, 7.92);
    this.group.add(archTop);

    const archLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, 0.1), cyanEmissiveMat);
    archLeft.position.set(-1.25, 2.7, 7.92);
    this.group.add(archLeft);

    const archRight = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, 0.1), cyanEmissiveMat);
    archRight.position.set(1.25, 2.7, 7.92);
    this.group.add(archRight);

    // Open Sliding Door Panels (retracted left and right so doorway is open to walk inside)
    const doorHalfGeom = new THREE.BoxGeometry(0.7, 2.2, 0.08);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.9,
      roughness: 0.3,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25
    });
    const doorL = new THREE.Mesh(doorHalfGeom, doorMat);
    doorL.position.set(-0.95, 2.7, 7.85);
    this.group.add(doorL);

    const doorR = new THREE.Mesh(doorHalfGeom, doorMat);
    doorR.position.set(0.95, 2.7, 7.85);
    this.group.add(doorR);

    // Illuminated Door Threshold Strip
    const doorThreshold = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.15), cyanEmissiveMat);
    doorThreshold.position.set(0, 1.82, 7.85);
    this.group.add(doorThreshold);

    // Procedural Canvas Signage: "NASA MARS ARCHIVAL LIBRARY"
    const signMesh = this.createArchivalSignMesh();
    signMesh.position.set(0, 4.4, 7.95);
    this.group.add(signMesh);

    // Interactive Exterior Terminal / Holo-Kiosk (on landing deck)
    const kioskGroup = new THREE.Group();
    kioskGroup.position.set(2.1, 1.8, 6.2);

    const kioskBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.1, 8), titaniumDarkMat);
    kioskBase.position.y = 0.55;
    kioskGroup.add(kioskBase);

    const consoleHeadGeom = new THREE.BoxGeometry(0.7, 0.5, 0.1);
    const consoleHead = new THREE.Mesh(consoleHeadGeom, titaniumDarkMat);
    consoleHead.position.set(0, 1.15, 0);
    consoleHead.rotation.x = -Math.PI / 4;
    kioskGroup.add(consoleHead);

    const ringGeom = new THREE.RingGeometry(0.8, 0.95, 24);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeom, cyanEmissiveMat);
    ringMesh.position.y = 0.05;
    kioskGroup.add(ringMesh);

    this.terminalPromptMesh = this.createTerminalPromptMesh();
    this.terminalPromptMesh.position.set(0, 1.9, 0);
    kioskGroup.add(this.terminalPromptMesh);

    this.group.add(kioskGroup);

    // Warm entrance exterior light
    const entranceLight = new THREE.PointLight(0x38bdf8, 1.8, 10, 1.5);
    entranceLight.position.set(0, 3.8, 8.2);
    this.group.add(entranceLight);

    // =========================================================================
    // 9. COMPLETE 3D HIGH-TECH INTERIOR ARCHITECTURE & PLANETARY RESEARCH HUB
    // =========================================================================
    this.buildInteriorArchitecture(titaniumDarkMat, titaniumLightMat, cyanEmissiveMat);

    scene.add(this.group);
  }

  /**
   * Constructs the complete high-fidelity 3D interior architecture:
   * - Solid double-sided inner rotunda wall with doorway opening
   * - Panoramic interior observation ribbon windows overlooking Jezero crater
   * - Polished obsidian carbon deck floor with glowing cyan circuitry
   * - Vaulted ceiling with illuminated oculus looking up into the glass dome
   * - Stepped central dais with master holographic Mars globe & floating telemetry HUDs
   * - 4 Specialized Perimeter Research Bays (Geology, Climate, PDS Server Bank, Specimen Vitrine)
   * - Illuminated digital bookshelves / data crystal stacks
   * - Soft ambient interior lighting & accent spotlights
   */
  private buildInteriorArchitecture(
    titaniumDarkMat: THREE.Material,
    titaniumLightMat: THREE.Material,
    cyanEmissiveMat: THREE.Material
  ) {
    const interiorGroup = new THREE.Group();

    // ---------------------------------------------------------
    // A. SOLID INNER ROTUNDA WALLS (Double-Sided Architectural Cladding)
    // ---------------------------------------------------------
    // Angular opening for the entrance door is centered at +z (theta = PI / 2).
    // Doorway opening arc = 0.44 rad (approx 3.1m clear opening at r = 7.0m).
    const doorwayArcHalf = 0.22;
    const innerWallStart = Math.PI / 2 + doorwayArcHalf;
    const innerWallLength = Math.PI * 2 - doorwayArcHalf * 2;

    const innerWallMat = new THREE.MeshStandardMaterial({
      color: 0x141a24,
      metalness: 0.75,
      roughness: 0.38,
      side: THREE.DoubleSide
    });

    const innerWallGeom = new THREE.CylinderGeometry(
      7.02,
      7.02,
      5.2,
      48,
      1,
      true,
      innerWallStart,
      innerWallLength
    );
    const innerWall = new THREE.Mesh(innerWallGeom, innerWallMat);
    innerWall.position.y = 4.4;
    innerWall.receiveShadow = true;
    interiorGroup.add(innerWall);

    // Baseboard trim molding along the inner floor perimeter
    const baseboardGeom = new THREE.CylinderGeometry(
      6.96,
      6.96,
      0.18,
      48,
      1,
      true,
      innerWallStart,
      innerWallLength
    );
    const baseboard = new THREE.Mesh(baseboardGeom, titaniumDarkMat);
    baseboard.position.y = 1.89;
    interiorGroup.add(baseboard);

    // Architectural horizontal glowing accent trim bands
    const trimYLevels = [2.4, 4.0, 5.6];
    for (const yLevel of trimYLevels) {
      const trimGeom = new THREE.CylinderGeometry(
        6.98,
        6.98,
        0.05,
        48,
        1,
        true,
        innerWallStart,
        innerWallLength
      );
      const trimMat = new THREE.MeshBasicMaterial({
        color: 0x0284c7,
        side: THREE.DoubleSide
      });
      const trimMesh = new THREE.Mesh(trimGeom, trimMat);
      trimMesh.position.y = yLevel;
      interiorGroup.add(trimMesh);
    }

    // ---------------------------------------------------------
    // B. PANORAMIC INTERIOR OBSERVATION WINDOWS (Eye-Level Ribbon)
    // ---------------------------------------------------------
    const innerWindowGeom = new THREE.CylinderGeometry(
      6.99,
      6.99,
      1.15,
      48,
      1,
      true,
      innerWallStart,
      innerWallLength
    );
    const innerWindowMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
      metalness: 0.95,
      roughness: 0.08,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide
    });
    const innerWindow = new THREE.Mesh(innerWindowGeom, innerWindowMat);
    innerWindow.position.y = 4.75;
    interiorGroup.add(innerWindow);

    // Interior titanium mullions dividing window bays
    for (let c = 1; c < 12; c++) {
      const angle = (c / 12) * Math.PI * 2;
      // Skip the entrance corridor opening
      if (Math.abs(angle - Math.PI / 2) < 0.3) continue;

      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.25, 0.12), titaniumDarkMat);
      mullion.position.set(Math.cos(angle) * 6.98, 4.75, Math.sin(angle) * 6.98);
      mullion.rotation.y = -angle;
      interiorGroup.add(mullion);
    }

    // ---------------------------------------------------------
    // C. AIRLOCK ENTRANCE TUNNEL & INNER PORTAL
    // ---------------------------------------------------------
    // Left inner corridor wall
    const corridorWallL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.8, 1.8), titaniumDarkMat);
    corridorWallL.position.set(-1.4, 3.2, 6.1);
    interiorGroup.add(corridorWallL);

    // Right inner corridor wall
    const corridorWallR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.8, 1.8), titaniumDarkMat);
    corridorWallR.position.set(1.4, 3.2, 6.1);
    interiorGroup.add(corridorWallR);

    // Corridor ceiling
    const corridorCeil = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.2, 1.8), titaniumDarkMat);
    corridorCeil.position.set(0, 4.5, 6.1);
    interiorGroup.add(corridorCeil);

    // Inner Airlock Archway Portal Frame (facing into the rotunda)
    const innerPortalTop = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 0.12), cyanEmissiveMat);
    innerPortalTop.position.set(0, 4.3, 5.25);
    interiorGroup.add(innerPortalTop);

    const innerPortalL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.6, 0.12), cyanEmissiveMat);
    innerPortalL.position.set(-1.35, 3.1, 5.25);
    interiorGroup.add(innerPortalL);

    const innerPortalR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.6, 0.12), cyanEmissiveMat);
    innerPortalR.position.set(1.35, 3.1, 5.25);
    interiorGroup.add(innerPortalR);

    // Airlock blue decontamination beam
    const decontamLight = new THREE.PointLight(0x38bdf8, 1.5, 6, 1.8);
    decontamLight.position.set(0, 3.8, 6.1);
    interiorGroup.add(decontamLight);

    // ---------------------------------------------------------
    // D. POLISHED OBSIDIAN CARBON FLOOR WITH GLOWING CIRCUITS
    // ---------------------------------------------------------
    // Master interior floor disc at y = 1.802m
    const floorGeom = new THREE.CircleGeometry(7.02, 48);
    floorGeom.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f1624,
      metalness: 0.88,
      roughness: 0.22
    });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.position.y = 1.802;
    floorMesh.receiveShadow = true;
    interiorGroup.add(floorMesh);

    // Concentric glowing cyan circuit conduit rings in floor
    const floorRings = [
      { rIn: 6.75, rOut: 6.82, col: 0x0284c7 },
      { rIn: 4.45, rOut: 4.52, col: 0x38bdf8 },
      { rIn: 2.38, rOut: 2.45, col: 0x0ea5e9 }
    ];
    for (const r of floorRings) {
      const ringGeom = new THREE.RingGeometry(r.rIn, r.rOut, 48);
      ringGeom.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({ color: r.col });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.y = 1.805;
      interiorGroup.add(ring);
    }

    // Inlaid entrance pathway stripes leading from airlock to central dais
    const runnerL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.01, 3.0), cyanEmissiveMat);
    runnerL.position.set(-0.9, 1.806, 3.9);
    interiorGroup.add(runnerL);

    const runnerR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.01, 3.0), cyanEmissiveMat);
    runnerR.position.set(0.9, 1.806, 3.9);
    interiorGroup.add(runnerR);

    // ---------------------------------------------------------
    // E. VAULTED INNER CEILING & ARCHITECTURAL OCULUS RING
    // ---------------------------------------------------------
    // Ceiling ring spanning from r = 2.6m to r = 7.02m at y = 7.0m
    const ceilingGeom = new THREE.RingGeometry(2.6, 7.02, 48);
    ceilingGeom.rotateX(Math.PI / 2);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x161e2e,
      metalness: 0.7,
      roughness: 0.45,
      side: THREE.DoubleSide
    });
    const ceiling = new THREE.Mesh(ceilingGeom, ceilingMat);
    ceiling.position.y = 7.0;
    interiorGroup.add(ceiling);

    // Glowing Halo Ring around the Central Oculus (y = 6.98m)
    const oculusHaloGeom = new THREE.RingGeometry(2.45, 2.62, 48);
    oculusHaloGeom.rotateX(Math.PI / 2);
    const oculusHaloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide
    });
    const oculusHalo = new THREE.Mesh(oculusHaloGeom, oculusHaloMat);
    oculusHalo.position.y = 6.98;
    interiorGroup.add(oculusHalo);

    // Radial structural ceiling ribs (8 beams connecting wall to oculus)
    const ribGeom = new THREE.BoxGeometry(0.18, 0.28, 4.4);
    for (let r = 0; r < 8; r++) {
      const angle = (r / 8) * Math.PI * 2;
      const rib = new THREE.Mesh(ribGeom, titaniumDarkMat);
      rib.position.set(Math.cos(angle) * 4.8, 6.9, Math.sin(angle) * 4.8);
      rib.rotation.y = -angle + Math.PI / 2;
      interiorGroup.add(rib);
    }

    // ---------------------------------------------------------
    // F. CENTRAL STEPPED DAIS & MASTER PLANETARY HOLOGRAM SYSTEM
    // ---------------------------------------------------------
    // Step 1: Base step ring (r = 2.5m, h = 0.15m, top y = 1.95m)
    const step1Geom = new THREE.CylinderGeometry(2.5, 2.55, 0.15, 36);
    const step1Mesh = new THREE.Mesh(step1Geom, titaniumDarkMat);
    step1Mesh.position.y = 1.875;
    step1Mesh.receiveShadow = true;
    interiorGroup.add(step1Mesh);

    // Step 2: Main raised dais deck (r = 2.3m, h = 0.2m, top surface y = 2.15m)
    const daisGeom = new THREE.CylinderGeometry(2.3, 2.3, 0.2, 36);
    const daisMat = new THREE.MeshStandardMaterial({
      color: 0x1a2232,
      metalness: 0.85,
      roughness: 0.3
    });
    const daisMesh = new THREE.Mesh(daisGeom, daisMat);
    daisMesh.position.y = 2.05;
    daisMesh.receiveShadow = true;
    interiorGroup.add(daisMesh);

    // Glowing cyan rim ring on dais deck edge
    const daisRimGeom = new THREE.RingGeometry(2.26, 2.31, 36);
    daisRimGeom.rotateX(-Math.PI / 2);
    const daisRim = new THREE.Mesh(daisRimGeom, cyanEmissiveMat);
    daisRim.position.y = 2.152;
    interiorGroup.add(daisRim);

    // Central inlaid compass rosette / mission star on dais floor
    const compassGeom = new THREE.RingGeometry(0.9, 0.96, 24);
    compassGeom.rotateX(-Math.PI / 2);
    const compassMesh = new THREE.Mesh(compassGeom, cyanEmissiveMat);
    compassMesh.position.y = 2.153;
    interiorGroup.add(compassMesh);

    // Master Projector Pedestal Column (y = 2.15 to 2.85m)
    const pedestalBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.72, 0.7, 16),
      titaniumDarkMat
    );
    pedestalBase.position.set(0, 2.5, 0);
    pedestalBase.castShadow = true;
    interiorGroup.add(pedestalBase);

    // Projector Emitter Collar & Lens
    const emitterCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.52, 0.12, 16),
      titaniumLightMat
    );
    emitterCollar.position.set(0, 2.88, 0);
    interiorGroup.add(emitterCollar);

    const emitterLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.05, 16),
      cyanEmissiveMat
    );
    emitterLens.position.set(0, 2.95, 0);
    interiorGroup.add(emitterLens);

    // Inverted Hologram Light Sheath Cone
    const holoConeGeom = new THREE.ConeGeometry(1.2, 1.1, 24, 1, true);
    holoConeGeom.rotateX(Math.PI);
    const holoConeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const holoCone = new THREE.Mesh(holoConeGeom, holoConeMat);
    holoCone.position.set(0, 3.48, 0);
    interiorGroup.add(holoCone);

    // Central Levitating 3D Holographic Mars Globe (Hovering at y = 4.1m)
    const marsHoloGroup = new THREE.Group();
    marsHoloGroup.position.set(0, 4.1, 0);

    // Mars surface sphere with warm terracotta tones
    const innerMarsGeom = new THREE.SphereGeometry(0.85, 32, 24);
    const innerMarsMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      emissive: 0x9a3412,
      emissiveIntensity: 0.35,
      roughness: 0.75,
      metalness: 0.15
    });
    this.interiorHoloMars = new THREE.Mesh(innerMarsGeom, innerMarsMat);
    marsHoloGroup.add(this.interiorHoloMars);

    // Outer cyan topographic coordinate wireframe grid
    const marsGridGeom = new THREE.SphereGeometry(0.89, 24, 16);
    const marsGridMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    this.interiorHoloGrid = new THREE.Mesh(marsGridGeom, marsGridMat);
    marsHoloGroup.add(this.interiorHoloGrid);

    // Orbital Ring 1: Phobos (inclination: 25°)
    const phobosOrbitGeom = new THREE.RingGeometry(1.3, 1.34, 48);
    const phobosOrbitMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    this.interiorOrbitRing1 = new THREE.Mesh(phobosOrbitGeom, phobosOrbitMat);
    this.interiorOrbitRing1.rotation.x = Math.PI / 2.3;
    marsHoloGroup.add(this.interiorOrbitRing1);

    // Moon Phobos Satellite Marker
    const phobosGeom = new THREE.SphereGeometry(0.065, 8, 8);
    const phobosMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    this.interiorMoonPhobos = new THREE.Mesh(phobosGeom, phobosMat);
    this.interiorMoonPhobos.position.set(1.32, 0, 0);
    this.interiorOrbitRing1.add(this.interiorMoonPhobos);

    // Orbital Ring 2: Deimos (inclination: 50°)
    const deimosOrbitGeom = new THREE.RingGeometry(1.72, 1.76, 48);
    const deimosOrbitMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    this.interiorOrbitRing2 = new THREE.Mesh(deimosOrbitGeom, deimosOrbitMat);
    this.interiorOrbitRing2.rotation.x = Math.PI / 1.7;
    this.interiorOrbitRing2.rotation.y = 0.4;
    marsHoloGroup.add(this.interiorOrbitRing2);

    // Moon Deimos Satellite Marker
    const deimosGeom = new THREE.SphereGeometry(0.045, 8, 8);
    const deimosMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    this.interiorMoonDeimos = new THREE.Mesh(deimosGeom, deimosMat);
    this.interiorMoonDeimos.position.set(1.74, 0, 0);
    this.interiorOrbitRing2.add(this.interiorMoonDeimos);

    interiorGroup.add(marsHoloGroup);

    // Floating Holographic Telemetry Cards around Mars Globe
    const cardData = [
      {
        title: 'PLANETARY METRICS',
        lines: ['RADIUS: 3,389.5 KM', 'MASS: 6.417x10²³ KG', 'GRAVITY: 3.72 M/S² (0.38G)', 'SOL: 24H 39M 35S'],
        pos: new THREE.Vector3(1.65, 4.25, 0),
        rotY: -Math.PI / 2
      },
      {
        title: 'ATMOSPHERE PROFILE',
        lines: ['PRESSURE: 6.10 HPA', 'COMPOSITION: 95.3% CO₂', '2.6% N₂ | 1.9% AR', 'SCALE HEIGHT: 11.1 KM'],
        pos: new THREE.Vector3(-1.65, 4.25, 0),
        rotY: Math.PI / 2
      },
      {
        title: 'JEZERO CRATER HABITAT',
        lines: ['COORDS: 18.38°N 77.58°E', 'ELEVATION: -2,568M', 'MISSION SOL: 142', 'ARCHIVE NODES: ONLINE'],
        pos: new THREE.Vector3(0, 4.35, -1.65),
        rotY: 0
      }
    ];

    for (const c of cardData) {
      const cardGroup = new THREE.Group();
      cardGroup.position.copy(c.pos);
      cardGroup.rotation.y = c.rotY;

      const cardTex = this.createHudCardTexture(c.title, c.lines);
      const cardMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.15, 0.72),
        new THREE.MeshBasicMaterial({
          map: cardTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9
        })
      );
      cardGroup.add(cardMesh);
      interiorGroup.add(cardGroup);
      this.floatingHudCards.push(cardGroup);
    }

    // Master Interactive Console on Dais (South side of dais, facing north)
    const daisConsole = new THREE.Group();
    daisConsole.position.set(0, 2.15, 1.45);

    const consolePillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.24, 0.85, 8),
      titaniumDarkMat
    );
    consolePillar.position.y = 0.425;
    daisConsole.add(consolePillar);

    const consoleScreenGeom = new THREE.BoxGeometry(0.8, 0.45, 0.08);
    const consoleScreen = new THREE.Mesh(consoleScreenGeom, titaniumDarkMat);
    consoleScreen.position.set(0, 0.9, 0);
    consoleScreen.rotation.x = -Math.PI / 4;
    daisConsole.add(consoleScreen);

    // Floating Master Holographic UI Prompt above Dais Console
    this.interiorPromptMesh = this.createInteriorTerminalPromptMesh();
    this.interiorPromptMesh.position.set(0, 1.55, 0);
    daisConsole.add(this.interiorPromptMesh);

    interiorGroup.add(daisConsole);

    // ---------------------------------------------------------
    // G. FOUR PERIMETER RESEARCH BAYS (Radius ~5.3m)
    // ---------------------------------------------------------
    // Bay 1: Planetary Geology Bay (Angle: +45° = PI/4)
    const bay1 = this.createGeologyBay(titaniumDarkMat, titaniumLightMat, cyanEmissiveMat);
    bay1.position.set(Math.cos(Math.PI / 4) * 5.25, 1.8, Math.sin(Math.PI / 4) * 5.25);
    bay1.rotation.y = -Math.PI / 4 - Math.PI / 2;
    interiorGroup.add(bay1);

    // Bay 2: Mars Climate & Weather Telemetry Bay (Angle: +135° = 3*PI/4)
    const bay2 = this.createClimateBay(titaniumDarkMat, titaniumLightMat, cyanEmissiveMat);
    bay2.position.set(Math.cos((3 * Math.PI) / 4) * 5.25, 1.8, Math.sin((3 * Math.PI) / 4) * 5.25);
    bay2.rotation.y = -(3 * Math.PI) / 4 - Math.PI / 2;
    interiorGroup.add(bay2);

    // Bay 3: NASA PDS Deep Space Archive Server Bank (Angle: -135° = 5*PI/4)
    const bay3 = this.createDataServerBay(titaniumDarkMat, titaniumLightMat, cyanEmissiveMat);
    bay3.position.set(Math.cos((5 * Math.PI) / 4) * 5.25, 1.8, Math.sin((5 * Math.PI) / 4) * 5.25);
    bay3.rotation.y = -(5 * Math.PI) / 4 - Math.PI / 2;
    interiorGroup.add(bay3);

    // Bay 4: Astrobiology & Sample Specimen Vitrine (Angle: -45° = 7*PI/4)
    const bay4 = this.createSpecimenBay(titaniumDarkMat, titaniumLightMat, cyanEmissiveMat);
    bay4.position.set(Math.cos((7 * Math.PI) / 4) * 5.25, 1.8, Math.sin((7 * Math.PI) / 4) * 5.25);
    bay4.rotation.y = -(7 * Math.PI) / 4 - Math.PI / 2;
    interiorGroup.add(bay4);

    // ---------------------------------------------------------
    // H. DIGITAL BOOKSTACKS & HOLOGRAPHIC DATA CRYSTALS
    // ---------------------------------------------------------
    // Placed along perimeter walls between research stations
    const bookStackAngles = [0, Math.PI, -Math.PI / 2];
    const shelfLabels = [
      'NASA SCIENTIFIC PUBLICATIONS & JOURNALS',
      'ROVER & ORBITER MISSION ARCHIVES',
      'MARTIAN CARTOGRAPHY & ATLAS VOLUMES'
    ];

    for (let s = 0; s < bookStackAngles.length; s++) {
      const angle = bookStackAngles[s];
      const shelf = this.createArchivalBookshelf(
        shelfLabels[s],
        titaniumDarkMat,
        titaniumLightMat,
        cyanEmissiveMat
      );
      shelf.position.set(Math.cos(angle) * 6.35, 1.8, Math.sin(angle) * 6.35);
      shelf.rotation.y = -angle + Math.PI / 2;
      interiorGroup.add(shelf);
    }

    // ---------------------------------------------------------
    // I. ERGONOMIC SCI-FI READING BENCHES
    // ---------------------------------------------------------
    const benchAngles = [Math.PI / 6, (5 * Math.PI) / 6];
    for (const bAngle of benchAngles) {
      const bench = this.createSciFiBench(titaniumDarkMat, titaniumLightMat);
      bench.position.set(Math.cos(bAngle) * 4.4, 1.8, Math.sin(bAngle) * 4.4);
      bench.rotation.y = -bAngle + Math.PI / 2;
      interiorGroup.add(bench);
    }

    // ---------------------------------------------------------
    // J. INTERIOR LIGHTING & SCI-FI ATMOSPHERE
    // ---------------------------------------------------------
    // Central warm ambient point light ensuring full visibility
    const mainWarmLight = new THREE.PointLight(0xfff7ed, 2.2, 18, 1.2);
    mainWarmLight.position.set(0, 5.4, 0);
    interiorGroup.add(mainWarmLight);

    // Cyan spotlight from oculus directly onto central Mars globe
    const centralSpot = new THREE.SpotLight(0x38bdf8, 3.2, 14, Math.PI / 3.5, 0.35);
    centralSpot.position.set(0, 6.8, 0);
    centralSpot.target.position.set(0, 2.15, 0);
    interiorGroup.add(centralSpot);
    interiorGroup.add(centralSpot.target);

    // Dedicated task accent lights at the 4 research stations
    const bayLightPositions = [
      new THREE.Vector3(Math.cos(Math.PI / 4) * 4.6, 3.8, Math.sin(Math.PI / 4) * 4.6),
      new THREE.Vector3(Math.cos((3 * Math.PI) / 4) * 4.6, 3.8, Math.sin((3 * Math.PI) / 4) * 4.6),
      new THREE.Vector3(Math.cos((5 * Math.PI) / 4) * 4.6, 3.8, Math.sin((5 * Math.PI) / 4) * 4.6),
      new THREE.Vector3(Math.cos((7 * Math.PI) / 4) * 4.6, 3.8, Math.sin((7 * Math.PI) / 4) * 4.6)
    ];
    for (const pos of bayLightPositions) {
      const bLight = new THREE.PointLight(0x38bdf8, 1.2, 7, 1.8);
      bLight.position.copy(pos);
      interiorGroup.add(bLight);
    }

    this.group.add(interiorGroup);
  }

  /**
   * Bay 1: Planetary Geology & Stratigraphy Console
   */
  private createGeologyBay(
    darkMat: THREE.Material,
    _lightMat: THREE.Material,
    cyanMat: THREE.Material
  ): THREE.Group {
    const bay = new THREE.Group();

    // Curved desk workstation
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.8), darkMat);
    deskTop.position.set(0, 0.85, 0);
    bay.add(deskTop);

    const deskLegL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.75), darkMat);
    deskLegL.position.set(-1.0, 0.425, 0);
    bay.add(deskLegL);

    const deskLegR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.75), darkMat);
    deskLegR.position.set(1.0, 0.425, 0);
    bay.add(deskLegR);

    // Glowing front accent strip
    const frontGlow = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.04, 0.02), cyanMat);
    frontGlow.position.set(0, 0.83, 0.41);
    bay.add(frontGlow);

    // Main Stratigraphy Screen
    const stratTex = this.createGeologyScreenTexture();
    const mainScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.85),
      new THREE.MeshBasicMaterial({ map: stratTex, side: THREE.DoubleSide })
    );
    mainScreen.position.set(0, 1.5, -0.15);
    bay.add(mainScreen);

    // Overhead Bay Header Hologram
    const headerTex = this.createBayHeaderTexture('BAY 01: PLANETARY GEOLOGY & CORE ARCHIVE');
    const headerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 0.35),
      new THREE.MeshBasicMaterial({ map: headerTex, side: THREE.DoubleSide, transparent: true })
    );
    headerMesh.position.set(0, 2.35, -0.2);
    bay.add(headerMesh);

    return bay;
  }

  /**
   * Bay 2: Mars Climate & Real-Time Weather Console
   */
  private createClimateBay(
    darkMat: THREE.Material,
    _lightMat: THREE.Material,
    cyanMat: THREE.Material
  ): THREE.Group {
    const bay = new THREE.Group();

    // Curved desk workstation
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.8), darkMat);
    deskTop.position.set(0, 0.85, 0);
    bay.add(deskTop);

    const deskLegL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.75), darkMat);
    deskLegL.position.set(-1.0, 0.425, 0);
    bay.add(deskLegL);

    const deskLegR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.75), darkMat);
    deskLegR.position.set(1.0, 0.425, 0);
    bay.add(deskLegR);

    const frontGlow = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.04, 0.02), cyanMat);
    frontGlow.position.set(0, 0.83, 0.41);
    bay.add(frontGlow);

    // Live PSG / MEDA Climate Screen
    const weatherTex = this.createWeatherScreenTexture();
    const mainScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.85),
      new THREE.MeshBasicMaterial({ map: weatherTex, side: THREE.DoubleSide })
    );
    mainScreen.position.set(0, 1.5, -0.15);
    bay.add(mainScreen);

    // Overhead Bay Header Hologram
    const headerTex = this.createBayHeaderTexture('BAY 02: NASA PSG / MEDA CLIMATE TELEMETRY');
    const headerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 0.35),
      new THREE.MeshBasicMaterial({ map: headerTex, side: THREE.DoubleSide, transparent: true })
    );
    headerMesh.position.set(0, 2.35, -0.2);
    bay.add(headerMesh);

    return bay;
  }

  /**
   * Bay 3: NASA PDS Deep Space Archive Server Bank
   */
  private createDataServerBay(
    darkMat: THREE.Material,
    lightMat: THREE.Material,
    cyanMat: THREE.Material
  ): THREE.Group {
    const bay = new THREE.Group();

    // Left Server Rack Tower (2.4m tall)
    const rackGeom = new THREE.BoxGeometry(0.95, 2.4, 0.75);
    const rackL = new THREE.Mesh(rackGeom, darkMat);
    rackL.position.set(-0.8, 1.2, -0.1);
    bay.add(rackL);

    // Right Server Rack Tower (2.4m tall)
    const rackR = new THREE.Mesh(rackGeom, darkMat);
    rackR.position.set(0.8, 1.2, -0.1);
    bay.add(rackR);

    // Server Faceplate status arrays with pulsing LEDs
    const ledGeom = new THREE.BoxGeometry(0.04, 0.04, 0.02);
    const ledColors = [0x10b981, 0x38bdf8, 0xf59e0b];

    for (let r = 0; r < 2; r++) {
      const rackX = r === 0 ? -0.8 : 0.8;
      for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 6; col++) {
          const colIndex = (row + col) % ledColors.length;
          const ledMat = new THREE.MeshBasicMaterial({ color: ledColors[colIndex] });
          const led = new THREE.Mesh(ledGeom, ledMat);
          led.position.set(rackX - 0.3 + col * 0.12, 0.35 + row * 0.16, 0.28);
          bay.add(led);
          this.serverLeds.push(led);
        }
      }
    }

    // Central Data Terminal Screen between racks
    const pdsTex = this.createPdsServerTexture();
    const centralScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 0.75),
      new THREE.MeshBasicMaterial({ map: pdsTex, side: THREE.DoubleSide })
    );
    centralScreen.position.set(0, 1.4, 0.2);
    bay.add(centralScreen);

    // Terminal console shelf below central screen
    const shelfMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.4), lightMat);
    shelfMesh.position.set(0, 0.9, 0.2);
    bay.add(shelfMesh);

    // Overhead Bay Header Hologram
    const headerTex = this.createBayHeaderTexture('BAY 03: NASA PDS DEEP SPACE ARCHIVE CLUSTER');
    const headerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.1, 0.35),
      new THREE.MeshBasicMaterial({ map: headerTex, side: THREE.DoubleSide, transparent: true })
    );
    headerMesh.position.set(0, 2.55, 0.1);
    bay.add(headerMesh);

    // Floor accent glow
    const floorGlow = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 0.08), cyanMat);
    floorGlow.position.set(0, 0.01, 0.35);
    bay.add(floorGlow);

    return bay;
  }

  /**
   * Bay 4: Astrobiology Specimen Vitrine & Levitation Chamber
   */
  private createSpecimenBay(
    darkMat: THREE.Material,
    _lightMat: THREE.Material,
    cyanMat: THREE.Material
  ): THREE.Group {
    const bay = new THREE.Group();

    // Central Hexagonal Display Plinth
    const plinthGeom = new THREE.CylinderGeometry(0.65, 0.75, 0.95, 6);
    const plinth = new THREE.Mesh(plinthGeom, darkMat);
    plinth.position.set(0, 0.475, 0);
    bay.add(plinth);

    // Glowing cyan plinth collar
    const collarGeom = new THREE.CylinderGeometry(0.66, 0.66, 0.06, 6);
    const collar = new THREE.Mesh(collarGeom, cyanMat);
    collar.position.set(0, 0.95, 0);
    bay.add(collar);

    // Transparent Cylindrical Containment Vitrine (Glass cylinder)
    const vitrineGeom = new THREE.CylinderGeometry(0.55, 0.55, 1.25, 24, 1, true);
    const vitrineMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide
    });
    const vitrineGlass = new THREE.Mesh(vitrineGeom, vitrineMat);
    vitrineGlass.position.set(0, 1.6, 0);
    bay.add(vitrineGlass);

    // Vitrine top cap
    const capGeom = new THREE.CylinderGeometry(0.6, 0.55, 0.1, 24);
    const cap = new THREE.Mesh(capGeom, darkMat);
    cap.position.set(0, 2.25, 0);
    bay.add(cap);

    // Levitating Jezero Delta Core Rock Sample
    const rockGeom = new THREE.DodecahedronGeometry(0.18, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0xa16207,
      roughness: 0.85,
      metalness: 0.15
    });
    this.vitrineSpecimen = new THREE.Mesh(rockGeom, rockMat);
    this.vitrineSpecimen.position.set(0, 1.6, 0);
    bay.add(this.vitrineSpecimen);

    // Oscillating Laser Scanning Ring inside Vitrine
    const laserRingGeom = new THREE.RingGeometry(0.24, 0.27, 32);
    laserRingGeom.rotateX(Math.PI / 2);
    const laserRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide
    });
    this.vitrineLaserRing = new THREE.Mesh(laserRingGeom, laserRingMat);
    this.vitrineLaserRing.position.set(0, 1.6, 0);
    bay.add(this.vitrineLaserRing);

    // Side Specimen Analysis Screen
    const specTex = this.createSpecimenScreenTexture();
    const specScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 0.7),
      new THREE.MeshBasicMaterial({ map: specTex, side: THREE.DoubleSide })
    );
    specScreen.position.set(1.1, 1.45, 0);
    specScreen.rotation.y = -Math.PI / 6;
    bay.add(specScreen);

    // Overhead Bay Header Hologram
    const headerTex = this.createBayHeaderTexture('BAY 04: ASTROBIOLOGY SPECIMEN REPOSITORY');
    const headerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.1, 0.35),
      new THREE.MeshBasicMaterial({ map: headerTex, side: THREE.DoubleSide, transparent: true })
    );
    headerMesh.position.set(0, 2.55, -0.1);
    bay.add(headerMesh);

    return bay;
  }

  /**
   * Digital Archival Bookshelf with Glowing Data Crystals
   */
  private createArchivalBookshelf(
    shelfTitle: string,
    darkMat: THREE.Material,
    lightMat: THREE.Material,
    cyanMat: THREE.Material
  ): THREE.Group {
    const shelfGroup = new THREE.Group();

    // Bookshelf outer frame (2.4m tall, 1.5m wide, 0.45m deep)
    const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 0.45), darkMat);
    frameL.position.set(-0.75, 1.2, 0);
    shelfGroup.add(frameL);

    const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 0.45), darkMat);
    frameR.position.set(0.75, 1.2, 0);
    shelfGroup.add(frameR);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.1, 0.45), darkMat);
    frameTop.position.set(0, 2.4, 0);
    shelfGroup.add(frameTop);

    // 4 Horizontal illuminated shelves
    const crystalColors = [0x38bdf8, 0xf59e0b, 0x10b981, 0xa855f7];
    const crystalGeom = new THREE.BoxGeometry(0.12, 0.28, 0.22);

    for (let s = 0; s < 4; s++) {
      const shelfY = 0.45 + s * 0.52;
      const shelfPlank = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.04, 0.42), lightMat);
      shelfPlank.position.set(0, shelfY, 0);
      shelfGroup.add(shelfPlank);

      // Glowing shelf lip line
      const lip = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.02, 0.02), cyanMat);
      lip.position.set(0, shelfY + 0.01, 0.21);
      shelfGroup.add(lip);

      // Data crystal blocks on each shelf
      for (let c = 0; c < 7; c++) {
        const color = crystalColors[(s * 2 + c) % crystalColors.length];
        const crystalMat = new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 0.65,
          roughness: 0.15,
          metalness: 0.85
        });
        const crystal = new THREE.Mesh(crystalGeom, crystalMat);
        crystal.position.set(-0.55 + c * 0.18, shelfY + 0.16, 0.02);
        shelfGroup.add(crystal);
      }
    }

    // Top illuminated archival category sign
    const signTex = this.createBookshelfSignTexture(shelfTitle);
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.28),
      new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide })
    );
    signMesh.position.set(0, 2.62, 0.05);
    shelfGroup.add(signMesh);

    return shelfGroup;
  }

  /**
   * Curved Futuristic Seating Bench
   */
  private createSciFiBench(darkMat: THREE.Material, lightMat: THREE.Material): THREE.Group {
    const bench = new THREE.Group();

    // Curved carbon fiber base
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 0.6), darkMat);
    baseMesh.position.y = 0.225;
    bench.add(baseMesh);

    // Ergonomic cushioned seat
    const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.08, 0.52), lightMat);
    seatMesh.position.y = 0.49;
    bench.add(seatMesh);

    // Low backrest
    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.4, 0.08), darkMat);
    backMesh.position.set(0, 0.72, -0.22);
    bench.add(backMesh);

    return bench;
  }

  // =========================================================================
  // PROCEDURAL CANVAS TEXTURE GENERATORS
  // =========================================================================

  /**
   * Geology Stratigraphy & Spectroscopy Screen Texture
   */
  private createGeologyScreenTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0a101d';
    ctx.fillRect(0, 0, 512, 320);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('JEZERO DELTA STRATIGRAPHY & CORE DATA', 20, 32);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 42);
    ctx.lineTo(492, 42);
    ctx.stroke();

    const layers = [
      { name: 'Kodiak Butte Fan (Sandstone)', color: '#b45309', h: 36 },
      { name: 'Berea Member (Mudstone/Clay)', color: '#78350f', h: 42 },
      { name: 'Belva Crater Impact Ejecta', color: '#9a3412', h: 34 },
      { name: 'Neretva Vallis Infill', color: '#c2410c', h: 38 },
      { name: 'Basal Carbonate (Biosignature)', color: '#047857', h: 44 }
    ];

    let curY = 56;
    for (const l of layers) {
      ctx.fillStyle = l.color;
      ctx.fillRect(25, curY, 250, l.h - 4);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(l.name, 35, curY + l.h / 2 + 4);
      curY += l.h;
    }

    // Right panel: PIXL Spectrometry
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(290, 56, 202, 190);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(290, 56, 202, 190);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('PIXL / SHERLOC SPECTRA', 300, 76);

    const minerals = [
      { name: 'Fe/Mg Smectites', pct: '94%', w: 110, col: '#34d399' },
      { name: 'Olivine Phenocrysts', pct: '88%', w: 102, col: '#fbbf24' },
      { name: 'Mg-Carbonate', pct: '79%', w: 92, col: '#38bdf8' },
      { name: 'Hydrated Silica', pct: '64%', w: 75, col: '#a78bfa' }
    ];

    let mY = 98;
    for (const m of minerals) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px monospace';
      ctx.fillText(m.name, 300, mY);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(300, mY + 4, 120, 8);
      ctx.fillStyle = m.col;
      ctx.fillRect(300, mY + 4, m.w, 8);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(m.pct, 445, mY + 12);
      mY += 32;
    }

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('● PIXL CORE SCAN VERIFIED [PERSEVERANCE PDS]', 20, 292);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  /**
   * NASA PSG / MEDA Live Climate Screen Texture
   */
  private createWeatherScreenTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#081325';
    ctx.fillRect(0, 0, 512, 320);

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('NASA PSG / MEDA REAL-TIME WEATHER', 20, 32);

    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 42);
    ctx.lineTo(492, 42);
    ctx.stroke();

    const telemetry = [
      { label: 'ATMOSPHERIC PRESSURE', val: '614 Pa (6.14 mbar)', sub: 'Diurnal: 590 - 640 Pa', col: '#38bdf8' },
      { label: 'AIR TEMPERATURE (1.5m)', val: '-21.4 °C (251.7 K)', sub: 'Min: -82.6°C | Max: -14.1°C', col: '#f59e0b' },
      { label: 'GROUND SURF. TEMP', val: '-18.2 °C', sub: 'Radiative cooling: Active', col: '#ef4444' },
      { label: 'DUST OPTICAL DEPTH', val: 'τ = 0.38', sub: 'Atmosphere: Clear-Nominal', col: '#eab308' },
      { label: 'WIND VELOCITY & DIR', val: '6.4 m/s @ 118° (ESE)', sub: 'Max Gust: 14.8 m/s', col: '#34d399' }
    ];

    let tY = 66;
    for (const t of telemetry) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText(t.label, 25, tY);

      ctx.fillStyle = t.col;
      ctx.font = 'bold 15px monospace';
      ctx.fillText(t.val, 25, tY + 18);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.fillText(t.sub, 260, tY + 18);

      tY += 38;
    }

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('● PSG GSFC ATMOSPHERIC SIMULATOR ONLINE • SOL 142', 20, 292);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  /**
   * NASA PDS Deep Space Data Archive Screen Texture
   */
  private createPdsServerTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#060d1a';
    ctx.fillRect(0, 0, 512, 320);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('NASA PDS DEEP SPACE ARCHIVE CLUSTER', 20, 32);

    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 42);
    ctx.lineTo(492, 42);
    ctx.stroke();

    const nodes = [
      { name: 'NODE-01: GEOSCIENCES', status: 'ONLINE / 1.4 PB', ping: '12ms' },
      { name: 'NODE-02: ATMOSPHERES', status: 'ONLINE / 820 TB', ping: '8ms' },
      { name: 'NODE-03: CARTOGRAPHY', status: 'ONLINE / 3.2 PB', ping: '16ms' },
      { name: 'NODE-04: IMAGING & PDS4', status: 'ONLINE / 4.8 PB', ping: '10ms' }
    ];

    let nY = 66;
    for (const n of nodes) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(25, nY, 462, 32);

      ctx.fillStyle = '#10b981';
      ctx.fillRect(25, nY, 6, 32);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(n.name, 40, nY + 20);

      ctx.fillStyle = '#34d399';
      ctx.fillText(n.status, 240, nY + 20);

      ctx.fillStyle = '#6ee7b7';
      ctx.fillText(n.ping, 430, nY + 20);

      nY += 40;
    }

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('● UPLINK SYNCHRONIZED: MRO ELECTRA / ODYSSEY X-BAND', 20, 292);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  /**
   * Astrobiology Specimen Screen Texture
   */
  private createSpecimenScreenTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0a101d';
    ctx.fillRect(0, 0, 512, 320);

    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('ASTROBIOLOGY SAMPLE #07: BEREA DELTA', 20, 32);

    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 42);
    ctx.lineTo(492, 42);
    ctx.stroke();

    const specs = [
      { k: 'COLLECTION SITE', v: 'Jezero Western Delta (Sol 882)' },
      { k: 'TUBE ID', v: 'TITANIUM RETRIEVAL TUBE #A-108' },
      { k: 'LITHOLOGY', v: 'Fine-grained laminated mudstone/carbonate' },
      { k: 'BIOSIGNATURE', v: 'Aromatic carbon detected (SHERLOC)' },
      { k: 'PRESERVATION', v: 'High (Lacustrine clay shale)' },
      { k: 'RETURN MISSION', v: 'NASA-ESA Mars Sample Return' }
    ];

    let sY = 70;
    for (const s of specs) {
      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(s.k + ':', 25, sY);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = '13px sans-serif';
      ctx.fillText(s.v, 175, sY);

      sY += 32;
    }

    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('● LEVITATION CONTAINMENT FIELD: 100% SECURE', 20, 292);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  /**
   * Floating Holographic Telemetry HUD Card Texture
   */
  private createHudCardTexture(title: string, lines: string[]): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(6, 12, 24, 0.88)';
    ctx.roundRect(4, 4, 248, 152, 12);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.roundRect(4, 4, 248, 152, 12);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(title, 14, 24);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath();
    ctx.moveTo(14, 30);
    ctx.lineTo(242, 30);
    ctx.stroke();

    let lY = 52;
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    for (const line of lines) {
      ctx.fillText(line, 14, lY);
      lY += 22;
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  /**
   * Overhead Research Bay Header Hologram Texture
   */
  private createBayHeaderTexture(title: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 90;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(10, 16, 30, 0.85)';
    ctx.roundRect(4, 4, 504, 82, 10);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.roundRect(4, 4, 504, 82, 10);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 48);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  /**
   * Bookshelf Category Header Texture
   */
  private createBookshelfSignTexture(title: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 96;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 96);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 504, 88);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 52);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  /**
   * Floating Holographic UI Prompt for Central Dais Console
   */
  private createInteriorTerminalPromptMesh(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(8, 14, 29, 0.92)';
    ctx.roundRect(4, 4, 376, 152, 16);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.roundRect(4, 4, 376, 152, 16);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 17px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('★ NASA MARS CENTRAL ARCHIVE ★', 192, 38);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('ACCESS ARCHIVE', 192, 78);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.fillText('CLIMATE • DATASETS • PAPERS • GALLERY', 192, 116);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const promptGeom = new THREE.PlaneGeometry(1.8, 0.75);
    const promptMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    return new THREE.Mesh(promptGeom, promptMat);
  }

  /**
   * Builds high-gain satellite communications dish
   */
  private createSatelliteDish(): THREE.Group {
    const dishGroup = new THREE.Group();

    // Dish Mast
    const mastGeom = new THREE.CylinderGeometry(0.12, 0.15, 1.4, 8);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const mast = new THREE.Mesh(mastGeom, mastMat);
    mast.position.y = 0.7;
    dishGroup.add(mast);

    // Parabolic Bowl
    const bowlGeom = new THREE.SphereGeometry(1.2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 3);
    const bowlMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.7,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const bowl = new THREE.Mesh(bowlGeom, bowlMat);
    bowl.position.set(0, 1.4, 0);
    bowl.rotation.x = Math.PI / 3;
    dishGroup.add(bowl);

    // Feedhorn & Red Beacon
    const hornGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
    const horn = new THREE.Mesh(hornGeom, mastMat);
    horn.position.set(0, 1.8, 0.5);
    horn.rotation.x = Math.PI / 3;
    dishGroup.add(horn);

    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    beacon.position.set(0, 2.1, 0.75);
    dishGroup.add(beacon);

    return dishGroup;
  }

  /**
   * Generates procedurally textured sign above entrance
   */
  private createArchivalSignMesh(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, 512, 128);

    // Glowing border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 504, 120);

    // Inner header
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('★ NASA MARS ARCHIVAL LIBRARY ★', 256, 42);

    // Subtitle
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('PLANETARY RESEARCH HUB', 256, 80);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('DATASETS • CLIMATE • PAPERS • GALLERY', 256, 108);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const signGeom = new THREE.PlaneGeometry(3.2, 0.8);
    const signMat = new THREE.MeshBasicMaterial({ map: texture });
    return new THREE.Mesh(signGeom, signMat);
  }

  /**
   * Generates floating holographic interaction prompt above kiosk
   */
  private createTerminalPromptMesh(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(8, 14, 29, 0.9)';
    ctx.roundRect(4, 4, 248, 120, 16);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.roundRect(4, 4, 248, 120, 16);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MARS LIBRARY', 128, 38);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('ACCESS ARCHIVE', 128, 72);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px sans-serif';
    ctx.fillText('CLICK / TAP TO ENTER', 128, 102);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const promptGeom = new THREE.PlaneGeometry(1.5, 0.75);
    const promptMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    return new THREE.Mesh(promptGeom, promptMat);
  }

  /**
   * Distance calculation from any world position to the Library
   */
  public distanceTo(pos: { x: number; z: number }): number {
    const dx = pos.x - this.position.x;
    const dz = pos.z - this.position.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  /**
   * Checks if player is close enough to interact with Library
   */
  public isPlayerNear(playerPos: { x: number; z: number }): boolean {
    return this.distanceTo(playerPos) <= this.interactionRadius;
  }

  /**
   * Frame-by-frame animation update in render loop
   */
  public update(delta: number) {
    this.timeAccumulator += delta;

    // 1. Exterior Hologram & Lighting Animations
    if (this.holoMarsSphere) {
      this.holoMarsSphere.rotation.y += delta * 0.45;
    }
    if (this.holoOrbitRing1) {
      this.holoOrbitRing1.rotation.z += delta * 0.6;
    }
    if (this.holoOrbitRing2) {
      this.holoOrbitRing2.rotation.z -= delta * 0.4;
    }
    if (this.terminalPromptMesh) {
      this.terminalPromptMesh.position.y = 1.9 + Math.sin(this.timeAccumulator * 2.5) * 0.08;
    }
    if (this.beaconLight) {
      this.beaconLight.intensity = 2.2 + Math.sin(this.timeAccumulator * 3.0) * 0.6;
    }
    if (this.satelliteDish1) {
      this.satelliteDish1.rotation.x = Math.sin(this.timeAccumulator * 0.15) * 0.1;
    }
    if (this.satelliteDish2) {
      this.satelliteDish2.rotation.x = -Math.sin(this.timeAccumulator * 0.15) * 0.1;
    }

    // 2. Interior Central Mars Hologram & Satellites Animation
    if (this.interiorHoloMars) {
      this.interiorHoloMars.rotation.y += delta * 0.35;
    }
    if (this.interiorHoloGrid) {
      this.interiorHoloGrid.rotation.y += delta * 0.25;
      this.interiorHoloGrid.rotation.x += delta * 0.08;
    }
    if (this.interiorOrbitRing1) {
      this.interiorOrbitRing1.rotation.z += delta * 0.75;
    }
    if (this.interiorOrbitRing2) {
      this.interiorOrbitRing2.rotation.z -= delta * 0.45;
    }

    // 3. Floating Telemetry Cards gentle bob
    for (let i = 0; i < this.floatingHudCards.length; i++) {
      const card = this.floatingHudCards[i];
      card.position.y = 4.25 + Math.sin(this.timeAccumulator * 1.8 + i * 1.5) * 0.06;
    }

    // 4. Dais Central Prompt gentle bob
    if (this.interiorPromptMesh) {
      this.interiorPromptMesh.position.y = 1.55 + Math.sin(this.timeAccumulator * 2.2) * 0.05;
    }

    // 5. Astrobiology Rock Specimen Levitation & Laser Scanning
    if (this.vitrineSpecimen) {
      this.vitrineSpecimen.rotation.y += delta * 0.75;
      this.vitrineSpecimen.rotation.x += delta * 0.35;
      this.vitrineSpecimen.position.y = 1.6 + Math.sin(this.timeAccumulator * 2.0) * 0.04;
    }
    if (this.vitrineLaserRing) {
      this.vitrineLaserRing.position.y = 1.6 + Math.sin(this.timeAccumulator * 3.2) * 0.18;
    }

    // 6. Server LED Banks subtle activity cycling
    if (this.serverLeds.length > 0) {
      const step = Math.floor(this.timeAccumulator * 10) % this.serverLeds.length;
      for (let s = 0; s < 5; s++) {
        const targetLed = this.serverLeds[(step + s * 13) % this.serverLeds.length];
        if (targetLed && targetLed.material instanceof THREE.MeshBasicMaterial) {
          targetLed.material.color.setHex((step + s) % 2 === 0 ? 0x38bdf8 : 0x10b981);
        }
      }
    }
  }
}
