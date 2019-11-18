import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementPlanComponent } from './retirement-plan.component';

describe('RetirementPlanComponent', () => {
  let component: RetirementPlanComponent;
  let fixture: ComponentFixture<RetirementPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
