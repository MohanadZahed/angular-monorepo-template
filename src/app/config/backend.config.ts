import { ValueProvider } from '@angular/core';
import { BACKEND_CONFIG, BackendConfig } from '@angular-monorepo-template/core';
import { environment } from '../../environments/environment';

export const backendConfig: BackendConfig = {
  production: environment.production,
  rest: {
    featureFlagsUrl: environment.featureFlagsUrl,
    endpoints: {},
  },
};

export const backendConfigProvider: ValueProvider = {
  provide: BACKEND_CONFIG,
  useValue: backendConfig,
};
