import { Injectable, signal, inject, effect } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

export interface SwUpdateInfo {
  available: boolean;
  current: string;
  available_version: string;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private swUpdate = inject(SwUpdate, { optional: true });
  
  // Online/Offline status
  isOnline = signal<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  
  // Update available signal
  updateAvailable = signal<boolean>(false);
  
  // Current and available version info
  versionInfo = signal<SwUpdateInfo | null>(null);

  constructor() {
    this.setupOnlineOfflineListeners();
    this.setupServiceWorkerUpdateListener();
    this.setupPeriodicUpdateChecks();
  }

  /**
   * Setup listeners for online/offline events
   */
  private setupOnlineOfflineListeners(): void {
    if (typeof window === 'undefined') return;

    // Listen to online/offline events
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }

  /**
   * Setup listener for service worker updates using Angular's SwUpdate
   */
  private setupServiceWorkerUpdateListener(): void {
    if (!this.swUpdate || !this.swUpdate.isEnabled) {
      console.log('Service Worker updates are not enabled');
      return;
    }

    // Listen for version updates
    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(event => {
        console.log('New version available:', event.latestVersion);
        this.updateAvailable.set(true);
        this.versionInfo.set({
          available: true,
          current: event.currentVersion.hash,
          available_version: event.latestVersion.hash
        });
      });

    // Check for unrecoverable state
    this.swUpdate.unrecoverable.subscribe(event => {
      console.error('Service Worker in unrecoverable state:', event.reason);
      alert(
        'An error occurred that we cannot recover from:\n' +
        event.reason +
        '\n\nPlease reload the page.'
      );
    });

    // Check for updates on initialization
    if (this.swUpdate.isEnabled) {
      this.checkForUpdates();
    }
  }

  /**
   * Setup periodic update checks (every 60 seconds)
   */
  private setupPeriodicUpdateChecks(): void {
    if (!this.swUpdate || !this.swUpdate.isEnabled) {
      return;
    }

    // Check for updates every 60 seconds
    setInterval(() => {
      this.checkForUpdates();
    }, 60 * 1000);

    // Also check when page becomes visible again
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.swUpdate?.isEnabled) {
          this.checkForUpdates();
        }
      });
    }
  }

  /**
   * Manually check for service worker updates
   */
  async checkForUpdates(): Promise<boolean> {
    if (!this.swUpdate || !this.swUpdate.isEnabled) {
      return false;
    }

    try {
      const updateFound = await this.swUpdate.checkForUpdate();
      console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
      return updateFound;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return false;
    }
  }

  /**
   * Activate pending service worker update and reload the page
   */
  async activateUpdate(): Promise<void> {
    if (!this.swUpdate || !this.swUpdate.isEnabled) {
      console.warn('Service Worker is not enabled');
      return;
    }

    try {
      await this.swUpdate.activateUpdate();
      // Reload the page to apply the update
      document.location.reload();
    } catch (error) {
      console.error('Failed to activate update:', error);
    }
  }

  /**
   * Check if service worker is enabled
   */
  get isServiceWorkerEnabled(): boolean {
    return this.swUpdate?.isEnabled ?? false;
  }
}
