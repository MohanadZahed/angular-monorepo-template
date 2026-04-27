import { Routes } from '@angular/router';
import {
  featureFlagGuard,
  isAdmin,
  isAuthenticated,
  redirectIfAuthenticated,
  unsavedChangesGuard,
  NotFound,
} from '@angular-monorepo-template/core';
import { NxWelcome } from './nx-welcome';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [isAuthenticated],
    component: NxWelcome,
  },
  {
    path: 'login',
    canActivate: [redirectIfAuthenticated],
    loadChildren: () => import('login/Routes').then((m) => m?.remoteRoutes),
  },
  {
    path: 'statistics',
    canMatch: [featureFlagGuard('statistics')],
    canActivate: [isAuthenticated],
    loadComponent: () =>
      import('@angular-monorepo-template/statistics').then((m) => m.Statistics),
  },
  {
    path: 'invoices',
    canMatch: [featureFlagGuard('invoices')],
    canActivate: [isAuthenticated],
    loadComponent: () =>
      import('@angular-monorepo-template/invoices').then((m) => m.Invoices),
  },
  {
    path: 'orders',
    canMatch: [featureFlagGuard('orders')],
    canActivate: [isAuthenticated],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('@angular-monorepo-template/orders').then((m) => m.Orders),
  },
  {
    path: 'admin/feature-flags',
    canActivate: [isAdmin],
    loadComponent: () =>
      import('@angular-monorepo-template/admin').then(
        (m) => m.AdminFeatureFlags,
      ),
  },
  {
    path: 'not-found',
    component: NotFound,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
