import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { AuthService } from '@app/pages/auth/services/auth.service';
import { routes } from '../nav-item/routes';

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss'],
})
export class LayoutComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  sidebarOpen = true;
  routes = routes;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public authService: AuthService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');

    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
    };
    if (media.matchMedia('(max-width: 1199px)').matches) {
      this.sidebarOpen = false;
    }
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
