# Dwex Customization Guide

All customization options for the Dwex shell library — inputs, services, theming, content projection, and responsive behavior.

## Table of Contents

- [Shell Configuration](#shell-configuration)
- [Workspace Management](#workspace-management)
- [Navigation](#navigation)
- [Profile Mode](#profile-mode)
- [Tab System](#tab-system)
- [Split View](#split-view)
- [Theme System](#theme-system)
- [Services](#services)
- [Components](#components)
- [Content Projection](#content-projection)
- [Responsive Behavior](#responsive-behavior)
- [Built-in Settings Pages](#built-in-settings-pages)
- [CSS Customization](#css-customization)

---

## Shell Configuration

The `Shell` component (`<dwex-shell>`) is the main container. It provides toolbar, sidebar, content area, and all shell features.

### Basic Setup

```typescript
import { Component } from '@angular/core';
import { Shell, ShellWorkspace, NavItem } from '@mydrift/ngx-dwex';

@Component({
  selector: 'app-root',
  imports: [Shell],
  template: `
    <dwex-shell
      [workspaces]="workspaces"
      [settingsNavItems]="settingsNav"
      [settingsRoute]="'/settings'"
      [enableTabs]="true">
      <div shell-branding>My App</div>
      <div shell-actions><!-- toolbar buttons --></div>
    </dwex-shell>
  `
})
export class App { }
```

### Shell Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `workspaces` | `ShellWorkspace[]` | `[]` | Workspace configurations |
| `settingsNavItems` | `NavItem[]` | `[]` | Navigation items for the settings section |
| `settingsRoute` | `string` | `'/settings'` | Base route for settings |
| `enableTabs` | `boolean` | `false` | Enable browser-style tab bar |
| `profileMode` | `boolean` | `false` | Enable built-in profile menu |
| `userName` | `string` | `''` | Display name in profile menu |
| `userEmail` | `string` | `''` | Email in profile menu |
| `userAvatar` | `string` | `''` | Avatar image URL |
| `profileRoute` | `string` | `'/profile'` | Route for "Profile" menu item |

### Shell Outputs

| Output | Type | Description |
|--------|------|-------------|
| `signOut` | `void` | Emitted when the user clicks "Sign out" in the profile menu |

---

## Workspace Management

Workspaces let users switch between different navigation contexts. Each workspace gets its own nav items and appears as a tab in the toolbar.

### ShellWorkspace Interface

```typescript
interface ShellWorkspace {
  id: string;           // Unique identifier
  label: string;        // Display name in toolbar
  icon: string;         // Material icon name
  navItems: NavItem[];  // Sidebar navigation for this workspace
  showOn?: ShowOn;      // 'both' | 'mobile' | 'desktop'
}
```

### Multi-Workspace Example

```typescript
workspaces: ShellWorkspace[] = [
  {
    id: 'main',
    label: 'Main',
    icon: 'home',
    navItems: [
      { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
      { label: 'Profile', route: '/profile', icon: 'person' },
    ]
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: 'folder',
    navItems: [
      { label: 'All Files', route: '/documents/all', icon: 'description' },
      { label: 'Shared', route: '/documents/shared', icon: 'people' },
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'analytics',
    showOn: 'desktop', // Hidden on mobile
    navItems: [
      { label: 'Overview', route: '/analytics', icon: 'dashboard' },
    ]
  }
];
```

### Single Workspace

With a single workspace the toolbar switcher is hidden automatically:

```typescript
workspaces: ShellWorkspace[] = [
  {
    id: 'main',
    label: 'Main',
    icon: 'home',
    navItems: [
      { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    ]
  }
];
```

---

## Navigation

### NavItem Interface

```typescript
interface NavItem {
  label: string;        // Display text
  icon: string;         // Material icon name
  route?: string;       // Router path (omit for sections)
  section?: boolean;    // Render as a section header
  divider?: boolean;    // Show divider above this item
  showOn?: ShowOn;      // 'both' | 'mobile' | 'desktop'
}
```

### Example with Sections and Dividers

```typescript
navItems: NavItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
  { label: 'Quick Access', section: true, icon: '', divider: true },
  { label: 'Recent', route: '/recent', icon: 'history' },
  { label: 'Favorites', route: '/favorites', icon: 'star' },
  { label: 'Documents', section: true, icon: '', divider: true },
  { label: 'All Files', route: '/files', icon: 'description' },
  { label: 'Shared', route: '/shared', icon: 'people' },
];
```

### Responsive Visibility

```typescript
{ label: 'Quick Add', route: '/quick', icon: 'add_circle', showOn: 'mobile' }
{ label: 'Advanced', route: '/advanced', icon: 'tune', showOn: 'desktop' }
```

### Split View from Navigation

- **Right-click** any nav item → context menu with "Open in split view" / "Open in stacked view"
- **Ctrl+Click** (or Cmd+Click) any nav item → opens in split view directly

---

## Profile Mode

Enable a built-in profile button in the toolbar with avatar, user info, and sign-out.

```typescript
<dwex-shell
  [profileMode]="true"
  [userName]="'Jane Doe'"
  [userEmail]="'jane@example.com'"
  [userAvatar]="'https://example.com/avatar.jpg'"
  [profileRoute]="'/profile'"
  (signOut)="onSignOut()">
</dwex-shell>
```

The profile menu includes:
- User avatar + name + email header
- "Profile" link (navigates to `profileRoute`)
- "Settings" link
- "Sign out" button (emits `signOut` event)

When `profileMode` is `false`, a simple settings icon button appears instead.

---

## Tab System

Enable browser-style tabs with `[enableTabs]="true"`. Tabs are created automatically when navigating to registered routes.

### Features

- **Auto-creation** — Tabs open when navigating to known routes
- **Pin/Unpin** — Pinned tabs show as icon-only and can't be closed
- **Drag & Drop** — Reorder tabs within their zone (pinned or unpinned)
- **Middle-click** — Close a tab
- **Context Menu:**
  - Pin / Unpin Tab
  - Close, Close Others, Close to the Right, Close All *(unpinned only)*
  - Open in split view / Open in stacked view

### TabService API

```typescript
import { TabService } from '@mydrift/ngx-dwex';

const tabService = inject(TabService);

// Signals
tabService.enabled;       // signal<boolean>
tabService.tabs();        // Tab[]
tabService.activeRoute(); // string
tabService.activeTab();   // Tab | undefined
tabService.pinnedTabs();  // Tab[]
tabService.unpinnedTabs();// Tab[]

// Methods
tabService.activate(route);                    // Navigate to tab
tabService.close(route);                       // Close tab
tabService.closeOthers(route);                 // Close all others (keeps pinned)
tabService.closeToRight(route);                // Close tabs to the right (keeps pinned)
tabService.closeAll();                         // Close all unpinned tabs
tabService.togglePin(route);                   // Toggle pin state
tabService.reorderPinned(prevIdx, newIdx);     // Reorder within pinned zone
tabService.reorderUnpinned(prevIdx, newIdx);   // Reorder within unpinned zone
tabService.registerRoutes(items);              // Register route metadata
tabService.clearRegistry();                    // Clear route registry
```

### Tab Interface

```typescript
interface Tab {
  id: string;
  route: string;
  label: string;
  icon: string;
  pinned: boolean;
}
```

---

## Split View

Open any route's component in a secondary pane alongside the primary content. The divider is resizable via drag, and orientation can be toggled.

### SplitViewService API

```typescript
import { SplitViewService } from '@mydrift/ngx-dwex';

const splitView = inject(SplitViewService);

// Signals
splitView.isActive();          // boolean
splitView.orientation();       // 'vertical' | 'horizontal'
splitView.secondaryComponent();// Type<any> | null
splitView.splitRatio();        // number (0–100)
splitView.secondaryTitle();    // string

// Methods
splitView.open(component, { orientation, title });  // Open component in split
splitView.openRoute(path, { orientation });          // Open a route in split
splitView.close();                                   // Close split view
splitView.setOrientation(orientation);               // Set orientation
splitView.toggleOrientation();                       // Toggle vertical/horizontal
splitView.setSplitRatio(ratio);                      // Set ratio (clamped 20–80)
splitView.resetRatio();                              // Reset to 50/50
```

### Ways to Open Split View

1. **Right-click nav item** → "Open in split view" or "Open in stacked view"
2. **Ctrl+Click nav item** → Opens in vertical split
3. **Tab context menu** → "Open in split view" or "Open in stacked view"
4. **Programmatically** via `SplitViewService.openRoute()` or `.open()`

### Divider Interaction

- **Drag** the divider to resize panes
- **Double-click** the divider to reset to 50/50
- **Toggle orientation** button in the secondary pane header

---

## Theme System

### ThemeService

Manages light/dark mode and color palette with automatic `localStorage` persistence.

```typescript
import { ThemeService, ThemeMode, ThemeColor } from '@mydrift/ngx-dwex';

const theme = inject(ThemeService);

// Signals
theme.mode();   // 'light' | 'dark' | 'system'
theme.color();  // 'violet' | 'blue' | 'green' | 'red' | 'orange'

// Methods
theme.setMode('dark');
theme.setColor('blue');
theme.toggleMode();  // Cycles: light → dark → system → light
```

### Available Modes

| Mode | Behavior |
|------|----------|
| `light` | Always light |
| `dark` | Always dark |
| `system` | Follows OS preference |

### Available Colors

`violet` (default), `blue`, `green`, `red`, `orange`

### Custom Theme Colors

```scss
@use '@angular/material' as mat;

$custom-palette: ( /* ... */ );
$light-custom: mat.define-theme((
  color: (theme-type: light, primary: $custom-palette, use-system-variables: true)
));

html.light-theme.custom-theme {
  @include mat.all-component-themes($light-custom);
}
```

---

## Services

### KeyboardShortcutService

```typescript
import { KeyboardShortcutService, KeyboardShortcut } from '@mydrift/ngx-dwex';

const shortcuts = inject(KeyboardShortcutService);

shortcuts.register({
  key: 's',
  ctrl: true,
  description: 'Save document',
  callback: () => save()
});

shortcuts.unregister('s', true);
shortcuts.clear();
const all = shortcuts.getAll();
```

Shortcuts are automatically disabled when focus is in an input field.

### KeyboardShortcut Interface

```typescript
interface KeyboardShortcut {
  key: string;            // KeyboardEvent.key value
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: () => void;
  description?: string;
}
```

### LoadingService

Counter-based loading state — multiple `show()` calls require matching `hide()` calls.

```typescript
import { LoadingService } from '@mydrift/ngx-dwex';

const loading = inject(LoadingService);

loading.show();       // Increment counter
loading.hide();       // Decrement counter
loading.reset();      // Force reset
loading.isLoading();  // Signal<boolean>
```

### PwaService

Offline detection and service worker update management.

```typescript
import { PwaService } from '@mydrift/ngx-dwex';

const pwa = inject(PwaService);

pwa.isOnline();                  // Signal<boolean>
pwa.updateAvailable();           // Signal<boolean>
pwa.isServiceWorkerEnabled;      // boolean
await pwa.checkForUpdates();     // Check for SW updates
await pwa.activateUpdate();      // Apply update and reload
```

---

## Components

### PageTitle

Standardized page header with optional action buttons.

```typescript
import { PageTitle } from '@mydrift/ngx-dwex';

@Component({
  imports: [PageTitle],
  template: `
    <dwex-page-title title="Dashboard" subtitle="Overview of your data">
      <button mat-raised-button>New Item</button>
    </dwex-page-title>
  `
})
```

| Input | Type | Description |
|-------|------|-------------|
| `title` | `string` (required) | Main heading |
| `subtitle` | `string` | Optional description |

Action buttons are projected via `<ng-content>`.

### TabBar

The tab bar component used internally by the shell. Can also be used standalone:

```typescript
import { TabBar } from '@mydrift/ngx-dwex';
```

---

## Content Projection

| Selector | Location | Purpose |
|----------|----------|---------|
| `[shell-branding]` | Toolbar left | Logo, app name |
| `[shell-actions]` | Toolbar right | Custom action buttons |

```typescript
<dwex-shell [workspaces]="workspaces">
  <div shell-branding>
    <img src="logo.svg" width="28" />
    <span>MyApp</span>
  </div>
  <div shell-actions>
    <button mat-icon-button aria-label="Notifications">
      <mat-icon>notifications</mat-icon>
    </button>
  </div>
</dwex-shell>
```

---

## Responsive Behavior

Mobile breakpoint: **768px**.

### Mobile (≤768px)

- Sidebar hidden; slides in via hamburger menu
- Workspace switcher moves to bottom nav bar
- Touch-optimized tap targets

### Desktop (>768px)

- Persistent sidebar with three states:
  - **Expanded** (240px) — full labels
  - **Compact** (72px) — icons only
  - **Collapsed** (0px) — hidden
- Workspace switcher in toolbar
- Split view available

### Controlling Visibility

Both `ShellWorkspace.showOn` and `NavItem.showOn` accept `'both'` (default), `'mobile'`, or `'desktop'`.

---

## Built-in Settings Pages

Pre-built settings pages you can wire directly to routes:

```typescript
import {
  AppearanceSettingsPage,
  AccountSettingsPage,
  NotificationsSettingsPage,
  PrivacySettingsPage,
  AdvancedSettingsPage
} from '@mydrift/ngx-dwex';

const routes: Routes = [
  {
    path: 'settings',
    children: [
      { path: '', redirectTo: 'appearance', pathMatch: 'full' },
      { path: 'appearance', component: AppearanceSettingsPage },
      { path: 'account', component: AccountSettingsPage },
      { path: 'notifications', component: NotificationsSettingsPage },
      { path: 'privacy', component: PrivacySettingsPage },
      { path: 'advanced', component: AdvancedSettingsPage },
    ]
  }
];
```

Settings nav items:

```typescript
settingsNav: NavItem[] = [
  { label: 'Appearance', route: '/settings/appearance', icon: 'palette' },
  { label: 'Account', route: '/settings/account', icon: 'person' },
  { label: 'Notifications', route: '/settings/notifications', icon: 'notifications' },
  { label: 'Privacy', route: '/settings/privacy', icon: 'lock' },
  { label: 'Advanced', route: '/settings/advanced', icon: 'tune' },
];
```

The **Appearance** page automatically integrates with `ThemeService` for mode and color selection.

---

## CSS Customization

### CSS Custom Properties

```scss
dwex-shell {
  --dwex-sidenav-expanded: 240px;   // Expanded sidebar width
  --dwex-sidenav-compact: 72px;     // Compact sidebar width
  --dwex-content-padding: 10px;     // Content area padding
}
```

### Override Shell Styles

```scss
dwex-shell {
  .shell-toolbar {
    height: 64px;
  }

  .content-card {
    border-radius: 16px;
  }
}
```

### Material Design 3 Tokens

Dwex uses M3 system tokens. Override carefully:

```scss
html {
  --mat-sys-corner-large: 24px;
  --mat-sys-primary: #your-color;
}
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Theme not applying | Ensure your global styles import Material themes |
| Active nav item not highlighted | Check routes match exactly (including leading `/`) |
| Mobile layout broken | Verify `<meta name="viewport">` in `index.html` |
| Shortcuts not firing | Check for browser shortcut conflicts; focus must not be in an input |
| Split view not opening | Ensure the target route has a `component` (not lazy-loaded) in router config |

---

## Support

- [GitHub Issues](https://github.com/mydrift-user/ngx-dwex/issues)
- [Library README](projects/ngx-dwex/README.md)
- License: MIT
