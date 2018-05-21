import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
   <bcgov-page>
      <router-outlet></router-outlet>
   </bcgov-page>
  `,
  styles: []
})
export class AppComponent {
  title = 'app';
}
