import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ItemsQuery } from '@app/shared/models/items-query';
import { ItemsResp } from '@app/shared/models/items-resp';
import { HTTP_ERROR_HANDLER } from '@app/shared/helpers/handle-error';
import { ItemService } from '@app/shared/models/item-service';
import { environment } from '@root/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChangeStatusRQ } from '../models/change-status-rq';
import { Order } from '../models/order';
import { OrderStatus } from '../models/order-status';

@Injectable({
  providedIn: 'root',
})
export class OrderService implements ItemService<Order> {
  constructor(
    private http: HttpClient,
    @Inject(HTTP_ERROR_HANDLER) readonly handleError
  ) {}

  getAll(data: ItemsQuery): Observable<ItemsResp<Order>> {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(data)) {
      params.set(key, val as string);
    }
    return this.http
      .get<ItemsResp<Order>>(environment.apiUrl + `order/?${params}`)
      .pipe(
        catchError<ItemsResp<Order>, Observable<any>>((err) =>
          this.handleError(err)
        )
      );
  }
  getOne(id: string): Observable<Order> {
    return this.http.get<Order>(environment.apiUrl + `order/${id}`).pipe(
      catchError<Order, Observable<Order>>((err) => this.handleError(err))
    );
  }

  create(data: Order): Observable<Order['_id']> {
    return this.http
      .post<Order['_id']>(environment.apiUrl + `order`, data)
      .pipe(
        catchError<Order['_id'], Observable<Order['_id']>>((err) =>
          this.handleError(err)
        )
      );
  }

  edit(data: Partial<Order>, orderId?: Order['_id']): Observable<void> {
    return this.http
      .patch<void>(environment.apiUrl + `order/${orderId}`, data)
      .pipe(
        catchError<void, Observable<void>>((err) => this.handleError(err))
      );
  }

  changeStatus(data: ChangeStatusRQ): Observable<void> {
    return this.http
      .patch<void>(environment.apiUrl + `order/change-order-status`, data)
      .pipe(
        catchError<void, Observable<void>>((err) => this.handleError(err))
      );
  }

  delete(orderIds: string[]) {
    return this.http
      .patch(environment.apiUrl + `order/bulk-delete`, {
        itemIds: orderIds,
      })
      .pipe(catchError((err) => this.handleError(err)));
  }
}
