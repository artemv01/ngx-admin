import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrdersComponent } from './components/orders/orders.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '@app/shared/shared.module';
import { SingleOrderComponent } from './components/single-order/single-order.component';
import { EditAddressComponent } from './components/edit-address/edit-address.component';

@NgModule({
  declarations: [OrdersComponent, SingleOrderComponent, EditAddressComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    HttpClientModule,
    SharedModule,

    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTableModule,
    MatListModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRippleModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class OrderModule {}
