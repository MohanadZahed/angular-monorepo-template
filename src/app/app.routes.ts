import { Route } from '@angular/router';

export const appRoutes: Route[] = [];

/* import { Routes } from '@angular/router';
import { featureFlagGuard } from '@angular-monorepo-template/core';

export const routes: Routes = [
  {
    path: 'statistics',
    canMatch: [featureFlagGuard('statistics')],
    loadComponent: () =>
      import('@angular-monorepo-template/statistics').then((m) => m.StatisticsComponent),
  },
  {
    path: 'invoices',
    canMatch: [featureFlagGuard('invoices')],
    loadComponent: () =>
      import('@angular-monorepo-template/invoices').then((m) => m.InvoicesComponent),
  },
  {
    path: 'orders',
    canMatch: [featureFlagGuard('orders')],
    loadComponent: () =>
      import('@angular-monorepo-template/orders').then((m) => m.OrdersComponent),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('@angular-monorepo-template/shared-ui').then((m) => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
]; */
