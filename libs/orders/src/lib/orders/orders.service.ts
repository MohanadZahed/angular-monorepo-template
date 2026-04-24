import { Injectable, signal } from '@angular/core';

export interface Order {
  id: string;
  customer: string;
  items: number;
  amount: string;
  status: string;
  badgeClass: string;
  date: string;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: '#ORD-0041',
    customer: 'Alice Johnson',
    items: 3,
    amount: '$149.00',
    status: 'Delivered',
    badgeClass: 'badge--success',
    date: 'Apr 21, 2026',
  },
  {
    id: '#ORD-0040',
    customer: 'Bob Martinez',
    items: 1,
    amount: '$59.99',
    status: 'Shipped',
    badgeClass: 'badge--info',
    date: 'Apr 20, 2026',
  },
  {
    id: '#ORD-0039',
    customer: 'Carol Smith',
    items: 5,
    amount: '$312.50',
    status: 'Pending',
    badgeClass: 'badge--warning',
    date: 'Apr 19, 2026',
  },
  {
    id: '#ORD-0038',
    customer: 'David Lee',
    items: 2,
    amount: '$89.00',
    status: 'Delivered',
    badgeClass: 'badge--success',
    date: 'Apr 18, 2026',
  },
  {
    id: '#ORD-0037',
    customer: 'Eva Chen',
    items: 4,
    amount: '$204.00',
    status: 'Cancelled',
    badgeClass: 'badge--danger',
    date: 'Apr 17, 2026',
  },
];

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private nextOrderNum = 42;

  readonly orders = signal<Order[]>(INITIAL_ORDERS);

  addOrder(customer: string, items: number, amount: string): void {
    const num = this.nextOrderNum++;
    const date = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    this.orders.update((list) => [
      {
        id: `#ORD-${String(num).padStart(4, '0')}`,
        customer,
        items,
        amount,
        status: 'Pending',
        badgeClass: 'badge--warning',
        date,
      },
      ...list,
    ]);
  }
}
