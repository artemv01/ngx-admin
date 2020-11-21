import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemType } from '../../pages/product/models/item-type';

@Injectable({
  providedIn: 'root',
})
/* Temprorary solution. 
I think I will integrate a real state managment solution in the future.  */
export class StorageService<T> {
  private _store: BehaviorSubject<T> = new BehaviorSubject<T>(undefined);
  private _objectType: BehaviorSubject<ItemType> = new BehaviorSubject<ItemType>(
    undefined
  );

  public type$: Observable<ItemType> = this._objectType.asObservable();
  public select$: Observable<T> = this._store.asObservable();
  constructor() {}

  public save(val: T, type: ItemType): void {
    this._store.next(val);
    this._objectType.next(type);
  }
}
