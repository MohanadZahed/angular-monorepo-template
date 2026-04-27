import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ui-card">
      @if (title()) {
        <div class="ui-card-header">
          <h2 class="ui-card-title">{{ title() }}</h2>
          @if (subtitle()) {
            <p class="ui-card-subtitle">{{ subtitle() }}</p>
          }
        </div>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .ui-card {
      background-color: var(--ds-color-surface);
      color: var(--ds-color-text);
      border-radius: var(--ds-radius-md);
      box-shadow: var(--ds-shadow-md);
      padding: var(--ds-space-6);
    }

    .ui-card-header {
      margin-bottom: var(--ds-space-6);
    }

    .ui-card-title {
      font-size: var(--ds-font-size-xl);
      font-weight: var(--ds-font-weight-semibold);
      color: var(--ds-color-primary);
      margin: 0;
    }

    .ui-card-subtitle {
      font-size: var(--ds-font-size-md);
      color: var(--ds-color-text-muted);
      margin: var(--ds-space-1) 0 0;
    }
  `,
})
export class UiCardComponent {
  title = input<string>();
  subtitle = input<string>();
}
