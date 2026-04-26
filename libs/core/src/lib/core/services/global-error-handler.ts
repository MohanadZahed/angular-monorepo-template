import { ErrorHandler, Injectable, inject } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logger = inject(LoggerService);

  handleError(error: unknown): void {
    const payload = this.normalize(error);
    this.logger.error('Uncaught error', payload);
  }

  private normalize(error: unknown): Record<string, unknown> {
    const url = typeof window !== 'undefined' ? window.location.href : 'server';
    const timestamp = new Date().toISOString();
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        url,
        timestamp,
      };
    }
    return { value: String(error), url, timestamp };
  }
}
