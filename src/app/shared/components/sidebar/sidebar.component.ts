import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { expand } from 'rxjs/operators';
import { NavService } from '../../services/nav.service';
import { NavItem } from './nav-item';
import { routes } from './routes';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
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
export class SidebarComponent implements OnInit {
  expanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(public navService: NavService, public router: Router) {
    this.depth = this.depth ?? 0;
  }

  ngOnInit() {
    this.navService.currentUrl.subscribe((url: string) => {
      /*  if (this.item.path && url) {
        this.expanded = url.indexOf(`/${this.item.path}`) === 0;
        this.ariaExpanded = this.expanded;
      } */
    });
  }

  onItemSelected(item: NavItem) {
    this.router.navigate([item.path]);
    console.log(this.expanded);
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
    console.log(this.expanded);
  }
}
