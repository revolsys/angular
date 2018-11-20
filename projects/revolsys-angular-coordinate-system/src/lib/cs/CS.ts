import { Ellipsoid } from './Ellipsoid';

export abstract class CS {

  constructor(
    public id: number,
    public name: string
  ) {
  }

  abstract angle(x1: number, y1: number, x2: number, y2: number): number;

  angleBackwards(x1: number, y1: number, x2: number, y2: number): number {
    return this.angle(x2, y2, x1, y1);
  }

  abstract angleEllipsoid(x1: number, y1: number, x2: number, y2: number): number;

  abstract distanceMetres(x1: number, y1: number, x2: number, y2: number): number;

  abstract spatialDirection(x1: number, y1: number, h1: number, xsi: number, eta: number,
    x2: number, y2: number, h2: number, reducedDirection: number, xo: number, yo: number, zo: number): number;

  abstract spatialDistanceHeight(x1: number, y1: number, h1: number, x2: number, y2: number, h2: number): number;

  abstract distanceMetresEllipsoid(x1: number, y1: number, x2: number, y2: number): number;

  abstract makePrecise(value: number): number;

  abstract pointOffset(x: number, y: number, distance: number, angle: number): number[];

  abstract pointOffsetAngle(x: number, y: number, distance: number, angle: number): number[];

  abstract toX(text: string);

  abstract toY(text: string);

  abstract convertPoint(cs: CS, x: number, y: number): number[];

  abstract get ellipsoid(): Ellipsoid;

  public equals(cs: CS): boolean {
    if (this === cs) {
      return true;
    } else if (cs) {
      return this.name === cs.name;
    } else {
      return false;
    }
  }

  public project(lon: number, lat: number): number[] {
    return [lon, lat];
  }
}
