import * as THREE from 'three';
import { JezeroTerrain } from '../terrain/JezeroTerrain';
import { MarsLibraryBuilding } from './MarsLibraryBuilding';
import { OutpostManager } from '../outpost/OutpostManager';

export interface SurfaceQuery {
  elevation: number;
  isStructure: boolean;
  surfaceType: 'regolith' | 'metal_stairs' | 'library_deck' | 'habitat_platform';
  canClimb: boolean;
}

export class BuildingCollisionSystem {
  private terrain: JezeroTerrain;
  private library: MarsLibraryBuilding | null = null;
  private outpost: OutpostManager | null = null;

  constructor(terrain: JezeroTerrain) {
    this.terrain = terrain;
  }

  public registerLibrary(library: MarsLibraryBuilding) {
    this.library = library;
  }

  public registerOutpost(outpost: OutpostManager) {
    this.outpost = outpost;
  }

  /**
   * Resolves horizontal solid building collisions for an entity (astronaut or rover).
   * Pushes the candidate position out of solid walls and returns true if a collision occurred.
   */
  public resolveCollisions(position: THREE.Vector3, entityRadius: number = 0.45): boolean {
    let hasCollided = false;

    // 1. MARS ARCHIVAL LIBRARY COLLISIONS
    if (this.library) {
      const libPos = this.library.position;
      const angle = this.library.group.rotation.y;

      // Transform world (x, z) to Library Local Coordinates (lx, lz)
      const dx = position.x - libPos.x;
      const dz = position.z - libPos.z;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      let lx = dx * cosA - dz * sinA;
      let lz = dx * sinA + dz * cosA;

      const playerFootY = position.y - (entityRadius > 1.0 ? 0 : 1.85); // Approximate foot Y relative to world
      const localRelY = playerFootY - libPos.y;

      // A. Staircase & Entrance Deck Corridor
      // Stairs run from lz = 15.2 (ground apron) to lz = 6.8 (deck), Deck is lz = [5.0, 6.8]
      const isOnStairwayAxis = Math.abs(lx) <= 2.8 && lz >= 4.8 && lz <= 15.6;

      if (isOnStairwayAxis) {
        // Lateral Staircase Balustrades / Handrails (at lx = ±2.55)
        const maxStairWidth = 2.4 - entityRadius;
        if (lx > maxStairWidth) {
          lx = maxStairWidth;
          hasCollided = true;
        } else if (lx < -maxStairWidth) {
          lx = -maxStairWidth;
          hasCollided = true;
        }

        // Airlock Doorway: Allows entering the interior through doorway (|lx| <= 1.4)
        // If outside the doorway, airlock front wall blocks entry
        if (lz < 5.2 && Math.abs(lx) > 1.35) {
          lz = 5.2;
          hasCollided = true;
        }
      } else {
        const distFromCenter = Math.hypot(lx, lz);
        const plinthRadius = 10.6;
        const rotundaOuterRadius = 7.4;
        const rotundaInnerRadius = 6.85;

        // Is the player INSIDE the library rotunda?
        const isInsideRotunda = distFromCenter <= rotundaOuterRadius && lz < 5.2;

        if (isInsideRotunda) {
          // Inner Wall Boundary: keeps player safely enclosed inside the library room
          if (distFromCenter > rotundaInnerRadius - entityRadius) {
            // Allow exit through the airlock door corridor
            const isNearExitDoor = Math.abs(lx) <= 1.35 && lz >= 4.2;
            if (!isNearExitDoor) {
              const factor = (rotundaInnerRadius - entityRadius) / Math.max(0.01, distFromCenter);
              lx *= factor;
              lz *= factor;
              hasCollided = true;
            }
          }
        } else {
          // OUTSIDE THE BUILDING:
          // If on ground level below foundation, plinth blocks walking through
          if (localRelY < 0.8) {
            if (distFromCenter < plinthRadius + entityRadius) {
              const factor = (plinthRadius + entityRadius) / Math.max(0.01, distFromCenter);
              lx *= factor;
              lz *= factor;
              hasCollided = true;
            }
          } else {
            // If on the elevated plinth outside, exterior rotunda wall stops entry
            if (distFromCenter < rotundaOuterRadius + entityRadius) {
              const factor = (rotundaOuterRadius + entityRadius) / Math.max(0.01, distFromCenter);
              lx *= factor;
              lz *= factor;
              hasCollided = true;
            }
          }
        }
      }

      if (hasCollided) {
        // Convert clamped local (lx, lz) back to world position
        position.x = libPos.x + lx * cosA + lz * sinA;
        position.z = libPos.z - lx * sinA + lz * cosA;
      }
    }

    // 2. HABITAT CORE DOME COLLISION (World Center 0, 0)
    const distToHab = Math.hypot(position.x, position.z);
    const habRadius = 6.2;
    // Habitat airlock is at z in [5.5, 8.5], x in [-1.5, 1.5]
    const isInHabAirlock = Math.abs(position.x) <= 1.5 && position.z >= 5.2 && position.z <= 8.8;

    if (!isInHabAirlock && distToHab < habRadius + entityRadius) {
      const pushFactor = (habRadius + entityRadius) / Math.max(0.01, distToHab);
      position.x *= pushFactor;
      position.z *= pushFactor;
      hasCollided = true;
    }

    // 3. OUTPOST STRUCTURES (Batteries, Solar Arrays, Comms Dish)
    if (this.outpost && this.outpost.structures) {
      for (const s of this.outpost.structures) {
        const sDist = Math.hypot(position.x - s.position.x, position.z - s.position.z);
        let sRadius = 0.9;
        if (s.type === 'battery_bank') sRadius = 1.6;
        if (s.type === 'solar_array') sRadius = 1.1;
        if (s.type === 'comm_dish') sRadius = 1.1;
        if (s.type === 'science_lab') sRadius = 2.4;

        if (sDist < sRadius + entityRadius) {
          const push = (sRadius + entityRadius) / Math.max(0.01, sDist);
          position.x = s.position.x + (position.x - s.position.x) * push;
          position.z = s.position.z + (position.z - s.position.z) * push;
          hasCollided = true;
        }
      }
    }

    return hasCollided;
  }

