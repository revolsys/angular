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
import { CSI } from '../cs/CSI';
import { ProjCS } from '../cs/ProjCS';
import { TransverseMercator } from '../cs/TransverseMercator';
import { Point } from '../cs/Point';

@Component({
  selector: 'rs-cs-scale-factor-tt-correction',
  templateUrl: './scale-factor-tt-correction.component.html',
  styleUrls: ['./scale-factor-tt-correction.component.css']
})
export class ScaleFactorAndTTCorrectionComponent extends AbstractCoordinateSystemComponent implements OnInit {

  _cs: CS = CSI.utmN(10);

  coordinateSystems: CS[] = [CSI.utmN(7), CSI.utmN(8), CSI.utmN(9), CSI.utmN(10), CSI.utmN(11)];

  get cs(): CS {
    return this._cs;
  }

  get isProjectedCs(): boolean {
    return this.cs instanceof ProjCS;
  }

  form: FormGroup;

  lineScaleFactor: number;


  ttCorrection: number;

  constructor(
    protected injector: Injector,
    private fb: FormBuilder,
  ) {
    super(injector, 'Scale Factor and TT Correction', 'DMS');
    this.form = this.fb.group({
      fromPoint: this.fb.group({
        cs: this._cs,
        x: null,
        y: null
      }),
      toPoint: this.fb.group({
        cs: this._cs,
        x: null,
        y: null
      }),
      cs: this._cs
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

      if (cs instanceof TransverseMercator) {
        this.lineScaleFactor = cs.lineScaleFactor(x1, y1, x2, y2);
        this.ttCorrection = cs.ttCorrection(x1, y1, x2, y2);
      } else {
        this.lineScaleFactor = null;
        this.ttCorrection = null;
      }
      return;
    }
    this.lineScaleFactor = null;
    this.ttCorrection = null;
  }


  ngOnInit() {
    super.ngOnInit();
    this.calculate(this.form.value);
  }
}
