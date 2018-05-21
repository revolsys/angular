import {
  Observable,
  of
} from 'rxjs';
import {map} from 'rxjs/operators';
import {
  Injectable,
  Injector
} from '@angular/core';
import {Router} from '@angular/router';
import {CanActivate} from '@angular/router';
import {BaseService} from '../Service/BaseService';

@Injectable()
export class AuthService extends BaseService<any>  {
  username: string;
  roles: string[];

  constructor(injector: Injector) {
    super(injector);
    const url = this.getUrl('/authentication');
    this.httpRequest(
      http => {
        return http.get(url);
      },
      json => {
        if (json.error) {
          this.roles = [];
        } else {
          this.roles = json.roles;
          this.username = json.name;
        }
      }
    );
  }

  hasRole(role: string): boolean {
    if (this.roles == null) {
      return false;
    } else {
      return this.roles.indexOf(role) !== -1;
    }
  }

  hasAnyRole(roles: string[]): boolean {
    if (this.roles == null) {
      return true;
    } else {
      for (const role of roles) {
        if (this.roles.indexOf(role) !== -1) {
          return true;
        }
      }
      return false;
    }
  }

  hasAnyRoleAsync(roles: string[]): Observable<boolean> {
    if (this.roles == null) {
      const url = this.getUrl('/authentication');
      return this.http.get(url).pipe(
        map((json: any) => {
          if (json.error) {
            this.roles = [];
          } else {
            this.roles = json.roles;
          }
          return this.hasAnyRole(roles);
        }
        )
      );
    } else {
      return of(this.hasAnyRole(roles));
    }
  }
}
