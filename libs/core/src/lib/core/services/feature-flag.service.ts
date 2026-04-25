import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { BACKEND_CONFIG } from '../config/backend/backend-config.token';
import { LoggerService } from './logger.service';

export interface FeatureFlags {
  statistics: boolean;
  invoices: boolean;
  orders: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  statistics: false,
  invoices: false,
  orders: false,
};

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private http = inject(HttpClient);
  private config = inject(BACKEND_CONFIG);
  private logger = inject(LoggerService);
  private flags: FeatureFlags = DEFAULT_FLAGS;

  loadFlags() {
    this.logger.debug(
      'Loading feature flags from',
      this.config.rest.featureFlagsUrl,
    );
    return this.http.get<FeatureFlags>(this.config.rest.featureFlagsUrl).pipe(
      tap((response) => {
        this.logger.info('Feature flags loaded', response);
        this.flags = response;
      }),
      catchError(() => {
        this.flags = DEFAULT_FLAGS;
        this.logger.error('Failed to load feature flags');
        return of(null);
      }),
    );
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag];
  }
}
