import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkTheme: boolean;
  public isDarkTheme$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  toggleTheme(): void {
    console.log(this.isDarkTheme);
    if (this.isDarkTheme) {
      this.renderer.removeClass(document.body, 'theme-dark');
      this.renderer.addClass(document.body, 'theme-light');
      this.isDarkTheme = false;
      this.isDarkTheme$.next(false);
    } else {
      this.renderer.addClass(document.body, 'theme-dark');
      this.renderer.removeClass(document.body, 'theme-light');
      this.isDarkTheme = true;
      this.isDarkTheme$.next(true);
    }
  }
}
