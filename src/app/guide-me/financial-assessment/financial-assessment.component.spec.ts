import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAssessmentComponent } from './financial-assessment.component';

describe('FinAssessmentComponent', () => {
  let component: FinancialAssessmentComponent;
  let fixture: ComponentFixture<FinancialAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render step-title in a .p__step-title', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.p__step-title').textContent).toContain('Step 1');
  }));
  it('should render start-title in a .p__start-title', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.p__start-title').textContent).toContain('Financial Assessment');
  }));
  it('should render sub-title in a .p__start-sub-title', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    // tslint:disable-next-line:max-line-length
    expect(compiled.querySelector('.p__start-sub-title').textContent).toContain('In the next step, we are going to gather information on your income, expenses, assets and liabilities to determine your insurance needs.');
  }));
  it('testing the proceed button', async(() => {
    spyOn(component, 'goToIncome');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.goToIncome).toHaveBeenCalled();
    });
  }));
});
