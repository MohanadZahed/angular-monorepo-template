export interface StatusBucket {
  status: string;
  count: number;
}

export interface DailyBucket {
  date: string;
  total: number;
}

export const STATISTICS_CURRENCY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
