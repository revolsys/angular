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
import { Point } from '../cs/Point';

@Component({
  selector: 'rs-cs-distance-angle',
  templateUrl: './distance-angle.component.html',
  styleUrls: ['./distance-angle.component.css']
})
export class DistanceAndAnglesComponent extends AbstractCoordinateSystemComponent implements OnInit {

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

  get distanceTitle(): string {
    if (this.cs instanceof GeoCS) {
      return 'Ellipsoid';
    } else {
      return 'Mapping Plane';
    }
  }

  constructor(
    protected injector: Injector,
    private fb: FormBuilder,
  ) {
    super(injector, 'Distance and Angles', 'DMS');
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

  get fromPoint(): Point {
    return this.form.value['fromPoint'].point;
  }

  get toPoint(): Point {
    return this.form.value['toPoint'].point;
  }

  private calculate(data) {
    const fromPoint = this.fromPoint;
    const toPoint = this.toPoint;
    if (this.form.valid && fromPoint != null && toPoint != null) {
      const x1 = fromPoint.x;
      const y1 = fromPoint.y;
      const x2 = toPoint.x;
      const y2 = toPoint.y;
      const cs: CS = data.cs;
      this.distance = cs.distanceMetres(x1, y1, x2, y2);
      this.azimuth1 = cs.angle(x1, y1, x2, y2);
      this.azimuth2 = cs.angleBackwards(x1, y1, x2, y2);
      return;
    }
    this.distance = null;
    this.azimuth1 = null;
    this.azimuth2 = null;
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
