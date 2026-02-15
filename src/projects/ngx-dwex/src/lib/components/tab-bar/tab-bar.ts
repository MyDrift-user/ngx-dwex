import { Component, ChangeDetectionStrategy, inject, ElementRef, viewChild, signal, computed } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { TabService, Tab } from '../../services/tab.service';
import { SplitViewService } from '../../services/split-view.service';

@Component({
  selector: 'dwex-tab-bar',
  imports: [MatIcon, MatIconButton, MatDivider, MatMenuModule, MatTooltipModule, CdkDrag, CdkDropList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tabService.tabs().length > 0) {
      <div class="tab-bar">
        <div class="tab-scroll" #tabScroll
          (wheel)="onWheel($event)">
          <!-- Pinned tabs zone -->
          @if (tabService.pinnedTabs().length > 0) {
            <div class="tab-zone pinned-zone"
              cdkDropList
              cdkDropListOrientation="horizontal"
              [cdkDropListData]="'pinned'"
              (cdkDropListDropped)="onPinnedDrop($event)"
              #pinnedZone>
              @for (tab of tabService.pinnedTabs(); track tab.id) {
                <button cdkDrag cdkDragLockAxis="x" [cdkDragBoundary]="pinnedZone"
                  class="tab pinned"
                  [class.active]="tab.route === tabService.activeRoute()"
                  (click)="tabService.activate(tab.route)"
                  (auxclick)="onMiddleClick($event, tab)"
                  (contextmenu)="onContextMenu($event, tab)"
                  [matTooltip]="tab.label"
                  matTooltipShowDelay="600">
                  <mat-icon class="tab-icon">{{ tab.icon }}</mat-icon>
                </button>
              }
            </div>
            @if (tabService.unpinnedTabs().length > 0) {
              <div class="tab-divider"></div>
            }
          }
          <!-- Unpinned tabs zone -->
          <div class="tab-zone unpinned-zone"
            cdkDropList
            cdkDropListOrientation="horizontal"
            [cdkDropListData]="'unpinned'"
            (cdkDropListDropped)="onUnpinnedDrop($event)"
            #unpinnedZone>
            @for (tab of tabService.unpinnedTabs(); track tab.id) {
              <button cdkDrag cdkDragLockAxis="x" [cdkDragBoundary]="unpinnedZone"
                class="tab"
                [class.active]="tab.route === tabService.activeRoute()"
                (click)="tabService.activate(tab.route)"
                (auxclick)="onMiddleClick($event, tab)"
                (contextmenu)="onContextMenu($event, tab)"
                [matTooltip]="tab.label"
                matTooltipShowDelay="600">
                <mat-icon class="tab-icon">{{ tab.icon }}</mat-icon>
                <span class="tab-label">{{ tab.label }}</span>
                <button
                  class="tab-close"
                  (click)="closeTab($event, tab)"
                  aria-label="Close tab">
                  <mat-icon>close</mat-icon>
                </button>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Context menu (hidden trigger) -->
      <div
        class="context-trigger"
        [style.left.px]="contextPos().x"
        [style.top.px]="contextPos().y"
        [matMenuTriggerFor]="contextMenu"
        #contextTrigger="matMenuTrigger">
      </div>
      <mat-menu #contextMenu="matMenu">
        @if (contextTab(); as tab) {
          <button mat-menu-item (click)="tabService.togglePin(tab.route)">
            <mat-icon>{{ tab.pinned ? 'push_pin' : 'push_pin' }}</mat-icon>
            {{ tab.pinned ? 'Unpin Tab' : 'Pin Tab' }}
          </button>
          @if (!tab.pinned) {
            <button mat-menu-item (click)="tabService.close(tab.route)">
              <mat-icon>close</mat-icon>
              Close
            </button>
            <button mat-menu-item (click)="tabService.closeOthers(tab.route)">
              <mat-icon>tab_unselected</mat-icon>
              Close Others
            </button>
            <button mat-menu-item (click)="tabService.closeToRight(tab.route)">
              <mat-icon>tab_close_right</mat-icon>
              Close to the Right
            </button>
            <button mat-menu-item (click)="tabService.closeAll()">
              <mat-icon>close_fullscreen</mat-icon>
              Close All
            </button>
          }
          <mat-divider />
          <button mat-menu-item (click)="openTabInSplit(tab, 'vertical')">
            <mat-icon>vertical_split</mat-icon>
            Open in split view
          </button>
          <button mat-menu-item (click)="openTabInSplit(tab, 'horizontal')">
            <mat-icon>horizontal_split</mat-icon>
            Open in stacked view
          </button>
        }
      </mat-menu>
    }
  `,
  styles: [`
    :host {
      display: block;
      flex-shrink: 0;
    }

    .tab-bar {
      display: flex;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface);
      padding: 0 8px;
      gap: 2px;
    }

    .tab-scroll {
      display: flex;
      align-items: center;
      gap: 0;
      overflow-x: auto;
      flex: 1;
      height: 100%;
      scroll-behavior: smooth;

      /* Hide scrollbar but keep scrolling */
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .tab-zone {
      display: flex;
      align-items: center;
      gap: 2px;
      height: 100%;
    }

    .tab-divider {
      width: 1px;
      height: 20px;
      background: var(--mat-sys-outline-variant);
      margin: 0 4px;
      flex-shrink: 0;
    }

    .tab {
      all: unset;
      display: flex;
      align-items: center;
      gap: 6px;
      height: 32px;
      padding: 0 6px 0 10px;
      border-radius: 12px 12px 0 0;
      font-size: 13px;
      font-weight: 450;
      color: var(--mat-sys-on-surface-variant);
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      position: relative;
      box-sizing: border-box;
      transition: background-color 150ms ease,
                  color 150ms ease;

      &:hover {
        background: color-mix(in srgb, var(--mat-sys-on-surface) 6%, transparent);
        color: var(--mat-sys-on-surface);

        .tab-close {
          opacity: 1;
        }
      }

      &.active {
        color: var(--mat-sys-primary);
        background: color-mix(in srgb, var(--mat-sys-primary) 8%, transparent);

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 8px;
          right: 8px;
          height: 2px;
          border-radius: 2px 2px 0 0;
          background: var(--mat-sys-primary);
        }

        .tab-close {
          opacity: 0.7;

          &:hover {
            opacity: 1;
          }
        }
      }

      &.pinned {
        padding: 0 10px;

        .tab-label {
          display: none;
        }
      }
    }

    /* Drag-drop styles */
    .cdk-drag-preview {
      border-radius: 12px 12px 0 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      opacity: 0.9;
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
    }

    .cdk-drag-animating {
      transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
    }

    .tab-zone.cdk-drop-list-dragging .cdk-drag {
      transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
    }

    .tab-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .tab-label {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }

    .tab-close {
      all: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      opacity: 0;
      cursor: pointer;
      flex-shrink: 0;
      transition: opacity 150ms ease,
                  background-color 150ms ease;

      &:hover {
        background: color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent);
      }

      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
    }

    .context-trigger {
      position: fixed;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    /* Material menu item icon sizing */
    [mat-menu-item] mat-icon {
      margin-right: 8px;
    }
  `],
})
export class TabBar {
  readonly tabService = inject(TabService);
  private readonly splitViewService = inject(SplitViewService);

  private tabScrollEl = viewChild<ElementRef<HTMLElement>>('tabScroll');

  contextTab = signal<Tab | null>(null);
  contextPos = signal({ x: 0, y: 0 });

  private contextTrigger = viewChild<any>('contextTrigger');

  onPinnedDrop(event: CdkDragDrop<string>) {
    this.tabService.reorderPinned(event.previousIndex, event.currentIndex);
  }

  onUnpinnedDrop(event: CdkDragDrop<string>) {
    this.tabService.reorderUnpinned(event.previousIndex, event.currentIndex);
  }

  closeTab(event: MouseEvent, tab: Tab) {
    event.stopPropagation();
    this.tabService.close(tab.route);
  }

  onMiddleClick(event: MouseEvent, tab: Tab) {
    // Middle mouse button = button 1
    if (event.button === 1) {
      event.preventDefault();
      this.tabService.close(tab.route);
    }
  }

  onContextMenu(event: MouseEvent, tab: Tab) {
    event.preventDefault();
    this.contextTab.set(tab);
    this.contextPos.set({ x: event.clientX, y: event.clientY });

    // Trigger the mat-menu programmatically
    setTimeout(() => {
      const trigger = this.contextTrigger();
      if (trigger) {
        trigger.openMenu();
      }
    });
  }

  openTabInSplit(tab: Tab, orientation: 'vertical' | 'horizontal') {
    this.splitViewService.openRoute(tab.route, { orientation });
  }

  onWheel(event: WheelEvent) {
    const el = this.tabScrollEl()?.nativeElement;
    if (el) {
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    }
  }
}
