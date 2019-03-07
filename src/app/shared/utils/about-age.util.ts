import { Injectable } from '@angular/core';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Injectable()
export class AboutAge {
    getAboutAge(valueString: number, ageConstant: number): number {
		valueString = ageConstant - valueString;
        return valueString;
    }
	calculateAge(date, dateToCalculate): number{
		const dateParts = date.split("-");
		const dateOfBirth = new Date(dateParts[0], (dateParts[1] - 1), dateParts[1]);
		const calculateYear = dateToCalculate.getFullYear();
		const calculateMonth = dateToCalculate.getMonth();
		const calculateDay = dateToCalculate.getDate();
		
		const birthYear = dateOfBirth.getFullYear();	
		const birthMonth = dateOfBirth.getMonth();
		const birthDay = dateOfBirth.getDate();
		
		var age = calculateYear - birthYear;
		const ageMonth = calculateMonth - birthMonth;
		const ageDay = calculateDay - birthDay;

		if (ageMonth < 0 || (ageMonth == 0 && ageDay < 0)) {
			age = toInteger(age) - 1;
		}
		return age;
	}
}
