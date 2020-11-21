import { SelectionModel } from '@angular/cdk/collections';
import {
  Attribute,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ItemsQuery } from '@app/shared/models/items-query';
import { ItemsDataSource } from '@app/shared/datasources/items.datasource';
import { BulkAction } from '@app/shared/models/bulk-action';
import { NotificationService } from '@app/shared/services/notification.service';
import { fromEvent, merge, Subject } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { Review } from '../../models/review';
import { ReviewService } from '../../services/reviews.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<Review>;
  @ViewChild('search', { static: true }) searchInput: ElementRef;
  @ViewChild('selAction') selAction: FormControl;

  destroy = new Subject<null>();

  dataSource: ItemsDataSource<Review>;
  itemsQuery: ItemsQuery = {
    search: '',
    sortOrder: 'asc',
    sortType: 'createdAt',
    limit: 10,
    page: 1,
  };
  displayedColumns = [
    'select',
    'view',
    'author_name',
    'author_email',
    'product',
    'rating',
    'comment_text',
  ];

  totalItems: number = 0;

  selection = new SelectionModel<Review>(true, []);

  bulkActions: BulkAction[] = [
    {
      name: 'Delete',
      value: 'delete',
    },
  ];

  _cancelItemQuery = new Subject<null>();
  cancelItemQuery$ = this._cancelItemQuery.asObservable();

  constructor(
    private dataService: ReviewService,
    private fb: FormBuilder,
    private notify: NotificationService
  ) {
    this.dataSource = new ItemsDataSource<Review>(
      this.dataService,
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
          this.dataService.delete(items).subscribe(() => {
            this.notify.push();
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
