import { Angle } from './Angle';
import { CS } from './CS';
import { GeoCS } from './GeoCS';
import { Ellipsoid } from './Ellipsoid';

export class ProjCS extends CS {

  get ellipsoid(): Ellipsoid {
    return this.geoCS.ellipsoid;
  }

  constructor(
    id: number,
    name: string,
    public geoCS: GeoCS
  ) {
    super(id, name);
  }

  angle(x1: number, y1: number, x2: number, y2: number): number {
    return Angle.angleDegrees(x1, y1, x2, y2);
  }

  angleEllipsoid(x1: number, y1: number, x2: number, y2: number): number {
    const lonLat1 = this.inverse(x1, y1);
    const lonLat2 = this.inverse(x2, y2);
    return this.geoCS.angleEllipsoid(lonLat1[0], lonLat1[1], lonLat2[0], lonLat2[1]);
  }

  public astronomicAzimuth(x1: number, y1: number, h1: number, xsi: number,
    eta: number, x2: number, y2: number, h2: number,
    xo: number, yo: number, zo: number): number {
    const lonLat1 = this.inverse(x1, y1);
    const lonLat2 = this.inverse(x2, y2);
    return this.geoCS.astronomicAzimuth(lonLat1[0], lonLat1[1], h1, xsi, eta, lonLat2[0], lonLat2[1], h2, xo, yo, zo);
  }

  public convertPoint(cs: CS, x: number, y: number): number[] {
    if (this === cs) {
      return [x, y];
    } else if (cs instanceof GeoCS) {
      return this.inverse(x, y);
    } else if (cs instanceof ProjCS) {
      const lonLat = this.inverse(x, y);
      // No datum conversion
      const projCs = <ProjCS>cs;
      return projCs.project(lonLat[0], lonLat[1]);
    } else {
      return null;
    }
  }

  distanceMetres(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  distanceMetresEllipsoid(x1: number, y1: number, x2: number, y2: number): number {
    const lonLat1 = this.inverse(x1, y1);
    const lonLat2 = this.inverse(x2, y2);
    return this.geoCS.distanceMetresEllipsoid(lonLat1[0], lonLat1[1], lonLat2[0], lonLat2[1]);
  }

  ellipsoidDirection(x1: number, y1: number, height1: number, xsi: number, eta: number, x2: number,
    y2: number, height2: number, observedDirection: number, xo: number, yo: number, zo: number): number {
    const lonLat1 = this.inverse(x1, y1);
    const lonLat2 = this.inverse(x2, y2);
    return this.geoCS.ellipsoidDirection(lonLat1[0], lonLat1[1], height1, xsi, eta,
      lonLat2[0], lonLat2[1], height2, observedDirection, xo, yo, zo);
  }

  geodeticAzimuth(x1: number, y1: number, height1: number, xsi: number, eta: number, x2: number,
    y2: number, height2: number, astronomicAzimuth: number, xo: number, yo: number, zo: number): number {
    const lonLat1 = this.inverse(x1, y1);
    const lonLat2 = this.inverse(x2, y2);
    return this.geoCS.geodeticAzimuth(lonLat1[0], lonLat1[1], height1, xsi, eta,
      lonLat2[0], lonLat2[1], height2, astronomicAzimuth, xo, yo, zo);
  }

  public slopeDistance(x1: number, y1: number, h1: number, x2: number, y2: number, h2: number,
    xo: number, yo: number, zo: number): number {
    const lonLat1 = this.inverse(x1, y1);
    const lonLat2 = this.inverse(x2, y2);
    return this.slopeDistance(lonLat1[0], lonLat1[1], h1, lonLat2[0], lonLat2[1], h2, xo, yo, zo);

  }

  public spatialDirection(x1: number, y1: number, h1: number, xsi: number, eta: number,
    x2: number, y2: number, h2: number, reducedDirection: number, xo: number, yo: number, zo: number): number {
    const lonLat1 = this.inverse(x1, y1);
    const lonLat2 = this.inverse(x2, y2);
    return this.geoCS.spatialDirection(lonLat1[0], lonLat1[1], h1, xsi, eta, lonLat2[0], lonLat2[1], h2, xo, yo, zo, reducedDirection);
  }

  spatialDistanceHeight(x1: number, y1: number, h1: number, x2: number, y2: number, h2: number): number {
    const lonLat1 = this.inverse(x1, y1);
    const lonLat2 = this.inverse(x2, y2);
    return this.geoCS.spatialDistanceHeight(lonLat1[0], lonLat1[1], h1, lonLat2[0], lonLat2[1], h2);
  }

  spatialDistanceReduction(x1: number, y1: number, h1: number, heightOfInstrument: number, x2: number,
    y2: number, h2: number, heightOfTarget: number, distance: number): number {
     const lonLat1 = this.inverse(x1, y1);
    const lonLat2 = this.inverse(x2, y2);
   return this.ellipsoid.spatialDistanceReduction(lonLat1[0], lonLat1[1], h1, heightOfInstrument,
      lonLat2[0], lonLat2[1], h2, heightOfTarget, distance);
  }

  horizontalEllipsoidalFactor(x1: number, y1: number, height1: number,
    x2: number, y2: number, height2: number): number {
    const lonLat1 = this.inverse(x1, y1);
    const lonLat2 = this.inverse(x2, y2);
    return this.geoCS.horizontalEllipsoidalFactor(lonLat1[0], lonLat1[1], height1, lonLat2[0], lonLat2[1], height2);
  }

  pointOffset(x: number, y: number, distance: number, angle: number): number[] {
    angle = Angle.toRadians(Angle.toCartesian(angle));
    const x2 = x + distance * Math.cos(angle);
    const y2 = y + distance * Math.sin(angle);
    return [
      x2,
      y2
    ];
  }

  pointOffsetAngle(x: number, y: number, distance: number, angle: number): number[] {
    const rad = Angle.toRadians(angle);
    const x2 = x + distance * Math.sin(rad);
    const y2 = y + distance * Math.cos(rad);
    const resultAngle = this.angle(x2, y2, x, y);
    return [
      x2,
      y2,
      resultAngle
    ];
  }

  toX(text: string): number {
    return parseFloat(text);
  }

  toY(text: string): number {
    return parseFloat(text);
  }

  makePrecise(value: number): number {
    return Math.round(value * 1000) / 1000.0;
  }

  public inverse(x: number, y: number): number[] {
    const point = this.inverseRadians(x, y);
    point[0] = Angle.toDegrees(point[0]);
    point[1] = Angle.toDegrees(point[1]);
    return point;
  }

  public inverseRadians(x: number, y: number): number[] {
    throw new Error('Inverse operation not supported');
  }

  public project(lon: number, lat: number): number[] {
    const λ = Angle.toRadians(lon);
    const φ = Angle.toRadians(lat);
    return this.projectRadians(λ, φ);
  }

  public projectRadians(λ: number, φ: number): number[] {
    throw new Error('Inverse operation not supported');
  }

}
