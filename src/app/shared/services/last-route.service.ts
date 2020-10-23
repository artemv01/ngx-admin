import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LastRouteService {
  private _url = new BehaviorSubject<string>(null);
  public url$ = this._url.asObservable();

  public set(url: string) {
    this._url.next(url);
  }
}
