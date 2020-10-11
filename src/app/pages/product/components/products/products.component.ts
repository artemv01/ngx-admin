import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BulkAction } from 'src/app/shared/models/bulk-action';
import { FilterQuery } from 'src/app/shared/models/filter-query';
import { PaginationQuery } from 'src/app/shared/models/pagination-query';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  environment = environment;
  bulkActions: BulkAction[] = [
    {
      name: 'Delete',
      value: 'delete',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
