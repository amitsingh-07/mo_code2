import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentInstructionModalComponent } from './payment-instruction-modal.component';

describe('PaymentInstructionModalComponent', () => {
  let component: PaymentInstructionModalComponent;
  let fixture: ComponentFixture<PaymentInstructionModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentInstructionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentInstructionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
