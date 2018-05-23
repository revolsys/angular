import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";

import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';


import {Config} from './Config';
import {AuthService} from './Authentication/auth.service';
import {DeleteDialogComponent} from './Component/DeleteDialogComponent';
import {LoginDialogComponent} from './Component/LoginDialogComponent';
import {MessageDialogComponent} from './Component/MessageDialogComponent';
import {PageNotFoundComponent} from './Component/PageNotFoundComponent';
import {InputFileComponent} from './input-file/input-file-component';

const COMMON_MODULES = [
  PageNotFoundComponent,
  DeleteDialogComponent,
  LoginDialogComponent,
  MessageDialogComponent,
  InputFileComponent
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpClientModule,

    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule
  ],
  declarations: COMMON_MODULES,
  entryComponents: [
    DeleteDialogComponent,
    LoginDialogComponent,
    MessageDialogComponent
  ],
  providers: [
    AuthService
  ],
  exports: COMMON_MODULES
})
export class RevolsysAngularFrameworkModule {
  static forRoot(config: any): ModuleWithProviders {
    const configData = new Config();
    Object.assign(configData, config);
    return {
      ngModule: RevolsysAngularFrameworkModule,
      providers: [
        {provide: Config, useValue: configData}
      ]
    };
  }
}
