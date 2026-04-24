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
        <span aria-hidden="true" style="margin-right: 0.375rem">…</span>
      }
      <ng-content />
    </button>
  `,
})
export class UiButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger'>('secondary');
  size = input<'sm' | 'md' | 'lg'>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
}
