import { Injectable, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { signalStore } from '@ngrx/signals';
import { Observable, of, throwError } from 'rxjs';
import { withBaseStore } from './with-base-store';

interface Item {
  id: number;
}

@Injectable({ providedIn: 'root' })
class FakeService {
  calls = 0;
  next: Item[] = [{ id: 1 }];
  fail: Error | null = null;
  fetch(): Observable<Item[]> {
    this.calls += 1;
    const failure = this.fail;
    return failure ? throwError(() => failure) : of(this.next);
  }
}

const TestStore = signalStore(
  { providedIn: 'root' },
  withBaseStore<Item[]>(() => {
    const svc = inject(FakeService);
    return () => svc.fetch();
  }),
);

describe('withBaseStore', () => {
  let store: InstanceType<typeof TestStore>;
  let svc: FakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(TestStore);
    svc = TestBed.inject(FakeService);
  });

  it('load() fetches once and caches the result', () => {
    store.load();
    expect(svc.calls).toBe(1);
    expect(store.data()).toEqual([{ id: 1 }]);
    expect(store.loaded()).toBe(true);
    expect(store.loading()).toBe(false);

    store.load();
    expect(svc.calls).toBe(1);
  });

  it('reload() forces a fetch even when cached', () => {
    store.load();
    expect(svc.calls).toBe(1);
    svc.next = [{ id: 2 }];
    store.reload();
    expect(svc.calls).toBe(2);
    expect(store.data()).toEqual([{ id: 2 }]);
  });

  it('reset() clears state so the next load() refetches', () => {
    store.load();
    expect(svc.calls).toBe(1);
    store.reset();
    expect(store.data()).toBeUndefined();
    expect(store.loaded()).toBe(false);
    store.load();
    expect(svc.calls).toBe(2);
  });

  it('captures errors into the error signal and stops loading', () => {
    svc.fail = new Error('boom');
    store.load();
    expect(store.error()?.message).toBe('boom');
    expect(store.loading()).toBe(false);
    expect(store.loaded()).toBe(true);
  });

  it('exposes a queryState computed snapshot', () => {
    store.load();
    expect(store.queryState()).toEqual({
      data: [{ id: 1 }],
      loading: false,
      error: null,
      loaded: true,
    });
  });
});
