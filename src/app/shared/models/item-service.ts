import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemsQuery } from './items-query';
import { ItemsResp } from './items-resp';

export interface ItemService<T> {
  getAll: (query: ItemsQuery) => Observable<ItemsResp<T> | string>;
}
