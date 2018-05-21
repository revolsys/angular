import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {DemoMapComponent} from './demo-map/demo-map.component';
import {HelloComponent} from './hello.component';

import {
  PointOffsetComponent,
  LineMetricsComponent,
  CoordinateSystemConversionComponent,
  MeridianConvergenceComponent
} from 'revolsys-angular-coordinate-system';

const routes: Routes = [
  {path: '', component: HelloComponent, pathMatch: 'full'},
  {path: 'map', component: DemoMapComponent, pathMatch: 'full'},
  {path: 'line-calculations', component: LineMetricsComponent, pathMatch: 'full'},
  {path: 'point-offset', component: PointOffsetComponent, pathMatch: 'full'},
  {path: 'coordinate-system-conversion', component: CoordinateSystemConversionComponent, pathMatch: 'full'},
  {path: 'meridian-convergence', component: MeridianConvergenceComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
