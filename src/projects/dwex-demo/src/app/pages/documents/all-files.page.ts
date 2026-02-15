import { Component, signal, computed } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChip } from '@angular/material/chips';
import { PageTitle } from 'ngx-dwex';

interface CrmFile {
  id: number;
  name: string;
  icon: string;
  iconColor: string;
  type: string;
  typeClass: string;
  client: string;
  size: string;
  modified: string;
}

@Component({
  selector: 'app-all-files',
  imports: [MatIcon, MatFormFieldModule, MatInputModule, MatButtonModule, MatChip, PageTitle],
  template: `
    <dwex-page-title title="All Files" subtitle="Browse proposals, contracts, invoices, and more">
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-icon matPrefix>search</mat-icon>
        <input matInput placeholder="Search files..." [value]="searchQuery()" (input)="onSearchInput($event)" />
      </mat-form-field>
      <button mat-raised-button color="primary">
        <mat-icon>upload_file</mat-icon>
        Upload
      </button>
    </dwex-page-title>
    <div class="files-content">
      <!-- Filter chips -->
      <div class="filter-row">
        @for (f of filters; track f) {
          <mat-chip
            [class.selected]="activeFilter() === f"
            (click)="setFilter(f)">
            {{ f }}
          </mat-chip>
        }
      </div>

      <!-- File list -->
      <div class="file-list">
        @for (file of filteredFiles(); track file.id) {
          <div class="file-row">
            <mat-icon [style.color]="file.iconColor">{{ file.icon }}</mat-icon>
            <div class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-meta">{{ file.client }} • {{ file.size }}</span>
            </div>
            <mat-chip class="type-chip" [class]="file.typeClass">{{ file.type }}</mat-chip>
            <span class="file-date">{{ file.modified }}</span>
          </div>
        } @empty {
          <div class="empty-state">
            <mat-icon>search_off</mat-icon>
            <p>No files found</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .files-content {
      padding: 0 24px 24px;
    }

    .filter-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;

      mat-chip {
        cursor: pointer;

        &.selected {
          --mat-chip-background-color: var(--mat-sys-primary);
          --mat-chip-label-text-color: var(--mat-sys-on-primary);
        }
      }
    }

    .file-list {
      display: flex;
      flex-direction: column;
    }

    .file-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      border-radius: var(--dwex-corner-sm, 12px);
      cursor: pointer;
      transition: background-color 200ms cubic-bezier(0.2, 0, 0, 1);

      &:hover {
        background-color: color-mix(in srgb, var(--mat-sys-on-surface) 5%, transparent);
      }
    }

    .file-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .file-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-meta {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .type-chip {
      font-size: 11px !important;
      flex-shrink: 0;

      &.proposal {
        --mat-chip-background-color: var(--mat-sys-primary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-primary-container);
      }
      &.contract {
        --mat-chip-background-color: var(--mat-sys-tertiary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-tertiary-container);
      }
      &.invoice {
        --mat-chip-background-color: var(--mat-sys-secondary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-secondary-container);
      }
      &.other {
        --mat-chip-background-color: var(--mat-sys-surface-container-highest);
        --mat-chip-label-text-color: var(--mat-sys-on-surface-variant);
      }
    }

    .file-date {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      white-space: nowrap;
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
      .type-chip,
      .file-date {
        display: none;
      }
    }
  `]
})
export class AllFilesPage {
  searchQuery = signal('');
  activeFilter = signal('All');
  filters = ['All', 'Proposals', 'Contracts', 'Invoices', 'Other'];

