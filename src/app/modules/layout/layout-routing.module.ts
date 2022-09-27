import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'data-procesing',
        loadChildren: () =>
          import('../data-procesing/data-procesing.module').then(
            (m) => m.DataProcesingModule
          ),
      },
      {
        path: 'data-monitoring',
        loadChildren: () =>
          import('../data-monitoring/data-monitoring.module').then(
            (m) => m.DataMonitoringModule
          ),
      },
      {
        path: 'configuration',
        loadChildren: () =>
          import('../configuration/configuration.module').then(
            (m) => m.ConfigurationModule
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('../orders/orders.component').then((m) => m.OrdersComponent),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
