import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ItemsQuery } from '@app/shared/models/items-query';
import { ItemsResp } from '@app/shared/models/items-resp';
import { HTTP_ERROR_HANDLER } from 'src/app/shared/helpers/handle-error';
import { ItemService } from 'src/app/shared/models/item-service';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { Category } from '../../category/models/category';
import { StorageService } from '@app/shared/services/storage.service';
import { ItemType } from '../models/item-type';
import { LoadingService } from '@app/shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService implements ItemService<Product> {
  private itemType = ItemType.PRODUCT;
  constructor(
    private http: HttpClient,
    private store: StorageService<Product>,
    private loading: LoadingService,
    @Inject(HTTP_ERROR_HANDLER) readonly handleError
  ) {}

  getAll(data: ItemsQuery): Observable<ItemsResp<Product>> {
    this.loading.show();
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(data)) {
      params.set(key, val as string);
    }
    return this.http
      .get<ItemsResp<Product>>(environment.apiUrl + `product/?${params}`)
      .pipe(
        finalize(() => this.loading.hide()),

        catchError<ItemsResp<Product>, Observable<any>>((err) =>
          this.handleError(err)
        )
      );
  }
  getOne(id: string): Observable<Product> {
    this.loading.show();

    return this.http.get<Product>(environment.apiUrl + `product/${id}`).pipe(
      finalize(() => this.loading.hide()),

      catchError<Product, Observable<Product>>((err) => this.handleError(err))
    );
  }

  create(data: Product): Observable<Product> {
    this.loading.show();
    let form = new FormData();
    const { categories, category, ...formData } = data;
    for (const [key, value] of Object.entries(formData)) {
      form.append(key, data[key]);
    }
    form.append('categories', JSON.stringify(categories));
    return this.http.post<Product>(environment.apiUrl + `product`, form).pipe(
      finalize(() => this.loading.hide()),
      tap((product) => this.store.save(product, this.itemType)),
      catchError<Product, Observable<Product>>((err) => this.handleError(err))
    );
  }

  edit(data: Product, productId?: Product['_id']): Observable<Product> {
    this.loading.show();
    let form = new FormData();
    const { categories, category, ...formData } = data;
    for (const [key, value] of Object.entries(formData)) {
      form.append(key, data[key]);
    }
    form.append('categories', JSON.stringify(categories));
    return this.http
      .patch<Product>(environment.apiUrl + `product/${productId}`, form)
      .pipe(
        finalize(() => this.loading.hide()),

        tap((product) => this.store.save(product, this.itemType)),
        catchError<Product, Observable<Product>>((err) => this.handleError(err))
      );
  }

  delete(productIds: string[]) {
    this.loading.show();
    return this.http
      .patch(environment.apiUrl + `product/bulk-delete`, {
        productIds: productIds,
      })
      .pipe(
        finalize(() => this.loading.hide()),
        catchError((err) => this.handleError(err))
      );
  }
}
