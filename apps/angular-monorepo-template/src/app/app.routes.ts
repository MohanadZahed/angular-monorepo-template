import { Routes } from '@angular/router';
import { featureFlagGuard, NotFound } from '@angular-monorepo-template/core';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', children: [] },
  {
    path: 'login',
    loadChildren: () => import('login/Routes').then((m) => m?.remoteRoutes),
  },
  {
    path: 'statistics',
    canMatch: [featureFlagGuard('statistics')],
    loadComponent: () =>
      import('@angular-monorepo-template/statistics').then((m) => m.Statistics),
  },
  {
    path: 'invoices',
    canMatch: [featureFlagGuard('invoices')],
    loadComponent: () =>
      import('@angular-monorepo-template/invoices').then((m) => m.Invoices),
  },
  {
    path: 'orders',
    canMatch: [featureFlagGuard('orders')],
    loadComponent: () =>
      import('@angular-monorepo-template/orders').then((m) => m.Orders),
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
