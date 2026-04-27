import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';
import { TraceService } from '../services/trace.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(UserAuthService).getToken();
  const traceId = inject(TraceService).traceId();

  const headers: Record<string, string> = { 'X-Trace-Id': traceId };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return next(req.clone({ setHeaders: headers }));
};
