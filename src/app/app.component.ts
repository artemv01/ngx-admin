import { AfterViewInit, Renderer2, RendererFactory2 } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  previousUrl: string;
  renderer: Renderer2;
  constructor(rendererFactory: RendererFactory2, private titleService: Title) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  ngAfterViewInit() {
    this.titleService.setTitle("Ngx Admin");  
    const isDarkTheme =
      JSON.parse(localStorage.getItem('ngx-admin-dark')) || false;
    if (isDarkTheme) {
      this.renderer.addClass(document.body, 'theme-dark');
    } else {
      this.renderer.addClass(document.body, 'theme-light');
    }
  }
}
