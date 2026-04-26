import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { BACKEND_CONFIG, LoggerService } from '@angular-monorepo-template/core';

interface RawOrder {
  id: string;
  customer: string;
  items: number;
  amount: number;
  status: string;
  date: string;
}

export interface StatusBucket {
  status: string;
  count: number;
}

export interface DailyBucket {
  date: string;
  total: number;
}

const CURRENCY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private http = inject(HttpClient);
  private config = inject(BACKEND_CONFIG);
  private logger = inject(LoggerService);

  private orders = signal<RawOrder[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly totalOrders = computed(() => this.orders().length);

  readonly totalRevenue = computed(() =>
    this.orders()
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.amount, 0),
  );

  readonly totalRevenueDisplay = computed(() =>
    CURRENCY.format(this.totalRevenue()),
  );

  readonly avgOrderValue = computed(() => {
    const list = this.orders().filter((o) => o.status !== 'Cancelled');
    return list.length === 0 ? 0 : this.totalRevenue() / list.length;
  });

  readonly avgOrderValueDisplay = computed(() =>
    CURRENCY.format(this.avgOrderValue()),
  );

  readonly statusBreakdown = computed<StatusBucket[]>(() => {
    const map = new Map<string, number>();
    for (const o of this.orders()) {
      map.set(o.status, (map.get(o.status) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  });

  readonly dailyTotals = computed<DailyBucket[]>(() => {
    const map = new Map<string, number>();
    for (const o of this.orders()) {
      if (o.status === 'Cancelled') continue;
      map.set(o.date, (map.get(o.date) ?? 0) + o.amount);
    }
    return [...map.entries()]
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  });

  load() {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<RawOrder[]>(this.config.rest.ordersUrl).pipe(
      tap((list) => {
        this.orders.set(list);
        this.loading.set(false);
        this.logger.info('Statistics derived from orders', list.length);
      }),
      catchError((err) => {
        this.logger.error('Failed to load statistics source', err);
        this.error.set('Could not load statistics.');
        this.loading.set(false);
        return of([] as RawOrder[]);
      }),
    );
  }
}
