import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '../utils/util';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value) {
      if (value) {
      const dateValue  = new Date(value);
      const date = Util.padNumber(dateValue.getDate());
      const month = Util.padNumber(dateValue.getMonth() + 1);
      const year = dateValue.getFullYear().toString().substr(-2);
      return `${date}/${month}/${year}`;
      }
  }
}
