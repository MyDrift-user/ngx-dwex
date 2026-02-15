import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, signal, computed, inject, effect, output, ElementRef, NgZone } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ThemeService } from '../services/theme.service';
import { TabService } from '../services/tab.service';
import { SplitViewService } from '../services/split-view.service';
import { TabBar } from '../components/tab-bar/tab-bar';

export type ShowOn = 'both' | 'mobile' | 'desktop';

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  section?: boolean;
  divider?: boolean;
  showOn?: ShowOn;
}

export interface ShellWorkspace {
  id: string;
  label: string;
  icon: string;
  navItems: NavItem[];
  showOn?: ShowOn;
}

@Component({
  selector: 'dwex-shell',
  imports: [RouterOutlet, RouterLink, NgComponentOutlet, MatIcon, MatIconButton, MatButton, MatCard, MatDivider, MatMenu, MatMenuTrigger, MatMenuItem, MatTooltip, TabBar],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ height: 0, overflow: 'hidden', opacity: 0 }),
        animate('350ms cubic-bezier(0.05, 0.7, 0.1, 1)', style({ height: '80px', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '80px', overflow: 'hidden' }),
        animate('250ms cubic-bezier(0.3, 0, 1, 1)', style({ height: 0, opacity: 0 })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0.5 }),
        animate('350ms cubic-bezier(0.05, 0.7, 0.1, 1)', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.3, 0, 1, 1)', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms cubic-bezier(0.05, 0.7, 0.1, 1)', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.3, 0, 1, 1)', style({ opacity: 0 })),
      ]),
    ]),
    trigger('routeTransition', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(6px)' }),
        animate('350ms cubic-bezier(0.05, 0.7, 0.1, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class Shell {
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  private ngZone = inject(NgZone);
  private elRef = inject(ElementRef);
  readonly themeService = inject(ThemeService);
  readonly tabService = inject(TabService);
  readonly splitViewService = inject(SplitViewService);

  workspaces = input<ShellWorkspace[]>([]);
  settingsNavItems = input<NavItem[]>([]);
  settingsRoute = input('/settings');
  enableTabs = input(false);

  // Profile mode
  profileMode = input(false);
  userName = input('');
  userEmail = input('');
  userAvatar = input('');
  profileRoute = input('/profile');
  signOut = output<void>();

  activeWorkspaceId = signal('');
  sidenavState = signal<'expanded' | 'compact' | 'collapsed'>('expanded');
  mobileNavOpen = signal(false);
  private previousRoute = signal('/');

  // Nav context menu for split view
  protected navContextItem = signal<NavItem | null>(null);
  protected navContextPosition = signal({ x: '0px', y: '0px' });

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects ?? (e as NavigationEnd).url),
    ),
    { initialValue: this.router.url },
  );

  // Exposed for route transition animation binding
  protected routeAnimState = computed(() => this.currentUrl());

  isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 768px)').pipe(map(r => r.matches)),
    { initialValue: false },
  );

  isSettingsActive = computed(() => {
    const url = this.currentUrl();
    const sp = this.settingsRoute();
    return url === sp || url.startsWith(sp + '/');
  });

  visibleWorkspaces = computed(() => {
    const mobile = this.isMobile();
    return this.workspaces().filter(ws => {
      const show = ws.showOn ?? 'both';
      return show === 'both' || (mobile ? show === 'mobile' : show === 'desktop');
    });
  });

  currentNavItems = computed(() => {
    const mobile = this.isMobile();
    const filterNav = (items: NavItem[]) =>
      items.filter(item => {
        const show = item.showOn ?? 'both';
        return show === 'both' || (mobile ? show === 'mobile' : show === 'desktop');
      });

    if (this.isSettingsActive()) return filterNav(this.settingsNavItems());
    const ws = this.visibleWorkspaces();
    const activeId = this.activeWorkspaceId();
    const active = ws.find(w => w.id === activeId) ?? ws[0];
    return filterNav(active?.navItems ?? []);
  });

  hasMultipleNavItems = computed(() => {
    const mobile = this.isMobile();
    const filterNav = (items: NavItem[]) =>
      items.filter(item => {
        const show = item.showOn ?? 'both';
        return show === 'both' || (mobile ? show === 'mobile' : show === 'desktop');
      });
    
    // Check if ANY workspace has more than one nav item
    const workspaces = this.visibleWorkspaces();
    return workspaces.some(ws => {
      const items = filterNav(ws.navItems);
      const nonSectionItems = items.filter(item => !item.section);
      return nonSectionItems.length > 1;
    });
  });

  sidenavWidth = computed(() => {
    if (this.isMobile()) return '0px';
    const state = this.sidenavState();
    if (state === 'collapsed' || !this.hasMultipleNavItems()) return '0px';
    if (state === 'compact') return 'var(--dwex-sidenav-compact, 72px)';
    return 'var(--dwex-sidenav-expanded, 240px)';
  });

  toolbarMenuWidth = computed(() => {
    if (this.isMobile()) return 'auto';
    return 'var(--dwex-sidenav-compact, 72px)';
  });

  showCompact = signal(false);

  isCompact = computed(() => this.showCompact());

  constructor() {
    // Enable/disable tab service based on input
    effect(() => {
      this.tabService.enabled.set(this.enableTabs());
    });

    // Register all workspace + settings routes with the tab service
    effect(() => {
      this.tabService.clearRegistry();
      const allItems: { route?: string; label: string; icon: string }[] = [];
      for (const ws of this.workspaces()) {
        allItems.push(...ws.navItems);
      }
      allItems.push(...this.settingsNavItems());
      this.tabService.registerRoutes(allItems);
    });

    effect(() => {
      const ws = this.workspaces();
      if (ws.length > 0 && !this.activeWorkspaceId()) {
        this.activeWorkspaceId.set(ws[0].id);
      }
    });

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => {
        const url = (e as NavigationEnd).urlAfterRedirects ?? (e as NavigationEnd).url;
        const sp = this.settingsRoute();
        if (url !== sp && !url.startsWith(sp + '/')) {
          this.previousRoute.set(url);

          // Auto-switch workspace based on current route
          const ws = this.workspaces();
          for (const workspace of ws) {
            const match = workspace.navItems.some(item =>
              item.route && (url === item.route || url.startsWith(item.route + '/'))
            );
            if (match && this.activeWorkspaceId() !== workspace.id) {
              this.activeWorkspaceId.set(workspace.id);
              break;
            }
          }
        }
      });

    effect(() => {
      if (this.isSettingsActive()) this.activeWorkspaceId.set('');
    });
  }

  toggleSidenav() {
    if (this.isMobile()) {
      this.mobileNavOpen.update(v => !v);
      return;
    }
    const s = this.sidenavState();
    if (s === 'expanded') {
      this.showCompact.set(true);
      this.sidenavState.set('compact');
    } else if (s === 'compact') {
      this.sidenavState.set('collapsed');
    } else {
      this.showCompact.set(false);
      this.sidenavState.set('expanded');
    }
  }

  closeMobileNav() {
    this.mobileNavOpen.set(false);
  }

  switchWorkspace(id: string) {
    if (this.isSettingsActive()) {
      const prev = this.previousRoute();
      const sp = this.settingsRoute();
      this.router.navigateByUrl(prev === sp ? '/' : prev);
    }
    this.activeWorkspaceId.set(id);
  }

  toggleSettings() {
    if (this.isSettingsActive()) {
      const prev = this.previousRoute();
      const sp = this.settingsRoute();
      this.router.navigateByUrl(prev === sp || prev.startsWith(sp + '/') ? '/' : prev);
      const ws = this.workspaces();
      if (ws.length > 0) this.activeWorkspaceId.set(ws[0].id);
    } else {
      this.activeWorkspaceId.set('');
      this.router.navigateByUrl(this.settingsRoute());
    }
  }

  isActive(route?: string): boolean {
    if (!route) return false;
    const url = this.currentUrl();
    return url === route || url.startsWith(route + '/');
  }

  navigateToProfile() {
    this.activeWorkspaceId.set('');
    this.router.navigateByUrl(this.profileRoute());
  }

  handleSignOut() {
    this.signOut.emit();
  }

  // --- Nav item split view context menu ---

  onNavItemClick(event: MouseEvent, item: NavItem) {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      event.stopPropagation();
      if (item.route) {
        this.splitViewService.openRoute(item.route, { orientation: 'vertical' });
      }
    }
  }

  onNavContextMenu(event: MouseEvent, item: NavItem, trigger: MatMenuTrigger) {
    if (!item.route) return;
    event.preventDefault();
    this.navContextItem.set(item);
    this.navContextPosition.set({ x: event.clientX + 'px', y: event.clientY + 'px' });
    trigger.openMenu();
  }

  openInSplit(orientation: 'vertical' | 'horizontal') {
    const item = this.navContextItem();
    if (item?.route) {
      this.splitViewService.openRoute(item.route, { orientation });
    }
    this.navContextItem.set(null);
  }

  // --- Split view divider resize ---

  private isDraggingDivider = false;

  onDividerMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.startDividerDrag(event.clientX, event.clientY);

    const onMouseMove = (e: MouseEvent) => this.onDividerMove(e.clientX, e.clientY);
    const onMouseUp = () => {
      this.isDraggingDivider = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  onDividerTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    event.preventDefault();
    const touch = event.touches[0];
    this.startDividerDrag(touch.clientX, touch.clientY);

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      this.onDividerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => {
      this.isDraggingDivider = false;
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  }

  private startDividerDrag(clientX: number, clientY: number) {
    this.isDraggingDivider = true;
    document.body.style.userSelect = 'none';
    document.body.style.cursor =
      this.splitViewService.orientation() === 'vertical' ? 'col-resize' : 'row-resize';
  }

  private onDividerMove(clientX: number, clientY: number) {
    if (!this.isDraggingDivider) return;
    const container = this.elRef.nativeElement.querySelector('.split-container') as HTMLElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let ratio: number;
    if (this.splitViewService.orientation() === 'vertical') {
      ratio = ((clientX - rect.left) / rect.width) * 100;
    } else {
      ratio = ((clientY - rect.top) / rect.height) * 100;
    }
    this.ngZone.run(() => this.splitViewService.setSplitRatio(ratio));
  }

  onDividerDblClick() {
    this.splitViewService.resetRatio();
  }
}
