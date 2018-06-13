import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {DemoMapComponent} from './demo-map/demo-map.component';
import {DemoListPageComponent} from './demo-list-page/demo-list-page.component';
import {LongContentComponent} from './long-content/long-content.component';

import {
  PointOffsetComponent,
  LineMetricsComponent,
  CoordinateSystemConversionComponent,
  MeridianConvergenceComponent
} from 'revolsys-angular-coordinate-system';

const routes: Routes = [
  {path: '', component: DemoMapComponent, pathMatch: 'full'},
  {path: 'map', component: DemoMapComponent, pathMatch: 'full'},
  {path: 'line-calculations', component: LineMetricsComponent, pathMatch: 'full'},
  {path: 'point-offset', component: PointOffsetComponent, pathMatch: 'full'},
  {path: 'coordinate-system-conversion', component: CoordinateSystemConversionComponent, pathMatch: 'full'},
  {path: 'meridian-convergence', component: MeridianConvergenceComponent, pathMatch: 'full'},
  {path: 'list-page', component: DemoListPageComponent, pathMatch: 'full'},
  {path: 'long-page', component: LongContentComponent, pathMatch: 'full', data: {title: 'Long Page'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
