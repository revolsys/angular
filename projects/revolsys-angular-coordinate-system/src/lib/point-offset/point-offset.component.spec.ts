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

import {CsFieldComponent} from '../cs-field/cs-field.component';
import {PointFieldComponent} from '../point-field/point-field.component';

import {PointOffsetComponent} from './point-offset.component';

import pointOffsetData from '../../test/data/point-offset.json';

describe('PointOffsetComponent', () => {

  let component: PointOffsetComponent;
  let fixture: ComponentFixture<PointOffsetComponent>;
  let form: FormGroup;
  let controls: {[key: string]: AbstractControl};
  let resultForm: FormGroup;
  let resultControls: {[key: string]: AbstractControl};

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
    resultForm = component.resultForm;
    resultControls = resultForm.controls;
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
      if (Math.abs(x2 - expectedX2) > 1e-11 || Math.abs(y2 - expectedY2) > 1e-11 || Math.abs(angle2 - expectedAngle2) > 1e-11) {
        fail(`${i}\t
SRID=${csId};POINT(${x} ${y})\t${distance}\t${angle}\t
SRID=${csId};POINT(${expectedX2} ${expectedY2})\t${expectedAngle2}\t
SRID=${csId};POINT(${x2} ${y2})\t${angle2}`);
      }
    }
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
