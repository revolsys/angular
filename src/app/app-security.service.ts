import {Observable} from 'rxjs';
import {SecurityService} from 'revolsys-angular-bcgov-page';

export class AppSecurityService implements SecurityService {
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
