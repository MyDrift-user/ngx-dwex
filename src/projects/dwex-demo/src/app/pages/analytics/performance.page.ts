import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { PageTitle } from 'ngx-dwex';

@Component({
  selector: 'app-analytics-performance',
  imports: [MatIcon, MatCard, MatCardContent, PageTitle],
  template: `
    <dwex-page-title title="Performance" subtitle="Sales velocity, conversion rates, and pipeline health" />
    <div class="perf-content">
      <!-- Velocity metrics -->
      <div class="velocity-grid">
        @for (v of velocityMetrics; track v.label) {
          <mat-card class="velocity-card">
            <mat-card-content>
              <mat-icon [style.color]="v.color">{{ v.icon }}</mat-icon>
              <div class="velocity-value">{{ v.value }}</div>
              <div class="velocity-label">{{ v.label }}</div>
              <div class="velocity-sub">{{ v.sub }}</div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <!-- Conversion funnel -->
      <mat-card class="section-card">
        <mat-card-content>
          <h3 class="section-title">Conversion Funnel</h3>
          <div class="funnel">
            @for (stage of funnelStages; track stage.name) {
              <div class="funnel-row">
                <div class="funnel-bar-wrap">
                  <div class="funnel-bar" [style.width.%]="stage.pct" [style.background-color]="stage.color"></div>
                </div>
                <div class="funnel-info">
                  <span class="funnel-name">{{ stage.name }}</span>
                  <span class="funnel-stats">{{ stage.count }} deals • {{ stage.rate }}</span>
                </div>
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Two column: Win/Loss + Activity -->
      <div class="two-col">
        <mat-card class="section-card">
          <mat-card-content>
            <h3 class="section-title">Win/Loss Analysis</h3>
            <div class="wl-grid">
              @for (reason of winLossReasons; track reason.label) {
                <div class="wl-row">
                  <div class="wl-dot" [style.background-color]="reason.color"></div>
                  <span class="wl-label">{{ reason.label }}</span>
                  <span class="wl-value">{{ reason.pct }}%</span>
                  <div class="wl-bar-bg">
                    <div class="wl-bar" [style.width.%]="reason.pct" [style.background-color]="reason.color"></div>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="section-card">
          <mat-card-content>
            <h3 class="section-title">Activity Metrics</h3>
            <div class="activity-list">
              @for (act of activityMetrics; track act.label) {
                <div class="act-row">
                  <mat-icon [style.color]="act.color">{{ act.icon }}</mat-icon>
                  <div class="act-info">
                    <span class="act-label">{{ act.label }}</span>
                    <span class="act-sub">{{ act.sub }}</span>
                  </div>
                  <div class="act-values">
                    <span class="act-value">{{ act.value }}</span>
                    <span class="act-trend" [class.up]="act.trendUp" [class.down]="!act.trendUp">
                      {{ act.trend }}
                    </span>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .perf-content {
      padding: 8px 24px 24px;
    }

    .velocity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }

    .velocity-card {
      border: 1px solid var(--mat-sys-outline-variant);
      text-align: center;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        margin-bottom: 8px;
      }
    }

    .velocity-value {
      font-size: 28px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
      line-height: 1;
    }

    .velocity-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      margin-top: 4px;
    }

    .velocity-sub {
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
      margin-top: 2px;
    }

    .section-card {
      border: 1px solid var(--mat-sys-outline-variant);
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      margin: 0 0 16px;
    }

    .funnel {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .funnel-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .funnel-bar-wrap {
      flex: 1;
      height: 28px;
      background: var(--mat-sys-surface-container);
      border-radius: 6px;
      overflow: hidden;
    }

    .funnel-bar {
      height: 100%;
      border-radius: 6px;
      transition: width 500ms cubic-bezier(0.05, 0.7, 0.1, 1);
    }

    .funnel-info {
      min-width: 180px;
      flex-shrink: 0;
    }

    .funnel-name {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .funnel-stats {
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
    }

    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .wl-grid {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .wl-row {
      display: grid;
      grid-template-columns: 10px 1fr 40px 80px;
      align-items: center;
      gap: 10px;
    }

    .wl-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .wl-label {
      font-size: 13px;
      color: var(--mat-sys-on-surface);
    }

    .wl-value {
      font-size: 13px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
      text-align: right;
    }

    .wl-bar-bg {
      height: 4px;
      border-radius: 2px;
      background: var(--mat-sys-surface-container-highest);
    }

    .wl-bar {
      height: 100%;
      border-radius: 2px;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .act-row {
      display: flex;
      align-items: center;
      gap: 12px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .act-info {
      flex: 1;
    }

    .act-label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .act-sub {
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
    }

    .act-values {
      text-align: right;
    }

    .act-value {
      display: block;
      font-size: 16px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .act-trend {
      font-size: 11px;
      font-weight: 500;

      &.up { color: #059669; }
      &.down { color: #dc2626; }
    }

    @media (max-width: 768px) {
      .two-col {
        grid-template-columns: 1fr;
      }

      .funnel-info {
        min-width: 120px;
      }
    }
  `]
})
export class PerformancePage {
  velocityMetrics = [
    { label: 'Avg Sales Cycle', value: '28d', icon: 'schedule', color: '#2563eb', sub: '↓ 3 days from last quarter' },
    { label: 'Lead Response', value: '2.4h', icon: 'bolt', color: '#ea580c', sub: 'Avg first response time' },
    { label: 'Win Rate', value: '68%', icon: 'emoji_events', color: '#059669', sub: '↑ 3% from last quarter' },
    { label: 'Pipeline Velocity', value: '$142K', icon: 'speed', color: '#7c3aed', sub: 'Revenue per month' },
  ];

  funnelStages = [
    { name: 'Leads Generated', count: 248, rate: '100%', pct: 100, color: '#6b7280' },
    { name: 'Qualified', count: 156, rate: '62.9%', pct: 63, color: '#2563eb' },
    { name: 'Proposal Sent', count: 89, rate: '35.9%', pct: 36, color: '#7c3aed' },
    { name: 'Negotiation', count: 52, rate: '21.0%', pct: 21, color: '#ea580c' },
    { name: 'Closed Won', count: 34, rate: '13.7%', pct: 14, color: '#059669' },
  ];

  winLossReasons = [
    { label: 'Price competitive', pct: 35, color: '#059669' },
    { label: 'Feature fit', pct: 28, color: '#2563eb' },
    { label: 'Budget constraints', pct: 18, color: '#dc2626' },
    { label: 'Competitor chosen', pct: 12, color: '#ea580c' },
    { label: 'Timing/priority', pct: 7, color: '#6b7280' },
  ];

  activityMetrics = [
    { label: 'Calls Made', sub: 'This month', value: '342', icon: 'call', color: '#2563eb', trend: '+12%', trendUp: true },
    { label: 'Emails Sent', sub: 'This month', value: '1,847', icon: 'mail', color: '#7c3aed', trend: '+5%', trendUp: true },
    { label: 'Meetings Held', sub: 'This month', value: '89', icon: 'event', color: '#059669', trend: '+18%', trendUp: true },
    { label: 'Proposals Sent', sub: 'This month', value: '23', icon: 'send', color: '#ea580c', trend: '-3%', trendUp: false },
    { label: 'Demos Given', sub: 'This month', value: '31', icon: 'present_to_all', color: '#0891b2', trend: '+22%', trendUp: true },
  ];
}
