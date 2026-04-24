import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
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
    .ui-card-header {
      margin-bottom: 1.5rem;
    }

    .ui-card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-primary);
      margin: 0;
    }

    .ui-card-subtitle {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin: 0.25rem 0 0;
    }
  `,
})
export class UiCardComponent {
  title = input<string>();
  subtitle = input<string>();
}
