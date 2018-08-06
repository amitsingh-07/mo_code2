import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPlanComponent } from './hospital-plan.component';

describe('HospitalPlanComponent', () => {
  let component: HospitalPlanComponent;
  let fixture: ComponentFixture<HospitalPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
