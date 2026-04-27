import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { tap } from 'rxjs/operators';
import { OrdersDataStore } from '@angular-monorepo-template/core';
import {
  AddOrderInput,
  OrderView,
  ORDER_CURRENCY,
  ORDER_DATE,
  ORDER_STATUS_BADGE,
  OrdersService,
} from './orders.service';

export const OrdersStore = signalStore(
  { providedIn: 'root' },
  withComputed(() => {
    const ds = inject(OrdersDataStore);
    return {
      data: ds.data,
      loading: ds.loading,
      error: ds.error,
      loaded: ds.loaded,
      queryState: ds.queryState,
      orders: computed<OrderView[]>(() =>
        (ds.data() ?? []).map((o) => ({
          ...o,
          status: o.status as OrderView['status'],
          amountDisplay: ORDER_CURRENCY.format(o.amount),
          dateDisplay: ORDER_DATE.format(new Date(o.date)),
          badgeClass:
            ORDER_STATUS_BADGE[o.status as OrderView['status']] ??
            'badge--info',
        })),
      ),
    };
  }),
  withMethods(() => {
    const ds = inject(OrdersDataStore);
    const svc = inject(OrdersService);
    return {
      load: () => ds.load(),
      reload: () => ds.reload(),
      reset: () => ds.reset(),
      addOrder(input: AddOrderInput) {
        return svc.addOrder(input, ds.data() ?? []).pipe(
          tap((saved) => {
            if (!saved) return;
            ds.setOrders(svc.sortNewestFirst([saved, ...(ds.data() ?? [])]));
          }),
        );
      },
    };
  }),
);
