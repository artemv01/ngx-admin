import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { SingleCategoryComponent } from './components/single-category/single-category.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoriesComponent } from './components/categories/categories.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [SingleCategoryComponent, CategoriesComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
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
    MatIconModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTableModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRippleModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class CategoryModule {}
