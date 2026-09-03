import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProductDto } from '../../core/models/product.model';
import { BasketService } from '../../core/services/basket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  basket = inject(BasketService);

  featuredProducts = signal<ProductDto[]>([]);

  ngOnInit(): void {
    this.productService.getProducts({ pageIndex: 1, pageSize: 8 })
      .subscribe(result => this.featuredProducts.set(result.data));
  }

  addToCart(product: ProductDto, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.basket.addItem(product);
  }
}