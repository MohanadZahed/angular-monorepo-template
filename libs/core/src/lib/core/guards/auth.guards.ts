import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';

export const isAuthenticated: CanActivateFn = () => {
  const authService = inject(UserAuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isTokenExpired()) {
    authService.logout();
    return router.createUrlTree(['/login']);
  }

  return authService.isLoggedIn() || router.createUrlTree(['/login']);
};

export const redirectIfAuthenticated: CanActivateFn = () => {
  const authService = inject(UserAuthService);
  const router = inject(Router);
  return authService.isLoggedIn() ? router.createUrlTree(['/']) : true;
};
