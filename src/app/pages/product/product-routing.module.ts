import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { SingleProductComponent } from './components/single-product/single-product.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: 'add',
    component: SingleProductComponent,
    /* resolve: {
      categories: CategoriesResolver,
    }, */
  },
  {
    path: 'edit/:id',
    component: SingleProductComponent,
    /*  resolve: {
      product: SingleProductResolver,
      categories: CategoriesResolver,
    }, */
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
