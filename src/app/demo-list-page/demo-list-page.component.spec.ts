import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoListPageComponent } from './demo-list-page.component';

describe('DemoListPageComponent', () => {
  let component: DemoListPageComponent;
  let fixture: ComponentFixture<DemoListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
