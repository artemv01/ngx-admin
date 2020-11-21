import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ItemsQuery } from '@app/shared/models/items-query';
import { ItemsResp } from '@app/shared/models/items-resp';
import { HTTP_ERROR_HANDLER } from 'src/app/shared/helpers/handle-error';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';
import { StorageService } from '@app/shared/services/storage.service';
import { LoadingService } from '@app/shared/services/loading.service';
import { ItemType } from '@app/pages/product/models/item-type';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  itemType = ItemType.CATEGORY;
  constructor(
    private http: HttpClient,
    @Inject(HTTP_ERROR_HANDLER) readonly handleError,
    private store: StorageService<Category>,
    private loading: LoadingService
  ) {}

  getOne(id: string): Observable<Category> {
    this.loading.show();

    return this.http.get<Category>(environment.apiUrl + `category/${id}`).pipe(
      finalize(() => this.loading.hide()),
      catchError<Category, Observable<Category>>((err) => this.handleError(err))
    );
  }

  create(data: Category): Observable<Category> {
    this.loading.show();
    return this.http.post<Category>(environment.apiUrl + `category`, data).pipe(
      finalize(() => this.loading.hide()),

      tap((item) => this.store.save(item, this.itemType)),

      catchError<Category, Observable<Category>>((err) => this.handleError(err))
    );
  }

  edit(data: Category, categoryId?: Category['_id']): Observable<void> {
    this.loading.show();

    return this.http
      .patch<void>(environment.apiUrl + `category/${categoryId}`, data)
      .pipe(
        finalize(() => this.loading.hide()),

        catchError<void, Observable<void>>((err) => this.handleError(err))
      );
  }

  getAll(data: Partial<ItemsQuery> = {}): Observable<ItemsResp<Category>> {
    this.loading.show();

    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(data)) {
      params.set(key, val as string);
    }
    return this.http
      .get<ItemsResp<Category>>(environment.apiUrl + `category/?${params}`)
      .pipe(
        finalize(() => this.loading.hide()),

        catchError<ItemsResp<Category>, Observable<ItemsResp<Category>>>(
          (err) => this.handleError(err)
        )
      );
  }

  delete(catIds: string[]) {
    this.loading.show();

    return this.http
      .patch(environment.apiUrl + `category/bulk-delete`, {
        itemIds: catIds,
      })
      .pipe(
        finalize(() => this.loading.hide()),
        catchError((err) => this.handleError(err))
      );
  }
}
