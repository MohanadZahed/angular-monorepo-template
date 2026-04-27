import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService, Locale } from '../../core/services/i18n.service';

@Component({
  selector: 'lib-language-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="lang-toggle" [attr.aria-label]="i18n.t('header.language')">
      <span class="sr-only">{{ i18n.t('header.language') }}</span>
      <select
        class="lang-toggle-select"
        [value]="i18n.locale()"
        (change)="onChange($any($event.target).value)"
      >
        <option value="en">EN</option>
        <option value="de">DE</option>
      </select>
    </label>
  `,
  styles: [
    `
      .lang-toggle-select {
        background: transparent;
        color: inherit;
        border: 1px solid currentColor;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 0.85rem;
        cursor: pointer;
      }
    `,
  ],
})
export class LanguageToggle {
  protected i18n = inject(I18nService);

  onChange(value: string): void {
    this.i18n.set(value as Locale);
  }
}
