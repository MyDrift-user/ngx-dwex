import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageTitle } from 'ngx-dwex';

interface Company {
  id: number;
  name: string;
  industry: string;
  logo: string;
  logoBg: string;
  contacts: number;
  openDeals: number;
  totalRevenue: string;
  status: string;
  statusClass: string;
  lastActivity: string;
}

@Component({
  selector: 'app-companies',
  imports: [MatIcon, MatCard, MatCardContent, MatChip, MatButton, MatIconButton, MatFormFieldModule, MatInputModule, PageTitle],
  template: `
    <dwex-page-title title="Companies" subtitle="Accounts and organizations in your pipeline">
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-icon matPrefix>search</mat-icon>
        <input matInput placeholder="Search companies..." [value]="searchQuery()" (input)="onSearch($event)" />
      </mat-form-field>
      <button mat-raised-button color="primary">
        <mat-icon>domain_add</mat-icon>
        Add Company
      </button>
    </dwex-page-title>
    <div class="companies-content">
      <div class="companies-grid">
        @for (company of filteredCompanies(); track company.id) {
          <mat-card class="company-card">
            <mat-card-content>
              <div class="company-header">
                <div class="company-logo" [style.background-color]="company.logoBg">
                  {{ company.logo }}
                </div>
                <div class="company-identity">
                  <span class="company-name">{{ company.name }}</span>
                  <span class="company-industry">{{ company.industry }}</span>
                </div>
                <mat-chip class="company-status" [class]="company.statusClass">{{ company.status }}</mat-chip>
              </div>

              <div class="company-metrics">
                <div class="metric">
                  <mat-icon>people</mat-icon>
                  <span class="metric-value">{{ company.contacts }}</span>
                  <span class="metric-label">contacts</span>
                </div>
                <div class="metric">
                  <mat-icon>handshake</mat-icon>
                  <span class="metric-value">{{ company.openDeals }}</span>
                  <span class="metric-label">deals</span>
                </div>
                <div class="metric">
                  <mat-icon>payments</mat-icon>
                  <span class="metric-value">{{ company.totalRevenue }}</span>
                  <span class="metric-label">revenue</span>
                </div>
              </div>

              <div class="company-footer">
                <span class="last-activity">
                  <mat-icon>schedule</mat-icon>
                  {{ company.lastActivity }}
                </span>
                <div class="company-actions">
                  <button mat-icon-button aria-label="View details">
                    <mat-icon>open_in_new</mat-icon>
                  </button>
                  <button mat-icon-button aria-label="More options">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        } @empty {
          <div class="empty-state">
            <mat-icon>domain_disabled</mat-icon>
            <p>No companies match "{{ searchQuery() }}"</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .companies-content {
      padding: 8px 24px 24px;
    }

    .companies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 12px;
    }

    .company-card {
      border: 1px solid var(--mat-sys-outline-variant);
      cursor: pointer;
      transition: border-color 200ms cubic-bezier(0.2, 0, 0, 1),
                  box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);

      &:hover {
        border-color: var(--mat-sys-outline);
        box-shadow: 0 2px 8px color-mix(in srgb, var(--mat-sys-shadow) 8%, transparent);
      }
    }

    .company-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .company-logo {
      width: 44px;
      height: 44px;
      border-radius: var(--dwex-corner-sm, 12px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .company-identity {
      flex: 1;
      min-width: 0;
    }

    .company-name {
      display: block;
      font-size: 15px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .company-industry {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .company-status {
      font-size: 11px !important;
      flex-shrink: 0;

      &.customer {
        --mat-chip-background-color: var(--mat-sys-tertiary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-tertiary-container);
      }
      &.prospect {
        --mat-chip-background-color: var(--mat-sys-primary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-primary-container);
      }
      &.partner {
        --mat-chip-background-color: var(--mat-sys-secondary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-secondary-container);
      }
      &.churned {
        --mat-chip-background-color: var(--mat-sys-surface-container-highest);
        --mat-chip-label-text-color: var(--mat-sys-on-surface-variant);
      }
    }

    .company-metrics {
      display: flex;
      gap: 20px;
      padding: 12px 0;
      border-top: 1px solid var(--mat-sys-outline-variant);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      margin-bottom: 12px;
    }

    .metric {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    .metric-value {
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .company-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .last-activity {
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

    .company-actions {
      display: flex;
      gap: 2px;
      margin-right: -8px;
    }

    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 24px;
      color: var(--mat-sys-on-surface-variant);

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
        opacity: 0.4;
      }

      p {
        margin: 0;
        font-size: 14px;
      }
    }
  `]
})
export class CompaniesPage {
  searchQuery = signal('');

