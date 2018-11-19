import { Angle } from './Angle';
import { ProjCS } from './ProjCS';
import { GeoCS } from './GeoCS';

export class TransverseMercator extends ProjCS {
  public readonly a: number;

  public readonly b: number;

  public readonly λo: number;

  public readonly φo: number;


  constructor(
    id: number,
    name: string,
    geoCS: GeoCS,
    public readonly latitudeOfOrigin: number,
    public readonly centralMeridan: number,
    public readonly ko: number,
    public readonly xo: number,
    public readonly yo: number,
  ) {
    super(id, name, geoCS);
    const centralMeridian = centralMeridan;

    const ellipsoid = geoCS.ellipsoid;
    this.λo = Angle.toRadians(centralMeridian);
    this.φo = Angle.toRadians(centralMeridian);
    this.a = ellipsoid.semiMajorAxis;
    this.b = ellipsoid.semiMinorAxis;
  }

  public sinPhi(x1: number, y1: number, x2: number, y2: number): number {
    const phi1 = this.inverseRadians(x1, y1)[1];
    const phi2 = this.inverseRadians(x2, y2)[1];
    const phi = (phi1 + phi2) / 2;
    return Math.sin(phi);
  }

  public ttCorrection(x1: number, y1: number, x2: number, y2: number): number {
    const a = this.a;
    const b = this.b;
    const xo = this.xo;
    const sinφ = this.sinPhi(x1, y1, x2, y2);

    const Δx1 = x1 - xo;
    const Δx2 = x2 - xo;
    const esq = 1 - Math.pow(b / a, 2);
    const rsq = Math.pow(b / (1 - esq * (sinφ * sinφ)), 2);
    const rsq6 = rsq * 6;
    const x = Δx2 + Δx1 * 2;
    const tt = (y2 - y1) * x / rsq6 * (1 - x * x / (rsq * 27));
    const dmsParts = Angle.radianToDMS(tt);
    return dmsParts[2];
  }

  public lineScaleFactor(x1: number, y1: number, x2: number, y2: number): number {
    const a = this.a;
    const b = this.b;
    const x0 = this.xo;
    const sf = this.ko;

    const sinPhi = this.sinPhi(x1, y1, x2, y2);

    const xi = x1 - x0;
    const xj = x2 - x0;
    const bOverA = b / a;
    const esq = 1 - bOverA * bOverA;
    const r = b / (1 - esq * (sinPhi * sinPhi));
    const rsq = r * r;
    const rsq6 = rsq * 6;
    const xusq = xi * xi + xi * xj + xj * xj;
    return sf * (xusq / rsq6 * (xusq / (rsq * 36) + 1) + 1);
  }
}
