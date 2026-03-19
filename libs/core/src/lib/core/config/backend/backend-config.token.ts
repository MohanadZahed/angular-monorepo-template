import { InjectionToken } from '@angular/core';
import { BackendConfig } from './backend-config';

export const BACKEND_CONFIG = new InjectionToken<BackendConfig>('backend.config');