  files: CrmFile[] = [
    { id: 1, name: 'Acme Corp - Enterprise License Proposal.pdf', icon: 'picture_as_pdf', iconColor: '#dc2626', type: 'Proposal', typeClass: 'proposal', client: 'Acme Corp', size: '2.4 MB', modified: '2 hours ago' },
    { id: 2, name: 'Globex Inc - Service Agreement v3.docx', icon: 'description', iconColor: '#2563eb', type: 'Contract', typeClass: 'contract', client: 'Globex Inc', size: '1.1 MB', modified: '5 hours ago' },
    { id: 3, name: 'INV-2025-0047 Wayne Industries.pdf', icon: 'receipt_long', iconColor: '#059669', type: 'Invoice', typeClass: 'invoice', client: 'Wayne Industries', size: '340 KB', modified: 'Yesterday' },
    { id: 4, name: 'Cyberdyne Systems - Platform Migration.pdf', icon: 'picture_as_pdf', iconColor: '#dc2626', type: 'Proposal', typeClass: 'proposal', client: 'Cyberdyne', size: '4.7 MB', modified: 'Yesterday' },
    { id: 5, name: 'Oscorp - NDA (Signed).pdf', icon: 'verified', iconColor: '#7c3aed', type: 'Contract', typeClass: 'contract', client: 'Oscorp', size: '520 KB', modified: '2 days ago' },
    { id: 6, name: 'INV-2025-0046 Stark Solutions.pdf', icon: 'receipt_long', iconColor: '#059669', type: 'Invoice', typeClass: 'invoice', client: 'Stark Solutions', size: '290 KB', modified: '2 days ago' },
    { id: 7, name: 'Pricing Guide 2025.xlsx', icon: 'table_chart', iconColor: '#059669', type: 'Other', typeClass: 'other', client: 'Internal', size: '1.8 MB', modified: '3 days ago' },
    { id: 8, name: 'Initech - Custom Integration Proposal.pdf', icon: 'picture_as_pdf', iconColor: '#dc2626', type: 'Proposal', typeClass: 'proposal', client: 'Initech', size: '3.2 MB', modified: '4 days ago' },
    { id: 9, name: 'LexCorp - Master Service Agreement.docx', icon: 'description', iconColor: '#2563eb', type: 'Contract', typeClass: 'contract', client: 'LexCorp', size: '1.5 MB', modified: '5 days ago' },
    { id: 10, name: 'INV-2025-0045 Umbrella LLC.pdf', icon: 'receipt_long', iconColor: '#059669', type: 'Invoice', typeClass: 'invoice', client: 'Umbrella LLC', size: '310 KB', modified: '5 days ago' },
    { id: 11, name: 'Hooli - Security Assessment Proposal.pdf', icon: 'picture_as_pdf', iconColor: '#dc2626', type: 'Proposal', typeClass: 'proposal', client: 'Hooli', size: '5.1 MB', modified: '1 week ago' },
    { id: 12, name: 'Q1 2025 Sales Playbook.pptx', icon: 'slideshow', iconColor: '#ea580c', type: 'Other', typeClass: 'other', client: 'Internal', size: '8.2 MB', modified: '1 week ago' },
    { id: 13, name: 'INV-2025-0044 Acme Corp.pdf', icon: 'receipt_long', iconColor: '#059669', type: 'Invoice', typeClass: 'invoice', client: 'Acme Corp', size: '350 KB', modified: '1 week ago' },
    { id: 14, name: 'Stark Solutions - Phase 2 Addendum.docx', icon: 'description', iconColor: '#2563eb', type: 'Contract', typeClass: 'contract', client: 'Stark Solutions', size: '890 KB', modified: '2 weeks ago' },
    { id: 15, name: 'Commission Structure 2025.xlsx', icon: 'table_chart', iconColor: '#059669', type: 'Other', typeClass: 'other', client: 'Internal', size: '1.2 MB', modified: '2 weeks ago' },
    { id: 16, name: 'INV-2025-0043 Cyberdyne.pdf', icon: 'receipt_long', iconColor: '#059669', type: 'Invoice', typeClass: 'invoice', client: 'Cyberdyne', size: '380 KB', modified: '2 weeks ago' },
    { id: 17, name: 'Wayne Industries - Annual Renewal.docx', icon: 'description', iconColor: '#2563eb', type: 'Contract', typeClass: 'contract', client: 'Wayne Industries', size: '2.1 MB', modified: '3 weeks ago' },
    { id: 18, name: 'Competitive Analysis - Enterprise.pptx', icon: 'slideshow', iconColor: '#ea580c', type: 'Other', typeClass: 'other', client: 'Internal', size: '6.7 MB', modified: '1 month ago' },
  ];

  filteredFiles = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter();

    let result = this.files;

    if (filter !== 'All') {
      const singular = filter === 'Invoices' ? 'Invoice' : filter === 'Proposals' ? 'Proposal' : filter === 'Contracts' ? 'Contract' : 'Other';
      result = result.filter(f => f.type === singular);
    }

    if (query) {
      result = result.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.client.toLowerCase().includes(query)
      );
    }

    return result;
  });

  setFilter(filter: string) {
    this.activeFilter.set(filter);
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
}
