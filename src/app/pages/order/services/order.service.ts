import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ItemsQuery } from '@app/shared/models/items-query';
import { ItemsResp } from '@app/shared/models/items-resp';
import { HTTP_ERROR_HANDLER } from '@app/shared/helpers/handle-error';
import { ItemService } from '@app/shared/models/item-service';
import { environment } from '@root/environments/environment';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ChangeStatusRQ } from '../models/change-status-rq';
import { Order } from '../models/order';
import { OrderStatus } from '../models/order-status';
import { LoadingService } from '@app/shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService implements ItemService<Order> {
  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    @Inject(HTTP_ERROR_HANDLER) readonly handleError
  ) {}

  getAll(data: ItemsQuery): Observable<ItemsResp<Order>> {
    this.loading.show();
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(data)) {
      params.set(key, val as string);
    }
    return this.http
      .get<ItemsResp<Order>>(environment.apiUrl + `order/?${params}`)
      .pipe(
        tap(() => this.loading.hide()),
        catchError<ItemsResp<Order>, Observable<any>>((err) =>
          this.handleError(err)
        )
      );
  }
  getOne(id: string): Observable<Order> {
    this.loading.show();

    return this.http.get<Order>(environment.apiUrl + `order/${id}`).pipe(
      tap(() => this.loading.hide()),

      catchError<Order, Observable<Order>>((err) => this.handleError(err))
    );
  }

  create(data: Order): Observable<Order['_id']> {
    this.loading.show();

    return this.http
      .post<Order['_id']>(environment.apiUrl + `order`, data)
      .pipe(
        tap(() => this.loading.hide()),

        catchError<Order['_id'], Observable<Order['_id']>>((err) =>
          this.handleError(err)
        )
      );
  }

  edit(data: Partial<Order>, orderId?: Order['_id']): Observable<Order> {
    this.loading.show();

    return this.http
      .patch<Order>(environment.apiUrl + `order/${orderId}`, data)
      .pipe(
        tap(() => this.loading.hide()),

        catchError<Order, Observable<Order>>((err) => this.handleError(err))
      );
  }

  changeStatus(data: ChangeStatusRQ): Observable<string> {
    this.loading.show();

    return this.http
      .patch<string>(environment.apiUrl + `order/change-order-status`, data)
      .pipe(
        tap(() => this.loading.hide()),

        catchError<string, Observable<string>>((err) => this.handleError(err))
      );
  }

  delete(orderIds: string[]) {
    this.loading.show();

    return this.http
      .patch(environment.apiUrl + `order/bulk-delete`, {
        itemIds: orderIds,
      })
      .pipe(
        tap(() => this.loading.hide()),
        catchError((err) => this.handleError(err))
      );
  }
}
