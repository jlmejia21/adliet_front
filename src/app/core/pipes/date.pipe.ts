import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateStr',
})
export class DatePipe implements PipeTransform {
  transform(dateStr: string): string {
    // const date = moment(dateStr);
    // return date.format('DD/MM/YYYY');
    const splitString = dateStr.slice(0, 10);
    const strArray = splitString.split('-');
    return `${strArray[2]}/${strArray[1]}/${strArray[0]}`;
  }
}
