import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementPlanStep1Component } from './retirement-plan-step1.component';

describe('RetirementPlanStep1Component', () => {
  let component: RetirementPlanStep1Component;
  let fixture: ComponentFixture<RetirementPlanStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementPlanStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementPlanStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
