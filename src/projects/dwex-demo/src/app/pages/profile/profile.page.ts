import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageTitle } from 'ngx-dwex';

interface Contact {
  id: number;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  statusClass: string;
  avatar: string;
  deals: number;
  value: string;
}

@Component({
  selector: 'app-profile',
  imports: [MatIcon, MatCard, MatCardContent, MatChip, MatButton, MatIconButton, MatFormFieldModule, MatInputModule, PageTitle],
  template: `
    <dwex-page-title title="Contacts" subtitle="Manage your CRM contacts and leads">
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-icon matPrefix>search</mat-icon>
        <input matInput placeholder="Search contacts..." [value]="searchQuery()" (input)="onSearch($event)" />
      </mat-form-field>
      <button mat-raised-button color="primary">
        <mat-icon>person_add</mat-icon>
        Add Contact
      </button>
    </dwex-page-title>
    <div class="contacts-content">
      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat">
          <span class="stat-value">{{ contacts.length }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ activeCount }}</span>
          <span class="stat-label">Active</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ leadCount }}</span>
          <span class="stat-label">Leads</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ inactiveCount }}</span>
          <span class="stat-label">Inactive</span>
        </div>
      </div>

      <!-- Contacts list -->
      <div class="contacts-list">
        @for (contact of filteredContacts(); track contact.id) {
          <mat-card class="contact-card">
            <mat-card-content>
              <div class="contact-row">
                <div class="contact-avatar" [style.background-color]="contact.avatar">
                  {{ contact.name.charAt(0) }}
                </div>
                <div class="contact-info">
                  <div class="contact-name-row">
                    <span class="contact-name">{{ contact.name }}</span>
                    <mat-chip class="contact-status" [class]="contact.statusClass">{{ contact.status }}</mat-chip>
                  </div>
                  <span class="contact-role">{{ contact.role }} at {{ contact.company }}</span>
                </div>
                <div class="contact-details">
                  <div class="contact-metric">
                    <mat-icon>handshake</mat-icon>
                    <span>{{ contact.deals }} deals</span>
                  </div>
                  <div class="contact-metric">
                    <mat-icon>payments</mat-icon>
                    <span>{{ contact.value }}</span>
                  </div>
                </div>
                <div class="contact-actions">
                  <button mat-icon-button aria-label="Email">
                    <mat-icon>mail</mat-icon>
                  </button>
                  <button mat-icon-button aria-label="Call">
                    <mat-icon>call</mat-icon>
                  </button>
                  <button mat-icon-button aria-label="More">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        } @empty {
          <div class="empty-state">
            <mat-icon>person_search</mat-icon>
            <p>No contacts match "{{ searchQuery() }}"</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .contacts-content {
      padding: 8px 24px 24px;
    }

    .stats-row {
      display: flex;
      gap: 1px;
      margin-bottom: 16px;
      border-radius: var(--dwex-corner-sm, 12px);
      overflow: hidden;
      border: 1px solid var(--mat-sys-outline-variant);
    }

    .stat {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 12px;
      background: var(--mat-sys-surface-container);
    }

    .stat-value {
      font-size: 22px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .stat-label {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      margin-top: 2px;
    }

    .contacts-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .contact-card {
      border: 1px solid var(--mat-sys-outline-variant);
      cursor: pointer;
      transition: border-color 200ms cubic-bezier(0.2, 0, 0, 1),
                  box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);

      &:hover {
        border-color: var(--mat-sys-outline);
      }
    }

    .contact-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .contact-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 500;
      color: white;
      flex-shrink: 0;
    }

    .contact-info {
      flex: 1;
      min-width: 0;
    }

    .contact-name-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .contact-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .contact-role {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .contact-status {
      font-size: 11px !important;

      &.active {
        --mat-chip-background-color: var(--mat-sys-tertiary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-tertiary-container);
      }
      &.lead {
        --mat-chip-background-color: var(--mat-sys-primary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-primary-container);
      }
      &.inactive {
        --mat-chip-background-color: var(--mat-sys-surface-container-highest);
        --mat-chip-label-text-color: var(--mat-sys-on-surface-variant);
      }
    }

    .contact-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex-shrink: 0;
    }

    .contact-metric {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      white-space: nowrap;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    .contact-actions {
      display: flex;
      gap: 2px;
      flex-shrink: 0;
    }

    .empty-state {
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

    @media (max-width: 768px) {
      .contact-details,
      .contact-actions {
        display: none;
      }
    }
  `]
})
export class ProfilePage {
  searchQuery = signal('');

