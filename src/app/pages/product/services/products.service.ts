import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemsQuery } from '@app/shared/models/items-query';
import { ItemsResp } from '@app/shared/models/items-resp';
import { HTTP_ERROR_HANDLER } from 'src/app/shared/helpers/handle-error';
import { ItemService } from 'src/app/shared/models/item-service';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { Category } from '../../category/models/category';

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
  getOne(id: string): Observable<Product> {
    return this.http.get<Product>(environment.apiUrl + `product/${id}`).pipe(
      catchError<Product, Observable<Product>>((err) => this.handleError(err))
    );
  }

  create(data: Product): Observable<Product['_id']> {
    let form = new FormData();
    const { categories, category, ...formData } = data;
    for (const [key, value] of Object.entries(formData)) {
      form.append(key, data[key]);
    }
    form.append('categories', JSON.stringify(categories));
    return this.http
      .post<Product['_id']>(environment.apiUrl + `product`, form)
      .pipe(
        catchError<Product['_id'], Observable<Product['_id']>>((err) =>
          this.handleError(err)
        )
      );
  }

  edit(data: Product, productId?: Product['_id']): Observable<void> {
    let form = new FormData();
    const { categories, category, ...formData } = data;
    for (const [key, value] of Object.entries(formData)) {
      form.append(key, data[key]);
    }
    form.append('categories', JSON.stringify(categories));
    return this.http
      .patch<void>(environment.apiUrl + `product/${productId}`, form)
      .pipe(
        catchError<void, Observable<void>>((err) => this.handleError(err))
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
