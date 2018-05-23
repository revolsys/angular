import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule, HttpClientJsonpModule} from '@angular/common/http';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

import {AppRoutingModule} from './app-routing.module';

import {RevolsysAngularBcgovPageModule} from 'revolsys-angular-bcgov-page';
import {RevolsysAngularFrameworkModule} from 'revolsys-angular-framework';
import {RevolsysAngularLeafletModule} from 'revolsys-angular-leaflet';
import {RevolsysAngularCoordinateSystemModule} from 'revolsys-angular-coordinate-system';

import {AppComponent} from './app.component';
import {AppSecurityService} from './app-security.service';
import {DemoMapComponent} from './demo-map/demo-map.component';
import {GeographicNameSearchComponent} from './geographic-name-search.component';
import {DemoListPageComponent} from './demo-list-page/demo-list-page.component';
import {DemoService} from './demo.service';

@NgModule({
  declarations: [
    AppComponent,
    DemoMapComponent,
    GeographicNameSearchComponent,
    DemoListPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,

    MatPaginatorModule,
    MatTableModule,

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
        {
          title: 'List',
          routerLink: 'list-page'
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
  providers: [DemoService],
  bootstrap: [AppComponent]
})
export class AppModule {}
