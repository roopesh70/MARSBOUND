import * as THREE from 'three';
import { JezeroTerrain } from '../terrain/JezeroTerrain';
import { JEZERO_DISCOVERIES } from '../../data/discoveries';
import { DiscoveryRecord } from '../../types/discovery';

export class AstronautController {
  public camera: THREE.PerspectiveCamera;
  public position: THREE.Vector3;
  private velocity: THREE.Vector3;
  public isGrounded: boolean = true;
  private eyeHeight = 1.85; // meters

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

  // Event listener references for proper cleanup
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundMouseUp: (e: MouseEvent) => void;
  private boundBlur: () => void;
  private boundCanvasClick: () => void;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement, initialPos = { x: 0, z: 12 }) {
    this.camera = camera;
    this.domElement = domElement;
    this.position = new THREE.Vector3(initialPos.x, this.eyeHeight, initialPos.z);
    this.velocity = new THREE.Vector3();

    this.boundKeyDown = (e) => this.onKeyDown(e);
    this.boundKeyUp = (e) => this.onKeyUp(e);
    this.boundMouseMove = (e) => this.onMouseMove(e);
    this.boundMouseDown = (e) => this.onMouseDown(e);
    this.boundMouseUp = (e) => this.onMouseUp(e);
    this.boundBlur = () => this.resetInputs();
    this.boundCanvasClick = () => this.lockPointer();

    this.initEvents();
  }

  private initEvents() {
    window.addEventListener('keydown', this.boundKeyDown, { passive: false });
    window.addEventListener('keyup', this.boundKeyUp, { passive: false });
    window.addEventListener('blur', this.boundBlur);

    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);

    this.domElement.addEventListener('mousedown', this.boundMouseDown);
    this.domElement.addEventListener('click', this.boundCanvasClick);
  }

  public destroy() {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    window.removeEventListener('blur', this.boundBlur);

    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);

    this.domElement.removeEventListener('mousedown', this.boundMouseDown);
    this.domElement.removeEventListener('click', this.boundCanvasClick);
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
    try {
      if (document.pointerLockElement !== this.domElement) {
        const promise = this.domElement.requestPointerLock() as unknown;
        if (promise && typeof (promise as Promise<void>).catch === 'function') {
          (promise as Promise<void>).catch(() => {
            // Pointer lock might be blocked or cancelled by user, drag fallback remains active
          });
        }
      }
      this.isLocked = true;
    } catch {
      // Fallback: mouse dragging is supported even if pointer lock is denied
    }
  }

  public unlockPointer() {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
    this.isLocked = false;
  }

  private onMouseDown(e: MouseEvent) {
    if (e.button === 0) {
      this.isMouseDown = true;
      this.lockPointer();
    }
  }

  private onMouseUp(e: MouseEvent) {
    if (e.button === 0) {
      this.isMouseDown = false;
    }
  }

  private onKeyDown(e: KeyboardEvent) {
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
    const hasPointerLock = document.pointerLockElement === this.domElement;
    
    // Look around if pointer is locked OR if mouse button is held down (drag-to-look fallback)
    if (!hasPointerLock && !this.isMouseDown && !this.isLocked) {
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

  public update(delta: number, terrain: JezeroTerrain) {
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

    // 4. Boundary enforcement (keep player inside bounded Jezero exploration area)
    const distFromOrigin = Math.sqrt(this.position.x * this.position.x + this.position.z * this.position.z);
    this.isNearBoundary = distFromOrigin > (this.maxBoundaryRadius - 30);

    if (distFromOrigin > this.maxBoundaryRadius) {
      const angle = Math.atan2(this.position.z, this.position.x);
      this.position.x = Math.cos(angle) * this.maxBoundaryRadius;
      this.position.z = Math.sin(angle) * this.maxBoundaryRadius;
    }

    // 5. Terrain height ground clamping
    const terrainHeight = terrain.getElevationAt(this.position.x, this.position.z);
    const groundLevel = terrainHeight + this.eyeHeight;

    if (this.position.y <= groundLevel) {
      this.position.y = groundLevel;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    // Update actual camera position
    this.camera.position.copy(this.position);

    // 6. Check nearest POI
    let closest: DiscoveryRecord | null = null;
    let minD = 9999;
    for (const poi of JEZERO_DISCOVERIES) {
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

  public getHeadingDegrees(): number {
    // 0 = North (-Z), 90 = East (+X), 180 = South (+Z), 270 = West (-X)
    let deg = (-this.euler.y * (180 / Math.PI)) % 360;
    if (deg < 0) deg += 360;
    return Math.round(deg);
  }
}
