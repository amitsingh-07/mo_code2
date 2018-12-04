import { Pipe, PipeTransform } from '@angular/core';
import { padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value) {
      if (value) {
      const dateValue  = new Date(value);
      const date = padNumber(dateValue.getDate());
      const month = padNumber(dateValue.getMonth() + 1);
      const year = dateValue.getFullYear().toString().substr(-2);
      return `${date}/${month}/${year}`;
      }
  }
}
