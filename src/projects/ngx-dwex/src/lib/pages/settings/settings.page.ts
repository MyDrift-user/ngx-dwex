import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PageTitle } from '../../components/page-title/page-title';
import { ThemeService, ThemeMode, ThemeColor } from '../../services/theme.service';

@Component({
  selector: 'dwex-settings-page',
  imports: [
    MatIcon,
    PageTitle,
  ],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  themeService = inject(ThemeService);

  setThemeMode(mode: ThemeMode) {
    this.themeService.setMode(mode);
  }

  setThemeColor(color: ThemeColor) {
    this.themeService.setColor(color);
  }
}
