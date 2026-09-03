import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { BasketService } from '../../core/services/basket.service';
import { ProductDto } from '../../core/models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
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
    if (product) {
      this.basket.addItem(product, this.quantity());
    }
  }
}