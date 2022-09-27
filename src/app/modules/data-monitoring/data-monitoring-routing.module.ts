import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataMonitoringComponent } from './data-monitoring.component';

const routes: Routes = [
  {
    path: '',
    component: DataMonitoringComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataMonitoringRoutingModule {}
