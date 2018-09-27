import { FormControl } from '@angular/forms';
export class FinancialValidator {
    isEqual(c: FormControl): any {
        if (c.parent) {
            if (c.parent.value['username'] !== c.value) {
                return {isNotEqual: true}
            } else {
                return {isNotEqual: false}
            }
        }

        return null;
    }
}
