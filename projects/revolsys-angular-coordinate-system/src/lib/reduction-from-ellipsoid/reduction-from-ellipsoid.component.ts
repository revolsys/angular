import { AbstractCoordinateSystemComponent } from '../abstract-coordinate-system.component';
import {
  Component,
  OnInit,
  Injector
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Angle } from '../cs/Angle';
import { CS } from '../cs/CS';
import { CSI } from '../cs/CSI';
import { Point } from '../cs/Point';

@Component({
  selector: 'rs-cs-reduction-from-ellipsoid',
  templateUrl: './reduction-from-ellipsoid.component.html',
  styleUrls: ['./reduction-from-ellipsoid.component.css']
})
export class ReductionFromEllipsoidComponent extends AbstractCoordinateSystemComponent implements OnInit {

  form: FormGroup;

  azimuth1: number;

  azimuth2: number;

  get cs(): CS {
    return this.form.controls['cs'].value;
  }

  ellipsoidDirection: number;

  get fromPoint(): Point {
    return this.form.value['fromPoint'].point;
  }

  get toPoint(): Point {
    return this.form.value['toPoint'].point;
  }

  spatialDistance: number;

  spatialEllipsoidalDistance: number;

  get spatialEllipsoidFactor(): number {
    if (this.spatialEllipsoidalDistance == null) {
      return null;
    } else {
      return this.spatialEllipsoidalDistance / this.form.controls['distance'].value;
    }
  }
  astronomicAzimuth: number;

  geodeticAzimuth: number;

  horizontalScaleFactor: number;

  get horizontalDistance(): number {
    if (this.horizontalScaleFactor == null) {
      return null;
    } else {
      return this.form.controls['distance'].value * this.horizontalScaleFactor;
    }
  }

  observedDirection: number;

  slopeDistance: number;

  spatialDirection: number;

  constructor(
    protected injector: Injector,
    private fb: FormBuilder,
  ) {
    super(injector, 'Reduction from Ellipsoid', 'DMS');
    this.form = this.fb.group({
      fromPoint: this.fb.group({
        cs: CSI.NAD83,
        x: ['', Validators.required],
        y: ['', Validators.required]
      }),
      fromHeight: ['0', [Validators.required, Validators.min(0), Validators.max(5000)]],
      xi: ['0', [Validators.required, Validators.min(-30), Validators.max(30)]],
      eta: ['0', [Validators.required, Validators.min(-30), Validators.max(30)]],
      toPoint: this.fb.group({
        cs: CSI.NAD83,
        x: ['', Validators.required],
        y: ['', Validators.required]
      }),
      toHeight: ['0', [Validators.min(0), Validators.max(5000)]],
      cs: CSI.NAD83,
      reducedDirection: '0',
      astronomicAzimuth: null,
      observedDirection: null
    });
    this.form.controls['cs'].valueChanges.subscribe(cs => {
      this.form.controls.fromPoint.patchValue({ cs: cs });
      this.form.controls.toPoint.patchValue({ cs: cs });
    });
    this.form.valueChanges.subscribe(data => {
      this.calculate(data);
    });
  }

  private calculate(data) {
    const fromPoint = this.fromPoint;
    const toPoint = this.toPoint;
    if (this.form.valid && fromPoint != null && toPoint != null) {
      const cs: CS = data.cs;

      const x1 = fromPoint.x;
      const y1 = fromPoint.y;
      const x2 = toPoint.x;
      const y2 = toPoint.y;

      const lon1 = fromPoint.lon;
      const lat1 = fromPoint.lat;
      const lon2 = toPoint.lon;
      const lat2 = toPoint.lat;
      const height1 = parseFloat(data.fromHeight);
      const height2 = parseFloat(data.toHeight);
      const xsi = parseFloat(data.xi);
      const eta = parseFloat(data.eta);
      const reducedDirection = Angle.toDecimalDegrees(data.reducedDirection);

      this.spatialDistance = cs.spatialDistanceHeight(x1, y1, height1, x2, y2, height2);

      this.spatialDirection = cs.spatialDirection(x1, y1, height1, xsi, eta, x2, y2, height2, reducedDirection, 0, 0, -4.5);

      this.astronomicAzimuth = cs.astronomicAzimuth(lon1, lat1, height1, xsi, eta, lon2, lat2, height2, 0, 0, -4.5);
      this.slopeDistance = cs.slopeDistance(lon1, lat1, height1, lon2, lat2, height2, 0, 0, -4.5);
    } else {
      this.spatialDistance = null;
      this.spatialDirection = null;
      this.astronomicAzimuth = null;
      this.slopeDistance = null;
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.calculate(this.form.value);
  }

}
