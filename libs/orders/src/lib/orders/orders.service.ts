import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import {
  BACKEND_CONFIG,
  LoggerService,
  OrderData,
} from '@angular-monorepo-template/core';

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

export interface AddOrderInput {
  customer: string;
  items: number;
  amount: number;
}

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  Delivered: 'badge--success',
  Shipped: 'badge--info',
  Pending: 'badge--warning',
  Cancelled: 'badge--danger',
};

export const ORDER_CURRENCY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
export const ORDER_DATE = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private config = inject(BACKEND_CONFIG);
  private logger = inject(LoggerService);

  loadOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(this.config.rest.ordersUrl)
      .pipe(tap((list) => this.logger.info('Orders loaded', list.length)));
  }

  addOrder(
    input: AddOrderInput,
    current: OrderData[],
  ): Observable<Order | null> {
    const newOrder: Order = {
      id: this.nextOrderId(current),
      customer: input.customer,
      items: input.items,
      amount: input.amount,
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10),
    };
    return this.http.post<Order>(this.config.rest.ordersUrl, newOrder).pipe(
      tap((saved) => this.logger.info('Order created', saved.id)),
      catchError((err) => {
        this.logger.error('Failed to create order', err);
        return of(null);
      }),
    );
  }

  sortNewestFirst(list: OrderData[]): OrderData[] {
    return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  private nextOrderId(current: OrderData[]): string {
    const max = current.reduce((acc, o) => {
      const n = Number(o.id.replace(/\D/g, ''));
      return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
    return `ORD-${String(max + 1).padStart(4, '0')}`;
  }
}
