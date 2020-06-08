import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';

export function ValidateRange(control): { [key: string]: boolean } | null {
  const SINGAPORE_MOBILE_REGEXP = /^(8|9)\d{7}$/;
  if (!SINGAPORE_MOBILE_REGEXP.test(control.value)) { //Failed
    return { mobileRange: true };
  }
  //Success
  return null;
}

export function ValidateChange(oldValue: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    if (oldValue === (control.value)) {
      return { notChanged: true };
    }
    return null;
  };
}