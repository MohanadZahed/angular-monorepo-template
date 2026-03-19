// libs/core/src/lib/guards/feature-flag.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn, Router, Route } from '@angular/router';
import { FeatureFlagService, FeatureFlags } from '../services/feature-flag.service';

export const featureFlagGuard = (flag: keyof FeatureFlags): CanMatchFn => {
  return (_route: Route) => {
    const featureFlagService = inject(FeatureFlagService);
    const router = inject(Router);

    return featureFlagService.isEnabled(flag)
      ? true
      : router.createUrlTree(['/not-found']);
  };
}