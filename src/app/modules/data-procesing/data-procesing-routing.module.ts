import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataProcesingComponent } from './data-procesing.component';

const routes: Routes = [
  {
    path: '',
    component: DataProcesingComponent,
  },
  {
    path: 'asignation',
    loadComponent: () =>
      import('./components/asignation/asignation.component').then(
        (c) => c.AsignationComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataProcesingRoutingModule {}
