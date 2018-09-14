import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementIncomeFormComponent } from './retirement-income-form.component';

describe('RetirementIncomeFormComponent', () => {
  let component: RetirementIncomeFormComponent;
  let fixture: ComponentFixture<RetirementIncomeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementIncomeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementIncomeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
