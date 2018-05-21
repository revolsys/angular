import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {RevolsysAngularBcgovPageModule} from 'revolsys-angular-bcgov-page';

import {AppComponent} from './app.component';
import {AppSecurityService} from './app-security.service';
import {HelloComponent} from './hello.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent
  ],
  imports: [
    BrowserModule,
    RevolsysAngularBcgovPageModule.forRoot({
      basePath: '/',
      title: 'BCGOV Page',
      headerMenuItems: [
        {
          title: 'Menu Item',
          routerLink: 'item1'
        },
        {
          title: 'Menu Item2',
          routerLink: 'item2'
        },
      ],
      securityService: new AppSecurityService()
    }
    ),

    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
