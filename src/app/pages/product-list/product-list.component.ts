import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { BasketService } from '../../core/services/basket.service';
import { AuthService } from '../../core/services/auth.service';
import { BrandDto, ProductDto, ProductQueryParams, TypeDto } from '../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private auth = inject(AuthService);
  private router = inject(Router);
  basket = inject(BasketService);

  products = signal<ProductDto[]>([]);
  brands = signal<BrandDto[]>([]);
  types = signal<TypeDto[]>([]);
  totalCount = signal(0);
  pageSize = 8;

  query: ProductQueryParams = { pageIndex: 1, pageSize: this.pageSize, sort: 0 };

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount() / this.pageSize));
  }

  ngOnInit(): void {
    this.productService.getBrands().subscribe(brands => this.brands.set(brands));
    this.productService.getTypes().subscribe(types => this.types.set(types));
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts(this.query).subscribe(result => {
      this.products.set(result.data);
      this.totalCount.set(result.count);
    });
  }

  onFilterChange(): void {
    this.query.pageIndex = 1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.query.pageIndex = page;
    this.loadProducts();
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