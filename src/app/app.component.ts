import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormControl, NgModel, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { LastRouteService } from './shared/services/last-route.service';

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
  constructor(private router: Router, private lastRoute: LastRouteService) {
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
