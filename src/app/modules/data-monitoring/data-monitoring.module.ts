import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { DataMonitoringRoutingModule } from './data-monitoring-routing.module';
import { DataMonitoringComponent } from './data-monitoring.component';

@NgModule({
  declarations: [DataMonitoringComponent],
  imports: [
    CommonModule,
    TextMaskModule,
    DataMonitoringRoutingModule,
    ReactiveFormsModule,
  ],
})
export class DataMonitoringModule {}
