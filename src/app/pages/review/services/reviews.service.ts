import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ItemsQuery } from '@app/shared/models/items-query';
import { ItemsResp } from '@app/shared/models/items-resp';
import { HTTP_ERROR_HANDLER } from '@app/shared/helpers/handle-error';
import { ItemService } from '@app/shared/models/item-service';
import { environment } from '@root/environments/environment';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { LoadingService } from '@app/shared/services/loading.service';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService implements ItemService<Review> {
  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    @Inject(HTTP_ERROR_HANDLER) readonly handleError
  ) {}

  getAll(data: ItemsQuery): Observable<ItemsResp<Review>> {
    this.loading.show();
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(data)) {
      params.set(key, val as string);
    }
    return this.http
      .get<ItemsResp<Review>>(environment.apiUrl + `review/?${params}`)
      .pipe(
        finalize(() => this.loading.hide()),
        catchError<ItemsResp<Review>, Observable<any>>((err) =>
          this.handleError(err)
        )
      );
  }
  getOne(id: string): Observable<Review> {
    this.loading.show();

    return this.http.get<Review>(environment.apiUrl + `review/${id}`).pipe(
      finalize(() => this.loading.hide()),

      catchError<Review, Observable<Review>>((err) => this.handleError(err))
    );
  }

  edit(data: Partial<Review>, itemId?: Review['_id']): Observable<Review> {
    this.loading.show();

    return this.http
      .patch<Review>(environment.apiUrl + `review/${itemId}`, data)
      .pipe(
        finalize(() => this.loading.hide()),

        catchError<Review, Observable<Review>>((err) => this.handleError(err))
      );
  }

  delete(itemIds: string[]) {
    this.loading.show();

    return this.http
      .patch(environment.apiUrl + `review/bulk-delete`, {
        itemIds: itemIds,
      })
      .pipe(
        finalize(() => this.loading.hide()),
        catchError((err) => this.handleError(err))
      );
  }
}
