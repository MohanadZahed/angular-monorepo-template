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

export type Locale = 'en' | 'de';

const STORAGE_KEY = 'app-locale';

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  en: {
    'nav.statistics': 'Statistics',
    'nav.invoices': 'Invoices',
    'nav.orders': 'Orders',
    'nav.featureFlags': 'Feature Flags',
    'header.logout': 'Logout',
    'header.signedInAs': 'Signed in as',
    'header.signedOut': 'Signed out',
    'header.language': 'Language',

    'login.title': 'Sign in',
    'login.subtitle': 'Enter your credentials to continue',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Sign in',
    'login.invalidCredentials': 'Invalid username or password.',

    'orders.title': 'Orders',
    'orders.subtitle': 'Manage and track customer orders',
    'orders.new': '+ New Order',
    'orders.loading': 'Loading orders…',
    'orders.empty': 'No orders yet.',
    'orders.col.id': 'Order ID',
    'orders.col.customer': 'Customer',
    'orders.col.items': 'Items',
    'orders.col.amount': 'Amount',
    'orders.col.status': 'Status',
    'orders.col.date': 'Date',

    'invoices.title': 'Invoices',
    'invoices.subtitle': 'Track and manage client invoices',
    'invoices.loading': 'Loading invoices…',
    'invoices.empty': 'No invoices match the current filter.',
    'invoices.status': 'Status',
    'invoices.next': 'Next ›',
    'invoices.previous': '‹ Previous',
  },
  de: {
    'nav.statistics': 'Statistik',
    'nav.invoices': 'Rechnungen',
    'nav.orders': 'Bestellungen',
    'nav.featureFlags': 'Feature-Flags',
    'header.logout': 'Abmelden',
    'header.signedInAs': 'Angemeldet als',
    'header.signedOut': 'Abgemeldet',
    'header.language': 'Sprache',

    'login.title': 'Anmelden',
    'login.subtitle': 'Bitte Anmeldedaten eingeben, um fortzufahren',
    'login.username': 'Benutzername',
    'login.password': 'Passwort',
    'login.submit': 'Anmelden',
    'login.invalidCredentials': 'Ungültiger Benutzername oder Passwort.',

    'orders.title': 'Bestellungen',
    'orders.subtitle': 'Kundenbestellungen verwalten und nachverfolgen',
    'orders.new': '+ Neue Bestellung',
    'orders.loading': 'Bestellungen werden geladen…',
    'orders.empty': 'Noch keine Bestellungen.',
    'orders.col.id': 'Bestell-Nr.',
    'orders.col.customer': 'Kunde',
    'orders.col.items': 'Artikel',
    'orders.col.amount': 'Betrag',
    'orders.col.status': 'Status',
    'orders.col.date': 'Datum',

    'invoices.title': 'Rechnungen',
    'invoices.subtitle': 'Kundenrechnungen verfolgen und verwalten',
    'invoices.loading': 'Rechnungen werden geladen…',
    'invoices.empty': 'Keine Rechnungen entsprechen dem aktuellen Filter.',
    'invoices.status': 'Status',
    'invoices.next': 'Weiter ›',
    'invoices.previous': '‹ Zurück',
  },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly locale = signal<Locale>(this.readStored());
  readonly dictionary = computed(() => TRANSLATIONS[this.locale()]);

  constructor() {
    effect(() => {
      const locale = this.locale();
      if (this.isBrowser) {
        this.document.documentElement.lang = locale;
      }
    });
  }

  t(key: string): string {
    return this.dictionary()[key] ?? key;
  }

  set(locale: Locale): void {
    this.locale.set(locale);
    if (!this.isBrowser) return;
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // localStorage may be unavailable
    }
  }

  toggle(): void {
    this.set(this.locale() === 'en' ? 'de' : 'en');
  }

  private readStored(): Locale {
    if (!this.isBrowser) return 'en';
    try {
      const stored =
        this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'de') return stored;
    } catch {
      // ignore
    }
    return 'en';
  }
}
