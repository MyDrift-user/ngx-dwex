import { Routes } from '@angular/router';
import { AppearanceSettingsPage } from 'ngx-dwex';
import { HomePage } from './pages/home.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'settings', redirectTo: 'settings/appearance', pathMatch: 'full' },
  { path: 'settings/appearance', component: AppearanceSettingsPage },
  { path: '**', redirectTo: '' }
];
