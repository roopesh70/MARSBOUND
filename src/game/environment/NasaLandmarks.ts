import * as THREE from 'three';
import { JezeroTerrain } from '../terrain/JezeroTerrain';

export class NasaLandmarks {
  public group: THREE.Group;
  private ingenuityRotorTop: THREE.Group;
  private ingenuityRotorBottom: THREE.Group;

  constructor(scene: THREE.Scene, terrain: JezeroTerrain) {
    this.group = new THREE.Group();

    // 1. Ingenuity Mars Helicopter at Wright Brothers Field (22, 12)
    const ingenuity = this.createIngenuityHelicopter(22, 12, terrain);
    this.group.add(ingenuity.mesh);
    this.ingenuityRotorTop = ingenuity.rotorTop;
    this.ingenuityRotorBottom = ingenuity.rotorBottom;

    // 2. Three Forks Titanium Sample Tubes Depot (-35, -25)
    const sampleTubes = this.createThreeForksSampleDepot(-35, -25, terrain);
    this.group.add(sampleTubes);

    // 3. Cheyava Falls "Leopard Spots" Outcrop (-145, -90)
    const cheyavaFalls = this.createCheyavaFallsOutcrop(-145, -90, terrain);
    this.group.add(cheyavaFalls);

    // 4. Mount Washburn Atoko Point White Anorthosite Boulder (-130, -145)
    const atokoPoint = this.createAtokoPointBoulder(-130, -145, terrain);
    this.group.add(atokoPoint);

    // 5. Sky Crane Descent Stage Touchdown Blast Mark (-24, 18)
    const blastMark = this.createSkyCraneBlastMark(-24, 18, terrain);
    this.group.add(blastMark);

    scene.add(this.group);
  }

