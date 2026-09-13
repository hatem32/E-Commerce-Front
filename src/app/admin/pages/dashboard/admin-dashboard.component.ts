import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AdminOrderService } from '../../core/services/AdminOrder.service';
import { AdminUserService } from '../../core/services/AdminUser.service';
import { AdminStatsDto } from '../../core/models/stats.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(AdminOrderService);
  private userService = inject(AdminUserService);

  productsCount = signal(0);
  brandsCount = signal(0);
  typesCount = signal(0);
  usersCount = signal(0);

  stats = signal<AdminStatsDto | null>(null);

  maxDailyRevenue = computed(() => {
    const days = this.stats()?.revenueLast7Days ?? [];
    return Math.max(1, ...days.map(d => d.revenue));
  });

  ngOnInit(): void {
    this.productService.getProducts({ pageIndex: 1, pageSize: 1 }).subscribe(r => this.productsCount.set(r.count));
    this.productService.getBrands().subscribe(b => this.brandsCount.set(b.length));
    this.productService.getTypes().subscribe(t => this.typesCount.set(t.length));
    this.userService.getUsers().subscribe(u => this.usersCount.set(u.length));
    this.orderService.getStats().subscribe(s => this.stats.set(s));
  }

  barHeight(revenue: number): number {
    const max = this.maxDailyRevenue();
    return max > 0 ? Math.max(4, Math.round((revenue / max) * 100)) : 4;
  }
}