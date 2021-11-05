import {FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidateMobileChange(params: any): ValidatorFn {
  return (group: FormGroup): ValidationErrors => {
    const keys = Object.keys(params);
    let hasChange = false;
    for (const key of keys) {
      const updatedKey = 'new' + key.charAt(0).toUpperCase() + key.substring(1);
      if (group.controls[updatedKey]) {
        if (params[key] !== group.controls[updatedKey].value) {
          hasChange = true;
        }
      }
    }
    if (hasChange) {
      return null;
    } else {
      return { mobileNotChanged: true };
    }
  };
}

export function ValidateEmailChange(params: any): ValidatorFn {
  return (group: FormGroup): ValidationErrors => {
    const keys = Object.keys(params);
    let hasChange = false;
    for (const key of keys) {
      const updatedKey = 'new' + key.charAt(0).toUpperCase() + key.substring(1);
      if (group.controls[updatedKey]) {
        if (params[key] !== group.controls[updatedKey].value) {
          hasChange = true;
        }
      }
    }
    if (hasChange) {
      return null;
    } else {
      return { emailNotChanged: true };
    }
  };
}