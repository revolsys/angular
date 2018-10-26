import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import {AngleFieldComponent} from './angle-field/angle-field.component';
import {CoordinateSystemConversionComponent} from './coordinate-system-conversion/coordinate-system-conversion.component';
import {CsFieldComponent} from './cs-field/cs-field.component';
import {DistanceAndAnglesComponent} from './distance-angle/distance-angle.component';
import {ScaleFactorAndTTCorrectionComponent} from './scale-factor-tt-correction/scale-factor-tt-correction.component';
import {MeridianConvergenceComponent} from './meridian-convergence/meridian-convergence.component';
import {PointFieldComponent} from './point-field/point-field.component';
import {PointOffsetComponent} from './point-offset/point-offset.component';
import { ReductionFromEllipsoidComponent } from './reduction-from-ellipsoid/reduction-from-ellipsoid.component';
import { ReductionToEllipsoidComponent } from './reduction-to-ellipsoid/reduction-to-ellipsoid.component';

const components = [
  AngleFieldComponent,
  CoordinateSystemConversionComponent,
  CsFieldComponent,
  DistanceAndAnglesComponent,
  ScaleFactorAndTTCorrectionComponent,
  MeridianConvergenceComponent,
  PointFieldComponent,
  PointOffsetComponent,
  ReductionFromEllipsoidComponent,
  ReductionToEllipsoidComponent
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  declarations: components,
  exports: components
})
export class RevolsysAngularCoordinateSystemModule {
}
