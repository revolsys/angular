import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {
  PageConfig,
  SecurityService
} from 'revolsys-angular-bcgov-page';


@Injectable()
export class AppSecurityService implements SecurityService {
  constructor(
    private pageConfig: PageConfig
  ) {
    this.pageConfig.securityService = this;
  }

  getUsername(): string {
    return 'test_user';
  }

  hasRole(role: string): boolean {
    return false;
  }

  hasAnyRole(roles: string[]): boolean {
    return false;
  }

  hasAnyRoleAsync(roles: string[]): Observable<boolean> {
    return null;
  }

}
