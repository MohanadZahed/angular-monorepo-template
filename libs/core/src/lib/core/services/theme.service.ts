import {
  DOCUMENT,
  Injectable,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'ds-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(this.platformId);

  private mediaQuery = this.isBrowser
    ? this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)')
    : undefined;

  private systemPrefersDark = signal(this.mediaQuery?.matches ?? false);
  readonly preference = signal<ThemePreference>(this.readStoredPreference());

  readonly resolved = computed<ResolvedTheme>(() => {
    const pref = this.preference();
    if (pref === 'system') return this.systemPrefersDark() ? 'dark' : 'light';
    return pref;
  });

  constructor() {
    if (this.isBrowser && this.mediaQuery) {
      const onChange = (event: MediaQueryListEvent) =>
        this.systemPrefersDark.set(event.matches);
      this.mediaQuery.addEventListener('change', onChange);
    }

    effect(() => {
      const pref = this.preference();
      const resolved = this.resolved();
      this.applyToDocument(pref, resolved);
    });
  }

  toggle(): void {
    this.set(this.resolved() === 'dark' ? 'light' : 'dark');
  }

  set(preference: ThemePreference): void {
    this.preference.set(preference);
    if (!this.isBrowser) return;
    try {
      if (preference === 'system') {
        this.document.defaultView?.localStorage.removeItem(STORAGE_KEY);
      } else {
        this.document.defaultView?.localStorage.setItem(
          STORAGE_KEY,
          preference,
        );
      }
    } catch {
      // localStorage may be unavailable (private mode, blocked) — ignore.
    }
  }

  private readStoredPreference(): ThemePreference {
    if (!this.isBrowser) return 'system';
    try {
      const stored =
        this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // ignore
    }
    return 'system';
  }

  private applyToDocument(
    preference: ThemePreference,
    resolved: ResolvedTheme,
  ): void {
    const root = this.document.documentElement;
    if (preference === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', preference);
    }
    root.style.colorScheme = resolved;
  }
}
