import { Component, OnInit } from '@angular/core';
import { routes } from './routes';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  navItems = routes;
  constructor() {}

  ngOnInit(): void {}
}
