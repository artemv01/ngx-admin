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
  @ViewChild('selAction') selAction: FormControl;

  routeParamSub: any;
  categoryId: string;
  destroy: Subject<boolean> = new Subject();

  itemId: string;
  shippingAddress: Address = {} as Address;
  billingAddress: Address = {} as Address;
  orderTotal: number = 0;

  displayedColumns = ['select', 'view', 'name', 'price', 'quantity'];
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
    this.itemId = this.route.snapshot.paramMap.get('id');
    this.api.getOne(this.itemId).subscribe((result) => {
      this.cart = result.cart;
      this.cart$.next(this.cart);
      this.orderTotal = result.total;
      this.currentStatus.setValue(result.status);
      this.shippingAddress = result.shippingAddress;
      this.billingAddress = result.billingAddress;
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

          this.selAction.reset();
        }
      });
  }

  updateCart() {
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
      .subscribe((updates) => {
        this.cart = updates.cart;
        this.cart$.next(this.cart);
        this.orderTotal = updates.total;
      });
  }

  changeStatus(data: MatSelectChange) {
    const status = data.value;
    const req = {
      status: status,
      orders: [this.itemId],
    };
    this.api.changeStatus(req).subscribe((updates) => {
      this.currentStatus.setValue(updates);
      this.notify.push({
        type: 'success',
        message: 'Order status changed!',
      });
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

  deleteItemFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  ngOnDestroy() {
    this.destroy.next(null);
  }
}
