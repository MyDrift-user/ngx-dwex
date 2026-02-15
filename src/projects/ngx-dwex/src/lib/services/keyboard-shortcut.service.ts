import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: () => void;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutService {
  private shortcuts: KeyboardShortcut[] = [];

  constructor() {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(event => {
          // Don't trigger shortcuts when typing in input fields
          const target = event.target as HTMLElement;
          return !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
        })
      )
      .subscribe(event => this.handleKeyDown(event));
  }

  register(shortcut: KeyboardShortcut): void {
    this.shortcuts.push(shortcut);
  }

  unregister(key: string, ctrl?: boolean, shift?: boolean, alt?: boolean, meta?: boolean): void {
    this.shortcuts = this.shortcuts.filter(
      s => !(s.key === key && 
             s.ctrl === ctrl && 
             s.shift === shift && 
             s.alt === alt && 
             s.meta === meta)
    );
  }

  clear(): void {
    this.shortcuts = [];
  }

  getAll(): KeyboardShortcut[] {
    return [...this.shortcuts];
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const matching = this.shortcuts.find(
      s => s.key.toLowerCase() === event.key.toLowerCase() &&
           (s.ctrl ?? false) === event.ctrlKey &&
           (s.shift ?? false) === event.shiftKey &&
           (s.alt ?? false) === event.altKey &&
           (s.meta ?? false) === event.metaKey
    );

    if (matching) {
      event.preventDefault();
      matching.callback();
    }
  }
}
