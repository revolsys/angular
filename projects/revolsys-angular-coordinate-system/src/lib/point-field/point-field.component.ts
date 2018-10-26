import { AbstractCoordinateSystemComponent } from '../abstract-coordinate-system.component';
import { Component, Inject, Input, OnInit, Injector, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CS } from '../cs/CS';
import { CSI } from '../cs/CSI';
import { GeoCS } from '../cs/GeoCS';
import { Point } from '../cs/Point';

@Component({
  selector: 'rs-cs-point-field',
  templateUrl: './point-field.component.html',
  styleUrls: ['./point-field.component.css']
})
export class PointFieldComponent extends AbstractCoordinateSystemComponent implements OnInit {
  private _cs: CS = CSI.NAD83;

  get cs(): CS {
    return this._cs;
  }

  @Input()
  set cs(cs: CS) {
    this._cs = cs;
    if (this.pointForm) {
      this.pointForm.patchValue({ cs: cs });
    }
  }

  @Input()
  floatLabel = 'auto';

  @Input()
  name: string;

  @Input()
  parentForm: FormGroup;

  pointForm: FormGroup;

  @Input()
  readonly = false;

  private _x: string;

  private _y: string;

  get isGeographic(): boolean {
    return this.cs instanceof GeoCS;
  }

  @Input()
  prefix: string;

  @Input()
  required = false;

  get x(): string {
    if (this.pointForm) {
      const x = this.pointForm.value['x'];
      return this.formatX(x);
    } else {
      return this._x;
    }
  }

  @Input()
  set x(x: string) {
    this._x = x;
    if (this.pointForm) {
      this.pointForm.patchValue({ x: x });
    }
  }

  @Input()
  set point(point: Point) {
    if (point == null) {
      this.x = '';
      this.y = '';
    } else {
      this.cs = point.cs;
      this.x = point.formatX(this.angleFormat);
      this.y = point.formatY(this.angleFormat);
    }
  }

  get y(): string {
    if (this.pointForm) {
      const y = this.pointForm.value['y'];
      return this.formatY(y);
    } else {
      return this._y;
    }
  }

  @Input()
  set y(y: string) {
    this._y = y;
    if (this.pointForm) {
      this.pointForm.patchValue({ y: y });
    }
  }

  constructor(
    @Inject(Injector) protected injector: Injector,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(injector, null);
  }

  ngOnInit(): void {
    if (this.prefix) {
      this.prefix = this.prefix.trim() + ' ';
    }
    if (this.parentForm) {
      this.pointForm = <FormGroup>this.parentForm.controls[this.name];
      let pointControl: AbstractControl;
      if (this.pointForm) {
        if (!this.pointForm.controls['cs']) {
          this.pointForm.addControl('cs', this.fb.control(CSI.NAD83));
        }
        this._cs = this.pointForm.controls['cs'].value;
        this._x = this.pointForm.controls['x'].value;
        this._y = this.pointForm.controls['y'].value;

        const point = Point.newPoint(this.pointForm.value);
        pointControl = this.pointForm.controls['point'];
        if (pointControl) {
          pointControl.patchValue(point);
        } else {
          pointControl = this.fb.control(point);
          this.pointForm.addControl('point', pointControl);
        }

        this.setValidators();
        this.pointForm.updateValueAndValidity();
      } else {
        this.pointForm = this.fb.group({
          'cs': CSI.NAD83,
          'x': null,
          'y': null,
          'point': null
        });
        this.setValidators();
        this.parentForm.addControl(this.name, this.pointForm);
        const newValue = {};
        newValue[this.name] = this.pointForm.value;
        this.parentForm.patchValue(newValue);
      }
      this.pointForm.controls['cs'].valueChanges.subscribe(data => {
        this._cs = data;
        this.setValidators();
      });
      for (const field of ['x', 'y', 'cs']) {
        this.pointForm.controls[field].valueChanges.subscribe(data => {
          const point = Point.newPoint(this.pointForm.value);
          if ('x' === field) {
            point.setX(data);
          } else if ('y' === field) {
            point.setY(data);
          } else {
            point[field] = data;
          }
          pointControl.patchValue(point);
        });
      }
    }
  }

  getErrorMessage(form: FormGroup, controlName: string): string {
    const messages = [];
    const control = form.controls[controlName];
    if (control.hasError('required')) {
      messages.push('Required');
    }
    const patternError = control.getError('pattern');
    if (patternError) {
      messages.push('Invalid value');
    }
    return messages.join(', ');
  }

  private setValidators() {
    const form = this.pointForm;
    if (form) {
      const cs = form.controls['cs'].value;
      const controlX = form.controls['x'];
      const controlY = form.controls['y'];
      const validatorsX = [];
      const validatorsY = [];
      if (this.required) {
        validatorsX.push(Validators.required);
        validatorsY.push(Validators.required);
      }
      if (cs instanceof GeoCS) {
      } else {
        validatorsX.push(Validators.pattern(/^-?\d+(\.\d{1,3})?$/));
        validatorsY.push(Validators.pattern(/^-?\d+(\.\d{1,3})?$/));
      }
      controlX.setValidators(validatorsX);
      controlY.setValidators(validatorsY);
      controlX.updateValueAndValidity();
      controlY.updateValueAndValidity();
    }
  }

}
