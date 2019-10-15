import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourInvestmentAmountComponent } from './your-investment-amount.component';

describe('YourInvestmentAmountComponent', () => {
  let component: YourInvestmentAmountComponent;
  let fixture: ComponentFixture<YourInvestmentAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourInvestmentAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourInvestmentAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
