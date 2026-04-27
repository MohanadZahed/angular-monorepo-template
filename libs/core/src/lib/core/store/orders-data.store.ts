import { effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signalStore, withHooks, withMethods } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { BACKEND_CONFIG } from '../config';
import { UserAuthService } from '../services/user-auth.service';
import { withBaseStore } from './with-base-store';

export interface OrderData {
  id: string;
  customer: string;
  items: number;
  amount: number;
  status: string;
  date: string;
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
      effect(() => {
        if (!auth.isLoggedIn()) store.reset();
      });
    },
  })),
);
