import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmWithdrawalComponent } from './confirm-withdrawal.component';

describe('ConfirmWithdrawalComponent', () => {
  let component: ConfirmWithdrawalComponent;
  let fixture: ComponentFixture<ConfirmWithdrawalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmWithdrawalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
