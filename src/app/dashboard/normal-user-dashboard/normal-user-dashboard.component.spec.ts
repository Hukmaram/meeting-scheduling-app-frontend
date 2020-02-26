import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalUserDashboardComponent } from './normal-user-dashboard.component';

describe('NormalUserDashboardComponent', () => {
  let component: NormalUserDashboardComponent;
  let fixture: ComponentFixture<NormalUserDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalUserDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalUserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
