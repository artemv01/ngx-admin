import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ItemService } from '../models/item-service';
import { ItemsQuery } from '../models/items-query';
import { ItemsResp } from '../models/items-resp';

export class ItemsDataSource<T> extends MatTableDataSource<T> {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public totalItems: number = 0;

  constructor(
    private itemsService: ItemService<T>,
    private cancel$: Observable<null> = new Observable<null>()
  ) {
    super();
  }

  loadItems(query?: ItemsQuery): void {
    this.loadingSubject.next(true);

    this.itemsService
      .getAll(query)
      .pipe(takeUntil(this.cancel$))
      .subscribe((resp: ItemsResp<T>) => {
        this.data = resp.items;
        this.totalItems = resp.total;
        this.loadingSubject.next(false);
      });
  }
}
