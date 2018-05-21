import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'menu-link',
  templateUrl: './menu-link.component.html',
  styleUrls: ['./menu-link.component.css']
})
export class MenuLinkComponent {
  @Input()
  routerLink: string;

  @Input()
  href: string;

  @Input()
  prefix: string;

  @Input()
  label: string;

  @Input()
  icon: string;
}



