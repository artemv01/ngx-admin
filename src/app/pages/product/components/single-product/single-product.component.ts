import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { ItemsResp } from 'src/app/shared/components/items-table/items-resp';
import { AlertService } from 'src/app/shared/services/alert.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Product } from '../../models/product';
import { Category } from '../../../category/models/category';
import { ProductsService } from '../../services/products.service';
import { CategoryService } from 'src/app/pages/category/services/category.service';

export const salePriceRequired: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const sale = control.get('sale')?.value;
  const salePrice = control.get('salePrice')?.value;
  const onSale = control.get('onSale')?.value;
  if (onSale && !salePrice) {
    control.get('salePrice').setErrors({ salePriceRequired: true });
    control.get('salePrice').markAsTouched();
    return { salePriceRequired: true };
  } else if (
    salePrice &&
    salePrice.length &&
    !/^[0-9.]*$/.test(control.get('salePrice').value)
  ) {
    control.get('salePrice').setErrors({ pattern: true });
    return { pattern: true };
  }
  control.get('salePrice')?.setErrors(null);

  return null;
};

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss'],
})
export class SingleProductComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];

  filterCats$: Observable<Category[]>;
  catsInput = new FormControl();

  routeParamSub: any;
  productId: string;
  destroy: Subject<boolean> = new Subject();

  //   initImageSrc$ = new Subject();
  initImageSrc = '';

  productForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      description: [''],
      price: ['', [Validators.required, Validators.pattern('^[0-9.]*$')]],
      salePrice: ['', []],
      onSale: [false],
      image: [''],
      category: [''],
    },
    {
      validators: salePriceRequired,
    }
  );

  // product categories
  allCategories: Category[] = [];
  addedCategories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ProductsService,
    private alert: AlertService,
    public location: Location,
    public loading: LoadingService,
    public categoryService: CategoryService,
    public notification: NotificationService
  ) {
    this.filterCats$ = this.catsInput.valueChanges.pipe(
      startWith(null),
      map((text: string | null) =>
        text ? this._filter(text) : this.allCategories.slice()
      )
    );
  }

  get name(): AbstractControl {
    return this.productForm.get('name');
  }
  get description(): AbstractControl {
    return this.productForm.get('description');
  }
  get price(): AbstractControl {
    return this.productForm.get('price');
  }
  get salePrice(): AbstractControl {
    return this.productForm.get('salePrice');
  }
  get onSale(): AbstractControl {
    return this.productForm.get('onSale');
  }
  get category(): AbstractControl {
    return this.productForm.get('category');
  }
  get image(): AbstractControl {
    return this.productForm.get('image');
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy)).subscribe((params) => {
      // this.savedStatus = params['status'];
    });

    this.route.paramMap.pipe(takeUntil(this.destroy)).subscribe((params) => {
      this.productId = params.get('id') === 'add' ? '' : params.get('id');
      if (this.productId) {
        this._getProduct();
      } else {
        this.loading.show();
        this.categoryService
          .getAll()
          .subscribe((categories: ItemsResp<Category>) => {
            this.allCategories = categories.items;
            this.loading.hide();
          });
      }
    });
  }

  /* addProduct() {
    this.notification.push({ message: 'Product created!' });
  } */
  editProduct() {
    this.loading.show();
    let formData = {
      categories: this.addedCategories,
      ...this.productForm.value,
    };

    this.api.edit(formData, this.productId).subscribe(
      (result) => {
        this.loading.hide();
        this.notification.push({
          message: 'Product edited!',
        });
      },
      () => this.loading.hide()
    );
  }

  addProduct() {
    this.loading.show();
    let formData = {
      categories: this.addedCategories,
      ...this.productForm.value,
    };

    this.api.create(formData).subscribe(
      (result) => {
        this.loading.hide();

        this.router.navigate(['/dashboard/products/edit/', result], {
          queryParams: {
            status: 'success',
          },
          queryParamsHandling: 'merge',
        });
      },
      () => this.loading.hide()
    );
  }

  createCategory(event: MatChipInputEvent): void {
    const value = event.value;
    const input = event.input;
    const exists = this.allCategories.find((cat) => cat.name === value);

    input.value = '';

    if (exists) {
      this.alert.show('This category already exists');
      return;
    }
    this.addedCategories.push({ name: value, isNew: true });
    this.allCategories.push({ name: value });
  }

  addCategoryToProduct(event: MatAutocompleteSelectedEvent) {
    const id = event?.option?.value;
    if (!id) return;
    const cat = this.allCategories.find((cat) => cat._id === id);

    for (const val of this.addedCategories) {
      if (val.name === cat.name) {
        if (val.toDelete) {
          val.toDelete = false;
          return;
        }
        this.alert.show(`Category ${cat.name} is already added`);
        return false;
      }
    }

    this.addedCategories.push({ ...cat, isNew: true });
    this.catsInput.setValue(null);
  }
  removeCategory(i: number): void {
    this.addedCategories[i].toDelete = true;
  }

  private _getProduct() {
    this.loading.show();
    forkJoin([
      this.api.getOne(this.productId),
      this.categoryService.getAll(),
    ]).subscribe(
      ([product, categoryList]) => {
        const { categories, image, ...productData } = product;
        this.productForm.patchValue(productData);
        if (image) {
          // this.initImageSrc$.next(image);
          this.initImageSrc = image;
        }
        this.addedCategories = categories;
        this.productForm.updateValueAndValidity();
        this.allCategories = categoryList.items;
        this.loading.hide();
      },
      () => {
        this.loading.hide();
      }
    );
  }

  private _filter(value: string): Category[] {
    const filterValue = value.toLowerCase();

    return this.allCategories.filter(
      (cat) => cat.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  ngOnDestroy() {
    this.destroy.next(null);
  }
}
