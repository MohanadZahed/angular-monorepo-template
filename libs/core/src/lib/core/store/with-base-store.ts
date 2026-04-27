import { computed } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, pipe } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import {
  createErrorQueryState,
  createLoadingQueryState,
  createQueryState,
} from './query-state';

/**
 * SignalStore feature that wraps a fetcher with cache-aware load/reload/reset semantics
 * plus loading/error state.
 *
 * `load(param)` only triggers a fetch when no data exists and not currently loading,
 * so re-entering a route with a populated store skips the network call.
 * `reload(param)` always fetches. `reset()` clears state to its initial value.
 *
 * The fetcher factory runs inside the store's DI scope so consumers can `inject()`
 * services and return a typed function — no stringly-typed service lookups.
 */
export function withBaseStore<T, U = void>(
  fetcherFactory: () => (param: U) => Observable<T>,
  initialDataState?: T,
) {
  const initState = {
    ...createQueryState<T | undefined>(initialDataState),
    loaded: false,
  };

  return signalStoreFeature(
    withState(initState),
    withMethods((store) => {
      const fetch = fetcherFactory();
      const _load = rxMethod<U>(
        pipe(
          tap(() => patchState(store, createLoadingQueryState(store.data()))),
          concatMap((param) =>
            fetch(param).pipe(
              tapResponse({
                next: (data: T) =>
                  patchState(store, {
                    ...createQueryState(data),
                    loaded: true,
                  }),
                error: (error: Error) =>
                  patchState(store, {
                    ...createErrorQueryState(error, store.data()),
                    loaded: true,
                  }),
              }),
            ),
          ),
        ),
      );
      return {
        load(param?: U) {
          if (!store.data() && !store.loading()) _load(param as U);
        },
        reload(param?: U) {
          _load(param as U);
        },
        reset() {
          patchState(store, initState);
        },
        _load,
      };
    }),
    withComputed(({ data, loading, error, loaded }) => ({
      queryState: computed(() => ({
        data: data(),
        loading: loading(),
        error: error(),
        loaded: loaded(),
      })),
    })),
  );
}
