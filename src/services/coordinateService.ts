import { MarsCoordinates } from '../types/mars';
import { MarsRegionId } from '../types/region';
import { MARS_REGIONS } from '../data/regions/marsRegions';

// Mars reference constants
export const MARS_RADIUS_METERS = 3389500;
export const MARS_RADIUS_KM = 3389.5;
export const MARS_GRAVITY = 3.71; // m/s^2 (~38% of Earth's 9.81 m/s^2)
export const JEZERO_CENTER_LAT = 18.4447;
export const JEZERO_CENTER_LON = 77.4508;
export const JEZERO_DATUM_ELEVATION = -2574; // meters MOLA

// Scale factor for local play area (meters per degree scaled for local bounds)
const METERS_PER_DEGREE_LAT = (2 * Math.PI * MARS_RADIUS_METERS) / 360; // ~59,160 m/deg

// Playable local compression factor so players can hike between real landmark sites in minutes
const WORLD_COMPRESSION = 0.04; // 1 real km = 40 in-game meters for fun exploration pacing

export class CoordinateService {
  private static currentRegionId: MarsRegionId = 'jezero_crater';

  public static getActiveRegionId(): MarsRegionId {
    return this.currentRegionId;
  }

  public static setActiveRegion(regionId: MarsRegionId): void {
    this.currentRegionId = regionId;
  }

  /**
   * Convert local 3D world position to Martian latitude, longitude, and elevation
   * within the currently active region's local frame.
   */
  public static localToMars(x: number, y: number, z: number, regionId: MarsRegionId = this.currentRegionId): MarsCoordinates {
    const region = MARS_REGIONS.find((r) => r.id === regionId) || MARS_REGIONS[0];
    const centerLat = region.centerCoordinates.latitude;
    const centerLon = region.centerCoordinates.longitude;
    const datumElev = region.molaDatumElevation;

    const metersPerLon = METERS_PER_DEGREE_LAT * Math.cos((centerLat * Math.PI) / 180);
    const deltaLonDeg = x / (metersPerLon * WORLD_COMPRESSION);
    const deltaLatDeg = -z / (METERS_PER_DEGREE_LAT * WORLD_COMPRESSION);
    const elevation = datumElev + y;

    return {
      latitude: parseFloat((centerLat + deltaLatDeg).toFixed(5)),
      longitude: parseFloat((centerLon + deltaLonDeg).toFixed(5)),
      elevation: parseFloat(elevation.toFixed(1)),
      datum: 'MOLA Mars Areoid (IAU 2000)',
      crs: 'Planetocentric East-positive'
    };
  }

  /**
   * Convert Martian coordinates back to local 3D world position relative to a region's center
   */
  public static marsToLocal(
    lat: number,
    lon: number,
    elevation?: number,
    regionId: MarsRegionId = this.currentRegionId
  ): { x: number; y: number; z: number } {
    const region = MARS_REGIONS.find((r) => r.id === regionId) || MARS_REGIONS[0];
    const centerLat = region.centerCoordinates.latitude;
    const centerLon = region.centerCoordinates.longitude;
    const datumElev = region.molaDatumElevation;
    const actualElev = elevation !== undefined ? elevation : datumElev;

    const metersPerLon = METERS_PER_DEGREE_LAT * Math.cos((centerLat * Math.PI) / 180);
    const deltaLat = lat - centerLat;
    const deltaLon = lon - centerLon;

    const x = deltaLon * metersPerLon * WORLD_COMPRESSION;
    const z = -deltaLat * METERS_PER_DEGREE_LAT * WORLD_COMPRESSION;
    const y = actualElev - datumElev;

    return { x, y, z };
  }

  /**
   * Calculate 2D horizontal distance in meters between two local coordinates
   */
  public static distanceMeters(p1: { x: number; z: number }, p2: { x: number; z: number }): number {
    const dx = p1.x - p2.x;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  /**
   * Calculate true planetary Great-Circle distance in kilometers between two Martian geographic coordinates
   */
  public static calculateGreatCircleDistanceKm(coord1: MarsCoordinates, coord2: MarsCoordinates): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const lat1 = toRad(coord1.latitude);
    const lon1 = toRad(coord1.longitude);
    const lat2 = toRad(coord2.latitude);
    const lon2 = toRad(coord2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((MARS_RADIUS_KM * c).toFixed(1));
  }

  /**
   * Calculate compass bearing angle (0° to 360°) from one Martian coordinate to another
   */
  public static calculateBearingDegrees(from: MarsCoordinates, to: MarsCoordinates): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const lat1 = toRad(from.latitude);
    const lon1 = toRad(from.longitude);
    const lat2 = toRad(to.latitude);
    const lon2 = toRad(to.longitude);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;

    return parseFloat(bearing.toFixed(1));
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
