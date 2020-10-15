import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavService } from '../../services/nav.service';
import { NavItem } from './nav-item';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]),
  ],
})
export class NavItemComponent implements OnInit, OnDestroy {
  expanded: boolean = false;
  destroy = new Subject();
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(public navService: NavService, public router: Router) {
    this.depth = this.depth ?? 0;
  }

  ngOnInit() {
    this.navService.currentUrl
      .pipe(takeUntil(this.destroy))
      .subscribe((url: string) => {
        if (this.item.path && url) {
          this.expanded = url.indexOf(`${this.item.path}`) === 0;
        }
        // if (this.item.path && url) {
        //   this.expanded = url.indexOf(`${this.item.path}`) === 0;
        //   if (this.expanded) {
        //   }
        //   this.ariaExpanded = this.expanded;
      });
  }

  onItemSelected(item: NavItem) {
    this.router.navigate([item.path]);
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }
  ngOnDestroy() {
    this.destroy.next(null);
  }
}
