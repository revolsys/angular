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

import {CsFieldComponent} from '../cs-field/cs-field.component';
import {PointFieldComponent} from '../point-field/point-field.component';

import {PointOffsetComponent} from './point-offset.component';

import pointOffsetData from '../../test/data/point-offset.json';

describe('PointOffsetComponent', () => {

  let component: PointOffsetComponent;
  let fixture: ComponentFixture<PointOffsetComponent>;
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
  for (let fieldName of ['azimuth', 'distance']) {
    it(`${fieldName} invalid when empty`, () => {
      expect(controls[fieldName].valid).toBeFalsy();
    });
  }
  it('default values', () => {
    expect(controls['cs'].value).toBe(CSI.NAD83);
    expect(controls['distance'].value).toBe('');
    expect(controls['azimuth'].value).toBe('');
  });

  for (let i = 0; i < pointOffsetData.length; i++) {
    const values = pointOffsetData[i];
    const csName = values[0];
    const cs = CSI[csName];
    it('values ' + (i + 1), () => {
      form.patchValue({
        cs: cs,
        point: {
          x: values[1],
          y: values[2]
        },
        distance: values[3],
        azimuth: values[4]
      });
      expect(form.valid).toBeTruthy();
      const toPoint: FormGroup = <FormGroup>resultControls['toPoint'];
      expect(component.formatX(toPoint.controls['x'].value)).toBe(values[5]);
      expect(component.formatY(toPoint.controls['y'].value)).toBe(values[6]);
      expect(component.formatAngle(component.azimuth2)).toBe(values[7]);
    });
  }
});