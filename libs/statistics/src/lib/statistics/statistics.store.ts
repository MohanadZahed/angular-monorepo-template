import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { OrderData, OrdersDataStore } from '@angular-monorepo-template/core';
import {
  DailyBucket,
  STATISTICS_CURRENCY,
  StatusBucket,
} from './statistics.service';

export const StatisticsStore = signalStore(
  { providedIn: 'root' },
  withComputed(() => {
    const ds = inject(OrdersDataStore);
    const loading = ds.loading;
    const error = ds.error;
    const orders = computed<OrderData[]>(() => ds.data() ?? []);
    const totalOrders = computed(() => orders().length);
    const totalRevenue = computed(() =>
      orders()
        .filter((o) => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + o.amount, 0),
    );
    const totalRevenueDisplay = computed(() =>
      STATISTICS_CURRENCY.format(totalRevenue()),
    );
    const avgOrderValue = computed(() => {
      const list = orders().filter((o) => o.status !== 'Cancelled');
      return list.length === 0 ? 0 : totalRevenue() / list.length;
    });
    const avgOrderValueDisplay = computed(() =>
      STATISTICS_CURRENCY.format(avgOrderValue()),
    );
    const statusBreakdown = computed<StatusBucket[]>(() => {
      const map = new Map<string, number>();
      for (const o of orders()) {
        map.set(o.status, (map.get(o.status) ?? 0) + 1);
      }
      return [...map.entries()]
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count);
    });
    const dailyTotals = computed<DailyBucket[]>(() => {
      const map = new Map<string, number>();
      for (const o of orders()) {
        if (o.status === 'Cancelled') continue;
        map.set(o.date, (map.get(o.date) ?? 0) + o.amount);
      }
      return [...map.entries()]
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => (a.date < b.date ? -1 : 1));
    });
    return {
      loading,
      error,
      totalOrders,
      totalRevenue,
      totalRevenueDisplay,
      avgOrderValue,
      avgOrderValueDisplay,
      statusBreakdown,
      dailyTotals,
    };
  }),
  withMethods(() => {
    const ds = inject(OrdersDataStore);
    return {
      load: () => ds.load(),
      reload: () => ds.reload(),
    };
  }),
);
