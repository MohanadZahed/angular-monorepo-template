import {
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { BACKEND_CONFIG } from '../config';
import { LoggerService } from './logger.service';

export interface OrderEventPayload {
  id: string;
  customer: string;
  items: number;
  amount: number;
  status: string;
  date: string;
}

export type RealtimeEvent =
  | { type: 'order:created'; payload: OrderEventPayload }
  | { type: 'order:updated'; payload: OrderEventPayload }
  | { type: 'order:deleted'; payload: OrderEventPayload };

const RECONNECT_DELAY_MS = 3000;

@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private config = inject(BACKEND_CONFIG);
  private logger = inject(LoggerService);

  private socket?: WebSocket;
  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private destroyed = false;

  readonly events$ = new Subject<RealtimeEvent>();
  readonly connected = signal(false);

  constructor() {
    this.connect();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.socket?.close();
    this.socket = undefined;
  }

  private connect(): void {
    if (this.destroyed) return;
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof WebSocket === 'undefined') return;

    const url = this.config.rest.wsUrl;
    if (!url) return;

    try {
      const socket = new WebSocket(url);
      this.socket = socket;

      socket.addEventListener('open', () => {
        this.connected.set(true);
        this.logger.info('Realtime connected', { url });
      });

      socket.addEventListener('message', (ev) => {
        try {
          const data = JSON.parse(ev.data) as RealtimeEvent;
          this.events$.next(data);
        } catch (err) {
          this.logger.error('Realtime parse failed', { error: String(err) });
        }
      });

      socket.addEventListener('close', () => {
        this.connected.set(false);
        this.socket = undefined;
        this.scheduleReconnect();
      });

      socket.addEventListener('error', () => {
        this.logger.warn('Realtime socket error');
      });
    } catch (err) {
      this.logger.error('Realtime connect failed', { error: String(err) });
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.destroyed || this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.connect();
    }, RECONNECT_DELAY_MS);
  }
}
