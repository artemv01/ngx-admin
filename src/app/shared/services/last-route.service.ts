import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
