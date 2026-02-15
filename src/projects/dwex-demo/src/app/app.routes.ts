import { Routes } from '@angular/router';
import { AppearanceSettingsPage } from 'ngx-dwex';
import { AccountSettingsPage } from 'ngx-dwex';
import { NotificationsSettingsPage } from 'ngx-dwex';
import { PrivacySettingsPage } from 'ngx-dwex';
import { AdvancedSettingsPage } from 'ngx-dwex';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { DealsPage } from './pages/deals/deals.page';
import { ProfilePage } from './pages/profile/profile.page';
import { CompaniesPage } from './pages/companies/companies.page';
import { AllFilesPage } from './pages/documents/all-files.page';
import { TemplatesPage } from './pages/documents/templates.page';
import { SharedPage } from './pages/documents/shared.page';
import { OverviewPage } from './pages/analytics/overview.page';
import { UsersPage } from './pages/analytics/users.page';
import { PerformancePage } from './pages/analytics/performance.page';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPage },
  { path: 'deals', component: DealsPage },
  { path: 'profile', component: ProfilePage },
  { path: 'contacts', component: ProfilePage },
  { path: 'companies', component: CompaniesPage },
  { path: 'settings', redirectTo: 'settings/appearance', pathMatch: 'full' },
  { path: 'settings/appearance', component: AppearanceSettingsPage },
  { path: 'settings/account', component: AccountSettingsPage },
  { path: 'settings/notifications', component: NotificationsSettingsPage },
  { path: 'settings/privacy', component: PrivacySettingsPage },
  { path: 'settings/advanced', component: AdvancedSettingsPage },
  { path: 'documents', redirectTo: 'documents/all', pathMatch: 'full' },
  { path: 'documents/all', component: AllFilesPage },
  { path: 'documents/templates', component: TemplatesPage },
  { path: 'documents/shared', component: SharedPage },
  { path: 'analytics', redirectTo: 'analytics/overview', pathMatch: 'full' },
  { path: 'analytics/overview', component: OverviewPage },
  { path: 'analytics/users', component: UsersPage },
  { path: 'analytics/performance', component: PerformancePage },
];
