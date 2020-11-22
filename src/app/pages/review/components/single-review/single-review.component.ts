
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { LoadingService } from 'src/app/shared/services/loading.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CategoryService } from 'src/app/pages/category/services/category.service';
import { ReviewService } from '../../services/reviews.service';

@Component({
  selector: 'app-single-review',
  templateUrl: './single-review.component.html',
  styleUrls: ['./single-review.component.scss'],
})
export class SingleReviewComponent implements OnInit {
  itemId: string;
  destroy: Subject<boolean> = new Subject();

  editForm = this.fb.group({
    authorName: ['', [Validators.required]],
    authorEmail: ['', [Validators.required]],
    content: ['', [Validators.required]],
    rating: ['', [Validators.required]],
  });
  get authorName(): AbstractControl {
    return this.editForm.get('authorName');
  }
  get authorEmail(): AbstractControl {
    return this.editForm.get('authorEmail');
  }
  get content(): AbstractControl {
    return this.editForm.get('content');
  }
  authorNameTitle: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public location: Location,
    public loading: LoadingService,
    public categoryService: CategoryService,
    public notification: NotificationService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.reviewService.getOne(this.itemId).subscribe((review) => {
        const { _id, ...reviewData } = review;
        this.editForm.patchValue(reviewData);
        this.authorNameTitle = reviewData.authorName;
      });
    }
  }

  edit() {
    if (this.editForm.invalid) return;
    let formData = this.editForm.value;

    this.reviewService.edit(formData, this.itemId).subscribe((updated) => {
      const { _id, productName, ...reviewData } = updated;
      this.editForm.patchValue(reviewData);
      this.authorNameTitle = reviewData.authorName;

      this.notification.push({
        message: 'Product edited!',
      });
    });
  }

  back() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy.next(null);
  }
}