  contacts: Contact[] = [
    { id: 1, name: 'Sarah Chen', company: 'Acme Corp', role: 'VP Engineering', email: 'sarah@acme.com', phone: '+1 555-0101', status: 'Active', statusClass: 'active', avatar: '#7c3aed', deals: 3, value: '$142K' },
    { id: 2, name: 'James Miller', company: 'Globex Inc', role: 'CTO', email: 'james@globex.com', phone: '+1 555-0102', status: 'Active', statusClass: 'active', avatar: '#2563eb', deals: 2, value: '$186K' },
    { id: 3, name: 'María García', company: 'Initech', role: 'Procurement Manager', email: 'maria@initech.com', phone: '+1 555-0103', status: 'Lead', statusClass: 'lead', avatar: '#059669', deals: 1, value: '$67K' },
    { id: 4, name: 'David Park', company: 'Wayne Industries', role: 'CISO', email: 'david@wayne.com', phone: '+1 555-0104', status: 'Lead', statusClass: 'lead', avatar: '#dc2626', deals: 1, value: '$35K' },
    { id: 5, name: 'Emma Wilson', company: 'Umbrella LLC', role: 'Head of IT', email: 'emma@umbrella.com', phone: '+1 555-0105', status: 'Active', statusClass: 'active', avatar: '#ea580c', deals: 1, value: '$19K' },
    { id: 6, name: 'Alex Thompson', company: 'Stark Solutions', role: 'Director of Ops', email: 'alex@stark.com', phone: '+1 555-0106', status: 'Lead', statusClass: 'lead', avatar: '#0891b2', deals: 1, value: '$92K' },
    { id: 7, name: 'Priya Sharma', company: 'Oscorp', role: 'VP Product', email: 'priya@oscorp.com', phone: '+1 555-0107', status: 'Active', statusClass: 'active', avatar: '#c026d3', deals: 2, value: '$78K' },
    { id: 8, name: 'Michael Brown', company: 'LexCorp', role: 'CFO', email: 'michael@lexcorp.com', phone: '+1 555-0108', status: 'Inactive', statusClass: 'inactive', avatar: '#6b7280', deals: 0, value: '$0' },
    { id: 9, name: 'Lisa Park', company: 'Cyberdyne', role: 'Engineering Lead', email: 'lisa@cyberdyne.com', phone: '+1 555-0109', status: 'Active', statusClass: 'active', avatar: '#059669', deals: 4, value: '$215K' },
    { id: 10, name: 'Robert Kim', company: 'Hooli', role: 'Head of Security', email: 'robert@hooli.com', phone: '+1 555-0110', status: 'Inactive', statusClass: 'inactive', avatar: '#6b7280', deals: 0, value: '$0' },
  ];

  activeCount = this.contacts.filter(c => c.status === 'Active').length;
  leadCount = this.contacts.filter(c => c.status === 'Lead').length;
  inactiveCount = this.contacts.filter(c => c.status === 'Inactive').length;

  filteredContacts = signal(this.contacts);

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.searchQuery.set((event.target as HTMLInputElement).value);
    if (!query) {
      this.filteredContacts.set(this.contacts);
    } else {
      this.filteredContacts.set(this.contacts.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.company.toLowerCase().includes(query) ||
        c.role.toLowerCase().includes(query)
      ));
    }
  }
}
