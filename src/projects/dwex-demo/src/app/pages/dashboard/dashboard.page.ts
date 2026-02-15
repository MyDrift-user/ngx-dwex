import { Component, signal } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChip } from '@angular/material/chips';
import { PageTitle } from 'ngx-dwex';

interface Deal {
  name: string;
  company: string;
  value: string;
  stage: string;
  stageClass: string;
  daysAgo: number;
}

interface Activity {
  icon: string;
  text: string;
  time: string;
  iconClass: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [MatCard, MatCardContent, MatIcon, MatButton, MatIconButton, MatChip, PageTitle],
  template: `
    <dwex-page-title title="Dashboard" subtitle="Sales pipeline overview — Q1 2026">
      <button mat-raised-button color="primary">
        <mat-icon>add</mat-icon>
        New Deal
      </button>
    </dwex-page-title>
    <div class="page-content">
      <!-- KPI Cards -->
      <div class="kpi-row">
        @for (kpi of kpis; track kpi.label) {
          <div class="kpi-card">
            <div class="kpi-icon" [class]="kpi.color">
              <mat-icon>{{ kpi.icon }}</mat-icon>
            </div>
            <div class="kpi-info">
              <span class="kpi-value">{{ kpi.value }}</span>
              <span class="kpi-label">{{ kpi.label }}</span>
            </div>
            <div class="kpi-trend" [class.positive]="kpi.positive" [class.negative]="!kpi.positive">
              <mat-icon>{{ kpi.positive ? 'trending_up' : 'trending_down' }}</mat-icon>
              {{ kpi.change }}
            </div>
          </div>
        }
      </div>

      <div class="dashboard-columns">
        <!-- Deals Pipeline -->
        <mat-card class="section-card pipeline-card">
          <div class="card-header">
            <h3>
              <mat-icon>handshake</mat-icon>
              Active Deals
            </h3>
            <button mat-icon-button aria-label="More options">
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
          <mat-card-content>
            <div class="deals-list">
              @for (deal of deals; track deal.name) {
                <div class="deal-item">
                  <div class="deal-main">
                    <span class="deal-name">{{ deal.name }}</span>
                    <span class="deal-company">{{ deal.company }}</span>
                  </div>
                  <div class="deal-meta">
                    <span class="deal-value">{{ deal.value }}</span>
                    <mat-chip class="deal-stage" [class]="deal.stageClass">
                      {{ deal.stage }}
                    </mat-chip>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Activity Feed -->
        <mat-card class="section-card activity-card">
          <div class="card-header">
            <h3>
              <mat-icon>history</mat-icon>
              Recent Activity
            </h3>
            <button mat-icon-button aria-label="More options">
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
          <mat-card-content>
            <div class="activity-list">
              @for (activity of activities; track activity.text) {
                <div class="activity-item">
                  <div class="activity-icon" [class]="activity.iconClass">
                    <mat-icon>{{ activity.icon }}</mat-icon>
                  </div>
                  <div class="activity-content">
                    <span class="activity-text">{{ activity.text }}</span>
                    <span class="activity-time">{{ activity.time }}</span>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Upcoming Tasks -->
      <mat-card class="section-card">
        <div class="card-header">
          <h3>
            <mat-icon>task_alt</mat-icon>
            Upcoming Tasks
          </h3>
          <button mat-button color="primary">View All</button>
        </div>
        <mat-card-content>
          <div class="tasks-list">
            @for (task of tasks; track task.title) {
              <div class="task-item" [class.overdue]="task.overdue">
                <button class="task-check" [class.done]="task.done" (click)="task.done = !task.done">
                  <mat-icon>{{ task.done ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                </button>
                <div class="task-info">
                  <span class="task-title" [class.done]="task.done">{{ task.title }}</span>
                  <span class="task-due">
                    <mat-icon>schedule</mat-icon>
                    {{ task.due }}
                  </span>
                </div>
                <mat-chip class="task-priority" [class]="task.priorityClass">{{ task.priority }}</mat-chip>
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-content {
      padding: 8px 24px 24px;
    }

    /* KPI Row */
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px;
      margin-bottom: 16px;
    }

    .kpi-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 20px;
      border-radius: var(--dwex-corner-md, 16px);
      background: var(--mat-sys-surface-container);
      border: 1px solid var(--mat-sys-outline-variant);
      transition: background-color 200ms cubic-bezier(0.2, 0, 0, 1);
    }

    .kpi-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--dwex-corner-sm, 12px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      &.blue {
        background-color: var(--mat-sys-primary-container);
        mat-icon { color: var(--mat-sys-on-primary-container); }
      }
      &.green {
        background-color: var(--mat-sys-tertiary-container);
        mat-icon { color: var(--mat-sys-on-tertiary-container); }
      }
      &.orange {
        background-color: var(--mat-sys-secondary-container);
        mat-icon { color: var(--mat-sys-on-secondary-container); }
      }
      &.red {
        background-color: var(--mat-sys-error-container);
        mat-icon { color: var(--mat-sys-on-error-container); }
      }
    }

    .kpi-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .kpi-value {
      font-size: 22px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
      line-height: 1.2;
    }

    .kpi-label {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      white-space: nowrap;
    }

    .kpi-trend {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      font-weight: 500;
      flex-shrink: 0;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &.positive { color: #16a34a; }
      &.negative { color: var(--mat-sys-error); }
    }

    /* Layout */
    .dashboard-columns {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    @media (max-width: 900px) {
      .dashboard-columns {
        grid-template-columns: 1fr;
      }
    }

    /* Cards */
    .section-card {
      border: 1px solid var(--mat-sys-outline-variant);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px 4px;

      h3 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 500;
        color: var(--mat-sys-on-surface);

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          color: var(--mat-sys-primary);
        }
      }
    }

    /* Deals */
    .deals-list {
      display: flex;
      flex-direction: column;
    }

    .deal-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 4px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      transition: background-color 150ms ease;

      &:last-child { border-bottom: none; }
      &:hover { background-color: color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent); }
    }

    .deal-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .deal-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .deal-company {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .deal-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .deal-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
      white-space: nowrap;
    }

    .deal-stage {
      font-size: 11px !important;
      &.qualified {
        --mat-chip-background-color: var(--mat-sys-primary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-primary-container);
      }
      &.proposal {
        --mat-chip-background-color: var(--mat-sys-tertiary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-tertiary-container);
      }
      &.negotiation {
        --mat-chip-background-color: var(--mat-sys-secondary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-secondary-container);
      }
      &.closed {
        --mat-chip-background-color: #dcfce7;
        --mat-chip-label-text-color: #166534;
      }
    }

    html.dark-theme .deal-stage.closed {
      --mat-chip-background-color: #14532d;
      --mat-chip-label-text-color: #bbf7d0;
    }

    /* Activity Feed */
    .activity-list {
      display: flex;
      flex-direction: column;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 4px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);

      &:last-child { border-bottom: none; }
    }

    .activity-icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      &.email {
        background-color: var(--mat-sys-primary-container);
        mat-icon { color: var(--mat-sys-on-primary-container); }
      }
      &.call {
        background-color: var(--mat-sys-tertiary-container);
        mat-icon { color: var(--mat-sys-on-tertiary-container); }
      }
      &.deal {
        background-color: var(--mat-sys-secondary-container);
        mat-icon { color: var(--mat-sys-on-secondary-container); }
      }
      &.note {
        background-color: var(--mat-sys-surface-container-highest);
        mat-icon { color: var(--mat-sys-on-surface-variant); }
      }
    }

    .activity-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .activity-text {
      font-size: 13px;
      color: var(--mat-sys-on-surface);
      line-height: 1.4;
    }

    .activity-time {
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
      margin-top: 2px;
    }

    /* Tasks */
    .tasks-list {
      display: flex;
      flex-direction: column;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 4px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      transition: background-color 150ms ease;

      &:last-child { border-bottom: none; }
      &:hover { background-color: color-mix(in srgb, var(--mat-sys-on-surface) 3%, transparent); }
    }

    .task-check {
      all: unset;
      cursor: pointer;
      display: flex;
      color: var(--mat-sys-on-surface-variant);
      transition: color 200ms ease;

      mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      &.done {
        color: var(--mat-sys-primary);
        mat-icon { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24 !important; }
      }
    }

    .task-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .task-title {
      font-size: 14px;
      color: var(--mat-sys-on-surface);
      transition: opacity 200ms ease;

      &.done {
        text-decoration: line-through;
        opacity: 0.5;
      }
    }

    .task-due {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);

      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
    }

    .task-item.overdue .task-due {
      color: var(--mat-sys-error);
    }

    .task-priority {
      font-size: 11px !important;
      flex-shrink: 0;

      &.high {
        --mat-chip-background-color: var(--mat-sys-error-container);
        --mat-chip-label-text-color: var(--mat-sys-on-error-container);
      }
      &.medium {
        --mat-chip-background-color: var(--mat-sys-secondary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-secondary-container);
      }
      &.low {
        --mat-chip-background-color: var(--mat-sys-surface-container-highest);
        --mat-chip-label-text-color: var(--mat-sys-on-surface-variant);
      }
    }
  `]
})
export class DashboardPage {
  kpis = [
    { icon: 'payments', value: '$284K', label: 'Revenue (MTD)', change: '+12.5%', positive: true, color: 'blue' },
    { icon: 'handshake', value: '47', label: 'Active Deals', change: '+8', positive: true, color: 'green' },
    { icon: 'group', value: '1,248', label: 'Total Contacts', change: '+34', positive: true, color: 'orange' },
    { icon: 'trending_down', value: '3', label: 'Deals at Risk', change: '+1', positive: false, color: 'red' },
  ];

