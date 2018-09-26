import { Injectable } from '@angular/core';

const Regexp = new RegExp('[^\\d.]', 'g');

@Injectable()
export class Formatter {
    static getIntValue(valueString: any) {
        valueString += '';
        valueString = valueString.replace(Regexp, '');
        return valueString;
    }
}
