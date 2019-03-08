import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DemoMapComponent} from './demo-map/demo-map.component';
import {DemoListPageComponent} from './demo-list-page/demo-list-page.component';
import {LongContentComponent} from './long-content/long-content.component';

import {
  PointOffsetComponent,
  DistanceAndAnglesComponent,
  ScaleFactorAndTTCorrectionComponent,
  CoordinateSystemConversionComponent,
  MeridianConvergenceComponent,
  ReductionFromEllipsoidComponent,
  ReductionToEllipsoidComponent
} from 'revolsys-angular-coordinate-system';

const routes: Routes = [
  {path: '', component: DemoMapComponent, pathMatch: 'full'},
  {path: 'map', component: DemoMapComponent, pathMatch: 'full'},
  {path: 'ui/utilities/distance-angle', component: DistanceAndAnglesComponent, pathMatch: 'full'},
  {path: 'ui/utilities/point-offset', component: PointOffsetComponent, pathMatch: 'full'},
  {path: 'ui/utilities/coordinate-system-conversion', component: CoordinateSystemConversionComponent, pathMatch: 'full'},
  {path: 'ui/utilities/meridian-convergence', component: MeridianConvergenceComponent, pathMatch: 'full'},
  {path: 'ui/utilities/scale-factor-tt-correction', component: ScaleFactorAndTTCorrectionComponent, pathMatch: 'full'},
  {path: 'ui/utilities/reduction-from-ellipsoid', component: ReductionFromEllipsoidComponent, pathMatch: 'full'},
  {path: 'ui/utilities/reduction-to-ellipsoid', component: ReductionToEllipsoidComponent, pathMatch: 'full'},
  {path: 'list-page', component: DemoListPageComponent, pathMatch: 'full'},
  {path: 'long-page', component: LongContentComponent, pathMatch: 'full', data: {title: 'Long Page'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
