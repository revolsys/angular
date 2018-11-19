import { CSI } from '../cs/CSI';

import pointOffsetData from '../../test/data/scale-factor-tt-correction.json';
import { TransverseMercator } from '../cs/TransverseMercator';

describe('Line Scale Factor & tt-correction', () => {


  it(`test-data`, () => {
    let hasError = false;
    for (let i = 0; i < pointOffsetData.length; i++) {
      const values = pointOffsetData[i];
      const csId = values[0];
      const cs: TransverseMercator = <TransverseMercator>CSI.getCs(csId);
      const x1 = Number(values[1]);
      const y1 = Number(values[2]);
      const x2 = Number(values[3]);
      const y2 = Number(values[4]);
      const expectedLineScaleFactor = Number(values[5]);
      const expectedTtCorrection = Number(values[6]);

      const actualLineScaleFactor = cs.lineScaleFactor(x1, y1, x2, y2);
      const actualTtCorrection = cs.ttCorrection(x1, y1, x2, y2);

      if (Math.abs(expectedLineScaleFactor - actualLineScaleFactor) > 1e-2 ||
        Math.abs(expectedTtCorrection - actualTtCorrection) > 0.01)  {
        fail(`${i}\t
Params  \tSRID=${csId};POINT(${x1} ${y1})\tSRID=${csId};POINT(${x2} ${y2})
Expected\t${expectedLineScaleFactor.toFixed(3)}\t${expectedTtCorrection}
Actual  \t${actualLineScaleFactor.toFixed(3)}\t${actualTtCorrection}
        `);
        hasError = true;
        break;
      }
    }
    expect(hasError).toBeFalsy();
  });
});

