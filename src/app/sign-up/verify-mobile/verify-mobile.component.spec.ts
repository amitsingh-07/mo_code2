import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMobileComponent } from './verify-mobile.component';

describe('VerifyMobileComponent', () => {
  let component: VerifyMobileComponent;
  let fixture: ComponentFixture<VerifyMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form invalid when empty', () => {
    expect(component.verifyMobileForm.valid).toBeFalsy();
  });

  it('first name validity', () => {
    let errors = {};
    const otp1 = component.verifyMobileForm.controls['otp1'];
    expect(otp1.valid).toBeFalsy();

    const otp2 = component.verifyMobileForm.controls['otp2'];
    expect(otp2.valid).toBeFalsy();

    const otp3 = component.verifyMobileForm.controls['otp3'];
    expect(otp3.valid).toBeFalsy();

    const otp4 = component.verifyMobileForm.controls['otp4'];
    expect(otp4.valid).toBeFalsy();

    const otp5 = component.verifyMobileForm.controls['otp5'];
    expect(otp5.valid).toBeFalsy();

    const otp6 = component.verifyMobileForm.controls['otp6'];
    expect(otp6.valid).toBeFalsy();

    // otp field is required
    errors = otp1.errors || {};
    expect(errors['required']).toBeTruthy();

    errors = otp2.errors || {};
    expect(errors['required']).toBeTruthy();

    errors = otp3.errors || {};
    expect(errors['required']).toBeTruthy();

    errors = otp4.errors || {};
    expect(errors['required']).toBeTruthy();

    errors = otp5.errors || {};
    expect(errors['required']).toBeTruthy();

    errors = otp6.errors || {};
    expect(errors['required']).toBeTruthy();

    // Check for invalid otp
    otp1.setValue('1q');
    errors = otp1.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    otp2.setValue('1q');
    errors = otp2.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    otp3.setValue('1q');
    errors = otp3.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    otp4.setValue('1q');
    errors = otp4.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    otp5.setValue('1q');
    errors = otp5.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    otp6.setValue('1q');
    errors = otp6.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Check for valid otp
    otp1.setValue('1');
    errors = otp1.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();

    otp2.setValue('1');
    errors = otp2.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();

    otp3.setValue('1');
    errors = otp3.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();

    otp4.setValue('1');
    errors = otp4.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();

    otp5.setValue('1');
    errors = otp5.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();

    otp6.setValue('1');
    errors = otp6.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();

  });
});
