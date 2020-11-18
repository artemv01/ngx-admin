import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { SingleReviewComponent } from './components/single-review/single-review.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewsComponent,
  },

  {
    path: 'edit/:id',
    component: SingleReviewComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewRoutingModule {}
