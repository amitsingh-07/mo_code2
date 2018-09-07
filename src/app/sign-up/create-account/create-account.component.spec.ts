import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountComponent } from './create-account.component';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form invalid when empty', () => {
    expect(component.createAccountForm.valid).toBeFalsy();
  });

  it('country code validity', () => {
    const errors = {};
    const email = component.createAccountForm.controls['countryCode'];
    expect(email.valid).toBeTruthy();
  });

  it('mobile number validity', () => {
    let errors = {};
    const mobileNumber = component.createAccountForm.controls['mobileNumber'];
    expect(mobileNumber.valid).toBeFalsy();

    // Mobile Number field is required
    errors = mobileNumber.errors || {};
    expect(errors['required']).toBeTruthy();

    // Check for invalid singapore mobile number
    mobileNumber.setValue('12345845');
    errors = mobileNumber.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['mobileRange']).toBeTruthy();

    // Check for valid singapore mobile number
    mobileNumber.setValue('99999999');
    errors = mobileNumber.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['mobileRange']).toBeFalsy();

    // Check for other country mobile number
    mobileNumber.setValue('123458');
    errors = mobileNumber.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Check for other country mobile number
    mobileNumber.setValue('9597358881');
    errors = mobileNumber.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();

  });

  it('first name validity', () => {
    let errors = {};
    const firstName = component.createAccountForm.controls['firstName'];
    expect(firstName.valid).toBeFalsy();

    // Mobile Number field is required
    errors = firstName.errors || {};
    expect(errors['required']).toBeTruthy();

    // Check for invalid first name
    firstName.setValue('12345845');
    errors = firstName.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Check for valid first name
    firstName.setValue('test');
    errors = firstName.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });

  it('last name validity', () => {
    let errors = {};
    const lastName = component.createAccountForm.controls['lastName'];
    expect(lastName.valid).toBeFalsy();

    // Mobile Number field is required
    errors = lastName.errors || {};
    expect(errors['required']).toBeTruthy();

    // Check for invalid first name
    lastName.setValue('12345845');
    errors = lastName.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Check for valid first name
    lastName.setValue('test');
    errors = lastName.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });

  it('email validity', () => {
    let errors = {};
    const email = component.createAccountForm.controls['email'];
    expect(email.valid).toBeFalsy();

    // Mobile Number field is required
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();

    // Check for invalid first name
    email.setValue('test');
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    // Check for valid first name
    email.setValue('test@gmail.com');
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
