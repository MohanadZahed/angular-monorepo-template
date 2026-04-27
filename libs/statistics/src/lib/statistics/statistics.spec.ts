import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  BACKEND_CONFIG,
  BackendConfig,
  OrdersDataStore,
} from '@angular-monorepo-template/core';
import { StatisticsStore } from './statistics.store';

const TEST_CONFIG: BackendConfig = {
  production: false,
  rest: {
    featureFlagsUrl: 'http://test/featureFlags',
    ordersUrl: 'http://test/orders',
    invoicesUrl: 'http://test/invoices',
  },
};

const FIXTURE = [
  {
    id: 'A',
    customer: 'X',
    items: 1,
    amount: 100,
    status: 'Delivered',
    date: '2026-04-01',
  },
  {
    id: 'B',
    customer: 'Y',
    items: 2,
    amount: 200,
    status: 'Shipped',
    date: '2026-04-02',
  },
  {
    id: 'C',
    customer: 'Z',
    items: 3,
    amount: 999,
    status: 'Cancelled',
    date: '2026-04-02',
  },
];

describe('StatisticsStore', () => {
  let store: InstanceType<typeof StatisticsStore>;
  let dataStore: InstanceType<typeof OrdersDataStore>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BACKEND_CONFIG, useValue: TEST_CONFIG },
      ],
    });
    store = TestBed.inject(StatisticsStore);
    dataStore = TestBed.inject(OrdersDataStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('hydrates and computes KPIs from order data', () => {
    store.load();
    httpMock.expectOne(TEST_CONFIG.rest.ordersUrl).flush(FIXTURE);

    expect(store.totalOrders()).toBe(3);
    expect(store.totalRevenue()).toBe(300);
    expect(store.avgOrderValue()).toBe(150);
  });

  it('groups daily totals excluding cancelled orders', () => {
    store.load();
    httpMock.expectOne(TEST_CONFIG.rest.ordersUrl).flush(FIXTURE);

    expect(store.dailyTotals()).toEqual([
      { date: '2026-04-01', total: 100 },
      { date: '2026-04-02', total: 200 },
    ]);
  });

  it('produces a status breakdown sorted by count', () => {
    store.load();
    httpMock.expectOne(TEST_CONFIG.rest.ordersUrl).flush(FIXTURE);

    const breakdown = store.statusBreakdown();
    expect(breakdown.map((b) => b.status)).toEqual([
      'Delivered',
      'Shipped',
      'Cancelled',
    ]);
    expect(breakdown.every((b) => b.count === 1)).toBe(true);
  });

  it('caches across load() calls and refetches on reload()', () => {
    store.load();
    httpMock.expectOne(TEST_CONFIG.rest.ordersUrl).flush(FIXTURE);

    store.load();
    httpMock.expectNone(TEST_CONFIG.rest.ordersUrl);

    store.reload();
    httpMock.expectOne(TEST_CONFIG.rest.ordersUrl).flush(FIXTURE);
  });

  it('reflects new orders added via OrdersDataStore.setOrders()', () => {
    store.load();
    httpMock.expectOne(TEST_CONFIG.rest.ordersUrl).flush(FIXTURE);

    const newOrder = {
      id: 'D',
      customer: 'W',
      items: 1,
      amount: 50,
      status: 'Pending',
      date: '2026-04-03',
    };
    dataStore.setOrders([newOrder, ...FIXTURE]);

    expect(store.totalOrders()).toBe(4);
  });
});
