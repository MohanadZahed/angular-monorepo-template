import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BACKEND_CONFIG, BackendConfig } from '@angular-monorepo-template/core';
import { StatisticsService } from './statistics.service';

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

describe('StatisticsService', () => {
  let service: StatisticsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BACKEND_CONFIG, useValue: TEST_CONFIG },
      ],
    });
    service = TestBed.inject(StatisticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('hydrates and computes KPIs from order data', () => {
    service.load().subscribe();
    httpMock.expectOne(TEST_CONFIG.rest.ordersUrl).flush(FIXTURE);

    expect(service.totalOrders()).toBe(3);
    expect(service.totalRevenue()).toBe(300);
    expect(service.avgOrderValue()).toBe(150);
  });

  it('groups daily totals excluding cancelled orders', () => {
    service.load().subscribe();
    httpMock.expectOne(TEST_CONFIG.rest.ordersUrl).flush(FIXTURE);

    const daily = service.dailyTotals();
    expect(daily).toEqual([
      { date: '2026-04-01', total: 100 },
      { date: '2026-04-02', total: 200 },
    ]);
  });

  it('produces a status breakdown sorted by count', () => {
    service.load().subscribe();
    httpMock.expectOne(TEST_CONFIG.rest.ordersUrl).flush(FIXTURE);

    const breakdown = service.statusBreakdown();
    expect(breakdown.map((b) => b.status)).toEqual([
      'Delivered',
      'Shipped',
      'Cancelled',
    ]);
    expect(breakdown.every((b) => b.count === 1)).toBe(true);
  });
});
