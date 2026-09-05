import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AdminProductService } from '../../core/services/AdminProduct.service ';
import { ProductDto } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private adminProductService = inject(AdminProductService);

  products = signal<ProductDto[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.productService.getProducts({ pageIndex: 1, pageSize: 100 }).subscribe(r => this.products.set(r.data));
  }

  delete(product: ProductDto): void {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;

    this.adminProductService.deleteProduct(product.id).subscribe(() => this.load());
  }
}