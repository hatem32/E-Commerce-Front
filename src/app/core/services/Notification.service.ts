import { Injectable, computed, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toastsSignal = signal<Toast[]>([]);
  toasts = computed(() => this.toastsSignal());

  private nextId = 1;

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }

  private show(message: string, type: ToastType): void {
    const id = this.nextId++;
    this.toastsSignal.update(toasts => [...toasts, { id, message, type }]);

    setTimeout(() => this.dismiss(id), 3500);
  }
}