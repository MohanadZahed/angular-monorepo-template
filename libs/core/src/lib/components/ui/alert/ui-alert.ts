import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

type AlertType = 'success' | 'error' | 'info' | 'warning';

const ICONS: Record<AlertType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

@Component({
  selector: 'ui-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'alert' },
  template: `
    <div
      class="ui-alert"
      [class.ui-alert--success]="type() === 'success'"
      [class.ui-alert--error]="type() === 'error'"
      [class.ui-alert--warning]="type() === 'warning'"
      [class.ui-alert--info]="type() === 'info'"
    >
      <span class="ui-alert-icon" aria-hidden="true">{{ icon() }}</span>
      <div class="ui-alert-body">
        <ng-content />
      </div>
      @if (dismissible()) {
        <button
          type="button"
          class="ui-alert-dismiss"
          aria-label="Dismiss"
          (click)="dismissed.emit()"
        >
          ×
        </button>
      }
    </div>
  `,
  styles: `
    .ui-alert {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: var(--radius-sm);
      border-left: 4px solid transparent;
      font-size: 0.9375rem;
    }

    .ui-alert--success {
      background-color: var(--color-success-bg);
      border-color: var(--color-success);
      color: var(--color-success);
    }

    .ui-alert--error {
      background-color: var(--color-danger-bg);
      border-color: var(--color-danger);
      color: var(--color-danger);
    }

    .ui-alert--warning {
      background-color: var(--color-warning-bg);
      border-color: var(--color-warning);
      color: var(--color-warning);
    }

    .ui-alert--info {
      background-color: var(--color-info-bg);
      border-color: var(--color-info);
      color: var(--color-info);
    }

    .ui-alert-icon {
      font-weight: 700;
      flex-shrink: 0;
      line-height: 1.5;
    }

    .ui-alert-body {
      flex: 1;
      color: var(--color-text);
      line-height: 1.5;
    }

    .ui-alert-dismiss {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0 0.25rem;
      font-size: 1.25rem;
      line-height: 1;
      color: inherit;
      opacity: 0.6;
      flex-shrink: 0;
    }

    .ui-alert-dismiss:hover {
      opacity: 1;
    }
  `,
})
export class UiAlertComponent {
  type = input<AlertType>('info');
  dismissible = input<boolean>(false);
  dismissed = output<void>();

  icon = computed(() => ICONS[this.type()]);
}
