import { Angle } from './Angle';
import { Numbers } from './Numbers';

export class Ellipsoid {

  static NAD83 = new Ellipsoid(6378137, null, 6356752.314);

  //  static NAD83 = new Ellipsoid(6378137, 298.257222101);

  static WGS84 = new Ellipsoid(6378137, 298.257223563);

  readonly f: number; // flattening

  readonly b: number; // semiMinorAxis

  readonly eSq: number;

  readonly e: number;

  readonly semiMajorAxis: number;

  readonly inverseFlattening: number;

  constructor(
    semiMajorAxis: number,
    inverseFlattening: number,
    semiMinorAxis: number = null
  ) {
    this.semiMajorAxis = semiMajorAxis;
    if (inverseFlattening === null) {
      this.inverseFlattening = semiMajorAxis / (semiMajorAxis - semiMinorAxis);
    } else {
      this.inverseFlattening = inverseFlattening;
    }
    this.f = 1 / this.inverseFlattening;
    if (semiMinorAxis === null) {
      this.b = this.a - this.a * this.f;
    } else {
      this.b = semiMinorAxis;
    }
    this.eSq = this.f + this.f - this.f * this.f;
    this.e = Math.sqrt(this.eSq);
  }

  get eccentricitySquared(): number {
    return this.eSq;
  }

  get eccentricity(): number {
    return this.e;
  }

  get a(): number {
    return this.semiMajorAxis;
  }

  get semiMinorAxis(): number {
    return this.b;
  }

  vincentyInverse(λ1: number, φ1: number, λ2: number, φ2: number): number[] {
    const π = Angle.π;
    const πx2 = Angle.πx2;
    const πo2 = π / 2;
    const a = this.a;
    const b = this.b;

    const sing = 1e-12;

    // Check that Point 1 is NOT the same as Point 2.

    if (Math.abs(φ1 - φ2) <= sing && Math.abs(λ1 - λ2) <= sing) {
      return [0, 0, 0];
    }

    /*  Convert Longitude to POSITIVE EAST, if necessary. */

    if (λ1 > 0. && λ1 < π) {
      λ1 = πx2 - λ1;
    }
    if (λ2 > 0. && λ2 < π) {
      λ2 = πx2 - λ2;
    }

    /*  ELLIPSOID PARAMETERS (ALSO VALID FOR A SPHERE OF RADIUS A) */

    const f = (a - b) / a;

    const b2 = b * b;
    const omf = 1. - f;
    /*  REDUCED LATITUDE OF POINTS 1 AND 2 AND THEIR TRIG FUNCTIONS AND */
    /*    COMBINATIONS */

    let u1 = πo2;
    if (φ1 < 0.) {
      u1 = -u1;
    }
    if (Math.abs(Math.abs(φ1) - πo2) > sing) {
      u1 = Math.atan(omf * Math.tan(φ1));
    }
    const su1 = Math.sin(u1);
    const cu1 = Math.cos(u1);
    let u2 = πo2;
    if (φ2 < 0.) {
      u2 = -u2;
    }
    if (Math.abs(Math.abs(φ2) - πo2) > sing) {
      u2 = Math.atan(omf * Math.tan(φ2));
    }
    const su2 = Math.sin(u2);
    const cu2 = Math.cos(u2);
    const cu1su2 = cu1 * su2;
    const su1cu2 = su1 * cu2;
    const su1su2 = su1 * su2;
    const cu1cu2 = cu1 * cu2;

    let iter = 0;
    const Δλ = λ2 - λ1;
    if (Math.abs(Δλ - π) < sing && Math.abs(φ1) < sing && Math.abs(φ2) < sing) {
      throw Error('WILL NOT HANDLE ANTIPODAL SOLUTION');
    }
    let dlas = Δλ;
    let sdlas;
    let cdlas;
    let ssig;
    let csig;
    let sig;
    let ctsm;
    let ctsm2;
    let calph2;
    while (true) {
      sdlas = Math.sin(dlas);
      cdlas = Math.cos(dlas);
      ssig = Math.sqrt(Math.pow(cu2 * sdlas, 2) + Math.pow(cu1su2 - su1cu2 * cdlas, 2));
      csig = su1su2 + cu1cu2 * cdlas;
      sig = Math.acos(csig);
      const salpha = cu1cu2 * sdlas / ssig;
      calph2 = 1. - salpha * salpha;
      ctsm = 0.;
      if (Math.abs(calph2) > sing) {
        ctsm = csig - su1su2 * 2. / calph2;
      }
      ctsm2 = ctsm * ctsm;
      const c = f / 16. * calph2 * (f * (4. - calph2 * 3.) + 4.);
      const dlasup = Δλ
        + (1. - c) * f * salpha
        * (sig + c * ssig * (ctsm + c * csig * (ctsm2 * 2. - 1.)));
      if (Math.abs(dlasup - dlas) < sing) {
        break;
      }
      dlas = dlasup;
      ++iter;
      if (iter > 50) {
        throw Error('WILL NOT HANDLE ANTIPODAL SOLUTION');
      }
    }

    /*  GEODESIC DISTANCE  (EQUATIONS 3,4,6,19) */

    const usq = calph2 * (a * a - b2) / b2;
    const a3 = usq / 16384.
      * (usq * (usq * (320. - usq * 175.) - 768.) + 4096.) + 1.;
    const b4 = usq / 1024. * (usq * (usq * (74. - usq * 47.) - 128.) + 256.);
    /* Computing 2nd Math.power */
    const delsig = b4 * ssig
      * (ctsm
        + b4 / 4.
        * (csig * (ctsm2 * 2. - 1.)
          - b4 / 6. * ctsm * (ssig * ssig * 4. - 3.)
          * (ctsm2 * 4. - 3.)));
    const distance = b * a3 * (sig - delsig);

    /*  GEODESIC AZIMUTHS 1 TO 2 AND 2 TO 1  (EQUATIONS 20 AND 21) */

    let angle1 = Math.atan2(cu2 * sdlas, cu1su2 - su1cu2 * cdlas);
    let angle2 = Math.atan2(-cu1 * sdlas, su1cu2 - cu1su2 * cdlas);
    if (angle1 > πx2) {
      angle1 -= πx2;
    }
    if (angle1 < 0.) {
      angle1 += πx2;
    }
    if (angle2 > πx2) {
      angle2 -= πx2;
    }
    if (angle2 < 0.) {
      angle2 += πx2;
    }
    return [distance, angle1, angle2];
  }

