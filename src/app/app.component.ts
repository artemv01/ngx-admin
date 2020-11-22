import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { LastRouteService } from './shared/services/last-route.service';
import { LoadingService } from './shared/services/loading.service';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  previousUrl: string;
  constructor(
    private router: Router,
    private lastRoute: LastRouteService,
    public loading: LoadingService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (this.previousUrl) {
          lastRoute.set(this.previousUrl);
        }
        this.previousUrl = event.url;
      });
  }
}
