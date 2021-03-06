import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { AppRoutingModule } from './app-routing.module';

import { RevolsysAngularBcgovPageModule } from 'revolsys-angular-bcgov-page';
import { RevolsysAngularFrameworkModule } from 'revolsys-angular-framework';
import { RevolsysAngularLeafletModule } from 'revolsys-angular-leaflet';
import { RevolsysAngularCoordinateSystemModule } from 'revolsys-angular-coordinate-system';

import { AppComponent } from './app.component';
import { AppSecurityService } from './app-security.service';
import { DemoMapComponent } from './demo-map/demo-map.component';
import { GeographicNameSearchComponent } from './geographic-name-search.component';
import { DemoListPageComponent } from './demo-list-page/demo-list-page.component';
import { DemoService } from './demo.service';
import { LongContentComponent } from './long-content/long-content.component';
import { DemoFormComponent } from './demo-form/demo-form.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoMapComponent,
    DemoFormComponent,
    GeographicNameSearchComponent,
    DemoListPageComponent,
    LongContentComponent,
    DemoFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,

    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,

    RevolsysAngularLeafletModule,
    RevolsysAngularBcgovPageModule.forRoot({
      basePath: '/',
      fullWidthContent: true,
      title: 'BCGOV Page',
      headerMenuItems: [
        {
          title: 'Map',
          routerLink: 'map'
        },
        {
          title: 'List',
          routerLink: 'list-page'
        },
        {
          title: 'Form',
          routerLink: 'form'
        },
      ],
      version: 'test'
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
      useFactory: (ds: AppSecurityService) => function () {
        return null;
      },
      deps: [AppSecurityService],
      multi: true
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
