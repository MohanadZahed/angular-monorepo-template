import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { BACKEND_CONFIG, LoggerService } from '@angular-monorepo-template/core';

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customer: string;
  items: number;
  amount: number;
  status: OrderStatus;
  date: string;
}

export interface OrderView extends Order {
  amountDisplay: string;
  dateDisplay: string;
  badgeClass: string;
}

const STATUS_BADGE: Record<OrderStatus, string> = {
  Delivered: 'badge--success',
  Shipped: 'badge--info',
  Pending: 'badge--warning',
  Cancelled: 'badge--danger',
};

const CURRENCY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const DATE = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private config = inject(BACKEND_CONFIG);
  private logger = inject(LoggerService);

  private raw = signal<Order[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly orders = computed<OrderView[]>(() =>
    this.raw().map((o) => ({
      ...o,
      amountDisplay: CURRENCY.format(o.amount),
      dateDisplay: DATE.format(new Date(o.date)),
      badgeClass: STATUS_BADGE[o.status] ?? 'badge--info',
    })),
  );

  loadOrders() {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Order[]>(this.config.rest.ordersUrl).pipe(
      tap((list) => {
        this.raw.set(this.sortNewestFirst(list));
        this.logger.info('Orders loaded', list.length);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.logger.error('Failed to load orders', err);
        this.error.set('Could not load orders.');
        this.loading.set(false);
        return of([] as Order[]);
      }),
    );
  }

  addOrder(input: { customer: string; items: number; amount: number }) {
    const id = this.nextOrderId();
    const newOrder: Order = {
      id,
      customer: input.customer,
      items: input.items,
      amount: input.amount,
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10),
    };
    return this.http.post<Order>(this.config.rest.ordersUrl, newOrder).pipe(
      tap((saved) => {
        this.raw.update((list) => this.sortNewestFirst([saved, ...list]));
        this.logger.info('Order created', saved.id);
      }),
      catchError((err) => {
        this.logger.error('Failed to create order', err);
        this.error.set('Could not save order. Please try again.');
        return of(null);
      }),
    );
  }

  private nextOrderId(): string {
    const max = this.raw().reduce((acc, o) => {
      const n = Number(o.id.replace(/\D/g, ''));
      return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
    return `ORD-${String(max + 1).padStart(4, '0')}`;
  }

  private sortNewestFirst(list: Order[]): Order[] {
    return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  }
}
