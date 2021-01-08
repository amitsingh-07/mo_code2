import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Util } from './util';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length === 1 && Util.isNumber(dateParts[0])) {
        return { day:Util.toInteger(dateParts[0]), month: null, year: null };
      } else if (dateParts.length === 2 && Util.isNumber(dateParts[0]) && Util.isNumber(dateParts[1])) {
        return { day: Util.toInteger(dateParts[0]), month: Util.toInteger(dateParts[1]), year: null };
      } else if (dateParts.length === 3 && Util.isNumber(dateParts[0]) && Util.isNumber(dateParts[1]) && Util.isNumber(dateParts[2])) {
        return { day: Util.toInteger(dateParts[0]), month: Util.toInteger(dateParts[1]), year: Util.toInteger(dateParts[2]) };
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date ?
      `${Util.isNumber(date.day) ? Util.padNumber(date.day) : ''}/${Util.isNumber(date.month) ? Util.padNumber(date.month) : ''}/${date.year}` :
      '';
  }
}
