import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditAddressComponent } from './components/edit-address/edit-address.component';
import { OrdersComponent } from './components/orders/orders.component';
import { SingleOrderComponent } from './components/single-order/single-order.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
  },
  {
    path: 'edit/:id/:addressType',
    component: EditAddressComponent,
  },
  {
    path: 'edit/:id',
    component: SingleOrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
