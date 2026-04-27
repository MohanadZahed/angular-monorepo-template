import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { BACKEND_CONFIG } from '../config/backend/backend-config.token';
import { LoggerService } from './logger.service';

export interface FeatureFlags {
  statistics: boolean;
  invoices: boolean;
  orders: boolean;
}

export type FeatureFlagMap = Record<string, boolean>;

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
  private readonly _flags = signal<FeatureFlagMap>({ ...DEFAULT_FLAGS });
  readonly flags = this._flags.asReadonly();

  loadFlags() {
    this.logger.debug('Loading feature flags', {
      url: this.config.rest.featureFlagsUrl,
    });
    return this.http.get<FeatureFlagMap>(this.config.rest.featureFlagsUrl).pipe(
      tap((response) => {
        this.logger.info('Feature flags loaded', { flags: response });
        this._flags.set(response);
      }),
      catchError(() => {
        this._flags.set({ ...DEFAULT_FLAGS });
        this.logger.error('Failed to load feature flags');
        return of(null);
      }),
    );
  }

  saveFlags(flags: FeatureFlagMap) {
    return this.http
      .put<FeatureFlagMap>(this.config.rest.featureFlagsUrl, flags)
      .pipe(
        tap((response) => {
          this.logger.info('Feature flags saved', { flags: response });
          this._flags.set(response ?? flags);
        }),
      );
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return !!this._flags()[flag];
  }
}
