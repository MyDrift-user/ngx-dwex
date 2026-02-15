import { Injectable, signal, computed, Type, inject } from '@angular/core';
import { Router } from '@angular/router';

export type SplitOrientation = 'vertical' | 'horizontal';

@Injectable({ providedIn: 'root' })
export class SplitViewService {
  private router = inject(Router);

  private readonly _isActive = signal(false);
  private readonly _orientation = signal<SplitOrientation>('vertical');
  private readonly _secondaryComponent = signal<Type<any> | null>(null);
  private readonly _splitRatio = signal(50);
  private readonly _secondaryTitle = signal('');

  /** Whether split view is currently active */
  readonly isActive = this._isActive.asReadonly();
  /** Current split orientation: 'vertical' (side-by-side) or 'horizontal' (stacked) */
  readonly orientation = this._orientation.asReadonly();
  /** The component rendered in the secondary pane */
  readonly secondaryComponent = this._secondaryComponent.asReadonly();
  /** Split ratio (0–100) for the primary pane width/height */
  readonly splitRatio = this._splitRatio.asReadonly();
  /** Title displayed in the secondary pane header */
  readonly secondaryTitle = this._secondaryTitle.asReadonly();

  /**
   * Open a component in the secondary split pane.
   */
  open(component: Type<any>, options?: { orientation?: SplitOrientation; title?: string }) {
    this._secondaryComponent.set(component);
    if (options?.orientation) this._orientation.set(options.orientation);
    if (options?.title) this._secondaryTitle.set(options.title);
    this._isActive.set(true);
  }

  /**
   * Open a route's component in the secondary split pane.
   * Resolves the component from the router config by path.
   */
  openRoute(path: string, options?: { orientation?: SplitOrientation }) {
    const component = this.resolveComponent(path);
    if (component) {
      const title = this.resolveTitle(path) ?? path;
      this.open(component, { ...options, title });
    }
  }

  /** Close the split view and return to single-pane mode */
  close() {
    this._isActive.set(false);
    this._secondaryComponent.set(null);
    this._secondaryTitle.set('');
  }

  /** Set the split orientation */
  setOrientation(orientation: SplitOrientation) {
    this._orientation.set(orientation);
  }

  /** Toggle between vertical and horizontal orientation */
  toggleOrientation() {
    this._orientation.update(o => (o === 'vertical' ? 'horizontal' : 'vertical'));
  }

  /** Set the split ratio (clamped between 20–80) */
  setSplitRatio(ratio: number) {
    this._splitRatio.set(Math.max(20, Math.min(80, ratio)));
  }

  /** Reset split ratio to 50/50 */
  resetRatio() {
    this._splitRatio.set(50);
  }

  private resolveComponent(path: string): Type<any> | null {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return this.findComponent(this.router.config, cleanPath);
  }

  private resolveTitle(path: string): string | null {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return this.findTitle(this.router.config, cleanPath);
  }

  private findComponent(routes: any[], path: string): Type<any> | null {
    for (const route of routes) {
      if (route.path === path && route.component) return route.component;
      if (route.children) {
        const found = this.findComponent(route.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  private findTitle(routes: any[], path: string): string | null {
    for (const route of routes) {
      if (route.path === path && route.title) return route.title;
      if (route.children) {
        const found = this.findTitle(route.children, path);
        if (found) return found;
      }
    }
    return null;
  }
}
