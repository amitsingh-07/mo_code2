import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {

    constructor(
        private currencyPipe: CurrencyPipe) { }

    transform(value) {
        if (value) {
            return this.currencyPipe.transform(value, 'USD', 'symbol-narrow', '1.2-2');
        } else if (value === 0) {
            return 0;
        } else {
            return null;
        }
    }
}