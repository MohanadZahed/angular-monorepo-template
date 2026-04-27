import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BACKEND_CONFIG } from '../config/backend/backend-config.token';
import { TraceService } from './trace.service';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  traceId: string;
  ts: string;
}

const FLUSH_INTERVAL_MS = 5000;
const MAX_BUFFER = 50;

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private platformId = inject(PLATFORM_ID);
  private trace = inject(TraceService);
  private config = inject(BACKEND_CONFIG);

  private buffer: LogEntry[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  flush(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.buffer.length) return;
    const logsUrl = this.config.rest.logsUrl;
    if (!logsUrl) {
      this.buffer = [];
      return;
    }
    const batch = this.buffer;
    this.buffer = [];
    fetch(logsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
      keepalive: true,
    }).catch(() => {
      // swallow — logging failures must not break the app
    });
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
  ): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      traceId: this.trace.traceId(),
      ts: new Date().toISOString(),
    };
    this.toConsole(entry);
    if (!isPlatformBrowser(this.platformId)) return;
    this.buffer.push(entry);
    this.ensureTimer();
    if (this.buffer.length >= MAX_BUFFER) this.flush();
  }

  private ensureTimer(): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);
  }

  private toConsole(entry: LogEntry): void {
    const tag = `[${entry.level.toUpperCase()}][${entry.traceId}]`;
    const args = entry.context ? [entry.context] : [];
    if (entry.level === 'debug') console.debug(tag, entry.message, ...args);
    else if (entry.level === 'info') console.info(tag, entry.message, ...args);
    else if (entry.level === 'warn') console.warn(tag, entry.message, ...args);
    else console.error(tag, entry.message, ...args);
  }
}