  /**
   * Calculates surface elevation accounting for natural terrain,
   * staircase step climbing, elevated building decks, and foundations.
   */
  public getSurfaceElevation(worldX: number, worldZ: number, currentFootY?: number): SurfaceQuery {
    const terrainHeight = this.terrain.getElevationAt(worldX, worldZ);

    // Default to natural terrain
    let surfaceY = terrainHeight;
    let isStructure = false;
    let surfaceType: SurfaceQuery['surfaceType'] = 'regolith';

    if (this.library) {
      const libPos = this.library.position;
      const angle = this.library.group.rotation.y;

      // Transform world coordinates into library local coordinates
      const dx = worldX - libPos.x;
      const dz = worldZ - libPos.z;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const lx = dx * cosA - dz * sinA;
      const lz = dx * sinA + dz * cosA;

      const stairWidthHalf = 2.6;

      // 1. ENTRANCE STAIRCASE & UPPER LANDING DECK
      if (Math.abs(lx) <= stairWidthHalf) {
        // A. Top Entrance Landing Deck (in front of airlock)
        if (lz >= 5.0 && lz <= 6.8) {
          surfaceY = libPos.y + 1.8;
          isStructure = true;
          surfaceType = 'library_deck';
        }
        // B. 9-Step Open Grand Staircase (running from lz = 6.8 to lz = 13.8)
        else if (lz > 6.8 && lz <= 13.8) {
          const stairStartLz = 13.8;
          const stairProgress = (stairStartLz - lz) / 7.0; // 0.0 at ground (13.8) to 1.0 at deck (6.8)
          const numSteps = 9;
          const stepIndex = Math.min(numSteps - 1, Math.max(0, Math.floor(stairProgress * numSteps)));

          const stepHeight = ((stepIndex + 1) / numSteps) * 1.8;
          const stairY = libPos.y + stepHeight;

          // Seamless transition: stairs never plunge below natural terrain
          surfaceY = Math.max(terrainHeight, stairY);
          isStructure = true;
          surfaceType = 'metal_stairs';
        }
        // C. Ground Transition Apron (lz = 13.8 to 15.2)
        else if (lz > 13.8 && lz <= 15.2) {
          const apronProgress = (15.2 - lz) / 1.4; // 0.0 at ground (15.2) to 1.0 at step 0 (13.8)
          const apronY = libPos.y + 0.15 * apronProgress;
          surfaceY = Math.max(terrainHeight, apronY);
          isStructure = true;
          surfaceType = 'metal_stairs';
        }
      }

      // 2. LIBRARY ROTUNDA INTERIOR FLOOR & CENTRAL DAIS
      const distFromLibCenter = Math.hypot(lx, lz);
      if (!isStructure && distFromLibCenter <= 7.0 && lz <= 5.2) {
        if (distFromLibCenter <= 2.3) {
          // Central presentation dais
          surfaceY = libPos.y + 2.15;
          isStructure = true;
          surfaceType = 'library_deck';
        } else {
          // Main interior library floor
          surfaceY = libPos.y + 1.8;
          isStructure = true;
          surfaceType = 'library_deck';
        }
      }

      // 3. ELEVATED PODIUM FOUNDATION (if player climbed up onto it from outside)
      if (!isStructure) {
        if (distFromLibCenter <= 10.5) {
          const podiumTop = libPos.y + 1.2;
          // If player's feet are already near or above the podium height, support them
          if (currentFootY !== undefined && currentFootY >= podiumTop - 0.4) {
            surfaceY = podiumTop;
            isStructure = true;
            surfaceType = 'library_deck';
          }
        }
      }
    }

    return {
      elevation: surfaceY,
      isStructure,
      surfaceType,
      canClimb: true
    };
  }
}
