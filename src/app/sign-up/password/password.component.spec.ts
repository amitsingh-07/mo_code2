import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordComponent } from './password.component';

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form invalid when empty', () => {
    expect(component.passwordForm.valid).toBeFalsy();
  });

  it('password validity', () => {
    let errors = {};
    const password = component.passwordForm.controls['password'];
    expect(password.valid).toBeFalsy();

    password.setValue('Welcome');
    errors = password.errors || {};
    expect(errors['length']).toBeTruthy();

    password.setValue('welcomee@1');
    errors = password.errors || {};
    expect(errors['upperLower']).toBeTruthy();

    password.setValue('Welcomee');
    errors = password.errors || {};
    expect(errors['numberSymbol']).toBeTruthy();

    password.setValue('Welcome@1');
    errors = password.errors || {};
    expect(errors).toBeTruthy();
  });

  it('confirm password validity', () => {
    let errors = {};
    const password = component.passwordForm.controls['password'].value;
    const confirmpassword = component.passwordForm.controls['confirmPassword'];
    expect(confirmpassword.valid).toBeFalsy();

    password.setValue('sdfsdfsdfsdfsfsdfsd');
    confirmpassword.setValue('99999999');
    errors = confirmpassword.errors || {};
    expect(errors['notEquivalent']).toBeTruthy();

    password.setValue('Welcome@1');
    confirmpassword.setValue('Welcome@1');
    errors = confirmpassword.errors || {};
    expect(errors['notEquivalent']).toBeFalsy();
  });
});
