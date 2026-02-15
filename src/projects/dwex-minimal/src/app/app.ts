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

  protected readonly settingsNavItems = signal<NavItem[]>([
    { label: 'Appearance', route: '/settings/appearance', icon: 'palette' },
  ]);
}
