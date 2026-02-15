import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { moveItemInArray } from '@angular/cdk/drag-drop';

export interface Tab {
  id: string;
  route: string;
  label: string;
  icon: string;
  pinned: boolean;
}

export interface TabRouteInfo {
  label: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class TabService {
  private router = inject(Router);
  private registry = new Map<string, TabRouteInfo>();

  /** Whether the tab system is active */
  readonly enabled = signal(false);

  /** All currently open tabs */
  readonly tabs = signal<Tab[]>([]);

  /** Route of the currently active tab */
  readonly activeRoute = signal('');

  /** Active tab object */
  readonly activeTab = computed(() =>
    this.tabs().find(t => t.route === this.activeRoute())
  );

  /** Pinned tabs (always at the start) */
  readonly pinnedTabs = computed(() => this.tabs().filter(t => t.pinned));

  /** Unpinned tabs */
  readonly unpinnedTabs = computed(() => this.tabs().filter(t => !t.pinned));

  /** Max tabs before showing scroll */
  readonly maxVisibleTabs = signal(12);

  constructor() {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => (e as NavigationEnd).urlAfterRedirects ?? (e as NavigationEnd).url),
      )
      .subscribe(url => {
        if (!this.enabled()) return;
        this.activateOrOpen(url);
      });
  }

  /**
   * Register route → label/icon mappings so the tab service
   * can auto-create tabs with correct metadata on navigation.
   */
  registerRoutes(items: { route?: string; label: string; icon: string }[]) {
    for (const item of items) {
      if (item.route) {
        this.registry.set(item.route, { label: item.label, icon: item.icon });
      }
    }
  }

  /** Clear all registered routes (used when workspaces change) */
  clearRegistry() {
    this.registry.clear();
  }

  /**
   * Activate an existing tab or open a new one for the given route.
   * Called automatically on NavigationEnd when enabled.
   */
  activateOrOpen(route: string) {
    this.activeRoute.set(route);

    const existing = this.tabs().find(t => t.route === route);
    if (existing) return;

    // Look up metadata from registry
    const info = this.registry.get(route);
    if (!info) return; // Unknown route — don't create a tab

    this.tabs.update(tabs => [
      ...tabs,
      { id: route, route, label: info.label, icon: info.icon, pinned: false },
    ]);
  }

  /** Navigate to a tab */
  activate(route: string) {
    this.router.navigateByUrl(route);
  }

  /** Close a tab. Navigates to an adjacent tab if closing the active one. */
  close(route: string) {
    const currentTabs = this.tabs();
    const tab = currentTabs.find(t => t.route === route);
    if (!tab || tab.pinned) return;

    const idx = currentTabs.indexOf(tab);
    const newTabs = currentTabs.filter(t => t.route !== route);
    this.tabs.set(newTabs);

    // If closing the active tab, navigate to the best neighbor
    if (this.activeRoute() === route && newTabs.length > 0) {
      const nextIdx = Math.min(idx, newTabs.length - 1);
      this.router.navigateByUrl(newTabs[nextIdx].route);
    }
  }

  /** Close all non-pinned tabs except the given one */
  closeOthers(route: string) {
    this.tabs.update(tabs => tabs.filter(t => t.route === route || t.pinned));
    if (!this.tabs().find(t => t.route === this.activeRoute())) {
      const first = this.tabs()[0];
      if (first) this.router.navigateByUrl(first.route);
    }
  }

  /** Close all non-pinned tabs to the right of the given one */
  closeToRight(route: string) {
    const idx = this.tabs().findIndex(t => t.route === route);
    if (idx === -1) return;
    this.tabs.update(tabs =>
      tabs.filter((t, i) => i <= idx || t.pinned)
    );
    if (!this.tabs().find(t => t.route === this.activeRoute())) {
      this.router.navigateByUrl(route);
    }
  }

  /** Toggle pin state of a tab */
  togglePin(route: string) {
    this.tabs.update(tabs =>
      tabs.map(t => t.route === route ? { ...t, pinned: !t.pinned } : t)
    );
    // Move pinned tabs to the left
    this.tabs.update(tabs => {
      const pinned = tabs.filter(t => t.pinned);
      const unpinned = tabs.filter(t => !t.pinned);
      return [...pinned, ...unpinned];
    });
  }

  /** Reorder a pinned tab within the pinned zone */
  reorderPinned(previousIndex: number, currentIndex: number) {
    this.tabs.update(tabs => {
      const pinned = tabs.filter(t => t.pinned);
      const unpinned = tabs.filter(t => !t.pinned);
      moveItemInArray(pinned, previousIndex, currentIndex);
      return [...pinned, ...unpinned];
    });
  }

  /** Reorder an unpinned tab within the unpinned zone */
  reorderUnpinned(previousIndex: number, currentIndex: number) {
    this.tabs.update(tabs => {
      const pinned = tabs.filter(t => t.pinned);
      const unpinned = tabs.filter(t => !t.pinned);
      moveItemInArray(unpinned, previousIndex, currentIndex);
      return [...pinned, ...unpinned];
    });
  }

  /** Close all non-pinned tabs */
  closeAll() {
    this.tabs.update(tabs => tabs.filter(t => t.pinned));
    const remaining = this.tabs();
    if (remaining.length > 0) {
      this.router.navigateByUrl(remaining[0].route);
    }
  }
}
