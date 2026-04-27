import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  FeatureFlagService,
  I18nService,
  Locale,
  TranslatePipe,
} from '@angular-monorepo-template/core';

interface Section {
  id: string;
  titleKey: string;
  items: string[];
}

const SECTIONS: Record<Locale, Section[]> = {
  en: [
    {
      id: 'architecture',
      titleKey: 'home.section.architecture',
      items: [
        'Nx 22 monorepo with apps (host, login) and libs (core, orders, invoices, statistics, admin)',
        'ESLint @nx/enforce-module-boundaries — tags: type:app, type:lib, scope:shared, scope:feature',
        'Feature libs may only depend on scope:shared; libs never import from apps',
        'Strict public APIs: every lib exports through libs/<name>/src/index.ts (no deep imports)',
        'Module Federation (webpack): host angular-monorepo-template consumes the login remote',
      ],
    },
    {
      id: 'rendering',
      titleKey: 'home.section.rendering',
      items: [
        'Angular 21 standalone components everywhere; ChangeDetectionStrategy.OnPush by default',
        'Server-Side Rendering via @angular/ssr (provideServerRendering(withRoutes(...)))',
        'Client hydration with event replay — provideClientHydration(withEventReplay())',
        'Lazy-loaded feature routes via loadComponent; remote routes via loadChildren',
        'Route guards: isAuthenticated, isAdmin, redirectIfAuthenticated (canActivate), featureFlagGuard (canMatch), unsavedChangesGuard (canDeactivate)',
        'Wildcard route → 404 NotFound component',
      ],
    },
    {
      id: 'state',
      titleKey: 'home.section.state',
      items: [
        "NgRx SignalStore (@ngrx/signals) — providedIn: 'root' for cross-feature stores",
        'Custom withBaseStore() feature: cache-aware load / reload / reset, with QueryState (data | loading | error | loaded)',
        'rxMethod + tapResponse for stream-based fetchers; patchState for granular updates',
        'Local component state via signal(); derived state via computed(); side effects via effect()',
        'Cross-feature shared store: OrdersDataStore in core, consumed by orders feature',
      ],
    },
    {
      id: 'realtime',
      titleKey: 'home.section.realtime',
      items: [
        'WebSocket RealtimeService with auto-reconnect (3 s) and signal-backed connection state',
        'Order events streamed as a typed RxJS Subject (order:created / updated / deleted)',
        'Web Vitals: CLS, INP, LCP, FCP, TTFB measured via dynamic import (browser-only)',
        'Per-navigation trace IDs (TraceService) propagated as the X-Trace-Id HTTP header',
        'Global ErrorHandler (GlobalErrorHandler) feeding a structured LoggerService',
      ],
    },
    {
      id: 'crosscutting',
      titleKey: 'home.section.crosscutting',
      items: [
        'HTTP interceptors: authInterceptor (Bearer + X-Trace-Id), errorInterceptor (401 → logout)',
        'provideHttpClient(withFetch(), withInterceptors([...])) — Fetch-based HTTP client',
        'Fake JWT auth in localStorage (demo / admin), with exp-based isTokenExpired() check',
        'Feature flags loaded at boot via provideAppInitializer from json-server',
        'Backend configuration via InjectionToken (BACKEND_CONFIG) and a per-app provider',
      ],
    },
    {
      id: 'ui',
      titleKey: 'home.section.ui',
      items: [
        'Custom i18n: signal-based locale (EN / DE), pure pipe ({{ key | t }}), language toggle',
        'Theme service: light / dark / system, synced with prefers-color-scheme + localStorage',
        'Accessibility: skip link, ARIA labels, sr-only aria-live announcer, focusable controls',
        'Storybook 10 with @storybook/addon-a11y for UI primitives (button, card, alert)',
        'Design tokens (colors, spacing, typography) in SCSS — single source of truth via --ds-* vars',
      ],
    },
    {
      id: 'tooling',
      titleKey: 'home.section.tooling',
      items: [
        'Jest unit tests across all projects; Cypress e2e for host and login',
        'ESLint 9 (flat config), Prettier, Husky + lint-staged on commit',
        'Per-app GitHub Actions pipelines: ci-host.yml, ci-login.yml, ci-json-server.yml',
        'Multi-service Docker Compose (host SSR, login remote, json-server) with dev / prod overrides',
        'Production deploy to EC2 via SSH; image published to Docker Hub (mzahed23/angular-monorepo-template)',
      ],
    },
  ],
  de: [
    {
      id: 'architecture',
      titleKey: 'home.section.architecture',
      items: [
        'Nx-22-Monorepo mit Apps (host, login) und Libs (core, orders, invoices, statistics, admin)',
        'ESLint @nx/enforce-module-boundaries — Tags: type:app, type:lib, scope:shared, scope:feature',
        'Feature-Libs dürfen nur scope:shared importieren; Libs importieren niemals aus Apps',
        'Strikte Public APIs: jede Lib exportiert über libs/<name>/src/index.ts (keine Deep-Imports)',
        'Module Federation (webpack): Host angular-monorepo-template lädt das login-Remote',
      ],
    },
    {
      id: 'rendering',
      titleKey: 'home.section.rendering',
      items: [
        'Durchgängig Angular-21-Standalone-Components; ChangeDetectionStrategy.OnPush als Standard',
        'Server-Side Rendering via @angular/ssr (provideServerRendering(withRoutes(...)))',
        'Client-Hydration mit Event-Replay — provideClientHydration(withEventReplay())',
        'Lazy-geladene Feature-Routen via loadComponent; Remote-Routen via loadChildren',
        'Route-Guards: isAuthenticated, isAdmin, redirectIfAuthenticated (canActivate), featureFlagGuard (canMatch), unsavedChangesGuard (canDeactivate)',
        'Wildcard-Route → 404-NotFound-Component',
      ],
    },
    {
      id: 'state',
      titleKey: 'home.section.state',
      items: [
        "NgRx SignalStore (@ngrx/signals) — providedIn: 'root' für übergreifende Stores",
        'Eigene withBaseStore()-Feature: cache-bewusstes load / reload / reset mit QueryState (data | loading | error | loaded)',
        'rxMethod + tapResponse für stream-basierte Fetcher; patchState für gezielte Updates',
        'Lokaler Component-State via signal(); abgeleitet via computed(); Seiteneffekte via effect()',
        'Übergreifender Shared-Store: OrdersDataStore in core, genutzt vom orders-Feature',
      ],
    },
    {
      id: 'realtime',
      titleKey: 'home.section.realtime',
      items: [
        'WebSocket-RealtimeService mit Auto-Reconnect (3 s) und signal-basiertem Verbindungsstatus',
        'Order-Events als typisiertes RxJS-Subject (order:created / updated / deleted)',
        'Web Vitals: CLS, INP, LCP, FCP, TTFB per Dynamic-Import gemessen (nur im Browser)',
        'Pro Navigation generierte Trace-IDs (TraceService), als X-Trace-Id-Header weitergereicht',
        'Globaler ErrorHandler (GlobalErrorHandler) speist strukturierten LoggerService',
      ],
    },
    {
      id: 'crosscutting',
      titleKey: 'home.section.crosscutting',
      items: [
        'HTTP-Interceptors: authInterceptor (Bearer + X-Trace-Id), errorInterceptor (401 → Logout)',
        'provideHttpClient(withFetch(), withInterceptors([...])) — Fetch-basierter HTTP-Client',
        'Fake-JWT-Auth im localStorage (demo / admin), inkl. exp-basierter isTokenExpired()-Prüfung',
        'Feature-Flags beim Start via provideAppInitializer aus json-server geladen',
        'Backend-Konfiguration über InjectionToken (BACKEND_CONFIG) und app-spezifischen Provider',
      ],
    },
    {
      id: 'ui',
      titleKey: 'home.section.ui',
      items: [
        'Eigenes i18n: signal-basierte Locale (EN / DE), pure Pipe ({{ key | t }}), Sprachumschalter',
        'Theme-Service: light / dark / system, synchron mit prefers-color-scheme + localStorage',
        'Barrierefreiheit: Skip-Link, ARIA-Labels, sr-only aria-live-Region, fokussierbare Controls',
        'Storybook 10 mit @storybook/addon-a11y für UI-Bausteine (button, card, alert)',
        'Design-Tokens (Farben, Spacing, Typografie) in SCSS — einzige Wahrheit über --ds-*-Variablen',
      ],
    },
    {
      id: 'tooling',
      titleKey: 'home.section.tooling',
      items: [
        'Jest-Unit-Tests in allen Projekten; Cypress-E2E für host und login',
        'ESLint 9 (Flat-Config), Prettier, Husky + lint-staged beim Commit',
        'Pro-App-GitHub-Actions-Pipelines: ci-host.yml, ci-login.yml, ci-json-server.yml',
        'Mehrservice-Docker-Compose (host-SSR, login-Remote, json-server) mit Dev-/Prod-Overrides',
        'Produktiv-Deploy auf EC2 via SSH; Image auf Docker Hub (mzahed23/angular-monorepo-template)',
      ],
    },
  ],
};

