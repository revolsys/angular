import {Angle} from './cs/Angle';
import {CS} from './cs/CS';
import { Input, Injector, Directive } from '@angular/core';
import {GeoCS} from './cs/GeoCS';
import {CSI} from './cs/CSI';
import {BaseComponent} from 'revolsys-angular-framework';
import { FormGroup } from '@angular/forms';

@Directive()
export class AbstractCoordinateSystemComponent extends BaseComponent<any> {
  get cs(): CS {
    return CSI.NAD83;
  }

  @Input()
  public angleFormat: string;

  constructor(
    protected injector: Injector,
    title: string,
    angleFormat?: string
  ) {
    super(injector, null, title);
    this.angleFormat = angleFormat;
  }

  formatAngle(value: number, decimalPlaces: number = -1): string {
    if (typeof value === 'number') {
      if ('DMS' === this.angleFormat) {
        if (decimalPlaces < 0) {
          decimalPlaces = 2;
        }
        return Angle.toDegreesMinutesSeconds(value, decimalPlaces);
      } else if (decimalPlaces < 0) {
        return value.toFixed(2);
      } else {
        return value.toString();
      }
    } else {
      return '-';
    }
  }

  formatX(value: any, cs?: CS): string {
    if (!cs) {
      cs = this.cs;
    }
    if (typeof value === 'number') {
      if (value) {
        if (cs instanceof GeoCS) {
          if ('DMS' === this.angleFormat) {
            return Angle.toDegreesMinutesSecondsLon(value, 5);
          } else {
            return value.toString();
          }
        } else {
          return value.toFixed(3);
        }
      } else {
        return '-';
      }
    } else if (value === null) {
      return '';
    } else {
      return value.toString();
    }
  }

  formatY(value: any, cs?: CS): string {
    if (!cs) {
      cs = this.cs;
    }
    if (typeof value === 'number') {
      if (value) {
        if (cs instanceof GeoCS) {
          if ('DMS' === this.angleFormat) {
            return Angle.toDegreesMinutesSecondsLat(value, 5);
          } else {
            return value.toString();
          }
        } else {
          return value.toFixed(3);
        }
      } else {
        return '-';
      }
    } else if (value === null) {
      return '';
    } else {
      return value.toString();
    }
  }

  getErrorMessage(form: FormGroup, controlName: string): string {
    const messages = [];
    const control = form.controls[controlName];
    if (control.hasError('required')) {
      messages.push('Required');
    }

    const minError = control.getError('min');
    if (minError) {
      messages.push(`< ${minError.min}`);
    }

    const maxError = control.getError('max');
    if (maxError) {
      messages.push(`> ${maxError.max}`);
    }
    return messages.join(', ');
  }

}
