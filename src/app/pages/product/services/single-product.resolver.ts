import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { StorageService } from '@app/shared/services/storage.service';
import { Observable, of } from 'rxjs';
import {
  tap,
  map,
  filter,
  first,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import { Product } from '../models/product';
import { ItemType } from '../models/item-type';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class SingleProductResolver implements Resolve<Product> {
  constructor(
    private store: StorageService<Product>,
    private productService: ProductsService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product> {
    return this.store.select$.pipe(
      first(),
      withLatestFrom(this.store.type$),
      mergeMap(
        ([product, type]): Observable<Product> => {
          const id = route.paramMap.get('id');
          if (id === product?._id && type == ItemType.PRODUCT) {
            return of(product);
          }

          return this.productService.getOne(id);
        }
      )
    );
  }
}
