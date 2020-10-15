import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemsQuery } from 'src/app/shared/components/items-table/items-query';
import { ItemsResp } from 'src/app/shared/components/items-table/items-resp';
import { HTTP_ERROR_HANDLER } from 'src/app/shared/helpers/handle-error';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private http: HttpClient,
    @Inject(HTTP_ERROR_HANDLER) readonly handleError
  ) {}

  getOne(id: string): Observable<Category> {
    return this.http.get<Category>(environment.apiUrl + `category/${id}`).pipe(
      catchError<Category, Observable<Category>>((err) => this.handleError(err))
    );
  }

  create(data: Category): Observable<Category['_id']> {
    return this.http
      .post<Category['_id']>(environment.apiUrl + `category`, data)
      .pipe(
        catchError<Category['_id'], Observable<Category['_id']>>((err) =>
          this.handleError(err)
        )
      );
  }

  edit(data: Category, categoryId?: Category['_id']): Observable<void> {
    return this.http
      .patch<void>(environment.apiUrl + `category/${categoryId}`, data)
      .pipe(
        catchError<void, Observable<void>>((err) => this.handleError(err))
      );
  }

  getAll(data: Partial<ItemsQuery> = {}): Observable<ItemsResp<Category>> {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(data)) {
      params.set(key, val as string);
    }
    return this.http
      .get<ItemsResp<Category>>(environment.apiUrl + `category/?${params}`)
      .pipe(
        catchError<ItemsResp<Category>, Observable<ItemsResp<Category>>>(
          (err) => this.handleError(err)
        )
      );
  }

  delete(catIds: string[]) {
    return this.http
      .patch(environment.apiUrl + `category/bulk-delete`, {
        itemIds: catIds,
      })
      .pipe(catchError((err) => this.handleError(err)));
  }
}
