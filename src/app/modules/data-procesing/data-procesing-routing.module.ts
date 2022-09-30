import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignationGuard } from '@core/guards/assignation.guard';
import { DataProcesingComponent } from './data-procesing.component';

const routes: Routes = [
  {
    path: '',
    component: DataProcesingComponent,
  },
  {
    path: 'assignation',
    canActivate: [AssignationGuard],
    loadComponent: () =>
      import('./components/assignation/assignation.component').then(
        (c) => c.AssignationComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataProcesingRoutingModule {}
