import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './pages/auth/services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/products', pathMatch: 'full' },

  {
    path: '',
    canActivate: [],
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard/products',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'dashboard/categories',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/category/category.module').then((m) => m.CategoryModule),
  },
  {
    path: 'dashboard/orders',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/order/order.module').then((m) => m.OrderModule),
  },
  {
    path: 'dashboard/reviews',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/review/review.module').then((m) => m.ReviewModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
