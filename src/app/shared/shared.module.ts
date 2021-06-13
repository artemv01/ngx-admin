import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { ItemsTableComponent } from './components/items-table/items-table.component';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { ImageDropComponent } from './components/image-drop/image-drop.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { RateItemComponent } from './components/rate-item/rate-item.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    LayoutComponent,
    ItemsTableComponent,
    ImageDropComponent,
    NotificationsComponent,
    NavItemComponent,
    StarRatingComponent,
    RateItemComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatProgressBarModule,
  ],
  exports: [
    LayoutComponent,
    ItemsTableComponent,
    ImageDropComponent,
    StarRatingComponent,
    RateItemComponent,
  ],
})
export class SharedModule {}
