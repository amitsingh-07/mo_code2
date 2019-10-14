import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentOverviewComponent } from './investment-overview.component';

describe('InvestmentOverviewComponent', () => {
  let component: InvestmentOverviewComponent;
  let fixture: ComponentFixture<InvestmentOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Total Returns content', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#investment_overview_total_returns_labl').textContent).toContain('Total Returns');
  }));

  it('should render From start of investment content', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#investment_overview_investment_start_labl').textContent).toContain('From start of investment content');
  }));

  it('should render From start of investment content', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#investment_overview_investment_start_labl').textContent).toContain('From start of investment content');
  }));

  it('should render Net Capital Invested content', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#investment_overview_total_returns_labl').textContent).toContain('Net Capital Invested');
  }));

  it('should render Cash Account Balance', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#investment_overview_investment_cash_labl').textContent).toContain('Cash Account Balance');
  }));

});
