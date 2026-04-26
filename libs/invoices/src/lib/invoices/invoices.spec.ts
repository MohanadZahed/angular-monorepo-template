import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BACKEND_CONFIG, BackendConfig } from '@angular-monorepo-template/core';
import { Invoices } from './invoices';
import { Invoice } from './invoices.service';

const TEST_CONFIG: BackendConfig = {
  production: false,
  rest: {
    featureFlagsUrl: 'http://test/featureFlags',
    ordersUrl: 'http://test/orders',
    invoicesUrl: 'http://test/invoices',
  },
};

const FIXTURE: Invoice[] = Array.from({ length: 7 }, (_, i) => ({
  id: `INV-${i + 1}`,
  client: `Client ${i + 1}`,
  issued: '2026-04-01',
  due: `2026-04-${String(10 + i).padStart(2, '0')}`,
  amount: (i + 1) * 100,
  status: i % 2 === 0 ? 'paid' : 'pending',
}));

describe('Invoices', () => {
  let component: Invoices;
  let fixture: ComponentFixture<Invoices>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Invoices],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BACKEND_CONFIG, useValue: TEST_CONFIG },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Invoices);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.expectOne(TEST_CONFIG.rest.invoicesUrl).flush(FIXTURE);
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('paginates 7 rows into 2 pages of 5', () => {
    expect(component.totalPages()).toBe(2);
    expect(component.pageRows().length).toBe(5);
    component.nextPage();
    expect(component.page()).toBe(2);
    expect(component.pageRows().length).toBe(2);
  });

  it('filters by status and resets to page 1', () => {
    component.nextPage();
    component.onFilterChange('paid');
    expect(component.page()).toBe(1);
    expect(component.pageRows().every((r) => r.status === 'paid')).toBe(true);
  });

  it('toggles sort direction on the same key', () => {
    component.toggleSort('amount');
    expect(component.sortKey()).toBe('amount');
    expect(component.sortDir()).toBe('desc');
    component.toggleSort('amount');
    expect(component.sortDir()).toBe('asc');
  });

  it('exposes correct aria-sort state for headers', () => {
    component.toggleSort('amount');
    expect(component.ariaSort('amount')).toBe('descending');
    expect(component.ariaSort('due')).toBe('none');
  });
});
