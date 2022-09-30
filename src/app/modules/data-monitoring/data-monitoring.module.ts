import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@core/pipes/date.pipe';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxPaginationModule } from 'ngx-pagination';

import { DataMonitoringRoutingModule } from './data-monitoring-routing.module';
import { DataMonitoringComponent } from './data-monitoring.component';

@NgModule({
  declarations: [DataMonitoringComponent, DatePipe],
  imports: [
    CommonModule,
    TextMaskModule,
    DataMonitoringRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
})
export class DataMonitoringModule {}
