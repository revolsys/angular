import {Angle} from './Angle';
import {Ellipsoid} from './Ellipsoid';
import {CS} from './CS';
import {GeoCS} from './GeoCS';
import {AlbersConicEqualArea} from './AlbersConicEqualArea';
import {TransverseMercator} from './TransverseMercator';
import {TransverseMercatorThomas} from './TransverseMercatorThomas';

export class CSI {
  private static utmNCS: {[zone: number]: TransverseMercator} = {};

  static readonly NAD83 = new GeoCS(4269, 'NAD83', Ellipsoid.NAD83, 0, Angle.RAD_DEGREE);

  static readonly WGS84 = new GeoCS(4326, 'WGS84', Ellipsoid.WGS84, 0, Angle.RAD_DEGREE);

  static readonly BC_ALBERS = new AlbersConicEqualArea(3005, 'NAD83 / BC Albers', CSI.NAD83, 50, 58.5, 45, -126, 1000000, 0);

  static utmN(zone: number): TransverseMercator {
    let utm = CSI.utmNCS[zone];
    if (!utm) {
      utm = new TransverseMercatorThomas(26900 + zone, `NAD83 / UTM zone ${zone}N`, CSI.NAD83, 0, -183 + zone * 6, 0.9996, 500000, 0);
      CSI.utmNCS[zone] = utm;
    }
    return utm;
  }

  static getCs(csId: number): CS {
    switch (csId) {
      case 4269:
        return CSI.NAD83;
      case 4326:
        return CSI.WGS84;
      default:
        if (csId > 26900 && csId <= 26923) {
          return CSI.utmN(csId - 26900);
        } else {
          return null;
        }
    }
  }
}
