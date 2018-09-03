import { AbstractControl } from '@angular/forms';

export function ValidateMatchPassword(control: AbstractControl) {
  const password = control.get('password').value;
  const confirmPassword = control.get('confirmPassword').value;
  if (password !== confirmPassword) {
      return {MatchPassword: true};
  } else {
      return null;
  }
}
