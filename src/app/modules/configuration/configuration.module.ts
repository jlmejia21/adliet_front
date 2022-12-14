import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from '@shared/components/alert/alert.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';

@NgModule({
  declarations: [ConfigurationComponent],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    ReactiveFormsModule,
    AlertModule,
    NgxPaginationModule,
  ],
})
export class ConfigurationModule {}
