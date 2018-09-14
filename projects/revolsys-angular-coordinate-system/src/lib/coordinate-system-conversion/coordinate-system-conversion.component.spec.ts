import {
  ComponentFixture,
  TestBed,
  async
} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing'; import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

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

import {CoordinateSystemConversionComponent} from './coordinate-system-conversion.component';

import coordinateSystemConversionData from '../../test/data/coordinate-system-conversion.json';

describe('CoordinateSystemConversionComponent', () => {

  let component: CoordinateSystemConversionComponent;
  let fixture: ComponentFixture<CoordinateSystemConversionComponent>;
  let form: FormGroup;
  let controls: {[key: string]: AbstractControl;}
  let resultForm: FormGroup;
  let resultControls: {[key: string]: AbstractControl;}

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
    controls = form.controls;
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
        console.log(lonDms);
        console.log(actualLonDms);
        return;
        lonDmsMeasures.addValue(1);
      }
      if (Angle.equalDms(latDms, actualLatDms, 0, Angle.RE_LAT)) {
        latDmsMeasures.addValue(0);
      } else {
        latDmsMeasures.addValue(1);
      }
    }
    expect(xDmsMeasures.max).toBe(0);
    expect(yDmsMeasures.max).toBe(0);
    expect(xMeasures.max).toBe(0);
    expect(yMeasures.max).toBe(0.001);
    expect(lonMeasures.max).toBe(1e-11);
    expect(latMeasures.max).toBe(2e-11);

    console.log(xDmsMeasures.toString());
    console.log(yDmsMeasures.toString());
    console.log(xMeasures.toString());
    console.log(yMeasures.toString());
    console.log(lonMeasures.toString());
    console.log(latMeasures.toString());
    console.log(lonDmsMeasures.toString());
    console.log(latDmsMeasures.toString());
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

class Measures {
  count = 0;

  sum = 0;

  min = Number.MAX_VALUE;

  max = 0;

  counts: {[value: number]: number} = {};

  constructor(private scaleFactor?: number) {
  }
  addValue(value: number) {
    if (this.scaleFactor) {
      value = Math.round(value * this.scaleFactor) / this.scaleFactor;
    }
    let count = this.counts[value];
    if (count) {
      count++;
    } else {
      count = 1;
    }
    this.counts[value] = count;
    this.count++;
    this.sum += value;
    if (value < this.min) {
      this.min = value;
    }
    if (value > this.max) {
      this.max = value;
    }
  }

  get average(): number {
    return this.sum / this.count;
  }

  toString(): string {
    let s = `{count:${this.count},min:${this.min},max:${this.max},average:${this.average},counts:{`;
    let first = true;
    const keys = Object.keys(this.counts);
    keys.sort();
    for (const k of keys) {
      if (first) {
        first = false;
      } else {
        s += ','
      }
      s += `'${k}': ${this.counts[k]}`;
    }
    return s + '}'
  }
}