  deals: Deal[] = [
    { name: 'Enterprise License Renewal', company: 'Acme Corp', value: '$48,000', stage: 'Negotiation', stageClass: 'negotiation', daysAgo: 2 },
    { name: 'Cloud Migration Package', company: 'Globex Inc', value: '$124,500', stage: 'Proposal', stageClass: 'proposal', daysAgo: 5 },
    { name: 'Analytics Platform', company: 'Initech', value: '$67,200', stage: 'Qualified', stageClass: 'qualified', daysAgo: 1 },
    { name: 'Support Contract', company: 'Umbrella LLC', value: '$18,900', stage: 'Closed', stageClass: 'closed', daysAgo: 0 },
    { name: 'Security Audit', company: 'Wayne Industries', value: '$35,000', stage: 'Proposal', stageClass: 'proposal', daysAgo: 3 },
    { name: 'Data Warehouse Setup', company: 'Stark Solutions', value: '$92,000', stage: 'Qualified', stageClass: 'qualified', daysAgo: 7 },
  ];

  activities: Activity[] = [
    { icon: 'mail', text: 'Sarah Chen sent a proposal to Globex Inc for the Cloud Migration project.', time: '15 min ago', iconClass: 'email' },
    { icon: 'call', text: 'James Miller completed a discovery call with Wayne Industries.', time: '1 hour ago', iconClass: 'call' },
    { icon: 'handshake', text: 'Support Contract with Umbrella LLC moved to Closed Won.', time: '2 hours ago', iconClass: 'deal' },
    { icon: 'edit_note', text: 'Lisa Park added notes to the Initech opportunity.', time: '3 hours ago', iconClass: 'note' },
    { icon: 'mail', text: 'Follow-up email sent to Acme Corp regarding license terms.', time: '5 hours ago', iconClass: 'email' },
    { icon: 'call', text: 'Demo call scheduled with Stark Solutions for Thursday.', time: 'Yesterday', iconClass: 'call' },
  ];

  tasks = [
    { title: 'Send revised proposal to Acme Corp', due: 'Today, 5:00 PM', priority: 'High', priorityClass: 'high', overdue: false, done: false },
    { title: 'Follow up with Globex Inc decision maker', due: 'Tomorrow', priority: 'High', priorityClass: 'high', overdue: false, done: false },
    { title: 'Prepare quarterly pipeline review deck', due: 'Feb 12', priority: 'Medium', priorityClass: 'medium', overdue: false, done: false },
    { title: 'Update CRM notes for Wayne Industries', due: 'Feb 7', priority: 'Low', priorityClass: 'low', overdue: true, done: false },
    { title: 'Schedule onboarding call with Umbrella LLC', due: 'Feb 13', priority: 'Medium', priorityClass: 'medium', overdue: false, done: true },
    { title: 'Review Stark Solutions contract terms', due: 'Feb 14', priority: 'Low', priorityClass: 'low', overdue: false, done: false },
  ];
}

