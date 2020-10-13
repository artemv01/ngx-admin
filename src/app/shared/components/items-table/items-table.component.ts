import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { Output } from '@angular/core';
import {
  AfterViewInit,
  Attribute,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { fromEvent, merge, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { Product } from 'src/app/pages/product/models/product';
import { ProductsService } from 'src/app/pages/product/services/products.service';
import { BulkAction } from '../../models/bulk-action';
import { BulkEvent } from '../../models/bulk-event';
import { ItemsQuery } from './items-query';
import { ItemsDataSource } from './items.datasource';

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.scss'],
})
export class ItemsTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<Product>;
  @ViewChild('search', { static: true }) searchInput: ElementRef;
  @ViewChild('selAction') selAction: FormControl;

  @Input('bulkActions') bulkActions: BulkAction[] = [];
  @Output('bulkEvent') bulkEvent: EventEmitter<BulkEvent> = new EventEmitter();

  destory = new Subject<null>();

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
    'name',
    'price',
    'salePrice',
    'onSale',
    'rating',
    'createdAt',
  ];

  totalItems: number = 0;

  selection = new SelectionModel<Product>(true, []);

  constructor(
    @Attribute('itemsType') itemsType: string,
    private productService: ProductsService,
    private fb: FormBuilder
  ) {
    switch (itemsType) {
      case 'products':
        this.dataSource = new ItemsDataSource<Product>(this.productService);
    }
    this.dataSource.loadItems(this.itemsQuery);
  }

  ngAfterViewInit() {
    this.sort.sortChange
      .pipe(takeUntil(this.destory))
      .subscribe(({ direction, active }) => {
        this.paginator.pageIndex = this.itemsQuery.page = 0;
        this.itemsQuery.sortOrder = direction;
        this.itemsQuery.sortType = active;
      });

    this.paginator.page
      .pipe(takeUntil(this.destory))
      .subscribe(({ pageSize, pageIndex }) => {
        this.itemsQuery.limit = pageSize;
        this.itemsQuery.page = pageIndex;
      });

    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = this.itemsQuery.page = 0;
          this.itemsQuery.search = this.searchInput.nativeElement.value;
          this.loadItemsPage();
        }),
        takeUntil(this.destory)
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadItemsPage()),
        takeUntil(this.destory)
      )
      .subscribe();

    this.selAction.valueChanges
      .pipe(takeUntil(this.destory))
      .subscribe((val) => {
        if (!val) return;
        const items = this.selection.selected.map((val) => val._id);
        this.bulkEvent.emit({
          action: val,
          items: items,
        });
        this.selAction.reset();
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

  //   callBulkAction({ value }) {
  //     console.log(value);
  //   }

  ngOnDestroy(): void {
    this.destory.next(null);
  }
  ngOnInit(): void {}
}
