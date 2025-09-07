import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideEnvironment } from '@org/environment';
import { provideDataAccess } from '@org/data-access-layer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideDataAccess(),
    provideEnvironment({
      contexts: { api: { name: 'api/v1', port: 8000 } },
      host: 'http://localhost',
      production: false,
    }),
  ],
};
