import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemsQuery } from 'src/app/shared/components/items-table/items-query';
import { ItemsResp } from 'src/app/shared/components/items-table/items-resp';
import { HTTP_ERROR_HANDLER } from 'src/app/shared/helpers/handle-error';
import { ItemService } from 'src/app/shared/models/item-service';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService implements ItemService<Product> {
  constructor(
    private http: HttpClient,
    @Inject(HTTP_ERROR_HANDLER) readonly handleError
  ) {}

  getAll(data: ItemsQuery): Observable<ItemsResp<Product>> {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(data)) {
      params.set(key, val as string);
    }
    return this.http
      .get<ItemsResp<Product>>(environment.apiUrl + `product/?${params}`)
      .pipe(
        catchError<ItemsResp<Product>, Observable<any>>((err) =>
          this.handleError(err)
        )
      );
  }
  delete(productIds: string[]) {
    return this.http
      .patch(environment.apiUrl + `product/bulk-delete`, {
        productIds: productIds,
      })
      .pipe(catchError((err) => this.handleError(err)));
  }
}
