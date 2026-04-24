import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

const AUTH_KEY = 'auth_session';
const MOCK_TOKEN = 'mock-session-token';

@Injectable({ providedIn: 'root' })
export class UserAuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private isUserLoggedIn = new BehaviorSubject(
    this.isBrowser ? !!localStorage.getItem(AUTH_KEY) : false,
  );
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(AUTH_KEY) : null;
  }

  checkCredentials(username: string, password: string) {
    if (username === 'demo' && password === 'demo') {
      if (this.isBrowser) localStorage.setItem(AUTH_KEY, MOCK_TOKEN);
      this.isUserLoggedIn.next(true);
    }
  }

  logout() {
    if (this.isBrowser) localStorage.removeItem(AUTH_KEY);
    this.isUserLoggedIn.next(false);
  }
}
