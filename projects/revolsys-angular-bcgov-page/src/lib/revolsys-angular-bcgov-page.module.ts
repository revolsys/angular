import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MenuLinkComponent} from './menu-link.component';
import {PageComponent} from './page.component';
import {PageConfig} from './PageConfig';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  declarations: [
    MenuLinkComponent,
    PageComponent
  ],
  exports: [
    MenuLinkComponent,
    PageComponent
  ]
})
export class RevolsysAngularBcgovPageModule {
  static forRoot(config: PageConfig): ModuleWithProviders<RevolsysAngularBcgovPageModule> {
    return {
      ngModule: RevolsysAngularBcgovPageModule,
      providers: [
        {provide: PageConfig, useValue: config}
      ]
    };
  }

}
