import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'StringToLink'
  })
  export class StringToLinkFormatPipe extends Pipe implements PipeTransform {
    transform(value): string {
      if (value) {
        return value.replace(/ /g, '_').toLowerCase();
      } else {
        return value;
      }
    }
  }