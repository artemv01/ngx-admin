import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Location } from '@angular/common';

import { Router, ActivatedRoute } from '@angular/router';
import { BulkAction } from '@app/shared/models/bulk-action';
import { LoadingService } from '@app/shared/services/loading.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Address } from '../../models/address';
import { CartItem } from '../../models/cart-item';
import { Order } from '../../models/order';
import { OrderStatus } from '../../models/order-status';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.scss'],
})
export class SingleOrderComponent implements OnInit {
  addressForm = this.fb.group({
    shippingAddress: this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      address_line1: ['', [Validators.required]],
      address_line2: [''],
      zip: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
    }),
    billingAddress: this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      address_line1: [''],
      address_line2: [''],
      zip: [''],
      country: [''],
      city: [''],
      state: [''],
      email: [''],
      phone: [''],
    }),
  });
  showShippingForm = false;
  showBillingForm = false;
  get shippingForm(): AbstractControl {
    return this.addressForm.get('shippingAddress');
  }
  get shippingFirstName(): AbstractControl {
    return this.addressForm.get('shippingAddress').get('first_name');
  }
  get shippingLastName(): AbstractControl {
    return this.addressForm.get('shippingAddress').get('last_name');
  }
  get shippingAddressLine1(): AbstractControl {
    return this.addressForm.get('shippingAddress').get('address_line1');
  }
  get shippingAddressLine2(): AbstractControl {
    return this.addressForm.get('shippingAddress').get('address_line2');
  }
  get shippingCountry(): AbstractControl {
    return this.addressForm.get('shippingAddress').get('country');
  }
  get shippingCity(): AbstractControl {
    return this.addressForm.get('shippingAddress').get('city');
  }
  get shippingState(): AbstractControl {
    return this.addressForm.get('shippingAddress').get('state');
  }
  get shippingEmail(): AbstractControl {
    return this.addressForm.get('shippingAddress').get('email');
  }
  get shippingPhone(): AbstractControl {
    return this.addressForm.get('shippingAddress').get('phone');
  }
  get shippingZip(): AbstractControl {
    return this.addressForm.get('shippingAddress').get('zip');
  }

  get billingForm(): AbstractControl {
    return this.addressForm.get('billingAddress');
  }
  get billingFirstName(): AbstractControl {
    return this.addressForm.get('billingAddress').get('first_name');
  }
  get billingLastName(): AbstractControl {
    return this.addressForm.get('billingAddress').get('last_name');
  }

  get billingAddressLine1(): AbstractControl {
    return this.addressForm.get('billingAddress').get('address_line1');
  }
  get billingAddressLine2(): AbstractControl {
    return this.addressForm.get('billingAddress').get('address_line2');
  }
  get billingCountry(): AbstractControl {
    return this.addressForm.get('billingAddress').get('country');
  }
  get billingCity(): AbstractControl {
    return this.addressForm.get('billingAddress').get('city');
  }
  get billingState(): AbstractControl {
    return this.addressForm.get('billingAddress').get('state');
  }
  get billingEmail(): AbstractControl {
    return this.addressForm.get('billingAddress').get('email');
  }
  get billingPhone(): AbstractControl {
    return this.addressForm.get('billingAddress').get('phone');
  }
  get billingZip(): AbstractControl {
    return this.addressForm.get('billingAddress').get('zip');
  }

  @ViewChild('selAction') selAction: FormControl;

  routeParamSub: any;
  categoryId: string;
  destroy: Subject<boolean> = new Subject();

  itemId: string;
  shippingAddress: Address = {} as Address;
  billingAddress: Address = {} as Address;
  orderTotal: number = 0;

  displayedColumns = ['select', 'name', 'price', 'quantity'];
  bulkActions: BulkAction[] = [
    {
      name: 'Delete',
      value: 'delete',
    },
  ];
  savedStatus = '';

  orderStatuses = [
    {
      name: 'On Hold',
      value: 'on_hold',
    },
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Completed',
      value: 'completed',
    },
  ];
  currentStatus = new FormControl();

  cart: CartItem[];
  cart$ = new BehaviorSubject<CartItem[]>([]);

  selection = new SelectionModel<CartItem>(true, []);

  constructor(
    private fb: FormBuilder,
    private api: OrderService,
    public loading: LoadingService,
    private route: ActivatedRoute,
    private notify: NotificationService,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy)).subscribe((params) => {
      this.savedStatus = params['status'];
    });
    this.route.paramMap.pipe(takeUntil(this.destroy)).subscribe((params) => {
      this.itemId = params.get('id');
      this._getOrder();
    });
  }
  ngAfterViewInit() {
    this.selAction.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((type) => {
        if (!type) return;

        if (type === 'delete') {
          const toDelete = this.selection.selected.map(
            (val) => val.product.originalId
          );
          if (!toDelete.length) {
            this.notify.push({
              type: 'info',
              message: 'Please select at least one item.',
            });
            return;
          }
          this.cart = this.cart.filter(
            (item) => !toDelete.includes(item.product.originalId)
          );
          this.cart$.next(this.cart);
          /* this.api.delete(items).subscribe(() => {
                this.notify.push({});
                this._getOrder();
              }); */
          this.selAction.reset();
        }
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.cart.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.cart.forEach((row) => this.selection.select(row));
  }

  submitAddress(addressData) {
    this.loading.show();

    this.api
      .edit(
        {
          shippingAddress: addressData,
        },
        this.itemId
      )
      .subscribe(
        (result) => {
          this.shippingAddress = addressData;
          this.loading.hide();
        },
        () => this.loading.hide()
      );
  }

  updateCart() {
    this.loading.show();
    const updateRQ: Record<string, number> = {};
    this.cart.forEach((item) => {
      updateRQ[item.product.originalId] = item.quantity;
    });
    this.api
      .edit(
        {
          cartUpdateRQ: updateRQ,
        },
        this.itemId
      )
      .subscribe(
        (result) => {
          this._getOrder('Cart items updated!');
        },
        () => this.loading.hide()
      );
  }

  changeStatus(data: MatSelectChange) {
    const status = data.value;
    const req = {
      status: status,
      orders: [this.itemId],
    };
    this.loading.show();
    this.api.changeStatus(req).subscribe(
      (result) => {
        this._getOrder('Status changed!');
      },
      () => this.loading.hide()
    );
  }

  deleteItemFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  private _getOrder(status = '') {
    this.api.getOne(this.itemId).subscribe((result) => {
      this.cart = result.cart;
      this.cart$.next(this.cart);
      this.orderTotal = result.total;
      this.currentStatus.setValue(result.status);
      this.addressForm.get('shippingAddress').setValue(result.shippingAddress);
      this.addressForm.get('billingAddress').setValue(result.billingAddress);

      this.shippingAddress = this.shippingForm.value;
      this.billingAddress = this.billingForm.value;

      this.loading.hide();
      if (status.length) {
        this.notify.push({ message: status });
      }
    });
  }

  ngOnDestroy() {
    this.destroy.next(null);
  }
}
