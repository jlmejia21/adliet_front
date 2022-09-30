import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertModule } from '@shared/components/alert/alert.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataProcesingRoutingModule } from './data-procesing-routing.module';

import { DataProcesingComponent } from './data-procesing.component';

@NgModule({
  declarations: [DataProcesingComponent],
  imports: [
    CommonModule,
    DataProcesingRoutingModule,
    RouterModule,
    NgxPaginationModule,
    AlertModule,
  ],
})
export class DataProcesingModule {}
