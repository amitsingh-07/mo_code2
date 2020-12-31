import { Injectable } from '@angular/core';
import { Util } from './util';
<<<<<<< .mine
import { Util } from './util';
=======
import { toInteger } from '../utils/common.util';
>>>>>>> .theirs


@Injectable()
export class AboutAge {
	getAboutAge(valueString: number, ageConstant: number): number {
		valueString = ageConstant - valueString;
		return valueString;
	}

	calculateAge(date, dateToCalculate): number {
		if(date === null || date === '' || date === 'undefined' || date === undefined) {
			return -1;
		} else {
			const dateParts = date.split('/');
			const dateOfBirth = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);

			const calculateYear = dateToCalculate.getFullYear();
			const calculateMonth = dateToCalculate.getMonth();
			const calculateDay = dateToCalculate.getDate();

			const birthYear = dateOfBirth.getFullYear();
			const birthMonth = dateOfBirth.getMonth();
			const birthDay = dateOfBirth.getDate();

			let age = calculateYear - birthYear;
			const ageMonth = calculateMonth - birthMonth;
			const ageDay = calculateDay - birthDay;

			if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
				age = Util.toInteger(age) - 1;
			}
			return age;
		}
	}
	calculateAgeByYear(date, dateToCalculate): number {
		const dateParts = date.split('/');
		const dateOfBirth = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
		const birthYear = dateOfBirth.getFullYear();
		const calculateYear = dateToCalculate.getFullYear();
		let age = calculateYear - birthYear;
		return age;
	}
	getBirthYear(date): number {
		const dateParts = date.split('/');
		const dateOfBirth = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
		const birthYear = dateOfBirth.getFullYear();
		return birthYear;
	}
}
