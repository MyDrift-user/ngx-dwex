import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { PageTitle } from 'ngx-dwex';

@Component({
  selector: 'app-analytics-overview',
  imports: [MatIcon, MatCard, MatCardContent, PageTitle],
  template: `
    <dwex-page-title title="Overview" subtitle="Key metrics and sales performance at a glance" />
    <div class="overview-content">
      <!-- Metric cards -->
      <div class="metrics-grid">
        @for (metric of metrics; track metric.label) {
          <mat-card class="metric-card">
            <mat-card-content>
              <div class="metric-header">
                <div class="metric-icon" [style.background-color]="metric.bg">
                  <mat-icon [style.color]="metric.color">{{ metric.icon }}</mat-icon>
                </div>
                <div class="metric-trend" [class.up]="metric.trendUp" [class.down]="!metric.trendUp">
                  <mat-icon>{{ metric.trendUp ? 'trending_up' : 'trending_down' }}</mat-icon>
                  {{ metric.trend }}
                </div>
              </div>
              <div class="metric-value">{{ metric.value }}</div>
              <div class="metric-label">{{ metric.label }}</div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <!-- Revenue chart placeholder -->
      <mat-card class="chart-card">
        <mat-card-content>
          <h3 class="chart-title">Revenue Trend</h3>
          <div class="chart-placeholder">
            <div class="chart-bars">
              @for (bar of monthlyRevenue; track bar.month) {
                <div class="bar-group">
                  <div class="bar" [style.height.%]="bar.pct" [style.background-color]="bar.color"></div>
                  <span class="bar-label">{{ bar.month }}</span>
                  <span class="bar-value">{{ bar.value }}</span>
                </div>
              }
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Two column layout -->
      <div class="two-col">
        <!-- Top deals -->
        <mat-card class="chart-card">
          <mat-card-content>
            <h3 class="chart-title">Top Performing Reps</h3>
            <div class="rep-list">
              @for (rep of topReps; track rep.name; let i = $index) {
                <div class="rep-row">
                  <span class="rep-rank">{{ i + 1 }}</span>
                  <div class="rep-avatar" [style.background-color]="rep.avatar">{{ rep.name.charAt(0) }}</div>
                  <div class="rep-info">
                    <span class="rep-name">{{ rep.name }}</span>
                    <div class="rep-bar-bg">
                      <div class="rep-bar-fill" [style.width.%]="rep.pct" [style.background-color]="rep.color"></div>
                    </div>
                  </div>
                  <span class="rep-value">{{ rep.revenue }}</span>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Pipeline by stage -->
        <mat-card class="chart-card">
          <mat-card-content>
            <h3 class="chart-title">Pipeline by Stage</h3>
            <div class="stage-list">
              @for (stage of pipelineStages; track stage.name) {
                <div class="stage-row">
                  <div class="stage-info">
                    <div class="stage-dot" [style.background-color]="stage.color"></div>
                    <span class="stage-name">{{ stage.name }}</span>
                  </div>
                  <div class="stage-stats">
                    <span class="stage-count">{{ stage.count }} deals</span>
                    <span class="stage-value">{{ stage.value }}</span>
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
    .overview-content {
      padding: 8px 24px 24px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }

    .metric-card {
      border: 1px solid var(--mat-sys-outline-variant);
    }

    .metric-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .metric-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--dwex-corner-sm, 12px);
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .metric-trend {
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

    .metric-value {
      font-size: 28px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
      line-height: 1;
    }

    .metric-label {
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
      margin-top: 4px;
    }

    .chart-card {
      border: 1px solid var(--mat-sys-outline-variant);
      margin-bottom: 16px;
    }

    .chart-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      margin: 0 0 16px;
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      height: 180px;
      padding-top: 24px;
    }

    .bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      position: relative;
    }

    .bar {
      width: 100%;
      max-width: 48px;
      border-radius: 6px 6px 0 0;
      min-height: 4px;
      transition: height 500ms cubic-bezier(0.05, 0.7, 0.1, 1);
    }

    .bar-label {
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
    }

    .bar-value {
      font-size: 10px;
      color: var(--mat-sys-on-surface-variant);
      position: absolute;
      top: -18px;
    }

    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .rep-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .rep-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .rep-rank {
      font-size: 12px;
      font-weight: 600;
      color: var(--mat-sys-on-surface-variant);
      width: 16px;
      text-align: center;
    }

    .rep-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 500;
      color: white;
      flex-shrink: 0;
    }

    .rep-info {
      flex: 1;
      min-width: 0;
    }

    .rep-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .rep-bar-bg {
      height: 4px;
      border-radius: 2px;
      background: var(--mat-sys-surface-container-highest);
      margin-top: 4px;
    }

    .rep-bar-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 500ms cubic-bezier(0.05, 0.7, 0.1, 1);
    }

    .rep-value {
      font-size: 13px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
      white-space: nowrap;
    }

    .stage-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .stage-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .stage-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .stage-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .stage-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .stage-stats {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stage-count {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .stage-value {
      font-size: 13px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
      min-width: 60px;
      text-align: right;
    }

    @media (max-width: 768px) {
      .two-col {
        grid-template-columns: 1fr;
      }

      .bar-value {
        display: none;
      }
    }
  `]
})
export class OverviewPage {
  metrics = [
    { label: 'Total Revenue', value: '$1.2M', icon: 'payments', trend: '+12%', trendUp: true, bg: '#059669  20', color: '#059669' },
    { label: 'New Deals', value: '34', icon: 'handshake', trend: '+8%', trendUp: true, bg: '#2563eb20', color: '#2563eb' },
    { label: 'Win Rate', value: '68%', icon: 'emoji_events', trend: '+3%', trendUp: true, bg: '#7c3aed20', color: '#7c3aed' },
    { label: 'Avg Deal Size', value: '$35K', icon: 'trending_up', trend: '-2%', trendUp: false, bg: '#ea580c20', color: '#ea580c' },
  ];

