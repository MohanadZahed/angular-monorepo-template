import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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

  load(): Observable<Invoice[]> {
    return this.http
      .get<Invoice[]>(this.config.rest.invoicesUrl)
      .pipe(
        tap((list) =>
          this.logger.info('Invoices loaded', { count: list.length }),
        ),
      );
  }
}
