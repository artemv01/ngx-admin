import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/services/alert.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-single-category',
  templateUrl: './single-category.component.html',
  styleUrls: ['./single-category.component.scss'],
})
export class SingleCategoryComponent implements OnInit, AfterViewInit {
  categoryId: string;
  destroy: Subject<boolean> = new Subject();

  categoryForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  savedStatus = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: CategoryService,
    public location: Location,
    public loading: LoadingService,
    public notification: NotificationService
  ) {}

  get name(): AbstractControl {
    return this.categoryForm.get('name');
  }
  get description(): AbstractControl {
    return this.categoryForm.get('description');
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy)).subscribe((params) => {
      this.savedStatus = params.status;
    });

    this.route.paramMap.pipe(takeUntil(this.destroy)).subscribe((params) => {
      this.categoryId = params.get('id') === 'add' ? '' : params.get('id');
      if (this.categoryId) {
        this._getCategory();
      }
    });
  }

  ngAfterViewInit() {
    if (this.savedStatus === 'success') {
      setTimeout(() => {
        this.notification.push({
          message: 'Category created!',
        });
      }, 0);
    }
  }

  editCategory() {
    this.loading.show();
    this.api.edit(this.categoryForm.value, this.categoryId).subscribe(
      (result) => {
        this.loading.hide();
        this.notification.push({
          message: 'Category edited!',
        });
      },
      () => this.loading.hide()
    );
  }

  addCategory() {
    this.loading.show();
    this.api.create(this.categoryForm.value).subscribe(
      (result) => {
        this.loading.hide();

        this.router.navigate(['/dashboard/categories/edit/', result], {
          queryParams: {
            status: 'success',
          },
          queryParamsHandling: 'merge',
        });
      },
      () => this.loading.hide()
    );
  }

  private _getCategory() {
    this.loading.show();
    this.api.getOne(this.categoryId).subscribe(
      (category: Category) => {
        this.categoryForm.patchValue(category);
        this.loading.hide();
      },
      () => {
        this.loading.hide();
      }
    );
  }

  ngOnDestroy() {
    this.destroy.next(null);
  }
}
