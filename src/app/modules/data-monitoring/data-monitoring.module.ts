import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from '@core/pipes/pipe.module';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxPaginationModule } from 'ngx-pagination';

import { DataMonitoringRoutingModule } from './data-monitoring-routing.module';
import { DataMonitoringComponent } from './data-monitoring.component';

@NgModule({
  declarations: [DataMonitoringComponent],
  imports: [
    CommonModule,
    TextMaskModule,
    DataMonitoringRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    PipeModule,
  ],
})
export class DataMonitoringModule {}
