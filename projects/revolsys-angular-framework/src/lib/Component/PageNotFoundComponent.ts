import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'raf-page-not-found',
  template: `
    <div class="error-box">
      <h1>404 Error</h1>
      <p>I'm sorry the page you requested could not be found.</p>
      <button  (click)="back()" mat-raised-button color="warn">
        <span class="fa fa-chevron-left" aria-hidden="true"></span> Back
      </button>
    </div>
  `,
  styles: [`
.error-box {
  margin-top:10px;
  padding: 10px;
  color:#f44336;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
              0 2px 2px 0 rgba(0,0,0,.14),
              0 1px 5px 0 rgba(0,0,0,.12);
}
  `]
})
export class PageNotFoundComponent {
  constructor(private location: Location) {
  }

  back() {
    this.location.back();
  }
}
