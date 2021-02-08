import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './pages/auth/services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/products', pathMatch: 'full' },

  {
    path: '',
    canLoad: [],
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard/products',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./pages/product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'dashboard/categories',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./pages/category/category.module').then((m) => m.CategoryModule),
  },
  {
    path: 'dashboard/orders',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./pages/order/order.module').then((m) => m.OrderModule),
  },
  {
    path: 'dashboard/reviews',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./pages/review/review.module').then((m) => m.ReviewModule),
  },
  {
    path: 'dashboard/reports',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./pages/reports/reports.module').then((m) => m.ReportsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
