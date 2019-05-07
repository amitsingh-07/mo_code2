import { AbstractControl } from '@angular/forms';
import { RegexConstants } from '../../shared/utils/api.regex.constants';

export function ValidatePassword(control: AbstractControl) {
  if (!RegexConstants.Password.Full.test(control.value)) {
    const validator = {length: false, upperLower: false, numberSymbol: false};
    validator.length = !RegexConstants.Password.length.test(control.value);
    validator.upperLower = !RegexConstants.Password.UpperLower.test(control.value);
    validator.numberSymbol = !RegexConstants.Password.NumberSymbol.test(control.value);
    return validator;
  }
  return null;
}
