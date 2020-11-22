import { SelectionModel } from '@angular/cdk/collections';
import {
  Attribute,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
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
import { ItemsQuery } from '@app/shared/models/items-query';
import { ItemsDataSource } from '@app/shared/datasources/items.datasource';
import { BulkAction } from 'src/app/shared/models/bulk-action';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<Category>;
  @ViewChild('search', { static: true }) searchInput: ElementRef;
  @ViewChild('selAction') selAction: FormControl;

  destroy = new Subject<null>();

  dataSource: ItemsDataSource<Category>;
  itemsQuery: ItemsQuery = {
    search: '',
    sortOrder: 'asc',
    sortType: 'createdAt',
    limit: 10,
    page: 1,
  };
  displayedColumns = ['select', 'view', 'name', 'description', 'createdAt'];

  totalItems: number = 0;

  selection = new SelectionModel<Category>(true, []);

  bulkActions: BulkAction[] = [
    {
      name: 'Delete',
      value: 'delete',
    },
  ];

  _cancelItemQuery = new Subject<null>();
  cancelItemQuery$ = this._cancelItemQuery.asObservable();

  constructor(
    @Attribute('itemsType') itemsType: string,
    private categoryService: CategoryService,
    private notify: NotificationService
  ) {
    this.dataSource = new ItemsDataSource<Category>(
      this.categoryService,
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
          this.categoryService.delete(items).subscribe(() => {
            this.notify.push({});
            this.dataSource.loadItems(this.itemsQuery);
          });
          this.selAction.reset();
        }
      });
  }

  loadItemsPage() {
    // fix for pagination component because it works with pages starting from 0, api starts from 1
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

  ngOnDestroy(): void {
    this._cancelItemQuery.next(null);
    this.destroy.next();
  }
  ngOnInit(): void {}
}
