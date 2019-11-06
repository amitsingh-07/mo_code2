import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementPlanStep2Component } from './retirement-plan-step2.component';

describe('RetirementPlanStep2Component', () => {
  let component: RetirementPlanStep2Component;
  let fixture: ComponentFixture<RetirementPlanStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementPlanStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementPlanStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
