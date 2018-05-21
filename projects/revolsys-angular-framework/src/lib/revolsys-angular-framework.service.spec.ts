import { TestBed, inject } from '@angular/core/testing';

import { RevolsysAngularFrameworkService } from './revolsys-angular-framework.service';

describe('RevolsysAngularFrameworkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevolsysAngularFrameworkService]
    });
  });

  it('should be created', inject([RevolsysAngularFrameworkService], (service: RevolsysAngularFrameworkService) => {
    expect(service).toBeTruthy();
  }));
});
