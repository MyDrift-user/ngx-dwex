import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChip } from '@angular/material/chips';
import { PageTitle } from 'ngx-dwex';

interface Template {
  id: number;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  category: string;
  categoryClass: string;
  lastUsed: string;
  uses: number;
}

@Component({
  selector: 'app-templates',
  imports: [MatIcon, MatCard, MatCardContent, MatButton, MatIconButton, MatChip, PageTitle],
  template: `
    <dwex-page-title title="Templates" subtitle="Reusable document templates for proposals, contracts, and more">
      <button mat-raised-button color="primary">
        <mat-icon>add</mat-icon>
        New Template
      </button>
    </dwex-page-title>
    <div class="templates-content">
      <div class="templates-grid">
        @for (tmpl of templates; track tmpl.id) {
          <mat-card class="template-card">
            <mat-card-content>
              <div class="template-icon" [style.color]="tmpl.iconColor">
                <mat-icon>{{ tmpl.icon }}</mat-icon>
              </div>
              <div class="template-body">
                <span class="template-name">{{ tmpl.name }}</span>
                <span class="template-desc">{{ tmpl.description }}</span>
              </div>
              <div class="template-footer">
                <mat-chip class="template-cat" [class]="tmpl.categoryClass">{{ tmpl.category }}</mat-chip>
                <div class="template-meta">
                  <span class="template-uses">{{ tmpl.uses }} uses</span>
                  <span class="template-sep">•</span>
                  <span class="template-date">{{ tmpl.lastUsed }}</span>
                </div>
              </div>
              <div class="template-actions">
                <button mat-button color="primary">
                  <mat-icon>content_copy</mat-icon>
                  Use Template
                </button>
                <button mat-icon-button aria-label="More options">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .templates-content {
      padding: 8px 24px 24px;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }

    .template-card {
      border: 1px solid var(--mat-sys-outline-variant);
      transition: border-color 200ms cubic-bezier(0.2, 0, 0, 1),
                  box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);

      &:hover {
        border-color: var(--mat-sys-outline);
      }
    }

    .template-icon {
      margin-bottom: 10px;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
    }

    .template-body {
      margin-bottom: 12px;
    }

    .template-name {
      display: block;
      font-size: 15px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      margin-bottom: 4px;
    }

    .template-desc {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.5;
    }

    .template-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--mat-sys-outline-variant);
    }

    .template-cat {
      font-size: 11px !important;

      &.proposal {
        --mat-chip-background-color: var(--mat-sys-primary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-primary-container);
      }
      &.contract {
        --mat-chip-background-color: var(--mat-sys-tertiary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-tertiary-container);
      }
      &.email {
        --mat-chip-background-color: var(--mat-sys-secondary-container);
        --mat-chip-label-text-color: var(--mat-sys-on-secondary-container);
      }
      &.invoice {
        --mat-chip-background-color: var(--mat-sys-surface-container-highest);
        --mat-chip-label-text-color: var(--mat-sys-on-surface-variant);
      }
    }

    .template-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
    }

    .template-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `]
})
export class TemplatesPage {
  templates: Template[] = [
    {
      id: 1,
      name: 'Enterprise Proposal',
      description: 'Full-featured proposal for enterprise clients with scope, pricing, and timeline sections.',
      icon: 'description',
      iconColor: '#7c3aed',
      category: 'Proposal',
      categoryClass: 'proposal',
      lastUsed: '2 days ago',
      uses: 34,
    },
    {
      id: 2,
      name: 'Standard SaaS Agreement',
      description: 'Master service agreement template for SaaS subscription products.',
      icon: 'gavel',
      iconColor: '#2563eb',
      category: 'Contract',
      categoryClass: 'contract',
      lastUsed: '1 week ago',
      uses: 28,
    },
    {
      id: 3,
      name: 'SMB Quick Proposal',
      description: 'Streamlined one-page proposal for small to mid-size business deals.',
      icon: 'bolt',
      iconColor: '#ea580c',
      category: 'Proposal',
      categoryClass: 'proposal',
      lastUsed: '3 days ago',
      uses: 47,
    },
    {
      id: 4,
      name: 'Follow-Up Email',
      description: 'Post-demo follow-up with next steps, pricing summary, and CTA.',
      icon: 'mail',
      iconColor: '#0891b2',
      category: 'Email',
      categoryClass: 'email',
      lastUsed: 'Yesterday',
      uses: 112,
    },
    {
      id: 5,
      name: 'Non-Disclosure Agreement',
      description: 'Mutual NDA template for pre-sales technical discussions.',
      icon: 'shield',
      iconColor: '#059669',
      category: 'Contract',
      categoryClass: 'contract',
      lastUsed: '5 days ago',
      uses: 19,
    },
    {
      id: 6,
      name: 'Monthly Invoice',
      description: 'Standard invoice template with line items, tax, and payment terms.',
      icon: 'receipt_long',
      iconColor: '#059669',
      category: 'Invoice',
      categoryClass: 'invoice',
      lastUsed: '1 day ago',
      uses: 86,
    },
    {
      id: 7,
      name: 'Renewal Proposal',
      description: 'Contract renewal template highlighting usage growth and ROI.',
      icon: 'autorenew',
      iconColor: '#c026d3',
      category: 'Proposal',
      categoryClass: 'proposal',
      lastUsed: '2 weeks ago',
      uses: 15,
    },
    {
      id: 8,
      name: 'Cold Outreach',
      description: 'Initial outreach email for prospecting new enterprise leads.',
      icon: 'campaign',
      iconColor: '#dc2626',
      category: 'Email',
      categoryClass: 'email',
      lastUsed: 'Today',
      uses: 203,
    },
  ];
}
