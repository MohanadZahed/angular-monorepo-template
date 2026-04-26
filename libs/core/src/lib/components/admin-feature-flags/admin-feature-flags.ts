import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FeatureFlagMap,
  FeatureFlagService,
} from '../../core/services/feature-flag.service';
import { UiButtonComponent } from '../ui/button/ui-button';
import { UiCardComponent } from '../ui/card/ui-card';
import { UiAlertComponent } from '../ui/alert/ui-alert';

@Component({
  selector: 'lib-admin-feature-flags',
  imports: [UiButtonComponent, UiCardComponent, UiAlertComponent],
  templateUrl: './admin-feature-flags.html',
  styleUrl: './admin-feature-flags.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFeatureFlags {
  private featureFlagService = inject(FeatureFlagService);

  protected readonly draft = signal<FeatureFlagMap>({
    ...this.featureFlagService.flags(),
  });
  protected readonly entries = computed(() =>
    Object.entries(this.draft()).sort(([a], [b]) => a.localeCompare(b)),
  );
  protected readonly saving = signal(false);
  protected readonly status = signal<'idle' | 'success' | 'error'>('idle');

  toggle(key: string, enabled: boolean) {
    this.draft.update((flags) => ({ ...flags, [key]: enabled }));
    this.status.set('idle');
  }

  save() {
    this.saving.set(true);
    this.status.set('idle');
    this.featureFlagService.saveFlags(this.draft()).subscribe({
      next: () => {
        this.saving.set(false);
        this.status.set('success');
      },
      error: () => {
        this.saving.set(false);
        this.status.set('error');
      },
    });
  }
}
