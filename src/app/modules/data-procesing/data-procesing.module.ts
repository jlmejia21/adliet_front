import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  ],
})
export class DataProcesingModule {}