  vincenty(λ1: number, φ1: number, distance: number, α1: number): number[] {
    const sing = 1e-12;

    let west = false;
    if (λ1 > 0 && λ1 < Angle.π) {
      λ1 = Angle.π * 2 - λ1;
      west = true;
    }

    const a = this.semiMajorAxis;
    let b1 = this.semiMinorAxis;
    if (b1 === 0.) {
      b1 = a;
    }
    let b;
    let f;
    if (b1 > 1e3) {
      b = b1;
      f = (a - b) / a;
    }
    if (b1 < 1e3) {
      f = 1. / b1;
      b = a - a * f;
    }
    if (b === a) {
      b1 = 0.;
    }

    const bSq = b * b;
    const omf = 1 - f;

    const smax = a * Angle.π;
    if (distance > smax) {
      throw Error('Distance greater than 1/2 the ellipsoid');
    } else {
      const tpi = Angle.π * 2.;
      const pot = Angle.π / 2.;
      let U1 = pot;
      if (φ1 < 0.) {
        U1 = -U1;
      }
      if (Math.abs(Math.abs(φ1) - pot) > sing) {
        U1 = Math.atan(omf * Math.tan(φ1));
      }
      const sinU1 = Math.sin(U1);
      const cosU1 = Math.cos(U1);

      /*  TRIG FUNCTIONS OF FORWARD AZIMUTH */

      const cosα1 = Math.cos(α1);
      const sinα1 = Math.sin(α1);

      /*  COMPUTE SIGMA1  CHECK FOR ZERO  (EQUATION 1) */

      let σ1 = 0.;
      if (Math.abs(cosα1) > sing) {
        σ1 = Math.atan2(sinU1 / cosU1, cosα1);
      }

      /*  ALPHA AND ITS TRIG FUNCTIONS  (EQUATION 2) */

      const sinα = cosU1 * sinα1;
      const sinαSq = sinα * sinα;
      const cosαSq = 1. - sinαSq;
      const aSq = a * a;
      /*  U SQUARED  (NOTE  NOT REDUCED LATITUDE) */

      const μSq = cosαSq * (aSq - bSq) / bSq;

      /*  CONSTANTS A AND B  (EQUATIONS 3 AND 4) */

      const A = μSq / 16384.
        * (μSq * (μSq * (320. - μSq * 175.) - 768.) + 4096.) + 1.;
      const B = μSq / 1024. * (μSq * (μSq * (74. - μSq * 47.) - 128.) + 256.);

      /*  ITERATE TO FIND SIGMA TO 10-12 RADIANS  (EQUATIONS 5,6,7) */

      let iter = 0;
      const tsig1 = σ1 * 2.;
      const soba = distance / b / A;
      let sig = soba;
      let ddsig = 0.;
      let csig;
      let ssig;
      let ctsm;
      let ctsm2;
      while (true) {
        const tsigm = tsig1 + sig;
        ctsm = Math.cos(tsigm);
        /* Computing 2nd Math.power */
        ctsm2 = ctsm * ctsm;
        ssig = Math.sin(sig);
        const ssig2 = ssig * ssig;
        csig = Math.cos(sig);
        const delsig =
          B * ssig
          * (ctsm
            + B / 4.
            * (csig * (ctsm2 * 2. - 1.)
              - B / 6. * ctsm * (ssig2 * 4. - 3.)
              * (ctsm2 * 4. - 3.)));
        sig = soba + delsig;
        if ((Math.abs(ddsig - delsig)) < sing) {
          break;
        }
        ddsig = delsig;
        ++iter;
        if (iter > 50) {
          throw Error('Solution will not converge after 50 iterations');
        }
      }

      /*  CONSTANT TERMS IN REMAINING EQUATIONS */

      const sucs = sinU1 * csig;
      const cuss = cosU1 * ssig;
      const suss = sinU1 * ssig;
      const cucs = cosU1 * csig;

      /*  LATITUDE OF POINT 2  (EQUATION 8) */

      let φ2 = 0.;
      let dnum = sucs + cuss * cosα1;
      /* Computing 2nd Math.power */
      const sussMinusCucsCa12 = suss - cucs * cosα1;
      let den = omf * Math.sqrt(sinαSq + sussMinusCucsCa12 * sussMinusCucsCa12);
      if (Math.abs(dnum) > sing || Math.abs(den) > sing) {
        φ2 = Math.atan2(dnum, den);
      }

      /*  CHANGE IN LONGITUDE ON AUXILLARY SPHERE  (EQUATION 9) */

      let dlas = 0.;
      dnum = ssig * sinα1;
      den = cucs - suss * cosα1;
      if (Math.abs(dnum) > sing || Math.abs(den) > sing) {
        dlas = Math.atan2(dnum, den);
      }

      /*  CHANGE IN LONGITUDE AND LONGITUDE OF POINT 2  (EQUATIONS 10 AND 11) */

      const c = f / 16. * cosαSq * (f * (4. - cosαSq * 3.) + 4.);
      const dlam = dlas
        - (1. - c) * f * sinα
        * (sig + c * ssig * (ctsm + c * csig * (ctsm2 * 2. - 1.)));
      let λ2 = λ1 + dlam;
      if (λ2 < 0.) {
        λ2 += tpi;
      }
      if (λ2 > tpi) {
        λ2 -= tpi;
      }
      if (west) {
        λ2 = tpi - λ2;
      }

      /*  BACK AZIMUTH  (EQUATION 12) */

      let α2;
      if (Math.abs(α1) < sing) {
        α2 = Angle.π;
      }
      if (Math.abs(α1 - Angle.π) < sing) {
        α2 = 0.;
      }
      den = suss - cucs * cosα1;
      if (Math.abs(sinα) > sing || Math.abs(den) > sing) {
        α2 = Math.atan2(-sinα, den);
      }
      if (α2 > tpi) {
        α2 -= tpi;
      }
      if (α2 < 0.) {
        α2 += tpi;
      }
      return [λ2, φ2, α2];
    }
  }