  companies: Company[] = [
    { id: 1, name: 'Acme Corp', industry: 'Technology', logo: 'AC', logoBg: '#7c3aed', contacts: 4, openDeals: 2, totalRevenue: '$494K', status: 'Customer', statusClass: 'customer', lastActivity: '2 hours ago' },
    { id: 2, name: 'Globex Inc', industry: 'Manufacturing', logo: 'GI', logoBg: '#2563eb', contacts: 3, openDeals: 2, totalRevenue: '$210K', status: 'Customer', statusClass: 'customer', lastActivity: '5 hours ago' },
    { id: 3, name: 'Initech', industry: 'Software', logo: 'IN', logoBg: '#059669', contacts: 2, openDeals: 1, totalRevenue: '$211K', status: 'Customer', statusClass: 'customer', lastActivity: '1 day ago' },
    { id: 4, name: 'Wayne Industries', industry: 'Defense & Security', logo: 'WI', logoBg: '#1e293b', contacts: 3, openDeals: 2, totalRevenue: '$97K', status: 'Prospect', statusClass: 'prospect', lastActivity: '3 hours ago' },
    { id: 5, name: 'Umbrella LLC', industry: 'Healthcare', logo: 'UL', logoBg: '#dc2626', contacts: 2, openDeals: 1, totalRevenue: '$67K', status: 'Customer', statusClass: 'customer', lastActivity: '1 day ago' },
    { id: 6, name: 'Stark Solutions', industry: 'Engineering', logo: 'SS', logoBg: '#ea580c', contacts: 2, openDeals: 1, totalRevenue: '$92K', status: 'Prospect', statusClass: 'prospect', lastActivity: '2 days ago' },
    { id: 7, name: 'Oscorp', industry: 'Biotech', logo: 'OS', logoBg: '#c026d3', contacts: 2, openDeals: 1, totalRevenue: '$72K', status: 'Prospect', statusClass: 'prospect', lastActivity: '4 days ago' },
    { id: 8, name: 'Cyberdyne', industry: 'AI & Robotics', logo: 'CY', logoBg: '#0891b2', contacts: 3, openDeals: 1, totalRevenue: '$343K', status: 'Customer', statusClass: 'customer', lastActivity: '1 day ago' },
    { id: 9, name: 'LexCorp', industry: 'Finance', logo: 'LC', logoBg: '#6b7280', contacts: 1, openDeals: 1, totalRevenue: '$42K', status: 'Prospect', statusClass: 'prospect', lastActivity: '1 week ago' },
    { id: 10, name: 'Hooli', industry: 'Cloud Services', logo: 'HO', logoBg: '#0d9488', contacts: 1, openDeals: 1, totalRevenue: '$85K', status: 'Prospect', statusClass: 'prospect', lastActivity: '3 days ago' },
    { id: 11, name: 'Piedmont Tech', industry: 'Infrastructure', logo: 'PT', logoBg: '#8b5cf6', contacts: 2, openDeals: 2, totalRevenue: '$127K', status: 'Prospect', statusClass: 'prospect', lastActivity: '5 days ago' },
    { id: 12, name: 'Vandelay Industries', industry: 'Import/Export', logo: 'VI', logoBg: '#b45309', contacts: 1, openDeals: 0, totalRevenue: '$0', status: 'Churned', statusClass: 'churned', lastActivity: '2 months ago' },
  ];

  filteredCompanies = signal(this.companies);

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.searchQuery.set((event.target as HTMLInputElement).value);
    if (!query) {
      this.filteredCompanies.set(this.companies);
    } else {
      this.filteredCompanies.set(this.companies.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.industry.toLowerCase().includes(query)
      ));
    }
  }
}
