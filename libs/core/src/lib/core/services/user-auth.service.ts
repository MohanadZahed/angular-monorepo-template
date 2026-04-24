import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

const AUTH_KEY = 'auth_session';

@Injectable({ providedIn: 'root' })
export class UserAuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private isUserLoggedIn = new BehaviorSubject(
    this.isBrowser ? localStorage.getItem(AUTH_KEY) === 'true' : false,
  );
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();

  checkCredentials(username: string, password: string) {
    if (username === 'demo' && password === 'demo') {
      if (this.isBrowser) localStorage.setItem(AUTH_KEY, 'true');
      this.isUserLoggedIn.next(true);
    }
  }

  logout() {
    if (this.isBrowser) localStorage.removeItem(AUTH_KEY);
    this.isUserLoggedIn.next(false);
  }
}
