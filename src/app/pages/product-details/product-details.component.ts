import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { BasketService } from '../../core/services/basket.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductDto } from '../../core/models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private auth = inject(AuthService);
  basket = inject(BasketService);

  product = signal<ProductDto | null>(null);
  quantity = signal(1);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe(product => this.product.set(product));
  }

  increment(): void {
    this.quantity.update(q => q + 1);
  }

  decrement(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart(): void {
    const product = this.product();
    if (!product) return;

    if (!this.auth.requireLogin(this.router.url)) {
      return;
    }

    this.basket.addItem(product, this.quantity());
  }
}