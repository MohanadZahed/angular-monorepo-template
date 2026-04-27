import { DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { signalStore, withHooks, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { BACKEND_CONFIG } from '../config';
import { UserAuthService } from '../services/user-auth.service';
import { RealtimeService } from '../services/realtime.service';
import { withBaseStore } from './with-base-store';

export interface OrderData {
  id: string;
  customer: string;
  items: number;
  amount: number;
  status: string;
  date: string;
}

function sortNewestFirst(list: OrderData[]): OrderData[] {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const OrdersDataStore = signalStore(
  { providedIn: 'root' },
  withBaseStore<OrderData[]>(() => {
    const http = inject(HttpClient);
    const config = inject(BACKEND_CONFIG);
    return () => http.get<OrderData[]>(config.rest.ordersUrl);
  }),
  withMethods((store) => ({
    setOrders(orders: OrderData[]) {
      patchState(store, { data: orders, loaded: true });
    },
  })),
  withHooks((store) => ({
    onInit() {
      const auth = inject(UserAuthService);
      const realtime = inject(RealtimeService);
      const destroyRef = inject(DestroyRef);

      effect(() => {
        if (!auth.isLoggedIn()) store.reset();
      });

      realtime.events$
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe((event) => {
          const current = store.data() ?? [];
          if (event.type === 'order:created') {
            if (current.some((o) => o.id === event.payload.id)) return;
            patchState(store, {
              data: sortNewestFirst([event.payload, ...current]),
              loaded: true,
            });
          } else if (event.type === 'order:updated') {
            const idx = current.findIndex((o) => o.id === event.payload.id);
            if (idx === -1) return;
            const next = [...current];
            next[idx] = event.payload;
            patchState(store, { data: next });
          } else if (event.type === 'order:deleted') {
            patchState(store, {
              data: current.filter((o) => o.id !== event.payload.id),
            });
          }
        });
    },
  })),
);
