import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notification';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  emitter$: Subject<Notification[]> = new Subject();
  dismiss: Subject<null> = new Subject();
  notifications: Record<string, Notification> = {};
  constructor() {}
  push(data: Notification = {}) {
    if (!data.type) {
      data.type = 'success';
    }
    if (!data.message) {
      data.message = '';
    }
    const key = new Date().getTime();
    this.notifications[key] = { ...data, key: key };
    this.emitter$.next(Object.values(this.notifications));
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
