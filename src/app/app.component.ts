import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
   <bcgov-page>
      <ng-container headerMenu>
        <menu-link href="x" label="Extra"></menu-link>
              <menu-link href="x" label="Extra 2" ></menu-link>
      </ng-container>
      <router-outlet></router-outlet>
   </bcgov-page>
  `,
  styles: []
})
export class AppComponent {
  title = 'app';
}
