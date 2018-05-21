import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MenuLinkComponent} from './menu-link.component';
import {PageComponent} from './page.component';
import {PageConfig} from './PageConfig';
import {MenuItem} from './MenuItem';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
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
  static forRoot(config: PageConfig): ModuleWithProviders {
    return {
      ngModule: RevolsysAngularBcgovPageModule,
      providers: [
        {provide: PageConfig, useValue: config}
      ]
    };
  }

}
