import { CSI } from '../cs/CSI';

import pointOffsetData from '../../test/data/point-offset.json';

describe('Distance and Angle', () => {


  it(`test-data`, () => {
    let hasError = false;
    for (let i = 0; i < pointOffsetData.length; i++) {
      const values = pointOffsetData[i];
      const csId = values[0];
      const cs = CSI.getCs(csId);
      const x1 = Number(values[1]);
      const y1 = Number(values[2]);
      const x2 = Number(values[5]);
      const y2 = Number(values[6]);
      let validRange = true;
      if (csId !== 4269) {
        if (!(5200000 <= y1 && y1 <= 6900000 //
          && 5200000 <= y2 && y2 <= 6900000 //
          && -1000000 <= x1 && x1 <= 1000000 //
          && -1000000 <= x2 && x2 <= 1000000)) {
          validRange = false;
        }
      }
      if (validRange) {
        const expectedDistance = Number(values[3]);
        let expectedAngle1 = Number(values[4]);
        if (expectedDistance < 1e-3) {
          expectedAngle1 = 0;
        } else if (expectedAngle1 === 360) {
          expectedAngle1 = 0;
        }
        let expectedAngle2 = Number(values[7]);
        if (expectedDistance === 0) {
          expectedAngle2 = 0;
        }

        const actualDistance = cs.distanceMetres(x1, y1, x2, y2);
        const actualAngle1 = cs.angle(x1, y1, x2, y2);
        const actualAngle2 = cs.angle(x2, y2, x1, y1);
        let minAngleDiff = 0.01 / 3600;
        if (expectedDistance < 0.01) {
          minAngleDiff = 1.0 / 3600;
        }
        if (Math.abs(expectedDistance - actualDistance) > 1e-3 ||
          Math.abs(expectedAngle1 - actualAngle1) > minAngleDiff ||
          Math.abs(expectedAngle2 - actualAngle2) > minAngleDiff) {
          fail(`${i}\t
Params  \tSRID=${csId};POINT(${x1} ${y1})\tSRID=${csId};POINT(${x2} ${y2})
Expected\t${expectedDistance.toFixed(3)}\t${expectedAngle1}\t${expectedAngle2}
Actual  \t${actualDistance.toFixed(3)}\t${actualAngle1}\t${actualAngle2}
        `);
          hasError = true;
          break;
        }
      }
    }
    expect(hasError).toBeFalsy();
  });
});

