import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawPaymentMethodComponent } from './withdraw-payment-method.component';

describe('WithdrawPaymentMethodComponent', () => {
  let component: WithdrawPaymentMethodComponent;
  let fixture: ComponentFixture<WithdrawPaymentMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawPaymentMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
