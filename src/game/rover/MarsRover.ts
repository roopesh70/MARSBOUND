import * as THREE from 'three';
import { JezeroTerrain } from '../terrain/JezeroTerrain';

export class MarsRover {
  public group: THREE.Group;
  public position: THREE.Vector3;
  public rotationY = 0;
  public velocity = 0;
  public maxSpeed = 16.5; // m/s (~60 km/h for swift planetary transit)
  public reverseSpeed = 6.0; // m/s
  public acceleration = 12.0; // m/s^2
  public braking = 20.0;
  public turnSpeed = 1.8;
  public steerAngle = 0;

  public isOccupied = false;
  public battery = 100;
  public batteryCapacityWh = 45000;
  public headlightsOn = true;

  private wheels: THREE.Mesh[] = [];
  private headlights: THREE.SpotLight[] = [];
  private cabinMesh: THREE.Mesh;

  constructor(scene: THREE.Scene, terrain: JezeroTerrain, initialPos = { x: -8, z: 18 }) {
    this.group = new THREE.Group();
    const groundY = terrain.getElevationAt(initialPos.x, initialPos.z);
    this.position = new THREE.Vector3(initialPos.x, groundY + 1.2, initialPos.z);
    this.group.position.copy(this.position);

    // 1. Rover Main Cabin & Chassis
    const chassisGeom = new THREE.BoxGeometry(3.2, 1.4, 5.0);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.35,
      metalness: 0.7
    });
    const chassis = new THREE.Mesh(chassisGeom, chassisMat);
    chassis.position.y = 0.5;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    this.group.add(chassis);

    // 2. Cockpit Canopy Window (tinted gold reflective glass)
    const glassGeom = new THREE.BoxGeometry(2.8, 0.9, 1.8);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x1d3557,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x0a192f,
      emissiveIntensity: 0.4
    });
    this.cabinMesh = new THREE.Mesh(glassGeom, glassMat);
    this.cabinMesh.position.set(0, 1.2, -1.4);
    this.group.add(this.cabinMesh);

    // 3. Solar Roof Panel
    const roofGeom = new THREE.BoxGeometry(2.9, 0.08, 3.2);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x0f2744,
      roughness: 0.2,
      metalness: 0.9
    });
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.position.set(0, 1.25, 0.8);
    this.group.add(roof);

    // 4. Six Rocker-Bogie Off-Road Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.6, 20);
    wheelGeom.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.9,
      metalness: 0.3
    });

    const wheelOffsets = [
      { x: -1.9, z: -1.8 },
      { x: 1.9, z: -1.8 },
      { x: -2.0, z: 0.0 },
      { x: 2.0, z: 0.0 },
      { x: -1.9, z: 1.8 },
      { x: 1.9, z: 1.8 }
    ];

    for (const offset of wheelOffsets) {
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.position.set(offset.x, -0.4, offset.z);
      wheel.castShadow = true;
      this.wheels.push(wheel);
      this.group.add(wheel);
    }

    // 5. Dual Forward Headlights
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lampGeom = new THREE.SphereGeometry(0.18, 8, 8);

    const leftLamp = new THREE.Mesh(lampGeom, headlightMat);
    leftLamp.position.set(-1.1, 0.6, -2.52);
    this.group.add(leftLamp);

    const rightLamp = new THREE.Mesh(lampGeom, headlightMat);
    rightLamp.position.set(1.1, 0.6, -2.52);
    this.group.add(rightLamp);

    const leftSpot = new THREE.SpotLight(0xfffaed, 4.2, 85, Math.PI / 3.8, 0.35, 1.2);
    leftSpot.position.copy(leftLamp.position);
    leftSpot.target.position.set(-1.1, -0.5, -35);
    this.group.add(leftSpot);
    this.group.add(leftSpot.target);
    this.headlights.push(leftSpot);

    const rightSpot = new THREE.SpotLight(0xfffaed, 4.2, 85, Math.PI / 3.8, 0.35, 1.2);
    rightSpot.position.copy(rightLamp.position);
    rightSpot.target.position.set(1.1, -0.5, -35);
    this.group.add(rightSpot);
    this.group.add(rightSpot.target);
    this.headlights.push(rightSpot);

    // 6. Rear High-Gain Science Antenna
    const mastGeom = new THREE.CylinderGeometry(0.06, 0.06, 2.2);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const mast = new THREE.Mesh(mastGeom, mastMat);
    mast.position.set(-1.0, 1.6, 2.1);
    this.group.add(mast);

    scene.add(this.group);
  }

  public update(
    delta: number,
    terrain: JezeroTerrain,
    inputs: { forward: boolean; backward: boolean; left: boolean; right: boolean; brake: boolean }
  ) {
    const dt = Math.min(delta, 0.08);

    if (this.isOccupied) {
      // 1. Steering & Rotation
      if (inputs.left) {
        this.steerAngle = Math.min(0.6, this.steerAngle + dt * 3);
      } else if (inputs.right) {
        this.steerAngle = Math.max(-0.6, this.steerAngle - dt * 3);
      } else {
        this.steerAngle *= 0.8;
      }

      // Rotate vehicle only when moving
      if (Math.abs(this.velocity) > 0.1) {
        const turnDirection = this.velocity > 0 ? 1 : -1;
        this.rotationY += this.steerAngle * this.turnSpeed * dt * turnDirection;
      }

      // 2. Acceleration / Braking
      if (inputs.forward) {
        this.velocity = Math.min(this.maxSpeed, this.velocity + this.acceleration * dt);
        this.battery = Math.max(0, this.battery - dt * 0.25);
      } else if (inputs.backward) {
        this.velocity = Math.max(-this.reverseSpeed, this.velocity - this.acceleration * dt);
        this.battery = Math.max(0, this.battery - dt * 0.2);
      } else {
        // Coasting friction
        this.velocity *= 0.94;
        if (Math.abs(this.velocity) < 0.05) this.velocity = 0;
      }

      if (inputs.brake) {
        this.velocity *= 0.75;
      }
    } else {
      // Passive braking when unmanned
      this.velocity *= 0.85;
      if (Math.abs(this.velocity) < 0.05) this.velocity = 0;
      // Solar trickle recharge when idle under sun
      this.battery = Math.min(100, this.battery + dt * 0.08);
    }

    // 3. Move along forward heading (-Z in local frame)
    const forwardX = -Math.sin(this.rotationY);
    const forwardZ = -Math.cos(this.rotationY);

    this.position.x += forwardX * this.velocity * dt;
    this.position.z += forwardZ * this.velocity * dt;

    // 4. Ground clamping & slope alignment
    const groundY = terrain.getElevationAt(this.position.x, this.position.z);
    this.position.y = groundY + 1.05;

    // Sample terrain ahead and behind to tilt chassis with slopes
    const frontGround = terrain.getElevationAt(this.position.x + forwardX * 2, this.position.z + forwardZ * 2);
    const rearGround = terrain.getElevationAt(this.position.x - forwardX * 2, this.position.z - forwardZ * 2);
    const pitch = Math.atan2(frontGround - rearGround, 4);

    this.group.position.copy(this.position);
    this.group.rotation.set(pitch, this.rotationY, 0);

    // 5. Rotate wheels with driving speed
    const wheelRotDelta = (this.velocity / 0.65) * dt;
    for (const wheel of this.wheels) {
      wheel.rotation.x += wheelRotDelta;
    }
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
    const intensity = on ? 4.2 : 0;
    for (const spot of this.headlights) {
      spot.intensity = intensity;
    }
  }

  public toggleHeadlights(): boolean {
    this.setHeadlights(!this.headlightsOn);
    return this.headlightsOn;
  }
}
