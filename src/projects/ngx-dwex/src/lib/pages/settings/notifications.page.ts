import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageTitle } from '../../components/page-title/page-title';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'dwex-settings-notifications',
  standalone: true,
  imports: [PageTitle, MatIcon],
  template: `
    <dwex-page-title title="Notifications" subtitle="Configure notification preferences" />
    <div class="settings-placeholder">
      <div class="placeholder-icon">
        <mat-icon>notifications</mat-icon>
      </div>
      <p>Notification settings will appear here.</p>
      <span class="placeholder-hint">Configure your notification preferences in this page.</span>
    </div>
  `,
  styles: [`
    .settings-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
    }
    .placeholder-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: var(--mat-sys-surface-container-high);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .placeholder-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--mat-sys-on-surface-variant);
    }
    p {
      margin: 0;
      font-size: 16px;
      font-weight: 400;
      color: var(--mat-sys-on-surface);
    }
    .placeholder-hint {
      margin-top: 4px;
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsSettingsPage {}
