import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './components/reports/reports.component';
import { ChartsModule } from 'ng2-charts';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '@app/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ChartsModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatCardModule,
    SharedModule,
    MatProgressSpinnerModule,
  ],
})
export class ReportsModule {}
