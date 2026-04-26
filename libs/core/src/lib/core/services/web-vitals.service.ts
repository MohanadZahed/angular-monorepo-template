import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoggerService } from './logger.service';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
}

@Injectable({ providedIn: 'root' })
export class WebVitalsService {
  private logger = inject(LoggerService);
  private platformId = inject(PLATFORM_ID);
  private started = false;

  async start(): Promise<void> {
    if (this.started || !isPlatformBrowser(this.platformId)) return;
    this.started = true;
    try {
      const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals');
      onCLS((m) => this.report(m));
      onINP((m) => this.report(m));
      onLCP((m) => this.report(m));
      onFCP((m) => this.report(m));
      onTTFB((m) => this.report(m));
    } catch (err) {
      this.logger.warn('web-vitals failed to load', err);
    }
  }

  private report(metric: VitalMetric): void {
    this.logger.info(
      `vital ${metric.name}=${metric.value.toFixed(2)} (${metric.rating})`,
    );
  }
}
