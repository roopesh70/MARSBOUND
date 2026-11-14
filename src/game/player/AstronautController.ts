import * as THREE from 'three';
import { JezeroTerrain } from '../terrain/JezeroTerrain';
import { ALL_DISCOVERIES } from '../../data/discoveries';
import { DiscoveryRecord } from '../../types/discovery';
import { BuildingCollisionSystem } from '../environment/BuildingCollisionSystem';

interface BootDustParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
}

export class AstronautController {
  public camera: THREE.PerspectiveCamera;
  public position: THREE.Vector3;
  private velocity: THREE.Vector3;
  public isGrounded: boolean = true;
  private wasGrounded: boolean = true;
  private eyeHeight = 2.2; // meters

  // Boot regolith dust particles
  public dustParticlesMesh: THREE.Points;
  private dustPool: BootDustParticle[] = [];
  private readonly maxParticles = 140;
  private footstepTimer = 0;

  // Input states
  public moveForward = false;
  public moveBackward = false;
  public moveLeft = false;
  public moveRight = false;
  public isSprinting = false;

  // Mouse rotation
  private euler = new THREE.Euler(0, 0, 0, 'YXZ');
  public isLocked = false;
  public isMouseDown = false;
  public isPaused = false;
  private domElement: HTMLElement;

  // Mars physics settings (labelled gameplay-tuned)
  public walkSpeed = 5.5; // m/s
  public sprintSpeed = 9.5; // m/s
  public marsGravity = 3.71; // m/s^2 (~38% of Earth)
  public jumpVelocity = 5.2; // low-gravity spring hop

  // Exploration boundary
  public maxBoundaryRadius = 250; // meters from base
  public isNearBoundary = false;

  // Nearest POI
  public nearestPoi: DiscoveryRecord | null = null;
  public nearestPoiDistance: number = 999;

  // Building & Structure Collision System
  public collisionSystem: BuildingCollisionSystem | null = null;

