import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value) {
    if (typeof (value) === 'string') {
      if (value.match(/[a-z]/i)) {
        return value;
      } else {
        // tslint:disable-next-line:radix
        value = parseInt(value);
      }
    }
    if (value === 0) {
      return '$' + 0;
    } else {
      if (value <= 9999) {
        return '$' + this.formatter(value);
      } else if (value >= 10000 && value <= 999999) {
        return '$' + (value / 1000).toFixed(0) + 'K';
      } else if (value >= 1000000 && value <= 999999999) {
        return '$' + (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000000000 && value <= 999999999999) {
        return '$' + (value / 1000000000).toFixed(2) + 'B';
      } else {
        return value;
      }
    }
  }
  // tslint:disable-next-line:member-ordering
  formatter(n) {
    const d = '.';
    const t = ',';
    const i = String(n = Math.abs(Number(n) || 0).toFixed(0));
    const j = i.length > 3 ? (i.length) % 3 : 0;
    return (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t);
  }
}
