import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemsQuery } from '../components/items-table/items-query';
import { ItemsResp } from '../components/items-table/items-resp';

export interface ItemService<T> {
  getAll: (query: ItemsQuery) => Observable<ItemsResp<T> | string>;
}
