import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { PageTitle } from 'ngx-dwex';

interface SalesRep {
  name: string;
  avatar: string;
  role: string;
  deals: number;
  revenue: string;
  quota: string;
  quotaPct: number;
  trend: string;
  trendUp: boolean;
}

@Component({
  selector: 'app-analytics-users',
  imports: [MatIcon, MatCard, MatCardContent, PageTitle],
  template: `
    <dwex-page-title title="Team Analytics" subtitle="Individual sales rep performance and quotas" />
    <div class="users-content">
      <!-- Summary stats -->
      <div class="summary-row">
        <div class="summary-item">
          <mat-icon>groups</mat-icon>
          <div class="summary-info">
            <span class="summary-value">8</span>
            <span class="summary-label">Team Members</span>
          </div>
        </div>
        <div class="summary-item">
          <mat-icon>flag</mat-icon>
          <div class="summary-info">
            <span class="summary-value">75%</span>
            <span class="summary-label">Avg Quota Attainment</span>
          </div>
        </div>
        <div class="summary-item">
          <mat-icon>star</mat-icon>
          <div class="summary-info">
            <span class="summary-value">3</span>
            <span class="summary-label">Reps Above Quota</span>
          </div>
        </div>
      </div>

      <!-- Rep cards -->
      <div class="rep-grid">
        @for (rep of reps; track rep.name) {
          <mat-card class="rep-card">
            <mat-card-content>
              <div class="rep-header">
                <div class="rep-avatar" [style.background-color]="rep.avatar">
                  {{ rep.name.charAt(0) }}
                </div>
                <div class="rep-identity">
                  <span class="rep-name">{{ rep.name }}</span>
                  <span class="rep-role">{{ rep.role }}</span>
                </div>
                <div class="rep-trend" [class.up]="rep.trendUp" [class.down]="!rep.trendUp">
                  <mat-icon>{{ rep.trendUp ? 'trending_up' : 'trending_down' }}</mat-icon>
                  {{ rep.trend }}
                </div>
              </div>

              <!-- Quota progress -->
              <div class="quota-section">
                <div class="quota-header">
                  <span class="quota-label">Quota: {{ rep.quota }}</span>
                  <span class="quota-pct" [class.above]="rep.quotaPct >= 100">{{ rep.quotaPct }}%</span>
                </div>
                <div class="quota-bar-bg">
                  <div
                    class="quota-bar-fill"
                    [style.width.%]="Math.min(rep.quotaPct, 100)"
                    [class.above]="rep.quotaPct >= 100"
                    [class.danger]="rep.quotaPct < 50">
                  </div>
                </div>
              </div>

              <!-- Stats -->
              <div class="rep-stats">
                <div class="rep-stat">
                  <span class="rep-stat-value">{{ rep.deals }}</span>
                  <span class="rep-stat-label">Deals</span>
                </div>
                <div class="rep-stat">
                  <span class="rep-stat-value">{{ rep.revenue }}</span>
                  <span class="rep-stat-label">Revenue</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .users-content {
      padding: 8px 24px 24px;
    }

    .summary-row {
      display: flex;
      gap: 1px;
      margin-bottom: 16px;
      border-radius: var(--dwex-corner-sm, 12px);
      overflow: hidden;
      border: 1px solid var(--mat-sys-outline-variant);
    }

    .summary-item {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: var(--mat-sys-surface-container);

      mat-icon {
        color: var(--mat-sys-primary);
        font-size: 24px;
      }
    }

    .summary-info {
      display: flex;
      flex-direction: column;
    }

    .summary-value {
      font-size: 20px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .summary-label {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .rep-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }

    .rep-card {
      border: 1px solid var(--mat-sys-outline-variant);
    }

    .rep-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .rep-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 500;
      color: white;
      flex-shrink: 0;
    }

    .rep-identity {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .rep-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .rep-role {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .rep-trend {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      font-weight: 500;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &.up { color: #059669; }
      &.down { color: #dc2626; }
    }

    .quota-section {
      margin-bottom: 14px;
    }

    .quota-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .quota-label {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .quota-pct {
      font-size: 12px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);

      &.above { color: #059669; }
    }

    .quota-bar-bg {
      height: 6px;
      border-radius: 3px;
      background: var(--mat-sys-surface-container-highest);
    }

    .quota-bar-fill {
      height: 100%;
      border-radius: 3px;
      background: var(--mat-sys-primary);
      transition: width 500ms cubic-bezier(0.05, 0.7, 0.1, 1);

      &.above { background: #059669; }
      &.danger { background: #dc2626; }
    }

    .rep-stats {
      display: flex;
      gap: 24px;
    }

    .rep-stat {
      display: flex;
      flex-direction: column;
    }

    .rep-stat-value {
      font-size: 16px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .rep-stat-label {
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
    }

    @media (max-width: 768px) {
      .summary-row {
        flex-direction: column;
      }
    }
  `]
})
export class UsersPage {
  protected Math = Math;

  reps: SalesRep[] = [
    { name: 'Sarah Chen', avatar: '#7c3aed', role: 'Senior Account Exec', deals: 12, revenue: '$342K', quota: '$300K', quotaPct: 114, trend: '+18%', trendUp: true },
    { name: 'James Miller', avatar: '#2563eb', role: 'Account Executive', deals: 9, revenue: '$298K', quota: '$280K', quotaPct: 106, trend: '+12%', trendUp: true },
    { name: 'Lisa Park', avatar: '#059669', role: 'Senior Account Exec', deals: 11, revenue: '$264K', quota: '$260K', quotaPct: 102, trend: '+5%', trendUp: true },
    { name: 'Alex Thompson', avatar: '#0891b2', role: 'Account Executive', deals: 7, revenue: '$215K', quota: '$280K', quotaPct: 77, trend: '+8%', trendUp: true },
    { name: 'Priya Sharma', avatar: '#c026d3', role: 'Account Executive', deals: 8, revenue: '$189K', quota: '$260K', quotaPct: 73, trend: '-3%', trendUp: false },
    { name: 'Emma Wilson', avatar: '#ea580c', role: 'Business Dev Rep', deals: 6, revenue: '$142K', quota: '$220K', quotaPct: 65, trend: '+15%', trendUp: true },
    { name: 'David Park', avatar: '#dc2626', role: 'Business Dev Rep', deals: 5, revenue: '$98K', quota: '$220K', quotaPct: 45, trend: '-8%', trendUp: false },
    { name: 'María García', avatar: '#059669', role: 'SDR', deals: 4, revenue: '$67K', quota: '$180K', quotaPct: 37, trend: '+2%', trendUp: true },
  ];
}
