import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


import {FrameworkConfig} from './FrameworkConfig';
import {AuthService} from './Authentication/auth.service';
import {DeleteDialogComponent} from './Component/DeleteDialogComponent';
import {LoginDialogComponent} from './Component/LoginDialogComponent';
import {MessageDialogComponent} from './Component/MessageDialogComponent';
import {PageNotFoundComponent} from './Component/PageNotFoundComponent';
import {InputFileComponent} from './input-file/input-file-component';
import { VerticalLayoutComponent } from './vertical-layout/vertical-layout.component';

const COMMON_MODULES = [
  PageNotFoundComponent,
  DeleteDialogComponent,
  LoginDialogComponent,
  MessageDialogComponent,
  InputFileComponent,
  VerticalLayoutComponent,
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
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
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
  static forRoot(config: FrameworkConfig): ModuleWithProviders<RevolsysAngularFrameworkModule> {
    return {
      ngModule: RevolsysAngularFrameworkModule,
      providers: [
        {provide: FrameworkConfig, useValue: config}
      ]
    };
  }
}