  // Event listener references for proper cleanup
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundMouseUp: (e: MouseEvent) => void;
  private boundBlur: () => void;
  private boundPointerLockChange: () => void;
  private boundPointerLockError: () => void;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement, initialPos = { x: 0, z: 12 }) {
    this.camera = camera;
    this.domElement = domElement;
    this.position = new THREE.Vector3(initialPos.x, this.eyeHeight, initialPos.z);
    this.velocity = new THREE.Vector3();

    // Initialize boot dust particles
    const dustGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.maxParticles * 3);
    positions.fill(0);
    dustGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const dustMat = new THREE.PointsMaterial({
      color: 0xc46b41,
      size: 0.5,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.dustParticlesMesh = new THREE.Points(dustGeom, dustMat);

    for (let i = 0; i < this.maxParticles; i++) {
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

    this.boundKeyDown = (e) => this.onKeyDown(e);
    this.boundKeyUp = (e) => this.onKeyUp(e);
    this.boundMouseMove = (e) => this.onMouseMove(e);
    this.boundMouseDown = (e) => this.onMouseDown(e);
    this.boundMouseUp = (e) => this.onMouseUp(e);
    this.boundBlur = () => this.resetInputs();
    this.boundPointerLockChange = () => {
      this.isLocked = document.pointerLockElement === this.domElement;
    };
    this.boundPointerLockError = () => {
      this.isLocked = false;
    };

    this.initEvents();
  }

  private initEvents() {
    window.addEventListener('keydown', this.boundKeyDown, { passive: false });
    window.addEventListener('keyup', this.boundKeyUp, { passive: false });
    window.addEventListener('blur', this.boundBlur);

    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
    document.addEventListener('pointerlockchange', this.boundPointerLockChange);
    document.addEventListener('pointerlockerror', this.boundPointerLockError);

    this.domElement.addEventListener('mousedown', this.boundMouseDown);
  }

  public destroy() {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    window.removeEventListener('blur', this.boundBlur);

    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
    document.removeEventListener('pointerlockchange', this.boundPointerLockChange);
    document.removeEventListener('pointerlockerror', this.boundPointerLockError);

    this.domElement.removeEventListener('mousedown', this.boundMouseDown);
  }

  public resetInputs() {
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.isSprinting = false;
    this.isMouseDown = false;
  }

  public lockPointer() {
    if (this.isPaused) return;

    try {
      if (document.pointerLockElement !== this.domElement) {
        const promise = this.domElement.requestPointerLock() as unknown;
        if (promise && typeof (promise as Promise<void>).catch === 'function') {
          (promise as Promise<void>).catch(() => {
            this.isLocked = false;
          });
        }
      } else {
        this.isLocked = true;
      }
    } catch {
      this.isLocked = false;
    }
  }

  public unlockPointer() {
    try {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    } catch {
      // browser exit pointer lock failure fallback
    }
    this.isLocked = false;
    this.isMouseDown = false;
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button === 0 && !this.isPaused) {
      this.isMouseDown = true;
    }
  }

  private onMouseUp(e: MouseEvent) {
    if (e.button === 0) {
      this.isMouseDown = false;
    }
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.isPaused) return;

    // Ignore input if user is typing into an input field or textarea
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    const code = e.code;
    const key = e.key ? e.key.toLowerCase() : '';

    let handled = false;

    // Movement: Forward
    if (code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup') {
      this.moveForward = true;
      handled = true;
    }

    // Movement: Backward
    if (code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown') {
      this.moveBackward = true;
      handled = true;
    }

    // Movement: Left
    if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft') {
      this.moveLeft = true;
      handled = true;
    }

    // Movement: Right
    if (code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright') {
      this.moveRight = true;
      handled = true;
    }

    // Sprint
    if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
      this.isSprinting = true;
      handled = true;
    }

    // Low-gravity Hop / Jump
    if (code === 'Space' || key === ' ' || key === 'spacebar') {
      if (this.isGrounded) {
        this.velocity.y = this.jumpVelocity;
        this.isGrounded = false;
      }
      handled = true;
    }

    // Prevent default scrolling for game control keys
    if (handled && (code === 'Space' || code.startsWith('Arrow'))) {
      e.preventDefault();
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    const code = e.code;
    const key = e.key ? e.key.toLowerCase() : '';

    if (code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup') {
      this.moveForward = false;
    }
    if (code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown') {
      this.moveBackward = false;
    }
    if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft') {
      this.moveLeft = false;
    }
    if (code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright') {
      this.moveRight = false;
    }
    if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
      this.isSprinting = false;
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (this.isPaused) return;

    const hasPointerLock = document.pointerLockElement === this.domElement;
    
    // Look around ONLY if pointer is actually locked OR if mouse button is held down (drag-to-look fallback)
    if (!hasPointerLock && !this.isMouseDown) {
      return;
    }

    const movementX = e.movementX || (e as unknown as { mozMovementX: number }).mozMovementX || (e as unknown as { webkitMovementX: number }).webkitMovementX || 0;
    const movementY = e.movementY || (e as unknown as { mozMovementY: number }).mozMovementY || (e as unknown as { webkitMovementY: number }).webkitMovementY || 0;

    this.euler.setFromQuaternion(this.camera.quaternion);

    this.euler.y -= movementX * 0.0024;
    this.euler.x -= movementY * 0.0024;

    // Pitch limit: prevent flipping upside down
    this.euler.x = Math.max(-Math.PI / 2 + 0.08, Math.min(Math.PI / 2 - 0.08, this.euler.x));

    this.camera.quaternion.setFromEuler(this.euler);
  }

  public update(delta: number, terrain: JezeroTerrain, collisionSystem?: BuildingCollisionSystem) {
    const dt = Math.min(delta, 0.08);

    // 1. Calculate directional movement relative to camera orientation
    const speed = this.isSprinting ? this.sprintSpeed : this.walkSpeed;
    const moveVector = new THREE.Vector3();

    if (this.moveForward) moveVector.z -= 1;
    if (this.moveBackward) moveVector.z += 1;
    if (this.moveLeft) moveVector.x -= 1;
    if (this.moveRight) moveVector.x += 1;

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();

      // Rotate movement vector by player's yaw (camera Y rotation)
      const yaw = this.euler.y;
      const rotatedX = moveVector.x * Math.cos(yaw) + moveVector.z * Math.sin(yaw);
      const rotatedZ = -moveVector.x * Math.sin(yaw) + moveVector.z * Math.cos(yaw);

      this.velocity.x = rotatedX * speed;
      this.velocity.z = rotatedZ * speed;
    } else {
      // Damping deceleration when no key is held
      this.velocity.x *= 0.8;
      this.velocity.z *= 0.8;
      if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
      if (Math.abs(this.velocity.z) < 0.01) this.velocity.z = 0;
    }

    // 2. Apply Mars gravity when airborne
    if (!this.isGrounded) {
      this.velocity.y -= this.marsGravity * dt;
    }

    // 3. Update candidate position
    this.position.x += this.velocity.x * dt;
    this.position.z += this.velocity.z * dt;
    this.position.y += this.velocity.y * dt;

    // 3.1 Solid building collision response (push player out of solid walls & rotunda)
    const activeCollision = collisionSystem || this.collisionSystem;
    if (activeCollision) {
      const collided = activeCollision.resolveCollisions(this.position, 0.45);
      if (collided) {
        // Friction against solid walls for tactile feedback
        this.velocity.x *= 0.6;
        this.velocity.z *= 0.6;
      }
    }

    // 4. Boundary enforcement (keep player inside exploration area, extended for Neretva Canyon)
    const distFromOrigin = Math.sqrt(this.position.x * this.position.x + this.position.z * this.position.z);
    const angle = Math.atan2(this.position.z, this.position.x);

    // In the Northwest Neretva Canyon passage (angle ~ -2.45 to -1.95 rad, x < -150, z < -110):
    // Allow extended traverse up to 380m outward into the canyon gorge!
    const inCanyonCorridor = Math.abs(angle - (-2.22)) < 0.35 && this.position.x < -140 && this.position.z < -105;
    const effectiveMaxRadius = inCanyonCorridor ? 380 : this.maxBoundaryRadius;

    this.isNearBoundary = distFromOrigin > (effectiveMaxRadius - 30);

    if (distFromOrigin > effectiveMaxRadius) {
      this.position.x = Math.cos(angle) * effectiveMaxRadius;
      this.position.z = Math.sin(angle) * effectiveMaxRadius;
    }

    // 5. Ground, stair step-climbing, and landing impact detection
    const currentFootY = this.position.y - this.eyeHeight;
    const surfaceInfo = activeCollision
      ? activeCollision.getSurfaceElevation(this.position.x, this.position.z, currentFootY)
      : { elevation: terrain.getElevationAt(this.position.x, this.position.z), isStructure: false, surfaceType: 'regolith' };

    const groundLevel = surfaceInfo.elevation + this.eyeHeight;
    const stepDiff = surfaceInfo.elevation - currentFootY;

    // Stair Step-Climbing: if walking forward onto a step (diff <= 0.35m) while grounded
    const isStepClimb = this.isGrounded && stepDiff > 0 && stepDiff <= 0.35;
    const justLanded = !this.wasGrounded && (this.position.y <= groundLevel);

    if (isStepClimb || this.position.y <= groundLevel) {
      this.position.y = groundLevel;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    // Spawn dust puff on landing impact (only on natural Martian regolith)
    if (justLanded && !surfaceInfo.isStructure) {
      this.emitDustBurst(12, this.position.x, surfaceInfo.elevation + 0.05, this.position.z, 1.2);
    }

    // Spawn continuous boot puffs when walking/sprinting on natural regolith
    const horizontalSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    if (this.isGrounded && horizontalSpeed > 1.2 && !surfaceInfo.isStructure) {
      this.footstepTimer += dt;
      const stepInterval = this.isSprinting ? 0.3 : 0.44;
      if (this.footstepTimer >= stepInterval) {
        this.footstepTimer = 0;
        this.emitDustBurst(3, this.position.x, surfaceInfo.elevation + 0.05, this.position.z, 0.4);
      }
    } else {
      this.footstepTimer = 0;
    }

    this.wasGrounded = this.isGrounded;

    // Update active boot dust particles
    this.updateDustParticles(dt);

    // Update actual camera position
    this.camera.position.copy(this.position);

    // 6. Check nearest POI (across Jezero and Neretva discoveries)
    let closest: DiscoveryRecord | null = null;
    let minD = 9999;
    for (const poi of ALL_DISCOVERIES) {
      const dx = this.position.x - poi.worldPosition.x;
      const dz = this.position.z - poi.worldPosition.z;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d < minD) {
        minD = d;
        closest = poi;
      }
    }
    this.nearestPoi = closest;
    this.nearestPoiDistance = minD;
  }

  private emitDustBurst(count: number, x: number, y: number, z: number, spread: number) {
    let emitted = 0;
    for (const p of this.dustPool) {
      if (p.life <= 0) {
        p.x = x + (Math.random() - 0.5) * 0.3;
        p.y = y;
        p.z = z + (Math.random() - 0.5) * 0.3;
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.2 + Math.random() * 0.6) * spread;
        p.vx = Math.cos(angle) * speed;
        p.vy = 0.4 + Math.random() * 0.6 * spread;
        p.vz = Math.sin(angle) * speed;
        p.maxLife = 0.6 + Math.random() * 0.6;
        p.life = p.maxLife;
        emitted++;
        if (emitted >= count) break;
      }
    }
  }

  private updateDustParticles(dt: number) {
    const posAttr = this.dustParticlesMesh.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.dustPool[i];
      if (p.life > 0) {
        p.life -= dt;
        p.x += (p.vx + 0.06) * dt; // gentle wind drift
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.vy -= 1.8 * dt; // settle back down

        array[i * 3] = p.x;
        array[i * 3 + 1] = p.y;
        array[i * 3 + 2] = p.z;
      } else {
        array[i * 3] = 0;
        array[i * 3 + 1] = -999;
        array[i * 3 + 2] = 0;
      }
    }
    posAttr.needsUpdate = true;
  }

  public getHeadingDegrees(): number {
    // 0 = North (-Z), 90 = East (+X), 180 = South (+Z), 270 = West (-X)
    let deg = (-this.euler.y * (180 / Math.PI)) % 360;
    if (deg < 0) deg += 360;
    return Math.round(deg);
  }
}
