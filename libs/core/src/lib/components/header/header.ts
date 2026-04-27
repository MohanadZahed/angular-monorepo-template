import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserAuthService } from '../../core/services/user-auth.service';
import { FeatureFlagService } from '../../core/services/feature-flag.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LanguageToggle } from '../language-toggle/language-toggle';

@Component({
  selector: 'lib-app-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, LanguageToggle],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  private authService = inject(UserAuthService);
  private featureFlagService = inject(FeatureFlagService);
  private themeService = inject(ThemeService);
  private i18n = inject(I18nService);
  private router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;

  showStatistics = this.featureFlagService.isEnabled('statistics');
  showInvoices = this.featureFlagService.isEnabled('invoices');
  showOrders = this.featureFlagService.isEnabled('orders');

  resolvedTheme = this.themeService.resolved;
  isDark = computed(() => this.resolvedTheme() === 'dark');
  themeToggleLabel = computed(() =>
    this.isDark() ? 'Switch to light theme' : 'Switch to dark theme',
  );

  readonly authAnnouncement = signal('');

  constructor() {
    let ready = false;
    effect(() => {
      const loggedIn = this.authService.isLoggedIn();
      const user = this.authService.currentUser();
      if (ready) {
        this.authAnnouncement.set(
          loggedIn
            ? `${this.i18n.t('header.signedInAs')} ${user}`
            : this.i18n.t('header.signedOut'),
        );
      }
      ready = true;
    });
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
