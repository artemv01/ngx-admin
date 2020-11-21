import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of, Subject } from 'rxjs';
import { first, mergeMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/services/alert.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { StorageService } from '@app/shared/services/storage.service';
import { ItemType } from '@app/pages/product/models/item-type';

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
  categoryName: string;

  get name(): AbstractControl {
    return this.categoryForm.get('name');
  }
  get description(): AbstractControl {
    return this.categoryForm.get('description');
  }
  savedStatus = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    public location: Location,
    public loading: LoadingService,
    public notification: NotificationService,
    private store: StorageService<Category>
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy)).subscribe((params) => {
      this.savedStatus = params['status'];
    });
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.store.select$
        .pipe(
          first(),
          withLatestFrom(this.store.type$),
          mergeMap(
            ([item, type]): Observable<Category> => {
              const id = this.categoryId;
              if (id === item?._id && type == ItemType.CATEGORY) {
                return of(item);
              }

              return this.categoryService.getOne(id);
            }
          )
        )
        .subscribe((item: Category) => {
          this.categoryName = item.name;
          this.categoryForm.patchValue(item);
        });
    }
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
    this.categoryService
      .edit(this.categoryForm.value, this.categoryId)
      .subscribe((result) => {
        this.notification.push({
          message: 'Category edited!',
        });
      });
  }

  addCategory() {
    if (this.categoryForm.invalid) return;
    this.categoryService.create(this.categoryForm.value).subscribe((result) => {
      this.router.navigate(['/dashboard/categories/edit/', result._id], {
        queryParams: {
          status: 'success',
        },
        queryParamsHandling: 'merge',
      });
    });
  }

  back() {
    this.router.navigate(['/dashboard', 'categories']);
  }

  ngOnDestroy() {
    this.destroy.next(null);
  }
}
