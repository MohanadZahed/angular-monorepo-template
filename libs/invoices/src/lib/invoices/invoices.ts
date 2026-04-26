import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { UiAlertComponent } from '@angular-monorepo-template/core';
import { Invoice, InvoiceStatus, InvoicesService } from './invoices.service';

type StatusFilter = 'all' | InvoiceStatus;
type SortKey = 'amount' | 'due';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 5;
const STATUS_BADGE: Record<InvoiceStatus, string> = {
  paid: 'badge--success',
  pending: 'badge--warning',
  overdue: 'badge--danger',
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

interface InvoiceRow extends Invoice {
  amountDisplay: string;
  issuedDisplay: string;
  dueDisplay: string;
  badgeClass: string;
  statusLabel: string;
}

@Component({
  selector: 'lib-invoices',
  imports: [UiAlertComponent],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Invoices implements OnInit {
  private service = inject(InvoicesService);

  readonly loading = this.service.loading;
  readonly error = this.service.error;

  readonly statusFilter = signal<StatusFilter>('all');
  readonly sortKey = signal<SortKey>('due');
  readonly sortDir = signal<SortDir>('desc');
  readonly page = signal(1);

  readonly statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
  ];

  readonly filtered = computed<Invoice[]>(() => {
    const status = this.statusFilter();
    const list = this.service.invoices();
    return status === 'all' ? list : list.filter((i) => i.status === status);
  });

  readonly sorted = computed<Invoice[]>(() => {
    const list = [...this.filtered()];
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return list.sort((a, b) => {
      const av = key === 'amount' ? a.amount : a.due;
      const bv = key === 'amount' ? b.amount : b.due;
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sorted().length / PAGE_SIZE)),
  );

  readonly pageRows = computed<InvoiceRow[]>(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.sorted()
      .slice(start, start + PAGE_SIZE)
      .map((i) => ({
        ...i,
        amountDisplay: CURRENCY.format(i.amount),
        issuedDisplay: DATE.format(new Date(i.issued)),
        dueDisplay: DATE.format(new Date(i.due)),
        badgeClass: STATUS_BADGE[i.status],
        statusLabel: i.status[0].toUpperCase() + i.status.slice(1),
      }));
  });

  readonly rangeLabel = computed(() => {
    const total = this.sorted().length;
    if (total === 0) return 'No invoices match the current filter.';
    const start = (this.page() - 1) * PAGE_SIZE + 1;
    const end = Math.min(start + PAGE_SIZE - 1, total);
    return `Showing ${start}–${end} of ${total}`;
  });

  ngOnInit(): void {
    this.service.load().subscribe();
  }

  onFilterChange(value: string) {
    this.statusFilter.set(value as StatusFilter);
    this.page.set(1);
  }

  toggleSort(key: SortKey) {
    if (this.sortKey() === key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('desc');
    }
    this.page.set(1);
  }

  ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (this.sortKey() !== key) return 'none';
    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
  }

  prevPage() {
    this.page.update((p) => Math.max(1, p - 1));
  }

  nextPage() {
    this.page.update((p) => Math.min(this.totalPages(), p + 1));
  }
}