  /**
   * 3D Procedural model of NASA's Ingenuity Mars Helicopter
   */
  private createIngenuityHelicopter(
    x: number,
    z: number,
    terrain: JezeroTerrain
  ): { mesh: THREE.Group; rotorTop: THREE.Group; rotorBottom: THREE.Group } {
    const group = new THREE.Group();
    const y = terrain.getElevationAt(x, z);
    group.position.set(x, y, z);

    // Materials
    const goldFoilMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.35
    });
    const carbonFiberMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.2,
      roughness: 0.6
    });
    const solarPanelMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.7,
      roughness: 0.25
    });

    // 1. Fuselage Avionics Box
    const boxGeom = new THREE.BoxGeometry(0.5, 0.45, 0.5);
    const box = new THREE.Mesh(boxGeom, goldFoilMat);
    box.position.y = 0.55;
    box.castShadow = true;
    group.add(box);

    // 2. Rotor Mast
    const mastGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 12);
    const mast = new THREE.Mesh(mastGeom, carbonFiberMat);
    mast.position.y = 0.95;
    mast.castShadow = true;
    group.add(mast);

    // 3. Solar Panel atop mast
    const panelGeom = new THREE.BoxGeometry(0.7, 0.02, 0.35);
    const panel = new THREE.Mesh(panelGeom, solarPanelMat);
    panel.position.y = 1.28;
    panel.castShadow = true;
    group.add(panel);

    // 4. Counter-rotating carbon fiber rotor blades
    const rotorTop = new THREE.Group();
    rotorTop.position.y = 1.15;
    const bladeGeom = new THREE.BoxGeometry(1.6, 0.015, 0.08);
    const blade1 = new THREE.Mesh(bladeGeom, carbonFiberMat);
    blade1.castShadow = true;
    rotorTop.add(blade1);
    group.add(rotorTop);

    const rotorBottom = new THREE.Group();
    rotorBottom.position.y = 0.95;
    const blade2 = new THREE.Mesh(bladeGeom, carbonFiberMat);
    blade2.rotation.y = Math.PI / 2;
    blade2.castShadow = true;
    rotorBottom.add(blade2);
    group.add(rotorBottom);

    // 5. Four Carbon Fiber Landing Legs
    const legGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8);
    legGeom.rotateZ(Math.PI / 4);

    const legAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    legAngles.forEach((angle) => {
      const leg = new THREE.Mesh(legGeom, carbonFiberMat);
      leg.position.set(Math.cos(angle) * 0.3, 0.3, Math.sin(angle) * 0.3);
      leg.rotation.y = angle;
      leg.castShadow = true;
      group.add(leg);

      // Footpad
      const padGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 8);
      const pad = new THREE.Mesh(padGeom, carbonFiberMat);
      pad.position.set(Math.cos(angle) * 0.52, 0.01, Math.sin(angle) * 0.52);
      group.add(pad);
    });

    return { mesh: group, rotorTop, rotorBottom };
  }

  /**
   * Three Forks Sample Depot: 10 Hermetically sealed titanium sample tubes
   */
  private createThreeForksSampleDepot(x: number, z: number, terrain: JezeroTerrain): THREE.Group {
    const group = new THREE.Group();
    const y = terrain.getElevationAt(x, z);
    group.position.set(x, y + 0.02, z);

    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.95,
      roughness: 0.18
    });
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.5,
      roughness: 0.3
    });

    const tubeGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12);
    tubeGeom.rotateZ(Math.PI / 2);

    // Scatter 10 sample tubes in a drop pattern
    for (let i = 0; i < 10; i++) {
      const tubeGroup = new THREE.Group();
      const tube = new THREE.Mesh(tubeGeom, titaniumMat);
      tube.castShadow = true;
      tubeGroup.add(tube);

      // End caps
      const capGeom = new THREE.SphereGeometry(0.042, 8, 8);
      const cap1 = new THREE.Mesh(capGeom, sealMat);
      cap1.position.x = 0.23;
      tubeGroup.add(cap1);

      const cap2 = new THREE.Mesh(capGeom, sealMat);
      cap2.position.x = -0.23;
      tubeGroup.add(cap2);

      // Place along a gentle zigzag traverse
      const offsetX = (i % 5) * 1.8 - 3.6 + (Math.random() - 0.5) * 0.4;
      const offsetZ = Math.floor(i / 5) * 2.2 - 1.1 + (Math.random() - 0.5) * 0.4;
      tubeGroup.position.set(offsetX, 0.04, offsetZ);
      tubeGroup.rotation.y = Math.random() * Math.PI;

      group.add(tubeGroup);
    }

    return group;
  }

  /**
   * Cheyava Falls "Leopard Spots" Mudstone Outcrop:
   * Reddish sedimentary rock with white calcium sulfate veins & dark reduction halos
   */
  private createCheyavaFallsOutcrop(x: number, z: number, terrain: JezeroTerrain): THREE.Group {
    const group = new THREE.Group();
    const y = terrain.getElevationAt(x, z);
    group.position.set(x, y, z);

    // 1. Layered Mudstone Bedrock Slabs
    const slabMat = new THREE.MeshStandardMaterial({
      color: 0x943d26,
      roughness: 0.92,
      metalness: 0.08,
      flatShading: true
    });
    const slabGeom = new THREE.BoxGeometry(4.5, 0.7, 3.2);
    const slab = new THREE.Mesh(slabGeom, slabMat);
    slab.position.y = 0.35;
    slab.rotation.set(0.08, 0.25, -0.05);
    slab.castShadow = true;
    slab.receiveShadow = true;
    group.add(slab);

    // 2. White Calcium Sulfate Gypsum Veins
    const veinMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.7,
      metalness: 0.1
    });
    const veinGeom = new THREE.BoxGeometry(4.2, 0.06, 0.12);
    const vein1 = new THREE.Mesh(veinGeom, veinMat);
    vein1.position.set(0, 0.68, 0.3);
    vein1.rotation.y = 0.15;
    group.add(vein1);

    const vein2 = new THREE.Mesh(veinGeom, veinMat);
    vein2.position.set(-0.2, 0.68, -0.4);
    vein2.rotation.y = -0.22;
    group.add(vein2);

    // 3. Leopard Spots (Millimeter-scale iron-phosphate reaction rims)
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917, // Dark black-green iron-phosphate rim
      roughness: 0.8
    });
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xdbeafe, // Pale sulfate inner core
      roughness: 0.6
    });

    for (let i = 0; i < 14; i++) {
      const spotGroup = new THREE.Group();
      const halo = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 12), haloMat);
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.025, 12), coreMat);
      spotGroup.add(halo);
      spotGroup.add(core);

      spotGroup.position.set(
        (Math.random() - 0.5) * 3.2,
        0.72,
        (Math.random() - 0.5) * 2.2
      );
      group.add(spotGroup);
    }

    // 4. Sample Core Abrasion Patch & Drill Hole (Sample MB-11)
    const drillHoleGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16);
    const drillHoleMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
    const drillHole = new THREE.Mesh(drillHoleGeom, drillHoleMat);
    drillHole.position.set(0.8, 0.68, 0);
    group.add(drillHole);

    return group;
  }

  /**
   * Atoko Point: Exotic white speckled crystalline anorthosite crust boulder
   */
  private createAtokoPointBoulder(x: number, z: number, terrain: JezeroTerrain): THREE.Group {
    const group = new THREE.Group();
    const y = terrain.getElevationAt(x, z);
    group.position.set(x, y, z);

    // Striking pale crystalline anorthosite rock contrasting with dark basalt
    const anorthositeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.82,
      metalness: 0.12,
      flatShading: true
    });
    const boulderGeom = new THREE.DodecahedronGeometry(1.6, 1);
    const boulder = new THREE.Mesh(boulderGeom, anorthositeMat);
    boulder.position.y = 0.9;
    boulder.scale.set(1.1, 0.85, 0.95);
    boulder.castShadow = true;
    boulder.receiveShadow = true;
    group.add(boulder);

    // Surrounding dark basalt slope rocks
    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0x3d1d12,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true
    });
    for (let i = 0; i < 6; i++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.4, 1), basaltMat);
      const angle = (i / 6) * Math.PI * 2;
      rock.position.set(Math.cos(angle) * 2.2, 0.25, Math.sin(angle) * 2.2);
      rock.castShadow = true;
      group.add(rock);
    }

    return group;
  }

  /**
   * Octavia E. Butler Landing Site: Sky Crane rocket descent blast mark
   */
  private createSkyCraneBlastMark(x: number, z: number, terrain: JezeroTerrain): THREE.Group {
    const group = new THREE.Group();
    const y = terrain.getElevationAt(x, z);
    group.position.set(x, y + 0.03, z);

    // Radial blast circle where dust was swept away
    const blastGeom = new THREE.RingGeometry(0.5, 9.0, 32);
    blastGeom.rotateX(-Math.PI / 2);
    const blastMat = new THREE.MeshBasicMaterial({
      color: 0x3f1f14,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const blastMesh = new THREE.Mesh(blastGeom, blastMat);
    group.add(blastMesh);

    // Historic Plaque Marker
    const plaquePole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 })
    );
    plaquePole.position.y = 0.6;
    plaquePole.castShadow = true;
    group.add(plaquePole);

    const plaqueBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.4, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 })
    );
    plaqueBoard.position.set(0, 1.1, 0);
    plaqueBoard.castShadow = true;
    group.add(plaqueBoard);

    return group;
  }

  public update(time: number) {
    // Subtle idle rotation of Ingenuity's counter-rotating blades
    if (this.ingenuityRotorTop && this.ingenuityRotorBottom) {
      this.ingenuityRotorTop.rotation.y = time * 2.5;
      this.ingenuityRotorBottom.rotation.y = -time * 2.5;
    }
  }
}
