# Dwex — Angular UI Shell Library

An Angular library that provides a complete application shell with navigation, theming, tabs, split views, workspace switching, and responsive layout. Built on Angular Material M3.

## Install

```bash
npm install @mydrift/ngx-dwex
```

## Minimal Example

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
    </dwex-shell>
  `
})
export class App {
  workspaces: ShellWorkspace[] = [
    {
      id: 'main', label: 'Main', icon: 'home',
      navItems: [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
        { label: 'Profile', route: '/profile', icon: 'person' },
      ]
    }
  ];

  settingsNav: NavItem[] = [
    { label: 'Appearance', route: '/settings/appearance', icon: 'palette' },
  ];
}
```

## Shell Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `workspaces` | `ShellWorkspace[]` | `[]` | Workspace configurations with nav items |
| `settingsNavItems` | `NavItem[]` | `[]` | Settings section navigation |
| `settingsRoute` | `string` | `'/settings'` | Base route for settings |
| `enableTabs` | `boolean` | `false` | Enable browser-style tab bar |
| `profileMode` | `boolean` | `false` | Built-in profile menu with avatar & sign-out |
| `userName` | `string` | `''` | Name shown in profile menu |
| `userEmail` | `string` | `''` | Email shown in profile menu |
| `userAvatar` | `string` | `''` | Avatar image URL |
| `profileRoute` | `string` | `'/profile'` | Profile page route |

| Output | Type | Description |
|--------|------|-------------|
| `signOut` | `void` | Emitted on sign-out click |

## Content Projection

| Selector | Location |
|----------|----------|
| `[shell-branding]` | Toolbar left — logo, app name |
| `[shell-actions]` | Toolbar right — custom buttons |

## Key Interfaces

```typescript
interface ShellWorkspace {
  id: string;
  label: string;
  icon: string;
  navItems: NavItem[];
  showOn?: 'both' | 'mobile' | 'desktop';
}

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  section?: boolean;
  divider?: boolean;
  showOn?: 'both' | 'mobile' | 'desktop';
}
```

## Services

| Service | Purpose |
|---------|---------|
| `ThemeService` | Light/dark/system mode, 5 color palettes, localStorage persistence |
| `TabService` | Tab lifecycle — open, close, pin, reorder, close others/right/all |
| `SplitViewService` | Secondary pane — open route/component, resize, toggle orientation |
| `KeyboardShortcutService` | Global keyboard shortcut registration |
| `LoadingService` | Counter-based loading state |
| `PwaService` | Offline detection, service worker updates |

## Components

| Component | Selector | Purpose |
|-----------|----------|---------|
| `Shell` | `<dwex-shell>` | Main application shell |
| `PageTitle` | `<dwex-page-title>` | Page header with title, subtitle, and action projection |
| `TabBar` | `<dwex-tab-bar>` | Tab bar (used internally, can be standalone) |

## Built-in Settings Pages

```typescript
import {
  AppearanceSettingsPage,
  AccountSettingsPage,
  NotificationsSettingsPage,
  PrivacySettingsPage,
  AdvancedSettingsPage
} from '@mydrift/ngx-dwex';
```

## Features

- **Workspaces** — Multiple navigation contexts, toolbar switcher, auto-detects active workspace from route
- **Tabs** — Auto-created on navigation, pin/unpin, drag reorder, context menu with close actions and split view
- **Split View** — Open any route in a secondary pane; right-click or Ctrl+click nav items; resizable divider
- **Theming** — M3 tokens, 5 palettes (violet/blue/green/red/orange), light/dark/system, auto-persisted
- **Profile Mode** — Avatar, name, email, settings link, sign-out in a toolbar menu
- **Responsive** — Mobile bottom nav, slide-in sidebar, 3-state desktop sidenav (expanded/compact/collapsed)
- **PWA** — Offline banner, service worker update detection

## Documentation

See the full [Customization Guide](../../CUSTOMIZATION.md) for detailed API docs, examples, and CSS overrides.

## License

MIT