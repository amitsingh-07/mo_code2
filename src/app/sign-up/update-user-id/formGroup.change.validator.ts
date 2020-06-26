import {FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidateGroupChange(params: any): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const keys = Object.keys(params);
      let hasChange = false;
      for (const key of keys) {
        if (group.controls[key]) {
          if (params[key] !== group.controls[key].value) {
            hasChange = true;
          }
        }
      }
      if (hasChange) {
        return null;
      } else {
        return { notChanged: true };
      }
    };
  }