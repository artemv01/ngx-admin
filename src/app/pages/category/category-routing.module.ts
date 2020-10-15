import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { SingleCategoryComponent } from './components/single-category/single-category.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
  },
  {
    path: 'add',
    component: SingleCategoryComponent,
  },
  {
    path: 'edit/:id',
    component: SingleCategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
