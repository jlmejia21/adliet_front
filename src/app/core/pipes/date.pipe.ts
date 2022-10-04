import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateStr',
})
export class DatePipe implements PipeTransform {
  transform(dateStr: string): string {
    const date = moment(dateStr);
    return date.format('DD/MM/YYYY');
  }
}
