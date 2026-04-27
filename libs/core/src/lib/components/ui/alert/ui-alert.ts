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
      gap: var(--ds-space-3);
      padding: var(--ds-space-3) var(--ds-space-4);
      border-radius: var(--ds-radius-sm);
      border-left: 4px solid transparent;
      font-size: var(--ds-font-size-base);
      line-height: var(--ds-line-height-normal);
    }

    .ui-alert--success {
      background-color: var(--ds-color-success-bg);
      border-color: var(--ds-color-success);
      color: var(--ds-color-success);
    }

    .ui-alert--error {
      background-color: var(--ds-color-danger-bg);
      border-color: var(--ds-color-danger);
      color: var(--ds-color-danger);
    }

    .ui-alert--warning {
      background-color: var(--ds-color-warning-bg);
      border-color: var(--ds-color-warning);
      color: var(--ds-color-warning);
    }

    .ui-alert--info {
      background-color: var(--ds-color-info-bg);
      border-color: var(--ds-color-info);
      color: var(--ds-color-info);
    }

    .ui-alert-icon {
      font-weight: var(--ds-font-weight-bold);
      flex-shrink: 0;
      line-height: var(--ds-line-height-normal);
    }

    .ui-alert-body {
      flex: 1;
      color: var(--ds-color-text);
      line-height: var(--ds-line-height-normal);
    }

    .ui-alert-dismiss {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0 var(--ds-space-1);
      font-size: var(--ds-font-size-2xl);
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
