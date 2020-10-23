import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductRoutingModule } from './product-routing.module';
import { ProductsComponent } from './components/products/products.component';
import { SingleProductComponent } from './components/single-product/single-product.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [ProductsComponent, SingleProductComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    SharedModule,
    HttpClientModule,
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
    DragDropModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
  ],
})
export class ProductModule {}
