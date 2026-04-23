import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { CommonModule } from '@angular/common';
import { distinctUntilChanged } from 'rxjs/operators';
import { UserAuthService } from '@angular-monorepo-template/core';
import { FeatureFlagService } from '@angular-monorepo-template/core';

@Component({
  imports: [CommonModule, NxWelcome, RouterModule],
  selector: 'ng-mf-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'angular-monorepo-template';
  private featureFlagService = inject(FeatureFlagService);
  private router = inject(Router);
  private userService = inject(UserAuthService);

  showStatistics = this.featureFlagService.isEnabled('statistics');
  showInvoices = this.featureFlagService.isEnabled('invoices');
  showOrders = this.featureFlagService.isEnabled('orders');
  isLoggedIn$ = this.userService.isUserLoggedIn$;

  ngOnInit() {
    this.isLoggedIn$
      .pipe(distinctUntilChanged())
      .subscribe(async (loggedIn) => {
        // Queue the navigation after initialNavigation blocking is completed
        setTimeout(() => {
          if (!loggedIn) {
            this.router.navigateByUrl('login');
          } else {
            this.router.navigateByUrl('');
          }
        });
      });
  }
}
