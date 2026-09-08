import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminOrderService } from '../../core/services/AdminOrder.service';
import { NotificationService } from '../../../core/services/Notification.service';
import { OrderToReturnDto } from '../../../core/models/order.model';

const STATUSES = ['Pending', 'PaymentReceived', 'PaymentFailed'];

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(AdminOrderService);
  private notify = inject(NotificationService);

  orders = signal<OrderToReturnDto[]>([]);
  statuses = STATUSES;
  updatingId = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.orderService.getAllOrders().subscribe(o => this.orders.set(o));
  }

  changeStatus(order: OrderToReturnDto, status: string): void {
    this.updatingId.set(order.id);

    this.orderService.updateStatus(order.id, status).subscribe({
      next: () => {
        this.updatingId.set(null);
        this.load();
        this.notify.success(`Order status updated to ${status}`);
      },
      error: () => {
        this.updatingId.set(null);
        this.notify.error("Could not update this order's status.");
      }
    });
  }
}