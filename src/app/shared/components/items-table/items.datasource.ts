import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { ItemService } from '../../models/item-service';
import { ItemsQuery } from './items-query';
import { ItemsResp } from './items-resp';

export class ItemsDataSource<T> extends MatTableDataSource<T> {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public totalItems: number = 0;

  constructor(private itemsService: ItemService<T>) {
    super();
  }

  loadItems(query?: ItemsQuery): void {
    this.loadingSubject.next(true);

    this.itemsService.getAll(query).subscribe((resp: ItemsResp<T>) => {
      this.data = resp.items;
      this.totalItems = resp.total;
      this.loadingSubject.next(false);
    });
  }
}
