import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AdminOrderService } from '../../core/services/AdminOrder.service';
import { AdminUserService } from '../../core/services/AdminUser.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(AdminOrderService);
  private userService = inject(AdminUserService);

  productsCount = signal(0);
  brandsCount = signal(0);
  typesCount = signal(0);
  ordersCount = signal(0);
  usersCount = signal(0);

  ngOnInit(): void {
    this.productService.getProducts({ pageIndex: 1, pageSize: 1 }).subscribe(r => this.productsCount.set(r.count));
    this.productService.getBrands().subscribe(b => this.brandsCount.set(b.length));
    this.productService.getTypes().subscribe(t => this.typesCount.set(t.length));
    this.orderService.getAllOrders().subscribe(o => this.ordersCount.set(o.length));
    this.userService.getUsers().subscribe(u => this.usersCount.set(u.length));
  }
}