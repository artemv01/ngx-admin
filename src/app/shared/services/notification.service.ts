import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Notification } from '../models/notification';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  emitter$: Subject<Notification[]> = new Subject();
  dismiss: Subject<null> = new Subject();
  notifications: Record<string, Notification> = {};
  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.dismissAll();
      });
  }
  push(data: Notification = {}) {
    if (!data.type) {
      data.type = 'success';
    }
    if (!data.message) {
      data.message = '';
    }
    const key = new Date().getTime();
    this.notifications[key] = { ...data, key: key };
    setInterval(() => this.emitter$.next(Object.values(this.notifications)), 0);

    setInterval(() => {
      delete this.notifications[key];
      this.emitter$.next(Object.values(this.notifications));
    }, 4000);
  }

  close(key: number) {
    delete this.notifications[key];
    this.emitter$.next(Object.values(this.notifications));
  }

  dismissAll() {
    this.notifications = {};
    this.emitter$.next([]);
  }
}
