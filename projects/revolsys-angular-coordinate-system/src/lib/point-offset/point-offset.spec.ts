import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing'; import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

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

import {MatDialogModule} from '@angular/material/dialog';

import {RevolsysAngularFrameworkModule} from 'revolsys-angular-framework';

import {CSI} from '../cs/CSI';

import {CsFieldComponent} from '../cs-field/cs-field.component';
import {PointFieldComponent} from '../point-field/point-field.component';

import {PointOffsetComponent} from './point-offset.component';

import pointOffsetData from '../../test/data/point-offset.json';

describe('Point Offset', () => {

  let component: PointOffsetComponent;
  let fixture: ComponentFixture<PointOffsetComponent>;
  let form: FormGroup;
  let controls: {[key: string]: AbstractControl};

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
      declarations: [CsFieldComponent, PointFieldComponent, PointOffsetComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PointOffsetComponent);

    component = fixture.componentInstance;
    component.ngOnInit();
    form = component.form;
    controls = form.controls;
  });

  it('form invalid when empty', () => {
    expect(form.valid).toBeFalsy();
  });
  for (const fieldName of ['azimuth', 'distance']) {
    it(`${fieldName} invalid when empty`, () => {
      expect(controls[fieldName].valid).toBeFalsy();
    });
  }
  it('default values', () => {
    expect(controls['cs'].value).toBe(CSI.NAD83);
    expect(controls['distance'].value).toBe('');
    expect(controls['azimuth'].value).toBe('');
  });

  it(`test-data`, () => {
    let hasError = false;
    for (let i = 0; i < pointOffsetData.length; i++) {
      const values = pointOffsetData[i];
      const csId = values[0];
      const cs = CSI.getCs(csId);
      const x = Number(values[1]);
      const y = Number(values[2]);
      const distance = Number(values[3]);
      const angle = Number(values[4]);
      const expectedX2 = Number(values[5]);
      const expectedY2 = Number(values[6]);
      const expectedAngle2 = Number(values[7]);

      const result = cs.pointOffsetAngle(x, y, distance, angle);
      const x2 = result[0];
      const y2 = result[1];
      const angle2 = result[2];
      let minDiff;
      let decimalPlaces;
      if (csId === 4269) {
        minDiff = 1e-11;
        decimalPlaces = 11;
      } else {
        minDiff = 0.001;
        decimalPlaces = 3;
      }
      if (Math.abs(x2 - expectedX2) > minDiff || Math.abs(y2 - expectedY2) > minDiff || Math.abs(angle2 - expectedAngle2) > 1e-11) {
        fail(`${i}\t
Params  \tSRID=${csId};POINT(${x} ${y})\t${distance}\t${angle}\t
Expected\tSRID=${csId};POINT(${expectedX2} ${expectedY2})\t${expectedAngle2}\t
Actual  \tSRID=${csId};POINT(${x2.toFixed(decimalPlaces)} ${y2.toFixed(decimalPlaces)})\t${angle2}`
        );
        hasError = true;
        break;
      }
    }
    expect(hasError).toBeFalsy();
  });

  // @TODO tests on form
  //  form.patchValue({
  //        cs: cs,
  //        point: {
  //          x: x,
  //          y: y
  //        },
  //        distance: distance,
  //        azimuth: angle
  //      });
  //      expect(form.valid).toBeTruthy();
  //      const toPoint: FormGroup = <FormGroup>resultControls['toPoint'];
  //      expect(component.formatX(toPoint.controls['x'].value)).toBe(expectedX2);
  //      expect(component.formatY(toPoint.controls['y'].value)).toBe(expectedY2);
  //      expect(component.formatAngle(component.azimuth2)).toBe(expectedAngle2);
});
