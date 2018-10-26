import { Angle } from './Angle';
import { CS } from './CS';
import { GeoCS } from './GeoCS';
import { CSI } from './CSI';
import { ProjCS } from './ProjCS';

export class Point {

  cs: CS = CSI.NAD83;

  _x = null;

  _y = null;

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get lat(): number {
    if (this.cs instanceof ProjCS) {
      const geoCS = this.cs.geoCS;
      const lonLat = this.cs.convertPoint(geoCS, this._x, this._y);
      return lonLat[0];
    } else {
      return this._y;
    }
  }

  get lon(): number {
    if (this.cs instanceof ProjCS) {
      const geoCS = this.cs.geoCS;
      const lonLat = this.cs.convertPoint(geoCS, this._x, this._y);
      return lonLat[0];
    } else {
      return this._x;
    }
  }

  set x(x: number) {
    this._x = x;
  }

  static newPoint(data: any): Point {
    const point = new Point();
    const cs = data['cs'];
    if (cs instanceof CS) {
      point.cs = cs;
    }
    point.setX(data['x']);
    point.setY(data['y']);
    return point;
  }

  set y(y: number) {
    this._y = y;
  }

  setX(x: string) {
    this.x = this.cs.toX(x);
  }

  setY(y: string) {
    this._y = this.cs.toY(y);
  }

  formatX(angleFormat: string = 'decimal'): string {
    if (this.x == null || isNaN(this.x)) {
      return '';
    } else {
      if (this.cs instanceof GeoCS) {
        if ('DMS' === angleFormat) {
          return Angle.toDegreesMinutesSecondsLon(this.x, 5);
        } else {
          return this.x.toString();
        }
      } else {
        return this.x.toFixed(3);
      }
    }
  }

  formatY(angleFormat: string = 'decimal'): string {
    if (this.y == null || isNaN(this.y)) {
      return '';
    } else {
      if (this.cs instanceof GeoCS) {
        if ('DMS' === angleFormat) {
          return Angle.toDegreesMinutesSecondsLat(this.y, 5);
        } else {
          return this.y.toString();
        }
      } else {
        return this.y.toFixed(3);
      }
    }
  }
}
