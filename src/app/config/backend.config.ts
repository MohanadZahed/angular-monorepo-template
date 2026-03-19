import { ValueProvider } from '@angular/core';
import { BACKEND_CONFIG } from '../../../libs/core/src/lib/core/services/feature-flag.service';
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
