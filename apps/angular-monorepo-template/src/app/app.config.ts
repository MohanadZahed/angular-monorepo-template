import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { FeatureFlagService } from '@angular-monorepo-template/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { backendConfigProvider } from './config/backend.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    provideAppInitializer(() => {
      const featureFlagService = inject(FeatureFlagService);
      return featureFlagService.loadFlags();
    }),
    backendConfigProvider,
  ],
};
