import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const AUTH_KEY = 'auth_token';

function buildFakeJwt(username: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(
    JSON.stringify({ sub: username, iat: now, exp: now + 3600 }),
  );
  return `eyJhbGciOiJIUzI1NiJ9.${payload}.fake-sig`;
}

function parseJwtPayload(token: string): { sub: string; exp: number } | null {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = parseJwtPayload(token);
  return !!payload && payload.exp > Math.floor(Date.now() / 1000);
}

@Injectable({ providedIn: 'root' })
export class UserAuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly _isLoggedIn = signal(
    this.isBrowser ? isTokenValid(localStorage.getItem(AUTH_KEY)) : false,
  );

  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  readonly currentUser = computed(() => {
    if (!this._isLoggedIn()) return null;
    const payload = parseJwtPayload(this.getToken() ?? '');
    return payload?.sub ?? null;
  });

  readonly isAdmin = computed(() => this.currentUser() === 'admin');

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(AUTH_KEY) : null;
  }

  checkCredentials(username: string, password: string): boolean {
    const validCredentials =
      (username === 'demo' && password === 'demo') ||
      (username === 'admin' && password === 'admin');
    if (validCredentials) {
      if (this.isBrowser)
        localStorage.setItem(AUTH_KEY, buildFakeJwt(username));
      this._isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    if (this.isBrowser) localStorage.removeItem(AUTH_KEY);
    this._isLoggedIn.set(false);
  }

  isTokenExpired(): boolean {
    return !isTokenValid(this.getToken());
  }
}
