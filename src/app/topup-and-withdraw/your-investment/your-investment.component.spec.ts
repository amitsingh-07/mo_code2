import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourInvestmentComponent } from './your-investment.component';

describe('YourInvestmentComponent', () => {
  let component: YourInvestmentComponent;
  let fixture: ComponentFixture<YourInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourInvestmentComponent);
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
