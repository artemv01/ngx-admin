import { SelectionModel } from '@angular/cdk/collections';
import {
  Attribute,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ItemsQuery } from '@app/shared/models/items-query';
import { ItemsDataSource } from '@app/shared/datasources/items.datasource';
import { NotificationService } from '@app/shared/services/notification.service';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { BulkAction } from 'src/app/shared/models/bulk-action';
import { FilterQuery } from 'src/app/shared/models/filter-query';
import { PaginationQuery } from 'src/app/shared/models/pagination-query';
import { environment } from 'src/environments/environment';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnDestroy {
  environment = environment;
  bulkActions: BulkAction[] = [
    {
      name: 'Delete',
      value: 'delete',
    },
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('itemsTable', { static: true }) table: MatTable<Product>;
  @ViewChild('search', { static: true }) searchInput: ElementRef;
  @ViewChild('selAction') selAction: FormControl;

  destroy = new Subject<null>();

  dataSource: ItemsDataSource<Product>;
  itemsQuery: ItemsQuery = {
    search: '',
    sortOrder: 'asc',
    sortType: 'createdAt',
    limit: 10,
    page: 1,
  };
  displayedColumns = [
    'select',
    // 'image',
    'view',
    'name',
    'price',
    'salePrice',
    'onSale',
    'rating',
    'createdAt',
  ];

  selection = new SelectionModel<Product>(true, []);

  _cancelItemQuery = new Subject<null>();
  cancelItemQuery$ = this._cancelItemQuery.asObservable();

  constructor(
    private productService: ProductsService,
    private fb: FormBuilder,
    private notify: NotificationService
  ) {
    this.dataSource = new ItemsDataSource<Product>(
      this.productService,
      this.cancelItemQuery$
    );
    this.dataSource.loadItems(this.itemsQuery);
  }

  ngAfterViewInit() {
    this.sort.sortChange
      .pipe(takeUntil(this.destroy))
      .subscribe(({ direction, active }) => {
        this.paginator.pageIndex = this.itemsQuery.page = 0;
        this.itemsQuery.sortOrder = direction;
        this.itemsQuery.sortType = active;
      });

    this.paginator.page
      .pipe(takeUntil(this.destroy))
      .subscribe(({ pageSize, pageIndex }) => {
        this.itemsQuery.limit = pageSize;
        this.itemsQuery.page = pageIndex;
      });

    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this._cancelItemQuery.next(null);
          this.paginator.pageIndex = this.itemsQuery.page = 0;
          this.itemsQuery.search = this.searchInput.nativeElement.value;
          this.loadItemsPage();
        }),
        takeUntil(this.destroy)
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadItemsPage()),
        takeUntil(this.destroy)
      )
      .subscribe();

    this.selAction.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((action) => {
        if (!action) return;
        const items = this.selection.selected.map((val) => val._id);
        if (!items.length) {
          this.notify.push({
            type: 'info',
            message: 'Please select at least one item.',
          });
          return;
        }
        if ('delete' === action) {
          this.productService.delete(items).subscribe(() => {
            this.notify.push({});
            this.dataSource.loadItems(this.itemsQuery);
          });
          this.selAction.reset();
        }
      });
  }

  loadItemsPage() {
    this.itemsQuery.page += 1;
    this.dataSource.loadItems(this.itemsQuery);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  ngOnDestroy() {
    this._cancelItemQuery.next(null);
    this.destroy.next();
  }
}
