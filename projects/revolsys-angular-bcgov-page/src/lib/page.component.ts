import {Observable} from 'rxjs';
import {map, filter, mergeMap} from 'rxjs/operators';
import {
  Component,
  Input,
  Optional,
  OnInit
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterState,
  RouterStateSnapshot
} from '@angular/router';
import {SecurityService} from './security.service';
import {PageConfig} from './PageConfig';
import {MenuItem} from './MenuItem';

@Component({
  selector: 'bcgov-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent {

  appTitle: string;

  headerMenuItems: Array<MenuItem> = [];

  headerMenuVisible = false;

  footerMenuVisible = false;

  @Input()
  fullHeightScroll: boolean = false;

  showHeaderAndFooter = true;

  securityService: SecurityService;

  fullWidthContent = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    @Optional() private config: PageConfig
  ) {
    if (config) {
      this.securityService = config.securityService;
      this.fullWidthContent = config.fullWidthContent;
      this.appTitle = config.title;
      if (config.title) {
        this.titleService.setTitle(config.title);
      }
      if (config.headerMenuItems) {
        this.headerMenuItems = config.headerMenuItems;
      }
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.showHeaderAndFooter) {
        this.showHeaderAndFooter = !('true' === params['contentOnly']);
      }
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),
    ).subscribe(event => {
      let title = event['title'];
      if (!title) {
        title = this.appTitle;
      }
      this.titleService.setTitle(title);
    });
  }

  isMenuVisible(menuItem: MenuItem): boolean {
    for (const route of this.router.config) {
      if (route.path === menuItem.routerLink) {
        if (route.data) {
          const roles: string[] = route.data['roles'];
          if (roles) {
            if (this.securityService) {
              const visible = this.securityService.hasAnyRole(roles);
              return visible;
            } else {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  get username(): string {
    if (this.securityService) {
      return this.securityService.getUsername();
    } else {
      return null;
    }
  }

  get title(): string {
    if (this.appTitle) {
      return this.appTitle;
    } else {
      return this.titleService.getTitle();
    }
  }
}
