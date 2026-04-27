import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: inline-block' },
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      class="btn"
      [class.btn--primary]="variant() === 'primary'"
      [class.btn--secondary]="variant() === 'secondary'"
      [class.btn--danger]="variant() === 'danger'"
      [class.btn--sm]="size() === 'sm'"
      [class.btn--lg]="size() === 'lg'"
    >
      @if (loading()) {
        <span aria-hidden="true" class="btn__spinner">…</span>
      }
      <ng-content />
    </button>
  `,
  styles: `
    .btn {
      display: inline-block;
      padding: var(--ds-space-3) var(--ds-space-5);
      border-radius: var(--ds-radius-md);
      font-size: var(--ds-font-size-md);
      font-weight: var(--ds-font-weight-medium);
      line-height: var(--ds-line-height-normal);
      cursor: pointer;
      text-decoration: none;
      border: 1px solid transparent;
      transition-property: var(--ds-motion-properties);
      transition-timing-function: var(--ds-motion-easing);
      transition-duration: var(--ds-motion-duration-fast);
    }

    .btn--primary {
      background-color: var(--ds-color-primary);
      color: var(--ds-color-text-on-primary);
    }
    .btn--primary:hover {
      background-color: var(--ds-color-primary-hover);
    }

    .btn--secondary {
      background-color: transparent;
      color: var(--ds-color-text);
      border-color: var(--ds-color-border);
    }
    .btn--secondary:hover {
      background-color: var(--ds-color-bg-subtle);
      border-color: var(--ds-color-border-strong);
    }

    .btn--danger {
      background-color: var(--ds-color-danger);
      color: var(--ds-color-text-on-primary);
    }
    .btn--danger:hover {
      background-color: var(--ds-color-danger-hover);
    }

    .btn--sm {
      padding: var(--ds-space-1) var(--ds-space-3);
      font-size: var(--ds-font-size-sm);
    }

    .btn--lg {
      padding: var(--ds-space-3) var(--ds-space-6);
      font-size: var(--ds-font-size-lg);
    }

    .btn:disabled,
    .btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .btn__spinner {
      margin-right: var(--ds-space-1);
    }
  `,
})
export class UiButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger'>('secondary');
  size = input<'sm' | 'md' | 'lg'>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
}
