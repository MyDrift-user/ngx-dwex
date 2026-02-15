import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, APP_INITIALIZER, inject, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { ThemeService } from 'ngx-dwex';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: true, // Enable in both dev and production for testing
      registrationStrategy: 'registerImmediately'
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const themeService = inject(ThemeService);
        return () => {
          // Theme service constructor already loads and applies the theme
        };
      },
      multi: true
    }
  ]
};
