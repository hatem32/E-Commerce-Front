import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProductDto } from '../../core/models/product.model';
import { BasketService } from '../../core/services/basket.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private auth = inject(AuthService);
  private router = inject(Router);
  basket = inject(BasketService);

  featuredProducts = signal<ProductDto[]>([]);

  ngOnInit(): void {
    this.productService.getProducts({ pageIndex: 1, pageSize: 8 })
      .subscribe(result => this.featuredProducts.set(result.data));
  }

  addToCart(product: ProductDto, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.auth.requireLogin(this.router.url)) {
      return;
    }

    this.basket.addItem(product);
  }
}