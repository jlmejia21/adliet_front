import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, SharedModule, LayoutRoutingModule],
})
export class LayoutModule {}
