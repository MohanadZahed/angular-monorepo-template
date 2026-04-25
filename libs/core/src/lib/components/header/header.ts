import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserAuthService } from '../../core/services/user-auth.service';
import { FeatureFlagService } from '../../core/services/feature-flag.service';

@Component({
  selector: 'lib-app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  private authService = inject(UserAuthService);
  private featureFlagService = inject(FeatureFlagService);
  private router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;

  showStatistics = this.featureFlagService.isEnabled('statistics');
  showInvoices = this.featureFlagService.isEnabled('invoices');
  showOrders = this.featureFlagService.isEnabled('orders');

  readonly authAnnouncement = signal('');

  constructor() {
    let ready = false;
    effect(() => {
      const loggedIn = this.authService.isLoggedIn();
      const user = this.authService.currentUser();
      if (ready) {
        this.authAnnouncement.set(
          loggedIn ? `Signed in as ${user}` : 'Signed out',
        );
      }
      ready = true;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
