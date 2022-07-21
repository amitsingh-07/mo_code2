import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyEditor'
})
export class CurrencyEditorPipe implements PipeTransform {

  constructor(
    private currencyPipe: CurrencyPipe
  ) { }

  transform(value: number, currencyType: string, decimal: string, symbol: string) {
    if (value) {
      return this.currencyPipe.transform(value, currencyType, symbol, decimal);
    } else if (value === 0) {
      return '$0';
    } else {
      return null
    };
  }

}