  monthlyRevenue = [
    { month: 'Jul', value: '$68K', pct: 34, color: 'var(--mat-sys-primary-container)' },
    { month: 'Aug', value: '$92K', pct: 46, color: 'var(--mat-sys-primary-container)' },
    { month: 'Sep', value: '$78K', pct: 39, color: 'var(--mat-sys-primary-container)' },
    { month: 'Oct', value: '$114K', pct: 57, color: 'var(--mat-sys-primary-container)' },
    { month: 'Nov', value: '$98K', pct: 49, color: 'var(--mat-sys-primary-container)' },
    { month: 'Dec', value: '$145K', pct: 73, color: 'var(--mat-sys-primary)' },
    { month: 'Jan', value: '$132K', pct: 66, color: 'var(--mat-sys-primary)' },
    { month: 'Feb', value: '$156K', pct: 78, color: 'var(--mat-sys-primary)' },
    { month: 'Mar', value: '$168K', pct: 84, color: 'var(--mat-sys-primary)' },
    { month: 'Apr', value: '$142K', pct: 71, color: 'var(--mat-sys-primary)' },
    { month: 'May', value: '$189K', pct: 95, color: 'var(--mat-sys-primary)' },
    { month: 'Jun', value: '$200K', pct: 100, color: 'var(--mat-sys-primary)' },
  ];

  topReps = [
    { name: 'Sarah Chen', revenue: '$342K', pct: 100, avatar: '#7c3aed', color: '#7c3aed' },
    { name: 'James Miller', revenue: '$298K', pct: 87, avatar: '#2563eb', color: '#2563eb' },
    { name: 'Lisa Park', revenue: '$264K', pct: 77, avatar: '#059669', color: '#059669' },
    { name: 'Alex Thompson', revenue: '$215K', pct: 63, avatar: '#0891b2', color: '#0891b2' },
    { name: 'Priya Sharma', revenue: '$189K', pct: 55, avatar: '#c026d3', color: '#c026d3' },
  ];

  pipelineStages = [
    { name: 'Prospecting', count: 12, value: '$180K', color: '#6b7280' },
    { name: 'Qualification', count: 8, value: '$240K', color: '#2563eb' },
    { name: 'Proposal', count: 6, value: '$420K', color: '#7c3aed' },
    { name: 'Negotiation', count: 4, value: '$310K', color: '#ea580c' },
    { name: 'Closed Won', count: 17, value: '$890K', color: '#059669' },
    { name: 'Closed Lost', count: 5, value: '$175K', color: '#dc2626' },
  ];
}
