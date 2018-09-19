import {
  ComponentFixture,
  TestBed,
  async
} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing'; import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';

import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

import {MatDialogModule} from '@angular/material/dialog';

import {RevolsysAngularFrameworkModule} from 'revolsys-angular-framework';

import {Angle} from '../cs/Angle';
import {CSI} from '../cs/CSI';
import {GeoCS} from '../cs/GeoCS';
import {CsFieldComponent} from '../cs-field/cs-field.component';
import {PointFieldComponent} from '../point-field/point-field.component';
import {MeridianConvergenceComponent} from './meridian-convergence.component';

import {Measures} from '../../test/measures';
import meridianConvergenceData from '../../test/data/meridian-convergence.json';
import {TransverseMercator} from '../cs/TransverseMercator';

describe('MeridianConvergenceComponent', () => {

  let component: MeridianConvergenceComponent;
  let fixture: ComponentFixture<MeridianConvergenceComponent>;
  let form: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatSelectModule,
        MatToolbarModule,
        MatTooltipModule,
        RevolsysAngularFrameworkModule.forRoot({
          useAuthService: false
        })
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CsFieldComponent, PointFieldComponent, MeridianConvergenceComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MeridianConvergenceComponent);

    component = fixture.componentInstance;
    component.ngOnInit();
    form = component.form;
  });

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
