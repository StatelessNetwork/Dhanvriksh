import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public renderer: Renderer2;
  public currentTheme: string;

  constructor(private rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    console.log(localStorage.getItem('theme'));
    this.setGlobalCSS(localStorage.getItem('theme') ?? '');
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  setTheme(theme: any) {
    const cssText = CSSTextGenerator(theme);
    this.setGlobalCSS(cssText);
    localStorage.setItem('theme', cssText);
  }

  // Define a single CSS variable
  setVariable(name: any, value: any) {
    this.document.documentElement.style.setProperty(name, value);
  }

  private setGlobalCSS(css: string) {
    this.document.documentElement.style.cssText = css;
  }

  activeTheme(item: any) {
    this.renderer.removeClass(this.document.body, this.currentTheme);
    this.currentTheme = item;
    this.renderer.addClass(this.document.body, item);
  }
}

const defaults = {
  primary: '#f47878',
};

function CSSTextGenerator(colors: any) {
  colors = { ...defaults, ...colors };

  const {
    primary,
    secondary,
  } = colors;

  return `
  --ion-color-primary: ${primary};
  --ion-color-secondary: ${secondary};
  --ion-toolbar-background-color: ${primary};
  `;
}

