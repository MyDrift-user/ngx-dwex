import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, CdkDrag, CdkDragPreview, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { PageTitle } from 'ngx-dwex';

interface Deal {
  id: number;
  name: string;
  company: string;
  value: number;
  owner: string;
  ownerAvatar: string;
  daysInStage: number;
  probability: number;
}

interface Stage {
  id: string;
  label: string;
  color: string;
  deals: Deal[];
}

@Component({
  selector: 'app-deal-dialog',
  imports: [MatButton, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ isEdit ? 'edit' : 'add_circle' }}</mat-icon>
      {{ isEdit ? 'Edit Deal' : 'New Deal' }}
    </h2>
    <mat-dialog-content>
      <div class="form-fields">
        <mat-form-field appearance="outline">
          <mat-label>Deal name</mat-label>
          <input matInput [(ngModel)]="data.name" placeholder="e.g. Cloud Migration" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Company</mat-label>
          <input matInput [(ngModel)]="data.company" placeholder="e.g. Acme Corp" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Value ($)</mat-label>
          <input matInput type="number" [(ngModel)]="data.value" placeholder="50000" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Owner</mat-label>
          <mat-select [(ngModel)]="data.owner">
            @for (o of owners; track o.name) {
              <mat-option [value]="o.name">{{ o.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Stage</mat-label>
          <mat-select [(ngModel)]="data.stageId">
            @for (s of stages; track s.id) {
              <mat-option [value]="s.id">{{ s.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="!data.name || !data.company || !data.value" (click)="submit()">
        {{ isEdit ? 'Save' : 'Create Deal' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    [mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 0;

      mat-icon {
        color: var(--mat-sys-primary);
      }
    }

    mat-dialog-content {
      overflow: visible;
      padding-top: 20px;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 340px;
    }
  `]
})
export class DealDialog {
  private dialogRef = inject(MatDialogRef<DealDialog>);
  private injectedData = inject(MAT_DIALOG_DATA) as {
    stageId: string;
    stages: { id: string; label: string }[];
    deal?: Deal;
  };

  isEdit = !!this.injectedData.deal;

  owners = [
    { name: 'Sarah Chen', color: '#7c3aed' },
    { name: 'James Miller', color: '#2563eb' },
    { name: 'Lisa Park', color: '#059669' },
    { name: 'Alex Thompson', color: '#0891b2' },
    { name: 'Emma Wilson', color: '#ea580c' },
    { name: 'Priya Sharma', color: '#c026d3' },
    { name: 'David Park', color: '#dc2626' },
    { name: 'María García', color: '#059669' },
  ];

  stages = this.injectedData.stages;

  data = this.injectedData.deal
    ? {
        name: this.injectedData.deal.name,
        company: this.injectedData.deal.company,
        value: this.injectedData.deal.value,
        owner: this.injectedData.deal.owner,
        stageId: this.injectedData.stageId,
      }
    : {
        name: '',
        company: '',
        value: 0,
        owner: this.owners[0].name,
        stageId: this.injectedData.stageId,
      };

  submit() {
    const ownerInfo = this.owners.find(o => o.name === this.data.owner);
    this.dialogRef.close({
      ...this.data,
      ownerAvatar: ownerInfo?.color ?? '#6b7280',
    });
  }
}

@Component({
  selector: 'app-deals',
  imports: [MatIcon, MatIconButton, MatButton, PageTitle, CdkDropList, CdkDropListGroup, CdkDrag, CdkDragPreview],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dwex-page-title [title]="'Deals'" [subtitle]="pipelineSubtitle()">
      <button mat-raised-button color="primary" (click)="openNewDeal()">
        <mat-icon>add</mat-icon>
        New Deal
      </button>
    </dwex-page-title>
    <div class="pipeline-content">
      <div class="pipeline-board" cdkDropListGroup>
        @for (stage of stages(); track stage.id) {
          <div class="stage-column">
            <div class="stage-header">
              <div class="stage-dot" [style.background-color]="stage.color"></div>
              <span class="stage-label">{{ stage.label }}</span>
              <span class="stage-count">{{ stage.deals.length }}</span>
            </div>
            <span class="stage-total">{{ formatCurrency(stageTotal(stage)) }}</span>
            <div class="stage-deals"
              cdkDropList
              [cdkDropListData]="stage.deals"
              [id]="stage.id"
              (cdkDropListDropped)="onDrop($event)">
              @for (deal of stage.deals; track deal.id) {
                <div class="deal-card" cdkDrag>
                  <!-- Custom lightweight preview for instant cursor tracking -->
                  <ng-template cdkDragPreview [matchSize]="true">
                    <div class="deal-preview">
                      <div class="deal-top">
                        <span class="deal-name">{{ deal.name }}</span>
                      </div>
                      <span class="deal-company">{{ deal.company }}</span>
                      <div class="deal-bottom">
                        <span class="deal-value">{{ formatCurrency(deal.value) }}</span>
                        <div class="deal-meta">
                          <span class="deal-days">{{ deal.daysInStage }}d</span>
                          <div class="deal-owner" [style.background-color]="deal.ownerAvatar">
                            {{ deal.owner.charAt(0) }}
                          </div>
                        </div>
                      </div>
                      <div class="deal-prob-bar">
                        <div class="deal-prob-fill" [style.width.%]="deal.probability" [style.background-color]="stage.color"></div>
                      </div>
                    </div>
                  </ng-template>
                  <div class="deal-top">
                    <span class="deal-name">{{ deal.name }}</span>
                    <div class="deal-actions">
                      <button mat-icon-button class="deal-menu" (click)="editDeal(stage, deal); $event.stopPropagation()">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button class="deal-menu" (click)="removeDeal(stage, deal); $event.stopPropagation()">
                        <mat-icon>close</mat-icon>
                      </button>
                    </div>
                  </div>
                  <span class="deal-company">{{ deal.company }}</span>
                  <div class="deal-bottom">
                    <span class="deal-value">{{ formatCurrency(deal.value) }}</span>
                    <div class="deal-meta">
                      <span class="deal-days">{{ deal.daysInStage }}d</span>
                      <div class="deal-owner" [style.background-color]="deal.ownerAvatar">
                        {{ deal.owner.charAt(0) }}
                      </div>
                    </div>
                  </div>
                  <div class="deal-prob-bar">
                    <div class="deal-prob-fill" [style.width.%]="deal.probability" [style.background-color]="stage.color"></div>
                  </div>
                </div>
              }
              @if (stage.deals.length === 0) {
                <div class="stage-empty">
                  <mat-icon>drag_indicator</mat-icon>
                  <span>Drop deals here</span>
                </div>
              }
              <button class="add-deal-btn" (click)="openNewDeal(stage.id)">
                <mat-icon>add</mat-icon>
                Add deal
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .pipeline-content {
      padding: 0 24px 24px;
      overflow-x: auto;
    }

    .pipeline-board {
      display: flex;
      gap: 12px;
      min-width: max-content;
    }

    .stage-column {
      width: 280px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
    }

    .stage-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
    }

    .stage-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .stage-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stage-count {
      font-size: 11px;
      font-weight: 600;
      color: var(--mat-sys-on-surface-variant);
      background: var(--mat-sys-surface-container-highest);
      padding: 1px 7px;
      border-radius: 10px;
    }

    .stage-total {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 10px;
    }

    .stage-deals {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 60px;
      transition: background-color 200ms ease;
      padding: 4px;
      margin: -4px;
      border-radius: var(--dwex-corner-md, 16px);
    }

    .stage-deals.cdk-drop-list-dragging {
      background: color-mix(in srgb, var(--mat-sys-primary) 5%, transparent);
    }

    .stage-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 20px 10px;
      border-radius: var(--dwex-corner-sm, 12px);
      border: 2px dashed var(--mat-sys-outline-variant);
      color: var(--mat-sys-on-surface-variant);
      opacity: 0.5;
      font-size: 12px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .deal-card {
      box-sizing: border-box;
      padding: 14px;
      border-radius: var(--dwex-corner-sm, 12px);
      background: var(--mat-sys-surface-container);
      border: 1px solid var(--mat-sys-outline-variant);
      cursor: grab;
      will-change: transform;
      /* CRITICAL: NO transition on transform — it fights CDK's direct transform manipulation and causes sluggishness */
      transition: border-color 200ms cubic-bezier(0.2, 0, 0, 1),
                  box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);

      &:hover {
        border-color: var(--mat-sys-outline);
        box-shadow: 0 2px 8px color-mix(in srgb, var(--mat-sys-shadow) 12%, transparent);
      }

      &:active {
        cursor: grabbing;
      }
    }

    /* Custom drag preview — identical sizing to .deal-card, no CSS transitions, instant cursor tracking */
    .deal-preview {
      box-sizing: border-box;
      padding: 14px;
      border-radius: var(--dwex-corner-sm, 12px);
      background: var(--mat-sys-surface-container);
      border: 1px solid var(--mat-sys-primary);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
      opacity: 0.92;
      /* No transition on transform — this is what makes it feel instant */
    }

    /* Placeholder: CDK's default placeholder auto-matches the source element's exact dimensions */
    .cdk-drag-placeholder {
      border-radius: var(--dwex-corner-sm, 12px);
      border: 1px dashed var(--mat-sys-primary) !important;
      background: color-mix(in srgb, var(--mat-sys-primary) 8%, transparent) !important;
      opacity: 1 !important;
      transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);

      /* Hide the card content — only the sized box with dashed outline shows */
      & > * {
        visibility: hidden;
      }
    }

    /* Smooth drop animation: card snaps from cursor to final position (official recommended pattern) */
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1) !important;
    }

    /* Smooth neighbor shifting while dragging (official recommended pattern) */
    .cdk-drop-list-dragging .cdk-drag {
      transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
    }

    .stage-deals.cdk-drop-list-receiving {
      background: color-mix(in srgb, var(--mat-sys-primary) 6%, transparent);
      outline: 2px dashed color-mix(in srgb, var(--mat-sys-primary) 30%, transparent);
      outline-offset: -2px;
    }

    .deal-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 4px;
    }

    .deal-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      line-height: 1.3;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .deal-actions {
      display: flex;
      margin: -8px -8px 0 0;
      opacity: 0;
      transition: opacity 150ms ease;

      .deal-card:hover & {
        opacity: 1;
      }
    }

    .deal-menu {
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .deal-company {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      display: block;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .deal-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .deal-value {
      font-size: 15px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .deal-meta {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .deal-days {
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
    }

    .deal-owner {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: white;
    }

    .deal-prob-bar {
      height: 3px;
      border-radius: 2px;
      background: var(--mat-sys-surface-container-highest);
    }

    .deal-prob-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 400ms cubic-bezier(0.05, 0.7, 0.1, 1);
    }

    .add-deal-btn {
      all: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px;
      border-radius: var(--dwex-corner-sm, 12px);
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
      cursor: pointer;
      border: 1px dashed var(--mat-sys-outline-variant);
      transition: background-color 200ms cubic-bezier(0.2, 0, 0, 1),
                  border-color 200ms cubic-bezier(0.2, 0, 0, 1),
                  color 200ms cubic-bezier(0.2, 0, 0, 1);

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      &:hover {
        background: color-mix(in srgb, var(--mat-sys-primary) 8%, transparent);
        border-color: var(--mat-sys-primary);
        color: var(--mat-sys-primary);
      }
    }
  `]
})
export class DealsPage {
  private dialog = inject(MatDialog);
  private nextId = 19;

  stages = signal<Stage[]>([
    {
      id: 'prospecting',
      label: 'Prospecting',
      color: '#6b7280',
      deals: [
        { id: 1, name: 'IT Modernization', company: 'Hooli', value: 85000, owner: 'María García', ownerAvatar: '#059669', daysInStage: 3, probability: 15 },
        { id: 2, name: 'Security Suite Upgrade', company: 'LexCorp', value: 42000, owner: 'David Park', ownerAvatar: '#dc2626', daysInStage: 1, probability: 10 },
        { id: 3, name: 'DevOps Pipeline', company: 'Piedmont Tech', value: 53000, owner: 'Emma Wilson', ownerAvatar: '#ea580c', daysInStage: 5, probability: 20 },
      ]
    },
    {
      id: 'qualification',
      label: 'Qualification',
      color: '#2563eb',
      deals: [
        { id: 4, name: 'Analytics Platform', company: 'Initech', value: 67200, owner: 'Lisa Park', ownerAvatar: '#059669', daysInStage: 4, probability: 35 },
        { id: 5, name: 'Data Warehouse Setup', company: 'Stark Solutions', value: 92000, owner: 'Alex Thompson', ownerAvatar: '#0891b2', daysInStage: 7, probability: 40 },
        { id: 6, name: 'API Integration Suite', company: 'Cyberdyne', value: 128000, owner: 'Sarah Chen', ownerAvatar: '#7c3aed', daysInStage: 2, probability: 30 },
        { id: 7, name: 'Compliance Dashboard', company: 'Oscorp', value: 72000, owner: 'Priya Sharma', ownerAvatar: '#c026d3', daysInStage: 6, probability: 45 },
      ]
    },
    {
      id: 'proposal',
      label: 'Proposal',
      color: '#7c3aed',
      deals: [
        { id: 8, name: 'Cloud Migration Package', company: 'Globex Inc', value: 124500, owner: 'Sarah Chen', ownerAvatar: '#7c3aed', daysInStage: 5, probability: 55 },
        { id: 9, name: 'Security Audit', company: 'Wayne Industries', value: 35000, owner: 'James Miller', ownerAvatar: '#2563eb', daysInStage: 3, probability: 60 },
        { id: 10, name: 'Platform Licensing', company: 'Umbrella LLC', value: 48500, owner: 'Emma Wilson', ownerAvatar: '#ea580c', daysInStage: 8, probability: 50 },
        { id: 11, name: 'ML Infrastructure', company: 'Piedmont Tech', value: 74000, owner: 'Lisa Park', ownerAvatar: '#059669', daysInStage: 1, probability: 65 },
      ]
    },
    {
      id: 'negotiation',
      label: 'Negotiation',
      color: '#ea580c',
      deals: [
        { id: 12, name: 'Enterprise License Renewal', company: 'Acme Corp', value: 48000, owner: 'James Miller', ownerAvatar: '#2563eb', daysInStage: 2, probability: 75 },
        { id: 13, name: 'Managed Services', company: 'Globex Inc', value: 86000, owner: 'Alex Thompson', ownerAvatar: '#0891b2', daysInStage: 4, probability: 80 },
        { id: 14, name: 'SaaS Migration', company: 'Wayne Industries', value: 62000, owner: 'Sarah Chen', ownerAvatar: '#7c3aed', daysInStage: 1, probability: 85 },
      ]
    },
    {
      id: 'closed-won',
      label: 'Closed Won',
      color: '#059669',
      deals: [
        { id: 15, name: 'Support Contract', company: 'Umbrella LLC', value: 18900, owner: 'Priya Sharma', ownerAvatar: '#c026d3', daysInStage: 0, probability: 100 },
        { id: 16, name: 'Annual Platform License', company: 'Cyberdyne', value: 215000, owner: 'Lisa Park', ownerAvatar: '#059669', daysInStage: 0, probability: 100 },
        { id: 17, name: 'Consulting Retainer', company: 'Initech', value: 144000, owner: 'James Miller', ownerAvatar: '#2563eb', daysInStage: 0, probability: 100 },
        { id: 18, name: 'Infrastructure Upgrade', company: 'Acme Corp', value: 446000, owner: 'Sarah Chen', ownerAvatar: '#7c3aed', daysInStage: 0, probability: 100 },
      ]
    },
  ]);

  pipelineSubtitle = computed(() => {
    const ss = this.stages();
    const totalValue = ss.reduce((sum, s) => sum + s.deals.reduce((ds, d) => ds + d.value, 0), 0);
    const totalDeals = ss.reduce((sum, s) => sum + s.deals.length, 0);
    return `Pipeline — ${this.formatCurrency(totalValue)} total value across ${totalDeals} deals`;
  });

  stageTotal(stage: Stage): number {
    return stage.deals.reduce((sum, d) => sum + d.value, 0);
  }

  formatCurrency(value: number): string {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  }

  onDrop(event: CdkDragDrop<Deal[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      // Update probability based on new stage
      const deal = event.container.data[event.currentIndex];
      const stage = this.stages().find(s => s.id === event.container.id);
      if (stage) {
        const probMap: Record<string, number> = {
          'prospecting': 15,
          'qualification': 35,
          'proposal': 55,
          'negotiation': 80,
          'closed-won': 100,
        };
        deal.probability = probMap[stage.id] ?? 50;
        deal.daysInStage = 0;
      }
    }
    // Force signal update
    this.stages.update(s => [...s]);
  }

  removeDeal(stage: Stage, deal: Deal) {
    stage.deals.splice(stage.deals.indexOf(deal), 1);
    this.stages.update(s => [...s]);
  }

  openNewDeal(stageId = 'prospecting') {
    const ref = this.dialog.open(DealDialog, {
      data: {
        stageId,
        stages: this.stages().map(s => ({ id: s.id, label: s.label })),
      },
      width: '420px',
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const newDeal: Deal = {
        id: this.nextId++,
        name: result.name,
        company: result.company,
        value: result.value,
        owner: result.owner,
        ownerAvatar: result.ownerAvatar,
        daysInStage: 0,
        probability: { prospecting: 15, qualification: 35, proposal: 55, negotiation: 80, 'closed-won': 100 }[result.stageId as string] ?? 15,
      };
      this.stages.update(stages => {
        const target = stages.find(s => s.id === result.stageId);
        if (target) target.deals.push(newDeal);
        return [...stages];
      });
    });
  }

  editDeal(stage: Stage, deal: Deal) {
    const ref = this.dialog.open(DealDialog, {
      data: {
        stageId: stage.id,
        stages: this.stages().map(s => ({ id: s.id, label: s.label })),
        deal,
      },
      width: '420px',
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const ownerInfo = [
        { name: 'Sarah Chen', color: '#7c3aed' },
        { name: 'James Miller', color: '#2563eb' },
        { name: 'Lisa Park', color: '#059669' },
        { name: 'Alex Thompson', color: '#0891b2' },
        { name: 'Emma Wilson', color: '#ea580c' },
        { name: 'Priya Sharma', color: '#c026d3' },
        { name: 'David Park', color: '#dc2626' },
        { name: 'María García', color: '#059669' },
      ].find(o => o.name === result.owner);

      // Update deal properties
      deal.name = result.name;
      deal.company = result.company;
      deal.value = result.value;
      deal.owner = result.owner;
      deal.ownerAvatar = result.ownerAvatar ?? ownerInfo?.color ?? '#6b7280';

      // If stage changed, move the deal
      if (result.stageId !== stage.id) {
        stage.deals.splice(stage.deals.indexOf(deal), 1);
        const targetStage = this.stages().find(s => s.id === result.stageId);
        if (targetStage) {
          targetStage.deals.push(deal);
          const probMap: Record<string, number> = {
            'prospecting': 15, 'qualification': 35, 'proposal': 55, 'negotiation': 80, 'closed-won': 100,
          };
          deal.probability = probMap[result.stageId] ?? 50;
          deal.daysInStage = 0;
        }
      }

      this.stages.update(s => [...s]);
    });
  }
}
