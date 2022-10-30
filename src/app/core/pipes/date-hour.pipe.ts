import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateHourStr',
})
export class DateHourPipe implements PipeTransform {
  transform(dateStr: string | null): string {
    if (dateStr === null) {
      return '';
    }
    const date = moment(dateStr);
    return date.format('DD/MM/YYYY HH:mm:ss A');
  }
}
