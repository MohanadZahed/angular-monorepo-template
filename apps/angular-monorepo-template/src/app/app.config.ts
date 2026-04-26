import {
  ApplicationConfig,
  ErrorHandler,
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
import {
  FeatureFlagService,
  GlobalErrorHandler,
  WebVitalsService,
} from '@angular-monorepo-template/core';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { backendConfigProvider } from './config/backend.config';
import {
  authInterceptor,
  errorInterceptor,
} from '@angular-monorepo-template/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor]),
    ),
    provideAppInitializer(() => {
      const featureFlagService = inject(FeatureFlagService);
      return featureFlagService.loadFlags();
    }),
    provideAppInitializer(() => inject(WebVitalsService).start()),
    backendConfigProvider,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
