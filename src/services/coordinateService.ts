import { MarsCoordinates } from '../types/mars';

// Mars reference constants
export const MARS_RADIUS_METERS = 3389500;
export const MARS_GRAVITY = 3.71; // m/s^2 (~38% of Earth's 9.81 m/s^2)
export const JEZERO_CENTER_LAT = 18.4447;
export const JEZERO_CENTER_LON = 77.4508;
export const JEZERO_DATUM_ELEVATION = -2574; // meters MOLA

// Scale factor for local play area (meters per degree scaled for a 1km x 1km local bounds)
// In our bounded Jezero playground:
// 1 unit in Three.js = 1 meter
const METERS_PER_DEGREE_LAT = (2 * Math.PI * MARS_RADIUS_METERS) / 360; // ~59,160 m/deg
const METERS_PER_DEGREE_LON = METERS_PER_DEGREE_LAT * Math.cos((JEZERO_CENTER_LAT * Math.PI) / 180); // ~56,120 m/deg

// Playable local compression factor so players can hike between real landmark sites in minutes
const WORLD_COMPRESSION = 0.04; // 1 real km = 40 in-game meters for fun exploration pacing

export class CoordinateService {
  /**
   * Convert local 3D world position to Martian latitude, longitude, and elevation
   */
  public static localToMars(x: number, y: number, z: number): MarsCoordinates {
    const deltaLonDeg = (x / (METERS_PER_DEGREE_LON * WORLD_COMPRESSION));
    const deltaLatDeg = (-z / (METERS_PER_DEGREE_LAT * WORLD_COMPRESSION));
    const elevation = JEZERO_DATUM_ELEVATION + y;

    return {
      latitude: parseFloat((JEZERO_CENTER_LAT + deltaLatDeg).toFixed(5)),
      longitude: parseFloat((JEZERO_CENTER_LON + deltaLonDeg).toFixed(5)),
      elevation: parseFloat(elevation.toFixed(1)),
      datum: 'MOLA Mars Areoid (IAU 2000)',
      crs: 'Planetocentric East-positive'
    };
  }

  /**
   * Convert Martian coordinates back to local 3D world position
   */
  public static marsToLocal(lat: number, lon: number, elevation: number = JEZERO_DATUM_ELEVATION): { x: number; y: number; z: number } {
    const deltaLat = lat - JEZERO_CENTER_LAT;
    const deltaLon = lon - JEZERO_CENTER_LON;

    const x = deltaLon * METERS_PER_DEGREE_LON * WORLD_COMPRESSION;
    const z = -deltaLat * METERS_PER_DEGREE_LAT * WORLD_COMPRESSION;
    const y = elevation - JEZERO_DATUM_ELEVATION;

    return { x, y, z };
  }

  /**
   * Calculate 2D horizontal distance in meters between two coordinates
   */
  public static distanceMeters(p1: { x: number; z: number }, p2: { x: number; z: number }): number {
    const dx = p1.x - p2.x;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  /**
   * Format coordinate for display in HUD / Panels
   */
  public static formatCoordinates(coords: MarsCoordinates): string {
    const latDir = coords.latitude >= 0 ? 'N' : 'S';
    const lonDir = coords.longitude >= 0 ? 'E' : 'W';
    return `${Math.abs(coords.latitude).toFixed(4)}° ${latDir}, ${Math.abs(coords.longitude).toFixed(4)}° ${lonDir} | Elev: ${coords.elevation.toFixed(0)}m (MOLA)`;
  }
}
