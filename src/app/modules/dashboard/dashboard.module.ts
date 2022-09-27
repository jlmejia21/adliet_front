import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgChartsModule } from 'ng2-charts';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, NgChartsModule],
})
export class DashboardModule {}
