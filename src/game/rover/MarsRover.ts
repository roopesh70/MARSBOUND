import * as THREE from 'three';
import { JezeroTerrain } from '../terrain/JezeroTerrain';
import { BuildingCollisionSystem } from '../environment/BuildingCollisionSystem';

interface WheelAssembly {
  pivot: THREE.Group;
  wheelMesh: THREE.Mesh;
  localX: number;
  localZ: number;
  isSteerable: boolean;
  steerMultiplier: number; // 1.0 for front, -0.75 for rear (counter-steer), 0 for middle
}

interface DustParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
}

export class MarsRover {
  public group: THREE.Group;
  public position: THREE.Vector3;
  public rotationY = 0;
  public pitch = 0;
  public roll = 0;
  public velocity = 0;
  public maxSpeed = 16.5; // m/s (~60 km/h for rapid planetary traverse)
  public reverseSpeed = 6.0; // m/s
  public acceleration = 12.0; // m/s^2
  public braking = 22.0;
  public turnSpeed = 1.85;
  public steerAngle = 0;

  public isOccupied = false;
  public battery = 100;
  public batteryCapacityWh = 45000;
  public headlightsOn = true;
  public wheelRadius = 0.65;

  // Wheel and Suspension Rigging
  private wheelAssemblies: WheelAssembly[] = [];
  private headlights: THREE.SpotLight[] = [];
  private taillights: THREE.Mesh[] = [];
  private rimfaxRadarLight: THREE.SpotLight | null = null;

  // Wheel Dust Plume Particle System
  public wheelDustMesh: THREE.Points;
  private maxDustParticles = 140;
  private dustPool: DustParticle[] = [];
  private dustPositions: Float32Array;

  // Regolith Tire Tracks System
  public tireTracksMesh: THREE.InstancedMesh;
  private maxTrackSegments = 160;
  private trackIndex = 0;
  private lastTrackDist = 0;
  private dummyTrack = new THREE.Object3D();

