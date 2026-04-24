import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(UserAuthService).getToken();

  if (!token) return next(req);

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
