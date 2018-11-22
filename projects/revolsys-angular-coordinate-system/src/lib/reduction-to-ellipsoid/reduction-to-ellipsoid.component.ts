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
  selector: 'rs-cs-reduction-to-ellipsoid',
  templateUrl: './reduction-to-ellipsoid.component.html',
  styleUrls: ['./reduction-to-ellipsoid.component.css']
})
export class ReductionToEllipsoidComponent extends AbstractCoordinateSystemComponent implements OnInit {
  form: FormGroup;

  get cs(): CS {
    return this.form.controls['cs'].value;
  }

  get fromPoint(): Point {
    return this.form.value['fromPoint'].point;
  }

  get toPoint(): Point {
    return this.form.value['toPoint'].point;
  }


  ellipsoidDirection: number;

  geodeticAzimuth: number;

  get horizontalEllipsoidalDistance(): number {
    if (this.horizontalEllipsoidalFactor == null) {
      return null;
    } else {
      return this.form.controls['distance'].value * this.horizontalEllipsoidalFactor;
    }
  }

  horizontalEllipsoidalFactor: number;

  spatialEllipsoidalDistance: number;

  get spatialEllipsoidalFactor(): number {
    const distance = parseFloat(this.form.controls['distance'].value);
    if (this.spatialEllipsoidalDistance == null || distance === 0 || isNaN(distance)) {
      return null;
    } else {
      return this.spatialEllipsoidalDistance / distance;
    }
  }

  constructor(
    protected injector: Injector,
    private fb: FormBuilder,
  ) {
    super(injector, 'Reduction to the Ellipsoid', 'DMS');
    this.form = this.fb.group({
      calculationName: 'All',
      fromPoint: this.fb.group({
        cs: CSI.NAD83,
        x: ['', Validators.required],
        y: ['', Validators.required]
      }),
      fromHeight: ['0', [Validators.required, Validators.min(0), Validators.max(5000)]],
      xi: ['0', [Validators.required, Validators.min(-30), Validators.max(30)]],
      eta: ['0', [Validators.required, Validators.min(-30), Validators.max(30)]],
      heightOfInstrument: ['0', [Validators.required, Validators.min(0), Validators.max(99.999)]],
      heightOfTarget: ['0', [Validators.required, Validators.min(0), Validators.max(99.999)]],
      toPoint: this.fb.group({
        cs: CSI.NAD83,
        x: ['', Validators.required],
        y: ['', Validators.required]
      }),
      toHeight: ['0', [Validators.required, Validators.min(0), Validators.max(5000)]],
      distance: ['0', [Validators.min(0), Validators.max(3500000)]],
      cs: CSI.NAD83,
      astronomicAzimuth: ['0', [Validators.required]],
      observedDirection: ['0', [Validators.required]],
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
    this.horizontalEllipsoidalFactor = null;
    this.spatialEllipsoidalDistance = null;
    this.ellipsoidDirection = null;
    this.geodeticAzimuth = null;

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
      const heightOfInstrument = parseFloat(data.heightOfInstrument);
      const heightOfTarget = parseFloat(data.heightOfTarget);
      const distance = parseFloat(data.distance);
      const xi = parseFloat(data.xi) / 3600;
      const eta = parseFloat(data.eta) / 3600;
      const astronomicAzimuth = Angle.toDecimalDegrees(data.astronomicAzimuth);
      const observedDirection = Angle.toDecimalDegrees(data.observedDirection);

      this.horizontalEllipsoidalFactor = cs.horizontalEllipsoidalFactor(lon1, lat1, height1, lon2, lat2, height2);
      this.spatialEllipsoidalDistance = cs.spatialDistanceReduction(lon1, lat1, height1, heightOfInstrument, lon2, lat2, height2, heightOfTarget, distance);

      if (observedDirection != null) {
        this.ellipsoidDirection = cs.ellipsoidDirection(x1, y1, height1, xi, eta,
          x2, y2, height2, observedDirection, 0, 0, -4.5);
      }

      if (astronomicAzimuth != null) {
        this.geodeticAzimuth = cs.geodeticAzimuth(lon1, lat1, height1, xi, eta, lon2, lat2, height2, astronomicAzimuth, 0, 0, -4.5);
      }
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.calculate(this.form.value);
  }

}
