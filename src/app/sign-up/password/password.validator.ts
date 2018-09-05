import { AbstractControl } from '@angular/forms';

export function ValidatePassword(control: AbstractControl) {
  const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/;
  const LENGTH_REGEXP = /.{8,20}/;
  const UPPER_LOWER_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])/;
  const NUMBER_SYMBOL_REGEXP = /^(?=.*\d)(?=.*[$@$!%*?&])/;
  if (!PASSWORD_REGEXP.test(control.value)) {
    const validator = {length: false, upperLower: false, numberSymbol: false};
    validator.length = !LENGTH_REGEXP.test(control.value);
    validator.upperLower = !UPPER_LOWER_REGEXP.test(control.value);
    validator.numberSymbol = !NUMBER_SYMBOL_REGEXP.test(control.value);
    return validator;
  }
  return null;
}
