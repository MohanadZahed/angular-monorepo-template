import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
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

  isLoggedIn = toSignal(this.authService.isUserLoggedIn$, {
    initialValue: false,
  });

  showStatistics = this.featureFlagService.isEnabled('statistics');
  showInvoices = this.featureFlagService.isEnabled('invoices');
  showOrders = this.featureFlagService.isEnabled('orders');

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
