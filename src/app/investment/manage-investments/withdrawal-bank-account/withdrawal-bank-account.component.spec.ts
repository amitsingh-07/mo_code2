import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalBankAccountComponent } from './withdrawal-bank-account.component';

describe('WithdrawBankAccountComponent', () => {
  let component: WithdrawalBankAccountComponent;
  let fixture: ComponentFixture<WithdrawalBankAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawalBankAccountComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
