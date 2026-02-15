import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatIconButton } from '@angular/material/button';
import { PageTitle } from 'ngx-dwex';

interface SharedDoc {
  id: number;
  name: string;
  icon: string;
  iconColor: string;
  sharedBy: string;
  sharedByAvatar: string;
  permission: string;
  permClass: string;
  date: string;
}

@Component({
  selector: 'app-shared',
  imports: [MatIcon, MatCard, MatCardContent, MatChip, MatIconButton, PageTitle],
  template: `
    <dwex-page-title title="Shared with Me" subtitle="Documents shared by your team and clients" />
    <div class="shared-content">
      @for (doc of sharedDocs; track doc.id) {
        <mat-card class="shared-card">
          <mat-card-content>
            <div class="shared-row">
              <mat-icon [style.color]="doc.iconColor">{{ doc.icon }}</mat-icon>
              <div class="shared-info">
                <span class="shared-name">{{ doc.name }}</span>
                <div class="shared-meta">
                  <div class="shared-avatar" [style.background-color]="doc.sharedByAvatar">
                    {{ doc.sharedBy.charAt(0) }}
                  </div>
                  <span>{{ doc.sharedBy }} • {{ doc.date }}</span>
                </div>
              </div>
              <mat-chip class="perm-chip" [class]="doc.permClass">{{ doc.permission }}</mat-chip>
              <button mat-icon-button aria-label="More options">
                <mat-icon>more_vert</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .shared-content {
      padding: 8px 24px 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .shared-card {
      border: 1px solid var(--mat-sys-outline-variant);
      cursor: pointer;
      transition: border-color 200ms cubic-bezier(0.2, 0, 0, 1);

      &:hover {
        border-color: var(--mat-sys-outline);
      }
    }

    .shared-row {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .shared-info {
      flex: 1;
      min-width: 0;
    }

    .shared-name {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .shared-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 2px;
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .shared-avatar {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
      font-weight: 500;
    }

    .perm-chip {
      font-size: 11px !important;
      flex-shrink: 0;

      &.edit {
        --mat-chip-background-color: var(--mat-sys-primary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-primary-container);
      }
      &.view {
        --mat-chip-background-color: var(--mat-sys-surface-container-highest);
        --mat-chip-label-text-color: var(--mat-sys-on-surface-variant);
      }
      &.comment {
        --mat-chip-background-color: var(--mat-sys-tertiary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-tertiary-container);
      }
    }

    @media (max-width: 768px) {
      .perm-chip {
        display: none;
      }
    }
  `]
})
export class SharedPage {
  sharedDocs: SharedDoc[] = [
    { id: 1, name: 'Q2 Sales Forecast - Final.xlsx', icon: 'table_chart', iconColor: '#059669', sharedBy: 'Sarah Chen', sharedByAvatar: '#7c3aed', permission: 'Can edit', permClass: 'edit', date: '1 hour ago' },
    { id: 2, name: 'Acme Corp - Proposal Review.pdf', icon: 'picture_as_pdf', iconColor: '#dc2626', sharedBy: 'James Miller', sharedByAvatar: '#2563eb', permission: 'Can comment', permClass: 'comment', date: '3 hours ago' },
    { id: 3, name: 'Client Onboarding Checklist.docx', icon: 'description', iconColor: '#2563eb', sharedBy: 'Priya Sharma', sharedByAvatar: '#c026d3', permission: 'Can view', permClass: 'view', date: 'Yesterday' },
    { id: 4, name: 'Commission Structure 2025.xlsx', icon: 'table_chart', iconColor: '#059669', sharedBy: 'Alex Thompson', sharedByAvatar: '#0891b2', permission: 'Can edit', permClass: 'edit', date: '2 days ago' },
    { id: 5, name: 'Competitive Analysis - Enterprise.pptx', icon: 'slideshow', iconColor: '#ea580c', sharedBy: 'Lisa Park', sharedByAvatar: '#059669', permission: 'Can view', permClass: 'view', date: '3 days ago' },
    { id: 6, name: 'Product Demo Script v4.docx', icon: 'description', iconColor: '#2563eb', sharedBy: 'Emma Wilson', sharedByAvatar: '#ea580c', permission: 'Can comment', permClass: 'comment', date: '1 week ago' },
  ];
}
