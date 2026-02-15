import { Component, signal } from '@angular/core';
import { Shell, ShellWorkspace, NavItem } from 'ngx-dwex';

@Component({
  selector: 'app-root',
  imports: [Shell],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly settingsNavItems = signal<NavItem[]>([
    { label: 'Appearance', route: '/settings/appearance', icon: 'palette' },
    { label: 'Account', route: '/settings/account', icon: 'person' },
    { label: 'Notifications', route: '/settings/notifications', icon: 'notifications' },
    { label: 'Privacy', route: '/settings/privacy', icon: 'lock' },
    { label: 'Advanced', route: '/settings/advanced', icon: 'tune' },
  ]);

  protected readonly workspaces = signal<ShellWorkspace[]>([
    {
      id: 'sales',
      label: 'Sales',
      icon: 'storefront',
      navItems: [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
        { label: 'Deals', route: '/deals', icon: 'handshake' },
        { label: 'People', section: true, icon: '', divider: true },
        { label: 'Contacts', route: '/contacts', icon: 'contacts' },
        { label: 'Companies', route: '/companies', icon: 'domain' },
      ],
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: 'folder',
      navItems: [
        { label: 'All Files', route: '/documents/all', icon: 'description' },
        { label: 'Templates', route: '/documents/templates', icon: 'content_copy' },
        { label: 'Shared', section: true, icon: '', divider: true },
        { label: 'Shared with Me', route: '/documents/shared', icon: 'people' },
      ],
    },
    {
      id: 'analytics',
      label: 'Reports',
      icon: 'analytics',
      navItems: [
        { label: 'Overview', route: '/analytics/overview', icon: 'bar_chart' },
        { label: 'Details', section: true, icon: '', divider: true },
        { label: 'Team Analytics', route: '/analytics/users', icon: 'groups' },
        { label: 'Performance', route: '/analytics/performance', icon: 'speed' },
      ],
    },
  ]);

  onSignOut() {
    console.log('Sign out clicked');
  }
}
