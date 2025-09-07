import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideEnvironment } from '@org/environment';
import { provideDataAccess } from '@org/data-access-layer';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DELON_LOCALE, DelonLocaleModule } from '@delon/theme';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { iconsComponents } from './icon';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
    provideNoopAnimations(),
    provideDataAccess(),
    provideEnvironment({
      contexts: { api: { name: 'api/v1', port: 8000 } },
      host: 'http://localhost',
      production: false,
    }),
    provideNzIcons(iconsComponents),
    importProvidersFrom(DelonLocaleModule, NzModalModule, NzDrawerModule),
    { provide: DELON_LOCALE, useValue: {} },
  ],
};
