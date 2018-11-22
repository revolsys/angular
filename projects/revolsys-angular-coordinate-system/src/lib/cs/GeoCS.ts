import { Angle } from './Angle';
import { CS } from './CS';
import { Ellipsoid } from './Ellipsoid';

export class GeoCS extends CS {
  private _df: number;

  get ellipsoid(): Ellipsoid {
    return this._ellipsoid;
  }

  constructor(
    id: number,
    name: string,
    private _ellipsoid: Ellipsoid,
    public readonly primeMeridian: number,
    private _rf: number
  ) {
    super(id, name);
    if (_rf = Angle.RAD_DEGREE) {
      this._df = 1;
    } else {
      this._df = Angle.toDegrees(this._rf);
    }
  }

  get conversionFactor(): number {
    return this._rf;
  }

  angle(x1: number, y1: number, x2: number, y2: number): number {
    return this.ellipsoid.azimuth(x1, y1, x2, y2);
  }

  angleBackwards(x1: number, y1: number, x2: number, y2: number): number {
    return this.ellipsoid.azimuthBackwards(x1, y1, x2, y2);
  }
  angleEllipsoid(x1: number, y1: number, x2: number, y2: number): number {
    return this.ellipsoid.azimuth(x1, y1, x2, y2);
  }


  public astronomicAzimuth(lon1: number, lat1: number, height1: number, xsi: number,
    eta: number, lon2: number, lat2: number, height2: number,
    xo: number, yo: number, zo: number): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);
    xsi = Angle.toRadians(xsi / 3600);
    eta = Angle.toRadians(eta / 3600);

    const astronomicAzimuth = this.ellipsoid.astronomicAzimuth(λ1, φ1, height1, xsi, eta, λ2, φ2, height2, xo, yo, zo);
    return Math.abs(Angle.toDegrees(astronomicAzimuth));
  }

  convertPoint(cs: CS, x: number, y: number): number[] {
    // No datum conversion
    if (this === cs || cs == null || cs instanceof GeoCS) {
      return [x, y];
    } else {
      return cs.project(x, y);
    }
  }

  distanceMetres(x1: number, y1: number, x2: number, y2: number) {
    return this.ellipsoid.distanceMetres(x1, y1, x2, y2);
  }

  distanceMetresEllipsoid(x1: number, y1: number, x2: number, y2: number) {
    return this.distanceMetres(x1, y1, x2, y2);
  }

  public ellipsoidDirection(lon1: number, lat1: number, height1: number, xsi: number, eta: number,
    lon2: number, lat2: number, height2: number, observedDirection: number, xo: number, yo: number, zo: number): any {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);
    xsi = Angle.toRadians(xsi / 3600);
    eta = Angle.toRadians(eta / 3600);
    observedDirection = Angle.toRadians(observedDirection);

    const ellipsoidDirection = this.ellipsoid.ellipsoidDirection(λ1, φ1, height1, xsi, eta, λ2, φ2, height2, observedDirection, xo, yo, zo);
    return Angle.toDegrees(ellipsoidDirection);
  }

  public geodeticAzimuth(lon1: number, lat1: number, h1: number,
    xsi: number, eta: number, lon2: number, lat2: number, h2: number,
    astronomicAzimuth: number, xo: number, yo: number, zo: number): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);

    xsi = Angle.toRadians(xsi / 3600);
    eta = Angle.toRadians(eta / 3600);
    astronomicAzimuth = Angle.toRadians(astronomicAzimuth);

    const geodeticAzimuth = this.ellipsoid.geodeticAzimuth(λ1, φ1, h1, xsi, eta, λ2,
      φ2, h2, astronomicAzimuth, xo, yo, zo);
    return Angle.toDegrees(geodeticAzimuth);
  }

  public slopeDistance(lon1: number, lat1: number, h1: number, lon2: number, lat2: number, h2: number,
    xo: number, yo: number, zo: number): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);
    return this.ellipsoid.slopeDistance(λ1, φ1, h1, λ2, φ2, h2, xo, yo, zo);
  }

  public spatialDirection(lon1: number, lat1: number, h1: number, xsi: number, eta: number,
    lon2: number, lat2: number, h2: number, reducedDirection: number, xo: number, yo: number, zo: number): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);

    eta = Angle.toRadians(eta / 3600);
    xsi = Angle.toRadians(xsi / 3600);
    reducedDirection = Angle.toRadians(reducedDirection);

    const spatialDirection = this.ellipsoid.spatialDirection(λ1, φ1, h1, xsi, eta, λ2, φ2, h2, reducedDirection, xo, yo, zo);
    return Math.abs(Angle.toDegrees(spatialDirection));
  }

  public spatialDistanceHeight(lon1: number, lat1: number, h1: number,
    lon2: number, lat2: number, h2: number): number {
    const λ1 = Angle.toRadians(-lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(-lon2);
    const φ2 = Angle.toRadians(lat2);
    return this._ellipsoid.spatialDistanceHeight(λ1, φ1, h1, λ2, φ2, h2);
  }


  public spatialDistanceReduction(lon1: number, lat1: number, h1: number, heightOfInstrument: number,
    lon2: number, lat2: number, h2: number, heightOfTarget: number, distance: number): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);
    return this.ellipsoid.spatialDistanceReduction(λ1, φ1, h1, heightOfInstrument, λ2,
      φ2, h2, heightOfTarget, distance);
  }

  public horizontalEllipsoidalFactor(lon1: number, lat1: number, height1: number,
    lon2: number, lat2: number, height2: number): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);
    return this.ellipsoid.horizontalEllipsoidalFactor(λ1, φ1, height1, λ2, φ2, height2);
  }

  makePrecise(value: number): number {
    return Math.round(value * 10000000) / 10000000.0;
  }

  pointOffset(x: number, y: number, distance: number, angle: number): number[] {
    return this.ellipsoid.pointOffset(x, y, distance, angle);
  }

  pointOffsetAngle(x: number, y: number, distance: number, angle: number): number[] {
    const lon = Angle.toRadians(-x);
    const lat = Angle.toRadians(y);
    angle = Angle.toRadians(angle);
    const result = this.ellipsoid.vincenty(lon, lat, distance, angle);
    for (let i = 0; i < result.length; i++) {
      result[i] = Angle.toDegrees(result[i]);
    }
    result[0] = -result[0];
    return result;
  }

  toDegrees(value: number): number {
    if (this._df === 1) {
      return value;
    } else {
      return value * this._df;
    }
  }

  toX(text: string): number {
    const degrees = Angle.toDecimalDegrees(text, Angle.RE_LON);
    if (degrees > 0 && this.name === 'NAD83') {
      return -degrees;
    } else {
      return degrees;
    }
  }

  toY(text: string): number {
    return Angle.toDecimalDegrees(text, Angle.RE_LAT);
  }

  toRadians(value: number): number {
    if (this._rf === 1) {
      return value;
    } else {
      return value * this._rf;
    }
  }

}
