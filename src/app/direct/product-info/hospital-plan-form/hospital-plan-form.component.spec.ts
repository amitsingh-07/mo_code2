import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPlanFormComponent } from './hospital-plan-form.component';

describe('HospitalPlanFormComponent', () => {
  let component: HospitalPlanFormComponent;
  let fixture: ComponentFixture<HospitalPlanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalPlanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
