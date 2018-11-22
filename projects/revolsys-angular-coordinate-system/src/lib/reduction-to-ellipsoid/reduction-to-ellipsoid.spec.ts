import reductionFromData from '../../test/data/reduction-to-ellipsoid.json';
import { Angle } from '../cs/Angle';
import { CSI } from '../cs/CSI';

describe('Reduction to Ellipsoid', () => {

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
        const heightOfInstrument = Number(values[5]);
        const heightOfTarget = Number(values[6]);
        const lon2 = Number(values[7]);
        const lat2 = Number(values[8]);
        const height2 = Number(values[9]);
        const distance = Number(values[10]);
        const observedDirection = Number(values[11]);
        const astronomicAzimuth = Number(values[12]);
        const expectedHorizontalEllipsoidalFactor = Number(values[13]);
        const expectedSpatialEllipsoidalDistance = Number(values[14]);
        const expectedEllipsoidDirection = Number(values[15]);
        const expectedGeodeticAzimuth = Number(values[16]);

        const cs = CSI.NAD83;

        const actualHorizontalEllipsoidalFactor = Math.round(cs.horizontalEllipsoidalFactor(lon1, lat1, height1, lon2, lat2, height2) * 1e8) / 1e8;
        const horizontalEllipsoidalFactorDelta = Math.abs(actualHorizontalEllipsoidalFactor - expectedHorizontalEllipsoidalFactor);

        const actualSpatialEllipsoidalDistance = cs.spatialDistanceReduction(lon1, lat1, height1, heightOfInstrument, lon2, lat2, height2, heightOfTarget, distance);
        const spatialEllipsoidalDistanceDelta = Math.abs(actualSpatialEllipsoidalDistance - expectedSpatialEllipsoidalDistance);

        const actualEllipsoidDirection = cs.ellipsoidDirection(lon1, lat1, height1, xsi, eta,
          lon2, lat2, height2, observedDirection, 0, 0, -4.5);
        const ellipsoidDirectionDelta = Math.abs(actualEllipsoidDirection - expectedEllipsoidDirection);

        const actualGeodeticAzimuth = cs.geodeticAzimuth(lon1, lat1, height1, xsi, eta,
          lon2, lat2, height2, astronomicAzimuth, 0, 0, -4.5);
        const geodeticAzimuthDelta = Math.abs(actualGeodeticAzimuth - expectedGeodeticAzimuth);

        if (spatialEllipsoidalDistanceDelta > 1e-3 || ellipsoidDirectionDelta > 1.0 / 3600 / 10 ||
          geodeticAzimuthDelta > 1.0 / 3600 / 10 || horizontalEllipsoidalFactorDelta > 1e-8) {
          fail(`${i}\t
${Angle.toDegreesMinutesSeconds(lat1, 5)}\t${Angle.toDegreesMinutesSeconds(lon1, 5)}
${Angle.toDegreesMinutesSeconds(lat2, 5)}\t${Angle.toDegreesMinutesSeconds(lon2, 5)}
SRID=4269;POINT(${lon1} ${lat1} ${height1})\t${xsi}\t${eta}\t${heightOfInstrument}\t${heightOfTarget}
SRID=4269;POINT(${lon2} ${lat2} ${height2})\t${distance}\t${Angle.toDegreesMinutesSeconds(observedDirection, 2)}\t${Angle.toDegreesMinutesSeconds(astronomicAzimuth, 2)}
horizontalEllipsoidFactor\t${expectedHorizontalEllipsoidalFactor}\t${actualHorizontalEllipsoidalFactor}
spatialEllipsoidalDistance\t${expectedSpatialEllipsoidalDistance}\t${actualSpatialEllipsoidalDistance}
ellipsoidDirection\t${Angle.toDegreesMinutesSeconds(expectedEllipsoidDirection, 1)}\t${Angle.toDegreesMinutesSeconds(actualEllipsoidDirection, 1)}
geodeticAzimuth\t${Angle.toDegreesMinutesSeconds(expectedGeodeticAzimuth, 1)}\t${Angle.toDegreesMinutesSeconds(actualGeodeticAzimuth, 1)}`);
          hasError = true;
          break;
        }
      }
    }
    expect(hasError).toBeFalsy();
  });
});