  public astronomicAzimuth(λ1: number, φ1: number, height1: number, xsi: number,
    eta: number, λ2: number, φ2: number, height2: number, xo: number, yo: number, zo: number): number {
     const a = this.semiMajorAxis;
    const b = this.semiMinorAxis;


    const phim = (φ1 + φ2) / 2;
    const esq = (a * a - b * b) / (a * a);

    const mm = (a * (1 - esq) / Math.pow(Math.sqrt(1 - esq * Math.pow(Math.sin(φ1), 2)), 3)
        + a * (1 - esq) / Math.pow(Math.sqrt(1 - esq * Math.pow(Math.sin(φ2), 2)), 3)) / 2;
    const nm = (a / Math.sqrt(1 - esq * Math.pow(Math.sin(φ1), 2))
        + a / Math.sqrt(1 - esq * Math.pow(Math.sin(φ2), 2))) / 2;

    const lineMetrics = this.vincentyInverse(λ1, φ1, λ2, φ2);
  const s12 = lineMetrics[0];
    const a12 = lineMetrics[1];


    const ssq = this.slopeDistanceSquared(λ1, φ1, height1, λ2, φ2, height2, xo, yo,
        zo);

    const dh = 0;
    const c1 = (-(xsi) * Math.sin(a12) + eta * Math.cos(a12)) * dh
        / Math.sqrt(ssq - Math.pow(dh, 2));
    const c2 = height2 / mm * esq * Math.sin(a12) * Math.cos(a12) * Math.pow(Math.cos(φ2), 2);
    const c3 = -esq * Math.pow(s12, 2) * Math.pow(Math.cos(phim), 2) * Math.sin(a12 * 2)
        / (Math.pow(nm, 2) * 12);
    return a12 + eta * Math.tan(φ1) - c1 - c2 - c3;
  }


