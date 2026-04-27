import { Injectable, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TraceService {
  private router = inject(Router);
  private readonly _traceId = signal<string>(this.generate());
  readonly traceId = this._traceId.asReadonly();

  init(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => this._traceId.set(this.generate()));
  }

  private generate(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return `nav-${crypto.randomUUID().slice(0, 8)}`;
    }
    return `nav-${Math.random().toString(36).slice(2, 10)}`;
  }
}
