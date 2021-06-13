import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import { AuthService } from '@app/pages/auth/services/auth.service';
import { ThemeService } from '@app/shared/services/theme.service';
import { routes } from '../nav-item/routes';

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss'],
})
export class LayoutComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  sidebarOpen = true;
  routes = routes;
  routeLoading = false;
  private _mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {

  }

  ngOnInit () {

    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');

    this._mobileQueryListener = () => {
      this.changeDetectorRef.detectChanges();
    };
    if (this.media.matchMedia('(max-width: 1199px)').matches) {
      this.sidebarOpen = false;
    }
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.router.events.subscribe(event => {
        if (event instanceof RouteConfigLoadStart) {
            this.routeLoading = true;
        } else if (event instanceof RouteConfigLoadEnd) {
            this.routeLoading = false;
        }
    });
}

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onToggleTheme() {
    this.themeService.toggleTheme();
  }
}
