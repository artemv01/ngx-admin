import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _display = new BehaviorSubject(false);
  public display$ = this._display.asObservable();
  private displayIncrement = 0;
  constructor() {}

  show() {
    if (this.displayIncrement < 1) {
      setTimeout(() => this._display.next(true), 0);
    }
    this.displayIncrement++;
    console.log('showing');
  }

  hide() {
    this.displayIncrement =
      this.displayIncrement > 1 ? this.displayIncrement - 1 : 0;
    console.log('hiding');
    if (this.displayIncrement === 0) {
      setTimeout(() => this._display.next(false), 0);
    }
  }
  forceHide() {
    this.displayIncrement = 0;
    setTimeout(() => this._display.next(false), 0);
  }
}