  constructor(scene: THREE.Scene, terrain: JezeroTerrain, initialPos = { x: -8, z: 18 }) {
    this.group = new THREE.Group();
    const groundY = terrain.getElevationAt(initialPos.x, initialPos.z);
    this.position = new THREE.Vector3(initialPos.x, groundY + 1.25, initialPos.z);
    this.group.position.copy(this.position);

    // ==========================================
    // 1. HIGH-TECH PLANETARY ROVER CHASSIS & HULL
    // ==========================================

    // A. Main Titanium & Multi-Layer Insulation (MLI) Lower Chassis
    const lowerChassisGeom = new THREE.BoxGeometry(3.0, 1.1, 4.8);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.32,
      metalness: 0.65
    });
    const lowerChassis = new THREE.Mesh(lowerChassisGeom, chassisMat);
    lowerChassis.position.y = 0.45;
    lowerChassis.castShadow = true;
    lowerChassis.receiveShadow = true;
    this.group.add(lowerChassis);

    // B. Gold Kapton Foil Thermal Shielding Wrap (Underbody & Flanks)
    const goldFoilMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.88
    });
    const flankLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.75, 4.2), goldFoilMat);
    flankLeft.position.set(-1.52, 0.45, 0.1);
    this.group.add(flankLeft);

    const flankRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.75, 4.2), goldFoilMat);
    flankRight.position.set(1.52, 0.45, 0.1);
    this.group.add(flankRight);

    // Underbody belly pan
    const bellyPan = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.15, 4.4), goldFoilMat);
    bellyPan.position.set(0, -0.05, 0);
    this.group.add(bellyPan);

    // C. Pressurized Explorer Cockpit Cabin & Gold UV Tinted Dome
    const cockpitGeom = new THREE.BoxGeometry(2.8, 0.95, 2.1);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x162c4a,
      roughness: 0.08,
      metalness: 0.94,
      emissive: 0x071526,
      emissiveIntensity: 0.45
    });
    const cockpit = new THREE.Mesh(cockpitGeom, glassMat);
    cockpit.position.set(0, 1.25, -1.15);
    cockpit.castShadow = true;
    this.group.add(cockpit);

    // Cockpit structural roll-cage framing
    const rollCageMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const rollBarA = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.85), rollCageMat);
    rollBarA.rotateZ(Math.PI / 2);
    rollBarA.position.set(0, 1.74, -2.15);
    this.group.add(rollBarA);

    const rollBarB = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.85), rollCageMat);
    rollBarB.rotateZ(Math.PI / 2);
    rollBarB.position.set(0, 1.74, -0.15);
    this.group.add(rollBarB);

    // D. High-Efficiency Triple-Junction Solar Roof Array
    const roofGeom = new THREE.BoxGeometry(2.9, 0.06, 2.7);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x0f2744,
      roughness: 0.18,
      metalness: 0.92
    });
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.position.set(0, 1.25, 1.05);
    roof.castShadow = true;
    this.group.add(roof);

    // Solar panel gold border framing
    const roofBorder = new THREE.Mesh(new THREE.BoxGeometry(2.96, 0.04, 2.76), goldFoilMat);
    roofBorder.position.set(0, 1.22, 1.05);
    this.group.add(roofBorder);

    // E. Heavy-Duty Forward Bull-Bar Bumper & Dual Stereo Hazcams
    const bumperGeom = new THREE.BoxGeometry(3.1, 0.28, 0.35);
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.75, roughness: 0.35 });
    const frontBumper = new THREE.Mesh(bumperGeom, darkMetalMat);
    frontBumper.position.set(0, 0.32, -2.55);
    this.group.add(frontBumper);

    // Forward Stereo Hazcams
    const hazcamMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2, metalness: 0.9 });
    const hazcamL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.12), hazcamMat);
    hazcamL.position.set(-0.65, 0.35, -2.72);
    this.group.add(hazcamL);
    const hazcamR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.12), hazcamMat);
    hazcamR.position.set(0.65, 0.35, -2.72);
    this.group.add(hazcamR);

    // Rear Bumper
    const rearBumper = new THREE.Mesh(bumperGeom, darkMetalMat);
    rearBumper.position.set(0, 0.32, 2.55);
    this.group.add(rearBumper);

    // ==========================================
    // 2. REMOTE SENSING MAST (MASTCAM-Z & SUPERCAM)
    // ==========================================
    const rsmGroup = new THREE.Group();
    rsmGroup.position.set(-0.95, 1.0, -1.8);

    // Carbon fiber mast pole
    const mastPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.07, 1.6, 12),
      new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.5 })
    );
    mastPole.position.y = 0.8;
    mastPole.castShadow = true;
    rsmGroup.add(mastPole);

    // Mastcam-Z head crossbar
    const mastHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.22, 0.24),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.6, roughness: 0.3 })
    );
    mastHead.position.y = 1.65;
    rsmGroup.add(mastHead);

    // Dual Mastcam-Z stereo camera lenses
    const lensGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.14, 16);
    lensGeom.rotateX(Math.PI / 2);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });

    const lensL = new THREE.Mesh(lensGeom, lensMat);
    lensL.position.set(-0.18, 1.65, -0.16);
    rsmGroup.add(lensL);

    const lensR = new THREE.Mesh(lensGeom, lensMat);
    lensR.position.set(0.18, 1.65, -0.16);
    rsmGroup.add(lensR);

    // SuperCam Laser Spectrometer Central Lens
    const superCamLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.16, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, emissive: 0xb45309, emissiveIntensity: 0.6 })
    );
    superCamLens.geometry.rotateX(Math.PI / 2);
    superCamLens.position.set(0, 1.76, -0.16);
    rsmGroup.add(superCamLens);

    // MEDA wind sensor booms
    const boomGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.4);
    boomGeom.rotateZ(Math.PI / 2);
    const boomL = new THREE.Mesh(boomGeom, darkMetalMat);
    boomL.position.set(-0.35, 1.45, 0);
    rsmGroup.add(boomL);

    this.group.add(rsmGroup);

    // ==========================================
    // 3. ARTICULATED ROBOTIC SCIENCE ARM (TURRET)
    // ==========================================
    const armGroup = new THREE.Group();
    armGroup.position.set(1.05, 0.6, -2.1);

    // Shoulder joint
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), darkMetalMat);
    armGroup.add(shoulder);

    // Upper arm
    const upperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.25 })
    );
    upperArm.position.set(0.1, 0.28, -0.18);
    upperArm.rotation.set(0.6, 0.3, 0);
    armGroup.add(upperArm);

    // Elbow joint & Forearm pointing down
    const forearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 })
    );
    forearm.position.set(0.2, 0.45, -0.55);
    forearm.rotation.set(-0.4, 0.2, 0);
    armGroup.add(forearm);

    // Science Turret & Coring Drill head
    const turretHead = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.32), darkMetalMat);
    turretHead.position.set(0.25, 0.3, -0.85);
    armGroup.add(turretHead);

    const drillBit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.035, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 })
    );
    drillBit.geometry.rotateX(Math.PI / 2);
    drillBit.position.set(0.25, 0.24, -1.05);
    armGroup.add(drillBit);

    this.group.add(armGroup);

    // ==========================================
    // 4. REAR MMRTG & HIGH-GAIN DISH ANTENNA
    // ==========================================
    // MMRTG (Radioisotope Thermoelectric Generator) Power Unit
    const mmrtgGroup = new THREE.Group();
    mmrtgGroup.position.set(0, 0.75, 2.5);

    const mmrtgCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 1.1, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 })
    );
    mmrtgCylinder.rotateX(Math.PI / 2);
    mmrtgCylinder.castShadow = true;
    mmrtgGroup.add(mmrtgCylinder);

    // Radial heat dissipation cooling fins
    const finMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    for (let f = 0; f < 8; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.95, 1.05), finMat);
      fin.rotation.z = (f * Math.PI) / 4;
      mmrtgGroup.add(fin);
    }
    this.group.add(mmrtgGroup);

    // High-Gain Antenna (HGA) Parabolic Dish
    const hgaGroup = new THREE.Group();
    hgaGroup.position.set(0.85, 1.35, 1.8);

    const hgaMast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7), darkMetalMat);
    hgaMast.position.y = 0.35;
    hgaGroup.add(hgaMast);

    const dishGeom = new THREE.SphereGeometry(0.48, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.2,
      metalness: 0.7,
      side: THREE.DoubleSide
    });
    const dish = new THREE.Mesh(dishGeom, dishMat);
    dish.rotation.x = Math.PI / 3.5;
    dish.position.set(0, 0.75, 0);
    hgaGroup.add(dish);

    const feedHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25), goldFoilMat);
    feedHorn.position.set(0, 0.85, 0.12);
    feedHorn.rotation.x = Math.PI / 3.5;
    hgaGroup.add(feedHorn);

    this.group.add(hgaGroup);

    // ==========================================
    // 4B. RIMFAX SUBSURFACE RADAR ANTENNA ARRAY
    // ==========================================
    const rimfaxGroup = new THREE.Group();
    rimfaxGroup.position.set(0, 0.15, 2.3);

    // Crossbar mount
    const crossbar = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.08, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 })
    );
    rimfaxGroup.add(crossbar);

    // Dual downward-facing dipole bowtie radar antennas
    const antMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.2
    });
    const antL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.3), antMat);
    antL.position.set(-0.45, -0.05, 0);
    rimfaxGroup.add(antL);

    const antR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.3), antMat);
    antR.position.set(0.45, -0.05, 0);
    rimfaxGroup.add(antR);

    // Downward radar pulse ground illuminator
    const radarSpot = new THREE.SpotLight(0x38bdf8, 2.5, 8.0, Math.PI / 4, 0.6, 1.5);
    radarSpot.position.set(0, -0.1, 0);
    radarSpot.target.position.set(0, -3.0, 0);
    rimfaxGroup.add(radarSpot);
    rimfaxGroup.add(radarSpot.target);
    this.rimfaxRadarLight = radarSpot;

    this.group.add(rimfaxGroup);

    // ==========================================
    // 5. ROCKER-BOGIE SUSPENSION & MACHINED WHEELS
    // ==========================================
    // 6 Rocker-Bogie Off-Road Wheels with Titanium Grousers (Cleats)
    const wheelRadius = 0.65;
    const wheelWidth = 0.62;
    const wheelBaseGeom = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24);
    wheelBaseGeom.rotateZ(Math.PI / 2);

    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x2b3340,
      roughness: 0.65,
      metalness: 0.65
    });

    const wheelRimMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.85
    });

    // Wheel definitions with 4-corner Ackermann steering
    const wheelConfigs = [
      { id: 'FL', x: -1.9, z: -1.8, isSteerable: true, steerMultiplier: 1.0 },
      { id: 'FR', x: 1.9, z: -1.8, isSteerable: true, steerMultiplier: 1.0 },
      { id: 'ML', x: -2.0, z: 0.0, isSteerable: false, steerMultiplier: 0 },
      { id: 'MR', x: 2.0, z: 0.0, isSteerable: false, steerMultiplier: 0 },
      { id: 'RL', x: -1.9, z: 1.8, isSteerable: true, steerMultiplier: -0.75 }, // Counter-steer
      { id: 'RR', x: 1.9, z: 1.8, isSteerable: true, steerMultiplier: -0.75 }  // Counter-steer
    ];

    for (const cfg of wheelConfigs) {
      const pivot = new THREE.Group();
      pivot.position.set(cfg.x, -0.4, cfg.z);

      // Wheel assembly
      const wheelGroup = new THREE.Group();
      const wheelMesh = new THREE.Mesh(wheelBaseGeom, wheelMat);
      wheelMesh.castShadow = true;
      wheelGroup.add(wheelMesh);

      // Machined spiral flexure spokes & hub cap
      const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, wheelWidth + 0.04, 16), wheelRimMat);
      hubCap.rotateZ(Math.PI / 2);
      wheelGroup.add(hubCap);

      // Chevron grousers (cleats)
      const cleatGeom = new THREE.BoxGeometry(wheelWidth - 0.06, 0.06, 0.08);
      const cleatMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.4 });
      for (let c = 0; c < 12; c++) {
        const cleat = new THREE.Mesh(cleatGeom, cleatMat);
        const angle = (c * Math.PI * 2) / 12;
        cleat.position.set(0, Math.sin(angle) * (wheelRadius + 0.02), Math.cos(angle) * (wheelRadius + 0.02));
        cleat.rotation.x = angle;
        wheelGroup.add(cleat);
      }

      pivot.add(wheelGroup);

      // Suspension upright knuckle
      const knuckle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 0.22), darkMetalMat);
      knuckle.position.set(cfg.x > 0 ? -0.22 : 0.22, 0.28, 0);
      pivot.add(knuckle);

      this.group.add(pivot);

      this.wheelAssemblies.push({
        pivot,
        wheelMesh: wheelGroup as unknown as THREE.Mesh,
        localX: cfg.x,
        localZ: cfg.z,
        isSteerable: cfg.isSteerable,
        steerMultiplier: cfg.steerMultiplier
      });
    }

    // Rocker-Bogie Titanium Suspension Struts
    const strutMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.25 });

    // Left Rocker Arm
    const leftRocker = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.7), strutMat);
    leftRocker.position.set(-1.65, 0.15, -0.9);
    leftRocker.rotation.set(0.65, 0, 0);
    this.group.add(leftRocker);

    // Right Rocker Arm
    const rightRocker = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.7), strutMat);
    rightRocker.position.set(1.65, 0.15, -0.9);
    rightRocker.rotation.set(0.65, 0, 0);
    this.group.add(rightRocker);

    // Left Bogie Arm (linking mid and rear)
    const leftBogie = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.1), strutMat);
    leftBogie.position.set(-1.68, -0.05, 0.9);
    leftBogie.rotation.set(-0.55, 0, 0);
    this.group.add(leftBogie);

    // Right Bogie Arm
    const rightBogie = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.1), strutMat);
    rightBogie.position.set(1.68, -0.05, 0.9);
    rightBogie.rotation.set(-0.55, 0, 0);
    this.group.add(rightBogie);

    // ==========================================
    // 6. DUAL HIGH-INTENSITY LED HEADLIGHTS & TAILLIGHTS
    // ==========================================
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lampGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.12, 16);
    lampGeom.rotateX(Math.PI / 2);

    const leftLamp = new THREE.Mesh(lampGeom, headlightMat);
    leftLamp.position.set(-1.05, 0.55, -2.52);
    this.group.add(leftLamp);

    const rightLamp = new THREE.Mesh(lampGeom, headlightMat);
    rightLamp.position.set(1.05, 0.55, -2.52);
    this.group.add(rightLamp);

    const leftSpot = new THREE.SpotLight(0xfffaed, 4.5, 95, Math.PI / 3.5, 0.35, 1.2);
    leftSpot.position.copy(leftLamp.position);
    leftSpot.target.position.set(-1.05, -0.6, -40);
    this.group.add(leftSpot);
    this.group.add(leftSpot.target);
    this.headlights.push(leftSpot);

    const rightSpot = new THREE.SpotLight(0xfffaed, 4.5, 95, Math.PI / 3.5, 0.35, 1.2);
    rightSpot.position.copy(rightLamp.position);
    rightSpot.target.position.set(1.05, -0.6, -40);
    this.group.add(rightSpot);
    this.group.add(rightSpot.target);
    this.headlights.push(rightSpot);

    // Rear Red Taillights / Brake Indicators
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tailGeom = new THREE.BoxGeometry(0.24, 0.12, 0.05);

    const tailL = new THREE.Mesh(tailGeom, tailMat);
    tailL.position.set(-1.1, 0.55, 2.54);
    this.group.add(tailL);
    this.taillights.push(tailL);

    const tailR = new THREE.Mesh(tailGeom, tailMat);
    tailR.position.set(1.1, 0.55, 2.54);
    this.group.add(tailR);
    this.taillights.push(tailR);

    // ==========================================
    // 7. REGOLITH TIRE TRACK SYSTEM
    // ==========================================
    // Instanced dual tire tread marks pressed into the Martian sand
    const trackGeom = new THREE.PlaneGeometry(0.55, 1.1);
    trackGeom.rotateX(-Math.PI / 2);
    const trackMat = new THREE.MeshBasicMaterial({
      color: 0x782813,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    this.tireTracksMesh = new THREE.InstancedMesh(trackGeom, trackMat, this.maxTrackSegments);
    // Hide initially below ground
    for (let t = 0; t < this.maxTrackSegments; t++) {
      this.dummyTrack.position.set(0, -999, 0);
      this.dummyTrack.updateMatrix();
      this.tireTracksMesh.setMatrixAt(t, this.dummyTrack.matrix);
    }
    this.tireTracksMesh.instanceMatrix.needsUpdate = true;
    scene.add(this.tireTracksMesh);

    // ==========================================
    // 8. WHEEL DUST PLUME PARTICLE SYSTEM
    // ==========================================
    const dustGeom = new THREE.BufferGeometry();
    this.dustPositions = new Float32Array(this.maxDustParticles * 3);
    for (let i = 0; i < this.maxDustParticles; i++) {
      this.dustPositions[i * 3 + 0] = 0;
      this.dustPositions[i * 3 + 1] = -999;
      this.dustPositions[i * 3 + 2] = 0;
      this.dustPool.push({
        x: 0,
        y: -999,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 1
      });
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(this.dustPositions, 3));

    const dustMat = new THREE.PointsMaterial({
      color: 0xc46b41,
      size: 0.85,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.wheelDustMesh = new THREE.Points(dustGeom, dustMat);
    scene.add(this.wheelDustMesh);

    scene.add(this.group);
  }

  public update(
    delta: number,
    terrain: JezeroTerrain,
    inputs: { forward: boolean; backward: boolean; left: boolean; right: boolean; brake: boolean; boost?: boolean },
    collisionSystem?: BuildingCollisionSystem
  ) {
    const dt = Math.min(delta, 0.08);

    if (this.isOccupied) {
      // 1. Smooth Ackermann Steering Dynamics
      if (inputs.left) {
        this.steerAngle = Math.min(0.62, this.steerAngle + dt * 3.2);
      } else if (inputs.right) {
        this.steerAngle = Math.max(-0.62, this.steerAngle - dt * 3.2);
      } else {
        this.steerAngle *= 0.78;
        if (Math.abs(this.steerAngle) < 0.01) this.steerAngle = 0;
      }

      // Rotate vehicle heading when moving or pivoting
      if (Math.abs(this.velocity) > 0.05) {
        const turnDirection = this.velocity > 0 ? 1 : -1;
        // High speed causes slight slip, low speed pivots sharply
        const speedFactor = Math.max(0.4, 1.0 - (Math.abs(this.velocity) / this.maxSpeed) * 0.45);
        this.rotationY += this.steerAngle * this.turnSpeed * dt * turnDirection * speedFactor;
      }

      // 2. Realistic Low-Gravity Acceleration, Torque Curve & Braking
      const currentMaxSpeed = inputs.boost ? this.maxSpeed * 1.35 : this.maxSpeed;
      const currentAccel = inputs.boost ? this.acceleration * 1.3 : this.acceleration;

      if (inputs.forward) {
        // High initial electric torque, tapering off at top speed
        const torqueMult = Math.max(0.35, 1.0 - (this.velocity / currentMaxSpeed) * 0.7);
        this.velocity = Math.min(currentMaxSpeed, this.velocity + currentAccel * torqueMult * dt);
        this.battery = Math.max(0, this.battery - dt * (inputs.boost ? 0.45 : 0.22));
      } else if (inputs.backward) {
        this.velocity = Math.max(-this.reverseSpeed, this.velocity - currentAccel * 0.8 * dt);
        this.battery = Math.max(0, this.battery - dt * 0.18);
      } else {
        // Rolling regolith resistance & mechanical drag
        this.velocity *= 0.94;
        if (Math.abs(this.velocity) < 0.04) this.velocity = 0;
      }

      // Handbrake / Emergency Stop
      if (inputs.brake) {
        this.velocity *= 0.72;
      }

      // Brighten taillights when braking
      const brakeColor = inputs.brake || (this.velocity < 0) ? 0xff2222 : 0x7f1d1d;
      for (const tail of this.taillights) {
        (tail.material as THREE.MeshBasicMaterial).color.setHex(brakeColor);
      }
    } else {
      // Passive braking when unmanned
      this.velocity *= 0.82;
      if (Math.abs(this.velocity) < 0.05) this.velocity = 0;
      // Solar trickle recharge under sun
      this.battery = Math.min(100, this.battery + dt * 0.08);
      this.steerAngle *= 0.8;
    }

    // 3. Move along forward heading (-Z in local frame)
    const forwardX = -Math.sin(this.rotationY);
    const forwardZ = -Math.cos(this.rotationY);

    this.position.x += forwardX * this.velocity * dt;
    this.position.z += forwardZ * this.velocity * dt;

    // Solid Building Collision check
    if (collisionSystem) {
      const collided = collisionSystem.resolveCollisions(this.position, 2.2);
      if (collided) {
        this.velocity = -this.velocity * 0.3; // Elastic bounce off structure walls
      }
    }

    // 4. FULL 6-WHEEL GROUND SAMPLING & TERRAIN CONFORMITY
    const cosY = Math.cos(this.rotationY);
    const sinY = Math.sin(this.rotationY);

    let totalGroundY = 0;
    const wheelGroundYs: number[] = [];

    // Sample terrain height under all 6 wheels
    for (const w of this.wheelAssemblies) {
      // Transform local wheel offset into world space coordinates
      const worldWX = this.position.x + w.localX * cosY + w.localZ * sinY;
      const worldWZ = this.position.z - w.localX * sinY + w.localZ * cosY;

      const surfaceElev = collisionSystem
        ? collisionSystem.getSurfaceElevation(worldWX, worldWZ).elevation
        : terrain.getElevationAt(worldWX, worldWZ);

      wheelGroundYs.push(surfaceElev);
      totalGroundY += surfaceElev;
    }

    const avgGroundY = totalGroundY / 6.0;
    this.position.y = avgGroundY + 1.25;

    // A. Pitch: Front wheels vs Rear wheels
    // Front: w0 (FL), w1 (FR); Rear: w4 (RL), w5 (RR)
    const frontGroundAvg = (wheelGroundYs[0] + wheelGroundYs[1]) / 2.0;
    const rearGroundAvg = (wheelGroundYs[4] + wheelGroundYs[5]) / 2.0;
    const terrainPitch = Math.atan2(frontGroundAvg - rearGroundAvg, 3.6);

    // B. Roll: Left wheels vs Right wheels
    // Left: w0 (FL), w2 (ML), w4 (RL); Right: w1 (FR), w3 (MR), w5 (RR)
    const leftGroundAvg = (wheelGroundYs[0] + wheelGroundYs[2] + wheelGroundYs[4]) / 3.0;
    const rightGroundAvg = (wheelGroundYs[1] + wheelGroundYs[3] + wheelGroundYs[5]) / 3.0;
    const terrainRoll = Math.atan2(rightGroundAvg - leftGroundAvg, 3.8);

    // C. Dynamic Suspension Inertia (Pitch heave on acceleration/braking & Body roll during turns)
    const accelPitch = (inputs.forward ? -0.06 : inputs.backward ? 0.05 : 0) * (Math.abs(this.velocity) / this.maxSpeed);
    const brakePitch = (inputs.brake ? 0.09 : 0) * (Math.abs(this.velocity) / this.maxSpeed);
    const cornerRoll = -(this.velocity / this.maxSpeed) * this.steerAngle * 0.08;

    const targetPitch = terrainPitch + accelPitch + brakePitch;
    const targetRoll = terrainRoll + cornerRoll;

    // Smooth spring damping for realistic chassis rocking
    this.pitch = THREE.MathUtils.damp(this.pitch, targetPitch, 8.5, dt);
    this.roll = THREE.MathUtils.damp(this.roll, targetRoll, 8.5, dt);

    this.group.position.copy(this.position);
    this.group.rotation.set(this.pitch, this.rotationY, this.roll, 'YXZ');

    // Pulse RIMFAX Subsurface Radar downward beam when active
    if (this.rimfaxRadarLight) {
      this.rimfaxRadarLight.intensity = this.isOccupied ? 2.2 + Math.sin(Date.now() * 0.008) * 0.8 : 0;
    }

    // 5. UPDATE WHEELS: INDEPENDENT SUSPENSION TRAVEL & 4-CORNER STEERING
    const wheelRotDelta = (this.velocity / this.wheelRadius) * dt;

    for (let i = 0; i < this.wheelAssemblies.length; i++) {
      const w = this.wheelAssemblies[i];

      // Steering rotation (front wheels turn into curve, rear wheels counter-steer)
      if (w.isSteerable) {
        w.pivot.rotation.y = this.steerAngle * w.steerMultiplier;
      }

      // Visual suspension travel: wheel moves up/down relative to chassis
      const groundOffset = wheelGroundYs[i] - avgGroundY;
      const targetLocalY = Math.max(-0.65, Math.min(-0.15, -0.4 + groundOffset * 0.45));
      w.pivot.position.y = THREE.MathUtils.damp(w.pivot.position.y, targetLocalY, 12, dt);

      // Spin wheel with driving speed
      w.wheelMesh.rotation.x += wheelRotDelta;
    }

    // 6. TIRE TRACK EMISSION
    if (Math.abs(this.velocity) > 0.6 && this.isOccupied) {
      this.lastTrackDist += Math.abs(this.velocity) * dt;
      if (this.lastTrackDist >= 1.4) {
        this.lastTrackDist = 0;
        this.dropTireTrackPair(terrain, cosY, sinY);
      }
    }

    // 7. WHEEL DUST PLUMES EMISSION & UPDATE
    this.updateWheelDust(dt, terrain);
  }

  /**
   * Drops dual chevron tire track impressions in the regolith behind left and right wheels
   */
  private dropTireTrackPair(
    terrain: JezeroTerrain,
    cosY: number,
    sinY: number
  ) {
    const leftOffset = -1.9;
    const rightOffset = 1.9;
    const rearOffset = 1.6;

    // Left track
    const leftX = this.position.x + leftOffset * cosY + rearOffset * sinY;
    const leftZ = this.position.z - leftOffset * sinY + rearOffset * cosY;
    const leftY = terrain.getElevationAt(leftX, leftZ) + 0.035;

    this.dummyTrack.position.set(leftX, leftY, leftZ);
    this.dummyTrack.rotation.set(this.pitch, this.rotationY, this.roll, 'YXZ');
    this.dummyTrack.updateMatrix();
    this.tireTracksMesh.setMatrixAt(this.trackIndex % this.maxTrackSegments, this.dummyTrack.matrix);

    // Right track
    const rightX = this.position.x + rightOffset * cosY + rearOffset * sinY;
    const rightZ = this.position.z - rightOffset * sinY + rearOffset * cosY;
    const rightY = terrain.getElevationAt(rightX, rightZ) + 0.035;

    this.dummyTrack.position.set(rightX, rightY, rightZ);
    this.dummyTrack.rotation.set(this.pitch, this.rotationY, this.roll, 'YXZ');
    this.dummyTrack.updateMatrix();
    this.tireTracksMesh.setMatrixAt((this.trackIndex + 1) % this.maxTrackSegments, this.dummyTrack.matrix);

    this.trackIndex = (this.trackIndex + 2) % this.maxTrackSegments;
    this.tireTracksMesh.instanceMatrix.needsUpdate = true;
  }

  /**
   * Generates low-gravity billowing dust plumes trailing behind driving wheels
   */
  private updateWheelDust(dt: number, terrain: JezeroTerrain) {
    const isMoving = Math.abs(this.velocity) > 0.8;
    const forwardX = -Math.sin(this.rotationY);
    const forwardZ = -Math.cos(this.rotationY);

    if (isMoving && this.isOccupied) {
      // Spawn dust from rear and middle wheels
      const spawnCount = Math.abs(this.velocity) > 8 ? 2 : 1;
      for (let s = 0; s < spawnCount; s++) {
        const inactive = this.dustPool.find((p) => p.life >= p.maxLife || p.y < -900);
        if (inactive) {
          const side = Math.random() > 0.5 ? 1 : -1;
          const wheelRearDist = Math.random() * 1.6 + 0.8;
          inactive.x = this.position.x - forwardX * wheelRearDist + side * 1.85 * Math.cos(this.rotationY);
          inactive.z = this.position.z - forwardZ * wheelRearDist - side * 1.85 * Math.sin(this.rotationY);
          const groundY = terrain.getElevationAt(inactive.x, inactive.z);
          inactive.y = groundY + 0.15;

          // Velocity: kickback opposite to travel direction + upward low-G puff
          const speedFactor = this.velocity / this.maxSpeed;
          inactive.vx = -forwardX * speedFactor * 2.8 + (Math.random() - 0.5) * 1.4;
          inactive.vy = Math.random() * 1.5 + 0.7;
          inactive.vz = -forwardZ * speedFactor * 2.8 + (Math.random() - 0.5) * 1.4;
          inactive.life = 0;
          inactive.maxLife = 0.85 + Math.random() * 0.65;
        }
      }
    }

    // Update active dust particles
    for (let i = 0; i < this.maxDustParticles; i++) {
      const p = this.dustPool[i];
      if (p.life < p.maxLife && p.y > -900) {
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;

        // Mars low-gravity (3.71 m/s^2) causes dust to linger longer before settling
        p.vy -= 1.6 * dt;
        p.vx *= 0.96;
        p.vz *= 0.96;

        this.dustPositions[i * 3 + 0] = p.x;
        this.dustPositions[i * 3 + 1] = p.y;
        this.dustPositions[i * 3 + 2] = p.z;
      } else {
        this.dustPositions[i * 3 + 1] = -999;
      }
    }

    this.wheelDustMesh.geometry.attributes.position.needsUpdate = true;
  }

  public getSpeedKmh(): number {
    return Math.abs(this.velocity * 3.6);
  }

  public distanceTo(pos: { x: number; z: number }): number {
    const dx = this.position.x - pos.x;
    const dz = this.position.z - pos.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  public setHeadlights(on: boolean) {
    this.headlightsOn = on;
    const intensity = on ? 4.5 : 0;
    for (const spot of this.headlights) {
      spot.intensity = intensity;
    }
  }

  public toggleHeadlights(): boolean {
    this.setHeadlights(!this.headlightsOn);
    return this.headlightsOn;
  }
}
