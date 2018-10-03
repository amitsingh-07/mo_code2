import { Injectable } from '@angular/core';

const Regexp = new RegExp('[^\\d.]', 'g');

@Injectable()
export class Formatter {
    static getIntValue(valueString: any) {
        valueString += '';
        valueString = valueString.replace(Regexp, '');
        return valueString;
    }

    static createObjectKey(value: any) {
        if (!value) {
            return '_';
        } else if (isNaN(value)) {
            return value.replace(/ /g, '_');
        } else {
            return '_' + value;
        }
    }
}
