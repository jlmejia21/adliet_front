import { NgModule } from '@angular/core';
import { DateHourPipe } from './date-hour.pipe';
import { DatePipe } from './date.pipe';

@NgModule({
  declarations: [DatePipe, DateHourPipe],
  exports: [DatePipe, DateHourPipe],
})
export class PipeModule {}
