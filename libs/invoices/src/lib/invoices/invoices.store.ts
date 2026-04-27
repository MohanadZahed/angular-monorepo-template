import { computed, effect, inject } from '@angular/core';
import { signalStore, withComputed, withHooks } from '@ngrx/signals';
import {
  UserAuthService,
  withBaseStore,
} from '@angular-monorepo-template/core';
import { Invoice, InvoicesService } from './invoices.service';

export const InvoicesStore = signalStore(
  { providedIn: 'root' },
  withBaseStore<Invoice[]>(() => {
    const svc = inject(InvoicesService);
    return () => svc.load();
  }),
  withComputed(({ data }) => ({
    invoices: computed<Invoice[]>(() => data() ?? []),
  })),
  withHooks((store) => ({
    onInit() {
      const auth = inject(UserAuthService);
      effect(() => {
        if (!auth.isLoggedIn()) store.reset();
      });
    },
  })),
);