  public geodeticAzimuth(lon1: number, lat1: number, h1: number, xsi: number,
    eta: number, lon2: number, lat2: number, h2: number, x0: number,
    y0: number, z0: number, spaz: number): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);
    spaz = Angle.toRadians(spaz);
    xsi = Angle.toRadians(xsi);
    eta = Angle.toRadians(eta);
    const radians = this.geodeticAzimuthRadians(λ1, φ1, h1, xsi, eta, λ2, φ2, h2,
      x0, y0, z0, spaz);
    return Angle.toDegrees360(radians);
  }

  public geodeticAzimuthRadians(λ1: number, φ1: number, h1: number,
    xsi: number, eta: number, λ2: number, φ2: number, h2: number,
    x0: number, y0: number, z0: number, astronomicAzimuth: number): number {
    const a = this.semiMajorAxis;
    const b = this.semiMinorAxis;

    const φm = (φ1 + φ2) / 2.;
    const esq = (a * a - b * b) / (a * a);
    const sinφ1 = Math.sin(φ1);
    const mm1 = Math.sqrt(1. - esq * (sinφ1 * sinφ1));
    const sinφ2 = Math.sin(φ2);
    const mm2 = Math.sqrt(1. - esq * (sinφ2 * sinφ2));
    const mm = (a * (1 - esq) / (mm1 * (mm1 * mm1)) + a * (1 - esq) / (mm2 * (mm2 * mm2)))
      / 2;
    const nm = (a / mm1 + a / mm2) / 2;

    const a12 = this.azimuthRadians(λ1, φ1, λ2, φ2);

    const s12 = this.distanceMetresRadians(λ1, φ1, λ2, φ2);

    // Always 0 as dh = 0
    const c1 = 0; // (-(xsi) * Math.sin(a12) + eta * Math.cos(a12)) * 0 / sqrt(ssq - 0 * 0);

    const cosφ2 = Math.cos(φ2);
    const c2 = h2 / mm * esq * Math.sin(a12) * Math.cos(a12) * (cosφ2 * cosφ2);

    const cosφm = Math.cos(φm);
    const c3 = -esq * (s12 * s12) * (cosφm * cosφm) * Math.sin(a12 * 2) / (nm * nm * 12);

    let geodeticAzimuth = astronomicAzimuth - eta * Math.tan(φ1) + c1 + c2 + c3;
    if (geodeticAzimuth < 0) {
      geodeticAzimuth = Angle.πx2 + geodeticAzimuth;
    }
    return geodeticAzimuth;
  }

  public horizontalEllipsoidFactor(lon1: number, lat1: number, h1: number,
    lon2: number, lat2: number, h2: number, spatialDistance: number): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);
    return this.horizontalEllipsoidFactorRadians(λ1, φ1, h1,
      λ2, φ2, h2, spatialDistance);
  }

  public horizontalEllipsoidFactorRadians(λ1: number, φ1: number, h1: number,
    λ2: number, φ2: number, h2: number, spatialDistance: number): number {
    const distanceAndAngles = this.vincentyInverse(λ1, φ1, λ2, φ2);
    const a12 = distanceAndAngles[1];
    const a21 = distanceAndAngles[2];
    const r1 = this.radius(φ1, a12);
    const r2 = this.radius(φ2, a21);
    const deltaH = Math.abs(h2 - h1);
    if (deltaH > 30) {
      return r1 / (r1 + h1);
    } else {
      return 1 / Math.sqrt((h1 / r1 + 1) * (h2 / r2 + 1));
    }
  }

  public spatialDistance(lon1: number, lat1: number, h1: number, heightOfInstrument: number, heightOfTarget: number,
    lon2: number, lat2: number, h2: number, spatialDistance: number): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);
    return this.spatialDistanceRadians(λ1, φ1, h1, heightOfInstrument, heightOfTarget, λ2,
      φ2, h2, spatialDistance);
  }

  public spatialDistanceRadians(λ1: number, φ1, h1: number, heightOfInstrument: number, heightOfTarget: number,
    λ2: number, φ2, h2: number, spatialDistance: number): number {

    const a12 = this.azimuthRadians(λ1, φ1, λ2, φ2);
    const a21 = this.azimuthRadians(λ2, φ2, λ1, φ1);
    const r1 = this.radius(φ1, a12);
    const r2 = this.radius(φ2, a21);

    h1 += heightOfInstrument;
    h2 += heightOfTarget;
    const deltaH = h2 - h1;
    const deltaHSq = deltaH * deltaH;
    if (spatialDistance * spatialDistance - deltaHSq >= 0) {
      const twor = r1 + r2;
      const lo = Math
        .sqrt((spatialDistance * spatialDistance - deltaHSq) / ((h1 / r1 + 1) * (h2 / r2 + 1)));
      return twor * Math.asin(lo / twor);
    } else {
      return spatialDistance;
    }
  }

  public ellipsoidDirection(lon1: number, lat1: number, h1: number, xsi: number, eta: number,
    lon2: number, lat2: number, h2: number, x0: number, y0: number, z0: number, spatialDirection: number): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);
    eta = Angle.toRadians(eta);
    xsi = Angle.toRadians(xsi);
    spatialDirection = Angle.toRadians(spatialDirection);
    const radians = this.ellipsoidDirectionRadians(λ1, φ1, h1, xsi, eta, λ2, φ2, h2,
      x0, y0, z0, spatialDirection);
    return Angle.toDegrees360(radians);
  }

  public ellipsoidDirectionRadians(λ1: number, φ1: number, h1: number, xsi: number, eta: number,
    λ2: number, φ2: number, h2: number, x0: number, y0: number, z0: number, spatialDirection: number) {
    const a = this.semiMajorAxis;
    const b = this.semiMinorAxis;

    const esq = (a * a - b * b) / (a * a);

    const sinφ1 = Math.sin(φ1);
    const sinφ2 = Math.sin(φ2);
    const d__1 = Math.sqrt(1. - esq * (sinφ1 * sinφ1));
    const d__4 = Math.sqrt(1 - esq * (sinφ2 * sinφ2));
    const mm = (a * (1 - esq) / (d__1 * (d__1 * d__1))
      + a * (1 - esq) / (d__4 * (d__4 * d__4))) / 2.;
    const nm = (a / Math.sqrt(1 - esq * (sinφ1 * sinφ1))
      + a / Math.sqrt(1 - esq * (sinφ2 * sinφ2))) / 2.;

    const s12 = this.distanceMetresRadians(λ1, φ1, λ2, φ2);
    const a12 = this.azimuthRadians(λ1, φ1, λ2, φ2);

    const slopeDistance = this.slopeDistance(λ1, φ1, h1, λ2, φ2, h2, x0,
      y0, z0);

    const dh = h2 - h1;
    const c1 = (-xsi * Math.sin(a12) + eta * Math.cos(a12)) * dh / Math.sqrt(slopeDistance * slopeDistance - dh * dh);

    const cosφ2 = Math.cos(φ2);
    const c2 = h2 * esq * Math.sin(a12) * Math.cos(a12) * cosφ2 * cosφ2 / mm;

    const φm = (φ1 + φ2) / 2;
    const cosφm = Math.cos(φm);
    const c3 = -esq * s12 * s12 * cosφm * cosφm * Math.sin(a12 * 2) / (nm * nm * 12);
    return spatialDirection + c1 + c2 + c3;
  }

  public slopeDistanceSquared(λ1: number, φ1: number, h1: number, λ2: number, φ2: number, h2: number,
    xo: number, yo: number, zo: number): number {
    const p1 = this.ellipsoidalToCartesianCoordinates(λ1, φ1, h1, xo, yo, zo);
    const p2 = this.ellipsoidalToCartesianCoordinates(λ2, φ2, h2, xo, yo, zo);

    const deltaX = p1[0] - p2[0];
    const deltaY = p1[1] - p2[1];
    const deltaZ = p1[2] - p2[2];
    return deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
   }

  public slopeDistance(λ1: number, φ1: number, h1: number, λ2: number, φ2: number, h2: number,
    xo: number, yo: number, zo: number): number {
    const ssq = this.slopeDistanceSquared(λ1, φ1, h1, λ2, φ2, h2, xo, yo, zo);
    return Math.sqrt(ssq);
  }

  public spatialDirection(λ1: number, φ1: number, h1: number, xsi: number, eta: number,
    λ2: number, φ2: number, h2: number, reducedDirection: number, xo: number, yo: number, zo: number): number {
    const a = this.semiMajorAxis;
    const b = this.semiMinorAxis;

    const phim = (φ1 + φ2) / 2;
    const esq = (a * a - b * b) / (a * a);

    const mm = (a * (1 - esq) / Math.pow(Math.sqrt(1 - esq * Math.pow(Math.sin(φ1), 2)), 3)
      + a * (1 - esq) / Math.pow(Math.sqrt(1 - esq * Math.pow(Math.sin(φ2), 2)), 3)) / 2;

    const nm = (a / Math.sqrt(1 - esq * Math.pow(Math.sin(φ1), 2))
      + a / Math.sqrt(1 - esq * Math.pow(Math.sin(φ1), 2))) / 2;

    const lineMetrics = this.vincentyInverse(λ1, φ1, λ2, φ2);
    const s12 = lineMetrics[0];
    const a12 = lineMetrics[1];

    const xyz1 = this.ellipsoidalToCartesianCoordinates(λ1, φ1, h1, xo, yo, zo);

    const xyz2 = this.ellipsoidalToCartesianCoordinates(λ2, φ2, h2, xo, yo, zo);

    const ssq = Math.pow(xyz1[0] - xyz2[0], 2) + Math.pow(xyz1[1] - xyz2[1], 2) + Math.pow(xyz1[2] - xyz2[2], 2);

    const dh = 0; // could remove this and resulting multiplies
    const c1 = (-(xsi) * Math.sin(a12) + eta * Math.cos(a12)) * dh
      / Math.sqrt(ssq - Math.pow(dh, 2));
    const c2 = h2 / mm * esq * Math.sin(a12) * Math.cos(a12) * Math.pow(Math.cos(φ2), 2);
    const c3 = -esq * Math.pow(s12, 2) * Math.pow(Math.cos(phim), 2) * Math.sin(a12 * 2)
      / (Math.pow(nm, 2) * 12);

    return reducedDirection - c1 - c2 - c3;
  }

  private ellipsoidalToCartesianCoordinates(λ: number, φ: number, h: number, xo: number, yo: number, zo: number): number[] {
    const a = this.semiMajorAxis;
    const b = this.semiMinorAxis;

    const e2 = (a * a - b * b) / (a * a);
    const sp = Math.sin(φ);
    const cp = Math.cos(φ);

    const n = a / Math.sqrt(1 - e2 * (sp * sp));
    const x = xo + (n + h) * cp * Math.cos(λ);
    const y = yo + (n + h) * cp * Math.sin(λ);
    const z = zo + (n * (1 - e2) + h) * sp;
    return [
      x, y, z
    ];
  }

  azimuth(lon1: number, lat1: number, lon2: number, lat2: number, precision: number = 10000000): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);

    const azimuth = this.azimuthRadians(λ1, φ1, λ2, φ2);
    return Numbers.makePrecise(precision, Angle.toDegrees360(azimuth));
  }

  azimuthRadians(λ1: number, φ1: number, λ2: number, φ2: number): number {
    return this.vincentyInverse(λ1, φ1, λ2, φ2)[1];
  }

  azimuthBackwards(lon1: number, lat1: number, lon2: number, lat2: number, precision: number = 10000000): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);

    const azimuth = this.azimuthBackwardsRadians(λ1, φ1, λ2, φ2);
    return Numbers.makePrecise(precision, Angle.toDegrees360(azimuth));
  }

  azimuthBackwardsRadians(λ1: number, φ1: number, λ2: number, φ2: number): number {
    return this.vincentyInverse(λ1, φ1, λ2, φ2)[2];
  }

  distanceMetres(lon1: number, lat1: number, lon2: number, lat2: number, precision: number = 10000000): number {
    const λ1 = Angle.toRadians(lon1);
    const φ1 = Angle.toRadians(lat1);
    const λ2 = Angle.toRadians(lon2);
    const φ2 = Angle.toRadians(lat2);
    return this.distanceMetresRadians(λ1, φ1, λ2, φ2);
  }

  distanceMetresRadians(λ1: number, φ1: number, λ2: number, φ2: number, precision: number = 10000000): number {
    return this.vincentyInverse(λ1, φ1, λ2, φ2)[0];
  }


  public radius(φ: number, alpha: number): number {
    const a = this.a;
    const b = this.b;
    const f = (a - b) / a;
    const ecc = f * (2. - f);

    const denom = Math.sqrt(1. - ecc * Math.pow(Math.sin(φ), 2));
    const primeVerticalRadius = a / denom;
    const meridianRadius = a * (1. - ecc) / Math.pow(denom, 3);
    return primeVerticalRadius * meridianRadius
      / (primeVerticalRadius * Math.pow(Math.cos(alpha), 2)
        + meridianRadius * Math.pow(Math.sin(alpha), 2));
  }

  public spatialDistanceHeight(λ1: number, φ1: number, h1: number,
    λ2: number, φ2: number, h2: number): number {
    const distanceAngles = this.vincentyInverse(λ1, φ1, λ2, φ2);
    const distance = distanceAngles[0];
    const a12 = distanceAngles[1];
    const a21 = distanceAngles[2];

    const r1 = this.radius(φ1, a12);
    const r2 = this.radius(φ2, a21);

    const twor = r1 + r2;
    const delhsq = Math.pow(h2 - h1, 2);
    const losq = Math.pow(twor * Math.sin(distance / twor), 2);
    return Math.sqrt(losq * (h1 / r1 + 1.) * (h2 / r2 + 1.) + delhsq);
  }

  pointOffset(lon: number, lat: number, distance: number, angle: number): number[] {
    let λ1 = Angle.toRadians(-lon);
    const φ1 = Angle.toRadians(lat);
    const angle12 = Angle.toRadians(angle);

    const a = this.a;
    const b = this.b;
    const f = (a - b) / a;

    const sinangle = Math.sin(angle12);
    const cosangle = Math.cos(angle12);

    let west = false;
    if (λ1 > 0 && λ1 < Math.PI) {
      λ1 = Math.PI * 2 - λ1;
      west = true;
    }

    const b2 = b * b;

    const smax = a * Math.PI;
    if (distance > smax) {
      return [NaN, NaN];
    }

    const pot = Math.PI / 2;
    let redlat = pot;
    if (φ1 < 0.) {
      redlat = -redlat;
    }
    const sing = 1e-12;
    if ((Math.abs(Math.abs(φ1) - pot)) > sing) {
      redlat = Math.atan((1 - f) * Math.tan(φ1));
    }
    const su = Math.sin(redlat);
    const cu = Math.cos(redlat);

    let sigma1 = 0;
    if (Math.abs(cosangle) > sing) {
      sigma1 = Math.atan2(su / cu, cosangle);
    }

    const sa = cu * sinangle;
    const sa2 = sa * sa;
    const alpha = Math.asin(sa);
    const ca = Math.cos(alpha);
    const ca2 = 1. - sa2;

    const uSq = ca2 * (a * a - b2) / b2;
    const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

    let iter = 0;
    const tsigma1 = sigma1 * 2.;
    const soba = distance / b / A;
    let sigma = soba;
    let lastSigma;
    let cos2Sigma;
    let cos2SigmaSq;
    let sinSigma;
    let cosSigma;

    do {
      cos2Sigma = Math.cos(2 * sigma1 + sigma);
      cos2SigmaSq = cos2Sigma * cos2Sigma;
      sinSigma = Math.sin(sigma);
      const sinSigmaSq = sinSigma * sinSigma;
      cosSigma = Math.cos(sigma);
      const deltaSigma = B * sinSigma * (cos2Sigma + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaSq) -
        B / 6 * cos2Sigma * (-3 + 4 * sinSigmaSq) * (-3 + 4 * cos2SigmaSq)));
      sigma = soba + deltaSigma;
      if (Math.abs(lastSigma - deltaSigma) < sing) {
        break;
      }
      lastSigma = deltaSigma;
      ++iter;
      if (iter > 50) {
        return [NaN, NaN];
      }
    } while (true);

    const sucs = su * cosSigma;
    const cuss = cu * sinSigma;
    const suss = su * sinSigma;
    const cucs = cu * cosSigma;

    let φ2 = 0;
    let dnum = sucs + cuss * cosangle;
    const d__1 = suss - cucs * cosangle;
    let den = (1 - f) * Math.sqrt(sa2 + d__1 * d__1);
    if (Math.abs(dnum) > sing || Math.abs(den) > sing) {
      φ2 = Math.atan2(dnum, den);
    }

    let dlas = 0;
    dnum = sinSigma * sinangle;
    den = cucs - suss * cosangle;
    if (Math.abs(dnum) > sing || Math.abs(den) > sing) {
      dlas = Math.atan2(dnum, den);
    }


    const c = f / 16. * ca2 * (f * (4. - ca2 * 3.) + 4.);
    const dlam = dlas - (1. - c) * f * sa * (sigma + c * sinSigma * (cos2Sigma + c * cosSigma * (
      cos2SigmaSq * 2. - 1.)));
    let λ2 = λ1 + dlam;
    if (λ2 < 0) {
      λ2 += Math.PI;
    }
    if (λ2 > Math.PI) {
      λ2 -= Math.PI;
    }
    if (west) {
      λ2 = Math.PI - λ2;
    }
    let a21;
    if (Math.abs(angle12) < sing) {
      a21 = Math.PI;
    }
    if (Math.abs(angle12 - Math.PI) < sing) {
      a21 = 0;
    }
    den = suss - cucs * cosangle;
    if (Math.abs(sa) > sing || Math.abs(den) > sing) {
      a21 = Math.atan2(-sa, den);
    }
    if (a21 > Math.PI) {
      a21 -= Math.PI;
    }
    if (a21 < 0.) {
      a21 += Math.PI;
    }
    return [
      Angle.toDegrees(-λ2),
      Angle.toDegrees(φ2)
    ];
  }
}
