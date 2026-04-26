import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BACKEND_CONFIG, BackendConfig } from '@angular-monorepo-template/core';
import { Orders } from './orders';

const TEST_CONFIG: BackendConfig = {
  production: false,
  rest: {
    featureFlagsUrl: 'http://test/featureFlags',
    ordersUrl: 'http://test/orders',
    invoicesUrl: 'http://test/invoices',
  },
};

describe('Orders', () => {
  let component: Orders;
  let fixture: ComponentFixture<Orders>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orders],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BACKEND_CONFIG, useValue: TEST_CONFIG },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Orders);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock.expectOne(TEST_CONFIG.rest.ordersUrl).flush([]);
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('starts on step 1 with the form hidden', () => {
    expect(component.currentStep()).toBe(1);
    expect(component.showForm()).toBe(false);
  });

  it('refuses to advance past invalid customer info', () => {
    component.startNewOrder();
    component.nextStep();
    expect(component.currentStep()).toBe(1);
    expect(component.firstName.touched).toBe(true);
  });

  it('advances when customer info is valid', () => {
    component.startNewOrder();
    component.firstName.setValue('Jane');
    component.lastName.setValue('Doe');
    component.email.setValue('jane@example.com');
    component.nextStep();
    expect(component.currentStep()).toBe(2);
  });

  it('reports unsaved changes when the form is dirty', () => {
    component.startNewOrder();
    component.firstName.setValue('Dirty');
    component.firstName.markAsDirty();
    expect(component.hasUnsavedChanges()).toBe(true);
  });
});
