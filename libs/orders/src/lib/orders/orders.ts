import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  HasUnsavedChanges,
  TranslatePipe,
  UiButtonComponent,
  UiAlertComponent,
} from '@angular-monorepo-template/core';
import { OrdersStore } from './orders.store';

const PRODUCTS = [
  { value: 'basic', label: 'Basic Package — $49/mo', price: 49 },
  { value: 'standard', label: 'Standard Package — $99/mo', price: 99 },
  { value: 'premium', label: 'Premium Package — $199/mo', price: 199 },
  { value: 'enterprise', label: 'Enterprise Package — $499/mo', price: 499 },
] as const;

@Component({
  selector: 'lib-orders',
  imports: [
    ReactiveFormsModule,
    UiButtonComponent,
    UiAlertComponent,
    TranslatePipe,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orders implements OnInit, HasUnsavedChanges {
  private fb = inject(FormBuilder);
  private store = inject(OrdersStore);

  readonly products = PRODUCTS;
  readonly steps = [
    { n: 1, label: 'Customer Info' },
    { n: 2, label: 'Order Details' },
    { n: 3, label: 'Review' },
  ];

  readonly orders = this.store.orders;
  readonly loading = this.store.loading;
  readonly loadError = this.store.error;

  showForm = signal(false);
  submitted = signal(false);
  submitting = signal(false);
  currentStep = signal(1);

  orderForm = this.fb.nonNullable.group({
    customer: this.fb.nonNullable.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    }),
    details: this.fb.nonNullable.group({
      product: ['', Validators.required],
      quantity: [
        1,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      notes: [''],
    }),
  });

  get customer() {
    return this.orderForm.controls.customer;
  }
  get details() {
    return this.orderForm.controls.details;
  }
  get firstName() {
    return this.customer.controls.firstName;
  }
  get lastName() {
    return this.customer.controls.lastName;
  }
  get email() {
    return this.customer.controls.email;
  }
  get product() {
    return this.details.controls.product;
  }
  get quantity() {
    return this.details.controls.quantity;
  }
  get notes() {
    return this.details.controls.notes;
  }

  selectedProductLabel = computed(
    () =>
      this.products.find((p) => p.value === this.product.value)?.label ??
      this.product.value,
  );

  ngOnInit(): void {
    this.store.load();
  }

  hasUnsavedChanges(): boolean {
    return this.orderForm.dirty && !this.submitted();
  }

  startNewOrder() {
    this.orderForm.reset({ details: { quantity: 1 } });
    this.currentStep.set(1);
    this.submitted.set(false);
    this.showForm.set(true);
  }

  cancelForm() {
    if (this.orderForm.dirty && !confirm('Discard unsaved order?')) return;
    this.showForm.set(false);
    this.orderForm.reset({ details: { quantity: 1 } });
  }

  nextStep() {
    const group = this.currentStep() === 1 ? this.customer : this.details;
    if (group.invalid) {
      group.markAllAsTouched();
      return;
    }
    if (this.currentStep() < 3) this.currentStep.update((s) => s + 1);
  }

  prevStep() {
    if (this.currentStep() > 1) this.currentStep.update((s) => s - 1);
  }

  submitOrder() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    const { customer, details } = this.orderForm.getRawValue();
    const productObj = this.products.find((p) => p.value === details.product);
    const amount = productObj ? productObj.price * details.quantity : 0;

    this.submitting.set(true);
    this.store
      .addOrder({
        customer: `${customer.firstName} ${customer.lastName}`,
        items: details.quantity,
        amount,
      })
      .subscribe((result) => {
        this.submitting.set(false);
        if (!result) return;
        this.orderForm.reset({ details: { quantity: 1 } });
        this.submitted.set(true);
        this.showForm.set(false);
      });
  }
}