@Component({
  selector: 'ng-mf-nx-welcome',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .home-intro {
        font-size: 1rem;
        line-height: 1.6;
        color: var(--color-text-muted);
        margin: 1.5rem 0 2rem;
        max-width: 60ch;
      }
      .flags-card {
        padding: 1.25rem 1.5rem;
        margin-bottom: 2rem;
      }
      .flags-card h2 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.25rem;
        color: var(--color-text);
      }
      .flags-hint {
        font-size: 0.8125rem;
        color: var(--color-text-muted);
        margin: 0 0 0.75rem;
      }
      .flags-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .flags-list li {
        font-size: 0.8125rem;
      }
      .tech-section {
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }
      .tech-section h2 {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 0.75rem;
        color: var(--color-primary);
        letter-spacing: -0.01em;
      }
      .tech-section ul {
        margin: 0;
        padding-left: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .tech-section li {
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--color-text);
      }
      .home-footer {
        margin-top: 2.5rem;
        font-size: 0.8125rem;
        color: var(--color-text-muted);
        text-align: center;
      }
    `,
  ],
  template: `
    <div class="wrapper">
      <div class="container">
        <div id="welcome">
          <h1>
            <span> Hello there, </span>
            Welcome angular-monorepo-template 👋💃🏻🪩🎶
          </h1>
        </div>

        <p class="home-intro">{{ 'home.intro' | t }}</p>

        <section
          class="card flags-card rounded shadow"
          aria-labelledby="flags-title"
        >
          <h2 id="flags-title">{{ 'home.flags.title' | t }}</h2>
          <p class="flags-hint">{{ 'home.flags.hint' | t }}</p>
          <ul class="flags-list">
            <li>
              <span
                class="badge"
                [class.badge--success]="showStatistics"
                [class.badge--neutral]="!showStatistics"
              >
                {{ 'home.flag.statistics' | t }} ·
                {{ (showStatistics ? 'home.flag.on' : 'home.flag.off') | t }}
              </span>
            </li>
            <li>
              <span
                class="badge"
                [class.badge--success]="showInvoices"
                [class.badge--neutral]="!showInvoices"
              >
                {{ 'home.flag.invoices' | t }} ·
                {{ (showInvoices ? 'home.flag.on' : 'home.flag.off') | t }}
              </span>
            </li>
            <li>
              <span
                class="badge"
                [class.badge--success]="showOrders"
                [class.badge--neutral]="!showOrders"
              >
                {{ 'home.flag.orders' | t }} ·
                {{ (showOrders ? 'home.flag.on' : 'home.flag.off') | t }}
              </span>
            </li>
          </ul>
        </section>

        @for (section of sections(); track section.id) {
          <section
            class="card tech-section rounded shadow"
            [attr.aria-labelledby]="'sec-' + section.id"
          >
            <h2 [id]="'sec-' + section.id">{{ section.titleKey | t }}</h2>
            <ul>
              @for (item of section.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </section>
        }

        <p class="home-footer">{{ 'home.footer' | t }}</p>
      </div>
    </div>
  `,
})
export class NxWelcome {
  private featureFlagService = inject(FeatureFlagService);
  private i18n = inject(I18nService);

  readonly showStatistics = this.featureFlagService.isEnabled('statistics');
  readonly showInvoices = this.featureFlagService.isEnabled('invoices');
  readonly showOrders = this.featureFlagService.isEnabled('orders');

  readonly sections = computed(() => SECTIONS[this.i18n.locale()]);
}
