import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatDialogModule } from '@angular/material/dialog';

import { RevolsysAngularFrameworkModule } from 'revolsys-angular-framework';

import { Angle } from '../cs/Angle';

import { CSI } from '../cs/CSI';

import { GeoCS } from '../cs/GeoCS';

import { CsFieldComponent } from '../cs-field/cs-field.component';
import { PointFieldComponent } from '../point-field/point-field.component';

import { CoordinateSystemConversionComponent } from './coordinate-system-conversion.component';

import coordinateSystemConversionData from '../../test/data/coordinate-system-conversion.json';
import { Measures } from '../../test/measures';

describe('Coordinate System Conversion', () => {

  let component: CoordinateSystemConversionComponent;
  let fixture: ComponentFixture<CoordinateSystemConversionComponent>;
  let form: FormGroup;
  let resultForm: FormGroup;
  let resultControls: { [key: string]: AbstractControl };

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
      declarations: [CsFieldComponent, PointFieldComponent, CoordinateSystemConversionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinateSystemConversionComponent);

    component = fixture.componentInstance;
    component.ngOnInit();
    form = component.form;
    resultForm = component.resultForm;
    resultControls = resultForm.controls;
  });

  it(`convert all`, () => {
    const xDmsMeasures = new Measures(1000);
    const yDmsMeasures = new Measures(1000);
    const xMeasures = new Measures(1000);
    const yMeasures = new Measures(1000);
    const lonMeasures = new Measures(1e11);
    const latMeasures = new Measures(1e11);
    const lonDmsMeasures = new Measures(1e5);
    const latDmsMeasures = new Measures(1e5);
    for (let i = 0; i < coordinateSystemConversionData.length; i++) {
      const values = coordinateSystemConversionData[i];
      const sourceCsId = Number(values[0]);
      const geoCs = CSI.getCs(sourceCsId);
      const lon = Number(values[1]);
      const lat = Number(values[2]);
      const lonDms = String(values[3]);
      const latDms = String(values[4]);
      const targetCsId = Number(values[5]);
      const utmCs = CSI.getCs(targetCsId);
      const x = Number(values[6]);
      const y = Number(values[7]);

      const lonDeg = Angle.toDecimalDegrees(lonDms, Angle.RE_LON);
      const latDeg = Angle.toDecimalDegrees(latDms, Angle.RE_LAT);
      const utmDmsPoint = geoCs.convertPoint(utmCs, lonDeg, latDeg);
      const utmDmsX = utmDmsPoint[0];
      const utmDmsY = utmDmsPoint[1];
      const utmDmsDeltaX = Math.abs(utmDmsX - x);
      const utmDmsDeltaY = Math.abs(utmDmsY - y);
      xDmsMeasures.addValue(utmDmsDeltaX);
      yDmsMeasures.addValue(utmDmsDeltaY);

      const utmPoint = geoCs.convertPoint(utmCs, lon, lat);
      const utmX = utmPoint[0];
      const utmY = utmPoint[1];
      const utmDeltaX = Math.abs(utmX - x);
      const utmDeltaY = Math.abs(utmY - y);
      xMeasures.addValue(utmDeltaX);
      yMeasures.addValue(utmDeltaY);

      const geoPoint = utmCs.convertPoint(geoCs, utmX, utmY);
      const actualLon = geoPoint[0];
      const actualLat = geoPoint[1];
      const deltaLon = Math.abs(actualLon - lon);
      const deltaLat = Math.abs(actualLat - lat);
      lonMeasures.addValue(deltaLon);
      latMeasures.addValue(deltaLat);

      const actualLonDms = Angle.toDegreesMinutesSecondsLon(actualLon, 6);
      const actualLatDms = Angle.toDegreesMinutesSecondsLat(actualLat, 6);
      if (Angle.equalDms(lonDms, actualLonDms, 0, Angle.RE_LON)) {
        lonDmsMeasures.addValue(0);
      } else {
        lonDmsMeasures.addValue(1);
      }
      if (Angle.equalDms(latDms, actualLatDms, 0, Angle.RE_LAT)) {
        latDmsMeasures.addValue(0);
      } else {
        latDmsMeasures.addValue(1);
      }
    }
    expect(xDmsMeasures.max).toBe(0.001);
    expect(yDmsMeasures.max).toBe(0.001);
    expect(xMeasures.max).toBe(0.001);
    expect(yMeasures.max).toBe(0.001);
    expect(lonMeasures.max).toBe(1e-11);
    expect(latMeasures.max).toBe(2e-11);

  });
  for (let i = 0; i < coordinateSystemConversionData.length; i += 10000) {
    const values = coordinateSystemConversionData[i];
    const sourceCsId = Number(values[0]);
    const geoCs = CSI.getCs(sourceCsId);
    const lon = String(values[1]);
    const lat = String(values[2]);
    const targetCsId = Number(values[5]);
    const utmCs = CSI.getCs(targetCsId);
    const x = String(values[6]);
    const y = String(values[7]);
    const action = (sourceCs, sourceX, sourceY, targetCs, targetX, targetY) => {
      it(`SRID=${sourceCsId};POINT(${sourceX} ${sourceY}) -> SRID=${targetCsId};POINT(${targetX} ${targetY})`, () => {
        form.patchValue({
          sourceCs: sourceCs,
          targetCs: targetCs,
          sourcePoint: {
            x: sourceX,
            y: sourceY
          }
        });
        expect(form.valid).toBeTruthy();
        const targetPoint: FormGroup = <FormGroup>resultControls['targetPoint'];
        const formTargetX = component.formatX(targetPoint.controls['x'].value, targetCs);
        const formTargetY = component.formatY(targetPoint.controls['y'].value, targetCs);
        if (targetCs instanceof GeoCS) {
          const expectedLon = component.formatX(targetX, targetCs);
          if (!Angle.equalDms(targetX, formTargetX, 0.00005, Angle.RE_LON)) {
            expect(expectedLon).toBe(targetX);
          }
          const expectedLat = component.formatY(targetY, targetCs);
          if (!Angle.equalDms(targetY, formTargetY, 0.00005, Angle.RE_LAT)) {
            expect(expectedLat).toBe(targetY);
          }
        } else {
          expect(formTargetX).toBeCloseTo(targetX, 0.001);
          expect(formTargetY).toBeCloseTo(targetY, 0.001);
        }
      });
    };

    action(geoCs, lon, lat, utmCs, x, y);
    action(utmCs, x, y, geoCs, lon, lat);
  }
});
