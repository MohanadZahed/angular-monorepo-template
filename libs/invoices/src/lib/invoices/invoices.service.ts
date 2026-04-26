import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { BACKEND_CONFIG, LoggerService } from '@angular-monorepo-template/core';

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  client: string;
  issued: string;
  due: string;
  amount: number;
  status: InvoiceStatus;
}

@Injectable({ providedIn: 'root' })
export class InvoicesService {
  private http = inject(HttpClient);
  private config = inject(BACKEND_CONFIG);
  private logger = inject(LoggerService);

  readonly invoices = signal<Invoice[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  load() {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Invoice[]>(this.config.rest.invoicesUrl).pipe(
      tap((list) => {
        this.invoices.set(list);
        this.loading.set(false);
        this.logger.info('Invoices loaded', list.length);
      }),
      catchError((err) => {
        this.logger.error('Failed to load invoices', err);
        this.error.set('Could not load invoices.');
        this.loading.set(false);
        return of([] as Invoice[]);
      }),
    );
  }
}
