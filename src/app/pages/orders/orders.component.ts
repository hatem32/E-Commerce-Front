import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { OrderToReturnDto } from '../../core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  orders = signal<OrderToReturnDto[]>([]);

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(orders => this.orders.set(orders));
  }
}