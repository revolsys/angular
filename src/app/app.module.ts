import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {HttpClientModule, HttpClientJsonpModule} from '@angular/common/http';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';

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
import {LongContentComponent} from './long-content/long-content.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoMapComponent,
    GeographicNameSearchComponent,
    DemoListPageComponent,
    LongContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,

    MatIconModule,
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
      ]
    }
    ),
    RevolsysAngularFrameworkModule.forRoot({
      basePath: '/',
      title: 'DEMO'
    }),
    RevolsysAngularCoordinateSystemModule,

    AppRoutingModule
  ],
  providers: [
    AppSecurityService,
    DemoService,
    {
      // Initializes security service
      provide: APP_INITIALIZER,
      useFactory: (ds: AppSecurityService) => function() {
        return null;
      },
      deps: [AppSecurityService],
      multi: true
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
