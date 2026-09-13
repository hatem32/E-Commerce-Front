import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'orbit_theme';
type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<Theme>(this.readInitialTheme());

  constructor() {
    this.apply(this.theme());
  }

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem(THEME_KEY, theme);
    this.apply(theme);
  }

  private apply(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private readInitialTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}