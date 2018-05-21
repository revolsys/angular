import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevolsysAngularFrameworkComponent } from './revolsys-angular-framework.component';

describe('RevolsysAngularFrameworkComponent', () => {
  let component: RevolsysAngularFrameworkComponent;
  let fixture: ComponentFixture<RevolsysAngularFrameworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevolsysAngularFrameworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevolsysAngularFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
