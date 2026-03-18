import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';

export interface FeatureFlags {
  statistics: boolean;
  invoices: boolean;
  orders: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  statistics: false,
  invoices: false,
  orders: false
};

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private http = inject(HttpClient);
  private flags: FeatureFlags = DEFAULT_FLAGS;

  loadFlags() {
    console.log('Loading feature flags from################', environment);
    return this.http.get<FeatureFlags>(environment.featureFlagsUrl).pipe(
      tap(response => {
        console.log('Feature flags loaded:', response);
        this.flags = response;
      }),
      catchError(() => {
        this.flags = DEFAULT_FLAGS;
        console.error('Failed to load feature flags');
        return of(null);
      })
    );
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag];
  }
}