import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { StorageService } from '@app/shared/services/storage.service';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Category } from '@app/pages/category/models/category';
import { CategoryService } from '@app/pages/category/services/category.service';
import { ItemsResp } from '@app/shared/models/items-resp';

@Injectable({
  providedIn: 'root',
})
export class CategoriesResolver implements Resolve<ItemsResp<Category>> {
  constructor(
    private store: StorageService<Product>,
    private categoryService: CategoryService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ItemsResp<Category>> {
    return this.categoryService.getAll();
  }
}
