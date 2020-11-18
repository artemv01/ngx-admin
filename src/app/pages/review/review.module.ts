import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewRoutingModule } from './review-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SharedMaterialModule } from '@app/shared/shared-material/shared-material.module';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { SingleReviewComponent } from './components/single-review/single-review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReviewsComponent, SingleReviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReviewRoutingModule,
    SharedModule,
    SharedMaterialModule,
  ],
})
export class ReviewModule {}
