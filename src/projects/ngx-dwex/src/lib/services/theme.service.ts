import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeColor = 'violet' | 'blue' | 'green' | 'red' | 'orange';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'dwex-theme';

  mode = signal<ThemeMode>(this.loadMode());
  color = signal<ThemeColor>(this.loadColor());

  constructor() {
    effect(() => {
      this.applyTheme();
      this.saveTheme();
    });

    this.setupSystemThemeListener();
  }

  private loadMode(): ThemeMode {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem(`${this.STORAGE_KEY}-mode`);
    return (stored as ThemeMode) || 'system';
  }

  private loadColor(): ThemeColor {
    if (typeof window === 'undefined') return 'violet';
    const stored = localStorage.getItem(`${this.STORAGE_KEY}-color`);
    return (stored as ThemeColor) || 'violet';
  }

  private saveTheme() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${this.STORAGE_KEY}-mode`, this.mode());
    localStorage.setItem(`${this.STORAGE_KEY}-color`, this.color());
  }

  private applyTheme() {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const isDark = this.getEffectiveTheme() === 'dark';

    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(isDark ? 'dark-theme' : 'light-theme');
    root.style.colorScheme = isDark ? 'dark' : 'light';

    root.classList.remove('violet-theme', 'blue-theme', 'green-theme', 'red-theme', 'orange-theme');
    root.classList.add(`${this.color()}-theme`);
  }

  private getEffectiveTheme(): 'light' | 'dark' {
    const mode = this.mode();
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return mode;
  }

  private setupSystemThemeListener() {
    if (typeof window === 'undefined') return;

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.mode() === 'system') {
        this.applyTheme();
      }
    });
  }

  setMode(mode: ThemeMode) {
    this.mode.set(mode);
  }

  setColor(color: ThemeColor) {
    this.color.set(color);
  }

  toggleMode() {
    const current = this.mode();
    if (current === 'light') this.setMode('dark');
    else if (current === 'dark') this.setMode('system');
    else this.setMode('light');
  }
}
