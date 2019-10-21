import { Component } from '@angular/core';

@Component({
  selector: 'raf-vertical-layout',
  template: `<div class="content">
<ng-content></ng-content>
</div>`,
  styles: [`
.content {
  display: flex;
  flex-direction: column;
}
:host ::ng-deep .content > * {
  margin-top:5px;
}
:host ::ng-deep .content > *:first-child {
  margin-top:0px;
}
  `]
})
export class VerticalLayoutComponent {
}
