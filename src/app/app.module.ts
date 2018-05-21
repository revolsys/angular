import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {RevolsysAngularBcgovPageModule} from 'revolsys-angular-bcgov-page';
import {RevolsysAngularFrameworkModule} from 'revolsys-angular-framework';
import {RevolsysAngularLeafletModule} from 'revolsys-angular-leaflet';
import {RevolsysAngularCoordinateSystemModule} from 'revolsys-angular-coordinate-system';

import {AppComponent} from './app.component';
import {AppSecurityService} from './app-security.service';
import {HelloComponent} from './hello.component';
import {DemoMapComponent} from './demo-map/demo-map.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    DemoMapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RevolsysAngularLeafletModule,
    RevolsysAngularBcgovPageModule.forRoot({
      basePath: '/',
      title: 'BCGOV Page',
      headerMenuItems: [
        {
          title: 'Map',
          routerLink: 'map'
        },
        {
          title: 'Point Offset',
          routerLink: 'point-offset'
        },
        {
          title: 'Line Calculations',
          routerLink: 'line-calculations'
        },
        {
          title: 'Coordinate System Conversion',
          routerLink: 'coordinate-system-conversion'
        },
        {
          title: 'Meridian Convergence & Point Scale Factor',
          routerLink: 'meridian-convergence'
        },
      ],
      securityService: new AppSecurityService()
    }
    ),
    RevolsysAngularFrameworkModule.forRoot({
      basePath: '/',
      title: 'DEMO'
    }),
    RevolsysAngularCoordinateSystemModule,

    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
