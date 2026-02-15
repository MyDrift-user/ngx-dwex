import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'dwex-page-title',
  template: `
    <div class="dwex-page-title">
      <div class="title-content">
        <h1>{{ title() }}</h1>
        @if (subtitle()) {
          <p class="subtitle">{{ subtitle() }}</p>
        }
      </div>
      <div class="title-actions">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding-bottom: 16px;
    }
    .dwex-page-title {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
      padding: 32px 24px 24px;
      position: relative;
    }
    .dwex-page-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 24px;
      right: 24px;
      height: 1px;
      background: linear-gradient(
        90deg,
        var(--mat-sys-outline-variant) 0%,
        var(--mat-sys-outline-variant) 60%,
        transparent 100%
      );
    }
    .title-content { flex: 1; min-width: 0; }
    .dwex-page-title h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 400;
      line-height: 1.3;
      letter-spacing: -0.01em;
      color: var(--mat-sys-on-surface);
    }
    .dwex-page-title .subtitle {
      margin: 6px 0 0;
      font-size: 14px;
      line-height: 1.5;
      color: var(--mat-sys-on-surface-variant);
    }
    .title-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .title-actions:empty { display: none; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitle {
  title = input.required<string>();
  subtitle = input<string>();
}
