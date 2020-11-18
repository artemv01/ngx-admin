import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '@app/shared/services/loading.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
})
export class EditAddressComponent implements OnInit, OnDestroy {
  addressForm = this.fb.group({
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
  });
  type: string;
  destroy: Subject<boolean> = new Subject();
  orderId: Order['_id'];

  get form(): AbstractControl {
    return this.addressForm.get('Address');
  }
  get firstName(): AbstractControl {
    return this.addressForm.get('first_name');
  }
  get lastName(): AbstractControl {
    return this.addressForm.get('last_name');
  }
  get addressLine1(): AbstractControl {
    return this.addressForm.get('address_line1');
  }
  get addressLine2(): AbstractControl {
    return this.addressForm.get('address_line2');
  }
  get country(): AbstractControl {
    return this.addressForm.get('country');
  }
  get city(): AbstractControl {
    return this.addressForm.get('city');
  }
  get state(): AbstractControl {
    return this.addressForm.get('state');
  }
  get email(): AbstractControl {
    return this.addressForm.get('email');
  }
  get phone(): AbstractControl {
    return this.addressForm.get('phone');
  }
  get zip(): AbstractControl {
    return this.addressForm.get('zip');
  }
  constructor(
    private fb: FormBuilder,
    public loading: LoadingService,
    public route: ActivatedRoute,
    private api: OrderService,
    private notify: NotificationService,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('addressType');
    this.orderId = this.route.snapshot.paramMap.get('id');
    this._getAddress();
  }
  ngOnDestroy(): void {
    this.destroy.next(null);
  }
  edit() {
    if (this.addressForm.invalid) {
      return false;
    }
    let req = {};
    if (this.type === 'shipping') {
      req = {
        shippingAddress: this.addressForm.value,
      };
    } else {
      req = {
        billingAddress: this.addressForm.value,
      };
    }
    this.api.edit(req, this.orderId).subscribe((result) => {
      this.notify.push({
        message: `${
          this.type === 'shipping' ? 'Shipping' : 'Billing'
        } address updated!`,
      });
    });
  }
  private _getAddress() {
    this.api.getOne(this.orderId).subscribe((result) => {
      const address =
        this.type === 'shipping' ? 'shippingAddress' : 'billingAddress';
      this.addressForm.setValue(result[address]);
    });
  }
}
