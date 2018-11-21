

import reductionFromData from '../../test/data/reduction-from-ellipsoid.json';
import { Angle } from '../cs/Angle';
import { CSI } from '../cs/CSI';

describe('Reduction feom Ellipsoid', () => {

  it(`test-data`, () => {
    let hasError = false;
    for (let i = 0; i < reductionFromData.length; i++) {
      if (i > 0) {
        const values = reductionFromData[i];
        const lon1 = Number(values[0]);
        const lat1 = Number(values[1]);
        const height1 = Number(values[2]);
        const xsi = Number(values[3]);
        const eta = Number(values[4]);
        const lon2 = Number(values[5]);
        const lat2 = Number(values[6]);
        const height2 = Number(values[7]);
        const reducedDirection = Number(values[8]);
        const expectedSpatialDistance = Number(values[9]);
        const expectedSpatialDirection = Number(values[10]);
        const expectedAstronomicAzimuth = Number(values[11]);
        const expectedSlopeDistance = Number(values[12]);

        const cs = CSI.NAD83;

        const actualSpatialDistance = Math.round(cs.spatialDistanceHeight(lon1, lat1, height1, lon2, lat2, height2) * 1000) / 1000.0;
        const spatialDistanceDelta = Math.abs(actualSpatialDistance - expectedSpatialDistance);

        const actualSpatialDirection = cs.spatialDirection(lon1, lat1, height1, xsi, eta,
          lon2, lat2, height2, reducedDirection, 0, 0, -4.5);
        const spatialDirectionDelta = Math.abs(actualSpatialDirection - expectedSpatialDirection);

        const actualAstronomicAzimuth = cs.astronomicAzimuth(lon1, lat1, height1, xsi, eta,
          lon2, lat2, height2, 0, 0, -4.5);
        const astronomicAzimuthDelta = Math.abs(actualAstronomicAzimuth - expectedAstronomicAzimuth);

        const actualSlopeDistance = Math.round(cs.slopeDistance(lon1, lat1, height1,
          lon2, lat2, height2, 0, 0, -4.5) * 1000) / 1000;
        const slopeDistanceDelta = Math.abs(actualSlopeDistance - expectedSlopeDistance);

        if (spatialDistanceDelta > 1e-3 || spatialDirectionDelta > 1.0 / 3600 / 1000
          || astronomicAzimuthDelta > 1.0 / 3600 / 10 || slopeDistanceDelta > 1e-3) {
          fail(`${i}\t
SRID=4269;POINT(${lon1} ${lat1} ${height1})\t${xsi}\t${eta}
SRID=4269;POINT(${lon2} ${lat2} ${height2})\t${Angle.toDegreesMinutesSeconds(reducedDirection, 2)}
spatialDistance\t${expectedSpatialDistance}\t${actualSpatialDistance}
spatialDirection\t${Angle.toDegreesMinutesSeconds(expectedSpatialDirection, 3)}\t${Angle.toDegreesMinutesSeconds(actualSpatialDirection, 3)}
astronomicAzimuth\t${Angle.toDegreesMinutesSeconds(expectedAstronomicAzimuth, 1)}\t${Angle.toDegreesMinutesSeconds(actualAstronomicAzimuth, 1)}\t${astronomicAzimuthDelta}
spatialDistance\t${expectedSlopeDistance}\t${actualSlopeDistance}`);
          hasError = true;
          break;
        }
      }
    }
    expect(hasError).toBeFalsy();
  });
});

