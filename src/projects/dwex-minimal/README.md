# Dwex Minimal Demo

The simplest possible Dwex application setup - perfect for learning or starting a new project.

## What's Included

This minimal demo demonstrates the bare minimum needed to use Dwex:

- ✅ **One workspace** - Single "Home" workspace
- ✅ **One navigation item** - Simple home navigation
- ✅ **One page** - Welcome page with getting started info
- ✅ **Minimal configuration** - Just the essentials

## Project Structure

```
dwex-minimal/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   └── home.page.ts          # Single home page component
│   │   ├── app.ts                    # Main app component
│   │   ├── app.html                  # Shell configuration
│   │   ├── app.scss                  # App styles (minimal)
│   │   ├── app.config.ts             # Angular config
│   │   └── app.routes.ts             # Routes (one route)
│   ├── index.html                    # HTML entry point
│   ├── main.ts                       # Bootstrap
│   └── styles.scss                   # Global styles
├── public/
│   └── manifest.webmanifest          # PWA manifest
├── tsconfig.app.json                 # TypeScript config
└── tsconfig.spec.json                # Test config
```

## Run the Demo

```bash
# From the root of the Dwex workspace
ng serve dwex-minimal
```

Then navigate to `http://localhost:4200/`

## Key Code Snippets

### App Component (app.ts)

```typescript
import { Component, signal } from '@angular/core';
import { Shell, ShellWorkspace, NavItem } from 'ngx-dwex';

@Component({
  selector: 'app-root',
  imports: [Shell],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Single workspace with one navigation item
  protected readonly workspaces = signal<ShellWorkspace[]>([
    {
      id: 'main',
      label: 'Home',
      icon: 'home',
      navItems: [
        { label: 'Home', route: '/', icon: 'home' }
      ]
    }
  ]);

  // Empty settings (keep it minimal)
  protected readonly settingsNavItems = signal<NavItem[]>([]);
}
```

### Shell Template (app.html)

```html
<dwex-shell 
  [workspaces]="workspaces()"
  [settingsNavItems]="settingsNavItems()">
  
  <!-- Simple branding -->
  <div shell-branding>
    <h2>Dwex Minimal</h2>
  </div>
  
</dwex-shell>
```

## What You Get Out of the Box

Even with this minimal setup, you automatically get:

- 🎨 **Full theming support** - 5 color palettes (violet, blue, green, red, orange)
- 🌓 **Light/Dark modes** - Including system preference support
- 📱 **Responsive design** - Mobile and desktop layouts
- 🎯 **Material Design 3** - Professional UI components
- ⚡ **Optimized performance** - Angular signals and OnPush
- ♿ **Accessibility** - ARIA labels, keyboard navigation
- 📦 **Type safety** - Full TypeScript support

## Next Steps

To expand this demo, you can:

### 1. Add More Pages

Create new page components and add routes:

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'about', component: AboutPage },
  { path: 'contact', component: ContactPage }
];
```

### 2. Add More Navigation Items

Update the workspace navigation:

```typescript
navItems: [
  { label: 'Home', route: '/', icon: 'home' },
  { label: 'About', route: '/about', icon: 'info' },
  { label: 'Contact', route: '/contact', icon: 'email' }
]
```

### 3. Add Sections and Dividers

Organize navigation with sections:

```typescript
navItems: [
  { label: 'Home', route: '/', icon: 'home' },
  { label: 'Menu', section: true, divider: true },
  { label: 'Products', route: '/products', icon: 'shopping_bag' },
  { label: 'Services', route: '/services', icon: 'build' }
]
```

### 4. Add Multiple Workspaces

Create different contexts:

```typescript
workspaces = signal<ShellWorkspace[]>([
  {
    id: 'main',
    label: 'Home',
    icon: 'home',
    navItems: [
      { label: 'Dashboard', route: '/', icon: 'dashboard' }
    ]
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: 'admin_panel_settings',
    navItems: [
      { label: 'Users', route: '/admin/users', icon: 'people' }
    ]
  }
]);
```

### 5. Add Settings Pages

Include built-in settings:

```typescript
import { AppearanceSettingsPage } from 'ngx-dwex';

// In routes
{ path: 'settings', component: AppearanceSettingsPage }

// In app component
settingsNavItems = signal<NavItem[]>([
  { label: 'Appearance', route: '/settings', icon: 'palette' }
]);
```

### 6. Add Toolbar Actions

Customize the toolbar:

```html
<dwex-shell [workspaces]="workspaces()">
  <div shell-branding>
    <h2>My App</h2>
  </div>
  
  <div shell-actions>
    <button mat-icon-button>
      <mat-icon>notifications</mat-icon>
    </button>
    <button mat-icon-button>
      <mat-icon>account_circle</mat-icon>
    </button>
  </div>
</dwex-shell>
```

### 7. Use Services

Leverage built-in services:

```typescript
import { inject } from '@angular/core';
import { ThemeService, LoadingService, KeyboardShortcutService } from 'ngx-dwex';

export class MyComponent {
  themeService = inject(ThemeService);
  loading = inject(LoadingService);
  shortcuts = inject(KeyboardShortcutService);
  
  ngOnInit() {
    // Change theme
    this.themeService.setColor('blue');
    
    // Show loading
    this.loading.show();
    
    // Register shortcut
    this.shortcuts.register({
      key: 's',
      ctrl: true,
      callback: () => this.save()
    });
  }
}
```

## Documentation

For complete documentation on all customization options, see:

- **[CUSTOMIZATION.md](../../CUSTOMIZATION.md)** - Comprehensive customization guide
- **[projects/ngx-dwex/README.md](../ngx-dwex/README.md)** - API reference

## Comparison with Full Demo

| Feature | Minimal Demo | Full Demo (dwex-demo) |
|---------|-------------|----------------------|
| Workspaces | 1 | 3 |
| Pages | 1 | 5+ |
| Settings | None | 5 pages |
| Navigation | 1 item | Multiple sections |
| Toolbar Actions | None | Profile & notifications |
| Complexity | Very simple | Comprehensive |
| Best For | Learning, starting | Reference, showcasing |

## Tips

1. **Start minimal** - Begin with this demo and add features as needed
2. **Follow patterns** - Use the full demo (dwex-demo) as reference for advanced features
3. **Read docs** - The CUSTOMIZATION.md file has examples for everything
4. **Use signals** - Keep your data reactive with Angular signals
5. **Test responsive** - Check both mobile and desktop layouts

## License

MIT - Same as the main Dwex library
