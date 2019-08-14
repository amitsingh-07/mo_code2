import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentPeriodComponent } from './investment-period.component';

describe('InvestmentPeriodComponent', () => {
  let component: InvestmentPeriodComponent;
  let fixture: ComponentFixture<InvestmentPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
