/*
 * Public API Surface of dwex
 */

// Shell
export { Shell, type NavItem, type ShellWorkspace, type ShowOn } from './lib/shell/shell';

// Components
export { PageTitle } from './lib/components/page-title/page-title';
export { TabBar } from './lib/components/tab-bar/tab-bar';

// Services
export { ThemeService, type ThemeMode, type ThemeColor } from './lib/services/theme.service';
export { LoadingService } from './lib/services/loading.service';
export { KeyboardShortcutService, type KeyboardShortcut } from './lib/services/keyboard-shortcut.service';
export { PwaService } from './lib/services/pwa.service';
export { TabService, type Tab, type TabRouteInfo } from './lib/services/tab.service';
export { SplitViewService, type SplitOrientation } from './lib/services/split-view.service';

// Settings Pages
export { AppearanceSettingsPage } from './lib/pages/settings/appearance.page';
export { AccountSettingsPage } from './lib/pages/settings/account.page';
export { NotificationsSettingsPage } from './lib/pages/settings/notifications.page';
export { PrivacySettingsPage } from './lib/pages/settings/privacy.page';
export { AdvancedSettingsPage } from './lib/pages/settings/advanced.page';
