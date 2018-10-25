import {Angle} from '../cs/Angle';
import {CSI} from '../cs/CSI';
import {MeridianConvergenceComponent} from './meridian-convergence.component';

import meridianConvergenceData from '../../test/data/meridian-convergence.json';
import {TransverseMercator} from '../cs/TransverseMercator';

describe('MeridianConvergenceComponent', () => {

  it(`test-data`, () => {
    let hasError = false;
    for (let i = 0; i < meridianConvergenceData.length; i++) {
      const values = meridianConvergenceData[i];
      const utmZone = Number(values[0]);
      const lon = Number(values[1]);
      const lat = Number(values[2]);
      const expectedMeridianConvergence = Number(values[3]);
      const expectedPointScaleFactor = Number(values[4]);

      const utmCs = <TransverseMercator>CSI.utmN(utmZone);

      const actualMeridianConvergence = MeridianConvergenceComponent.calculateMeridianConvergence(utmCs, lon, lat);
      const actualPointScaleFactor = MeridianConvergenceComponent.calculatePointScaleFactor(utmCs, lon, lat);
      const meridianConvergenceDelta = Math.abs(actualMeridianConvergence - expectedMeridianConvergence);
      const pointScaleFactorDelta = Math.abs(actualPointScaleFactor - expectedPointScaleFactor);
      if (Math.abs(meridianConvergenceDelta) > 0.01 / 3600 || Math.abs(pointScaleFactorDelta) > 1e-11) {
        fail(`${i}\t
SRID=4269;POINT(${lon} ${lat}) ${utmZone}
${Angle.toDegreesMinutesSeconds(expectedMeridianConvergence, 2)}\t${expectedPointScaleFactor}
${Angle.toDegreesMinutesSeconds(actualMeridianConvergence, 2)}\t${actualPointScaleFactor}`);
        hasError = true;
        break;
      }
    }
    expect(hasError).toBeFalsy();
  });
});
