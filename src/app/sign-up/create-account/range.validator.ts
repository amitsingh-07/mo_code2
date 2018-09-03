import { AbstractControl } from '@angular/forms';

export function ValidateRange(control: AbstractControl) {
  if (control.value !== undefined && (isNaN(control.value) || control.value < 8000000 || control.value > 99999999)) {
    return { mobileRange: true };
  }
  return null;
}
