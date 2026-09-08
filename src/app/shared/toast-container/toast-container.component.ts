import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/services/Notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  templateUrl: './toast-container.component.html'
})
export class ToastContainerComponent {
  notifications = inject(NotificationService);

  iconFor(type: string): string {
    switch (type) {
      case 'success': return 'fa-circle-check';
      case 'error': return 'fa-circle-exclamation';
      default: return 'fa-circle-info';
    }
  }
}