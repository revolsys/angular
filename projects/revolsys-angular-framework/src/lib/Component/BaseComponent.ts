import { Injector, OnInit, Directive } from '@angular/core';
import {
  DOCUMENT,
  Location
} from '@angular/common';
import {
  Title
} from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router
} from '@angular/router';


import {FrameworkConfig} from '../FrameworkConfig';
import {AuthService} from '../Authentication/auth.service';
import {Service} from '../Service/Service';
import {MessageDialogComponent} from './MessageDialogComponent';

@Directive()
export class BaseComponent<T> implements OnInit {

  authService: AuthService = this.injector.get(AuthService);

  protected config = this.injector.get(FrameworkConfig);

  dialog: MatDialog = this.injector.get(MatDialog);

  document: any = this.injector.get(DOCUMENT);

  protected location: Location = this.injector.get(Location);

  protected route: ActivatedRoute = this.injector.get(ActivatedRoute);

  protected router: Router = this.injector.get(Router);

  titleService: Title = this.injector.get(Title);

  constructor(
    protected injector: Injector,
    protected service: Service<T>,
    protected title?: string
  ) {
    if (this.title) {
      this.setTitle(this.title);
    }
  }

  ngOnInit(): void {
    if (this.title) {
      this.titleService.setTitle(this.title);
    }
  }

  routeList(): void {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  protected showError(message: string, body?: string) {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Error',
        message: message,
        body: body,
      }
    });
    throw Error();
  }

  public getUrl(path: string): string {
    return FrameworkConfig.getUrl(this.config, '/rest' + path);
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  get username(): string {
    return this.authService.username;
  }

  public setTitle(title: string) {
    this.title = title;
    if (title) {
      this.titleService.setTitle(title);
    }
  }

  stringValue(object: any): string {
    if (object) {
      if (Array.isArray(object)) {
        if (object.length > 0) {
          return object.join();
        }
      } else {
        return object.toString();
      }
    }
    return '-';
  }

  trackByIndex(index: number): number {
    return index;
  }

}
