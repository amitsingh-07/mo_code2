import { AbstractControl } from '@angular/forms';

export function ValidateRange(control: AbstractControl) {
  const SINGAPORE_MOBILE_REGEXP = /^(8|9)\d{7}$/;
  if (!SINGAPORE_MOBILE_REGEXP.test(control.value)) {
    return { mobileRange: true };
  }
  return null;
}
