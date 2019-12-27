import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PaymentRedirectComponent } from './payment-redirect.component';

describe('PaymentRedirectComponent', () => {
  let component: PaymentRedirectComponent;
  let fixture: ComponentFixture<PaymentRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentRedirectComponent],
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create PaymentRedirectComponent', () => {
    expect(component).toBeTruthy();
  });
});
