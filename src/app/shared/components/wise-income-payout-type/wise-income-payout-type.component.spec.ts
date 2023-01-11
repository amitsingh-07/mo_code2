import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WiseIncomePayoutTypeComponent } from './wise-income-payout-type.component';

describe('WiseIncomePayoutTypeComponent', () => {
  let component: WiseIncomePayoutTypeComponent;
  let fixture: ComponentFixture<WiseIncomePayoutTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WiseIncomePayoutTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiseIncomePayoutTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
