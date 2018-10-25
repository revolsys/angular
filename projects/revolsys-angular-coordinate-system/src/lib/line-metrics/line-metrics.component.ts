import { AbstractCoordinateSystemComponent } from '../abstract-coordinate-system.component';
import {
  Component,
  OnInit,
  Injector
} from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { CS } from '../cs/CS';
import { GeoCS } from '../cs/GeoCS';
import { CSI } from '../cs/CSI';
import { ProjCS } from '../cs/ProjCS';
import { TransverseMercator } from '../cs/TransverseMercator';

@Component({
  selector: 'rs-cs-line-metrics',
  templateUrl: './line-metrics.component.html',
  styleUrls: ['./line-metrics.component.css']
})
export class LineMetricsComponent extends AbstractCoordinateSystemComponent implements OnInit {

  get angleTitle(): string {
    if (this.cs instanceof GeoCS) {
      return 'Azimuth';
    } else {
      return 'Angle';
    }
  }

  azimuth1: number;

  azimuth2: number;

  _cs: CS = CSI.NAD83;

  get cs(): CS {
    return this._cs;
  }

  get isProjectedCs(): boolean {
    return this.cs instanceof ProjCS;
  }

  distance: number = null;

  form: FormGroup;

  lineScaleFactor: number;

  get distanceTitle(): string {
    if (this.cs instanceof GeoCS) {
      return 'Ellipsoid';
    } else {
      return 'Mapping Plane';
    }
  }

  ttCorrection: number;

  constructor(
    protected injector: Injector,
    private fb: FormBuilder,
  ) {
    super(injector, 'Line Calculations', 'DMS');
    this.form = this.fb.group({
      fromPoint: this.fb.group({
        cs: CSI.NAD83,
        x: null,
        y: null
      }),
      toPoint: this.fb.group({
        cs: CSI.NAD83,
        x: null,
        y: null
      }),
      cs: CSI.NAD83
    });
    this.form.controls['cs'].valueChanges.subscribe(cs => {
      this._cs = cs;
      this.form.controls.fromPoint.patchValue({ cs: cs });
      this.form.controls.toPoint.patchValue({ cs: cs });
    });
    this.form.valueChanges.subscribe(data => {
      this.calculate(data);
    });
  }

  get x1(): number {
    return this.cs.toX(this.form.value['fromPoint'].x);
  }

  get y1(): number {
    return this.cs.toY(this.form.value['fromPoint'].y);
  }

  get x2(): number {
    return this.cs.toX(this.form.value['toPoint'].x);
  }

  get y2(): number {
    return this.cs.toY(this.form.value['toPoint'].y);
  }

  private calculate(data) {
    if (this.form.valid) {
      const cs: CS = data.cs;
      const x1 = cs.toX(data['fromPoint'].x);
      const y1 = cs.toY(data['fromPoint'].y);
      const x2 = cs.toX(data['toPoint'].x);
      const y2 = cs.toY(data['toPoint'].y);
      this.distance = cs.distanceMetres(x1, y1, x2, y2);
      this.azimuth1 = cs.angle(x1, y1, x2, y2);
      this.azimuth2 = cs.angleBackwards(x1, y1, x2, y2);

      console.log(`${x1} ${y1}, ${x2} ${y2}`);
      console.log(`${this.distance}`);
      if (cs instanceof TransverseMercator) {
        this.lineScaleFactor = cs.lineScaleFactor(x1, y1, x2, y2);
        this.ttCorrection = cs.ttCorrection(x1, y1, x2, y2);
      } else {
        this.lineScaleFactor = null;
        this.ttCorrection = null;
      }
    } else {
      this.lineScaleFactor = null;
      this.ttCorrection = null;
      this.distance = null;
      this.azimuth1 = null;
      this.azimuth2 = null;
    }
  }

  formatDistance(): string {
    if (typeof this.distance === 'number') {
      return this.distance.toFixed(3);
    } else {
      return '-';
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.calculate(this.form.value);
  }
}
