import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [MatIconButton, MatIcon, MatMenu, MatMenuTrigger],
  template: `
    <button 
      mat-icon-button 
      [matMenuTriggerFor]="profileMenu"
      aria-label="User profile">
      <mat-icon>account_circle</mat-icon>
    </button>

    <mat-menu #profileMenu="matMenu" xPosition="before">
      <ng-content></ng-content>
    </mat-menu>
  `,
  styles: []
})
export class ProfileButtonComponent {}

// Re-export Material components for parent use
export { MatMenuItem, MatIcon, MatDivider };