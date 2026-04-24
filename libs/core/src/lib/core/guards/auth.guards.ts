import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { UserAuthService } from '../services/user-auth.service';

export const isAuthenticated: CanActivateFn = () => {
  const authService = inject(UserAuthService);
  const router = inject(Router);
  return authService.isUserLoggedIn$.pipe(
    take(1),
    map((loggedIn) => loggedIn || router.createUrlTree(['/login'])),
  );
};

export const redirectIfAuthenticated: CanActivateFn = () => {
  const authService = inject(UserAuthService);
  const router = inject(Router);
  return authService.isUserLoggedIn$.pipe(
    take(1),
    map((loggedIn) => (loggedIn ? router.createUrlTree(['/']) : true)),
  );
};
