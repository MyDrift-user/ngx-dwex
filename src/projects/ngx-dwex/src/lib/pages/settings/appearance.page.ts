import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PageTitle } from '../../components/page-title/page-title';
import { MatIcon } from '@angular/material/icon';
import { ThemeService, ThemeMode, ThemeColor } from '../../services/theme.service';

@Component({
  selector: 'dwex-settings-appearance',
  standalone: true,
  imports: [
    PageTitle,
    MatIcon,
  ],
  template: `
    <dwex-page-title title="Appearance" subtitle="Customize theme and colors" />
    <div class="settings-content">
      <div class="setting-section">
        <h3 class="setting-label">Theme</h3>
        <div class="theme-options">
          @for (t of themes; track t.value) {
            <button
              class="theme-option"
              [class.active]="themeService.mode() === t.value"
              (click)="setThemeMode(t.value)"
              [attr.aria-label]="t.label">
              <mat-icon>{{ t.icon }}</mat-icon>
              <span>{{ t.label }}</span>
            </button>
          }
        </div>
      </div>

      <div class="setting-section">
        <h3 class="setting-label">Color</h3>
        <div class="color-options">
          @for (c of colors; track c.value) {
            <button
              class="color-swatch"
              [style.--swatch-color]="c.hex"
              [class.active]="themeService.color() === c.value"
              (click)="setThemeColor(c.value)"
              [attr.aria-label]="c.label">
              @if (themeService.color() === c.value) {
                <mat-icon>check</mat-icon>
              }
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-content {
      padding: 8px 24px 24px;
      max-width: 600px;
    }

    .setting-section {
      margin-bottom: 36px;
    }

    .setting-label {
      margin: 0 0 14px;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: var(--mat-sys-on-surface-variant);
    }

    .theme-options {
      display: flex;
      gap: 10px;
    }

    .theme-option {
      all: unset;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px 28px;
      border-radius: var(--dwex-corner-md, 16px);
      cursor: pointer;
      color: var(--mat-sys-on-surface);
      border: 1px solid var(--mat-sys-outline-variant);
      transition: background-color 200ms cubic-bezier(0.2, 0, 0, 1),
                  border-color 200ms cubic-bezier(0.2, 0, 0, 1),
                  transform 200ms cubic-bezier(0.2, 0, 0, 1),
                  box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);

      &:hover {
        background-color: color-mix(in srgb, var(--mat-sys-on-surface) 6%, transparent);
      }

      &:active {
        transform: scale(0.96);
      }

      &.active {
        background-color: var(--mat-sys-secondary-container);
        color: var(--mat-sys-on-secondary-container);
        border-color: var(--mat-sys-secondary-container);
      }

      span {
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.02em;
      }
    }

    .color-options {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }

    .color-swatch {
      all: unset;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: var(--swatch-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: transform 250ms cubic-bezier(0.05, 0.7, 0.1, 1),
                  box-shadow 250ms cubic-bezier(0.2, 0, 0, 1);

      mat-icon {
        color: white;
        font-size: 20px;
        width: 20px;
        height: 20px;
        font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 20 !important;
      }

      &:hover {
        transform: scale(1.12);
      }

      &:active {
        transform: scale(0.95);
      }

      &.active {
        box-shadow: 0 0 0 3px var(--mat-sys-surface),
                    0 0 0 5px var(--swatch-color);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceSettingsPage {
  readonly themeService = inject(ThemeService);

  readonly themes = [
    { value: 'light' as ThemeMode, icon: 'light_mode', label: 'Light' },
    { value: 'dark' as ThemeMode, icon: 'dark_mode', label: 'Dark' },
    { value: 'system' as ThemeMode, icon: 'brightness_auto', label: 'System' },
  ];

  readonly colors = [
    { value: 'violet' as ThemeColor, label: 'Violet', hex: '#7c3aed' },
    { value: 'blue' as ThemeColor, label: 'Blue', hex: '#2563eb' },
    { value: 'green' as ThemeColor, label: 'Green', hex: '#059669' },
    { value: 'red' as ThemeColor, label: 'Red', hex: '#dc2626' },
    { value: 'orange' as ThemeColor, label: 'Orange', hex: '#ea580c' },
  ];

  setThemeMode(mode: ThemeMode) {
    this.themeService.setMode(mode);
  }

  setThemeColor(color: ThemeColor) {
    this.themeService.setColor(color);
  }
}
