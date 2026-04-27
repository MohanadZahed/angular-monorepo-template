export interface QueryState<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
}

export const createQueryState = <T>(data?: T): QueryState<T> => ({
  data,
  loading: false,
  error: null,
});

export const createLoadingQueryState = <T>(data?: T): QueryState<T> => ({
  data,
  loading: true,
  error: null,
});

export const createErrorQueryState = <T>(
  error: Error,
  data?: T,
): QueryState<T> => ({
  data,
  loading: false,
  error,
});
