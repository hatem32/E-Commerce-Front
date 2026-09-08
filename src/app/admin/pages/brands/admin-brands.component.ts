import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { AdminProductService } from '../../core/services/AdminProduct.service ';
import { NotificationService } from '../../../core/services/Notification.service';
import { BrandDto } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-brands.component.html'
})
export class AdminBrandsComponent implements OnInit {
  private productService = inject(ProductService);
  private adminProductService = inject(AdminProductService);
  private notify = inject(NotificationService);

  brands = signal<BrandDto[]>([]);
  newName = '';
  editingId = signal<number | null>(null);
  editingName = '';
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.productService.getBrands().subscribe(b => this.brands.set(b));
  }

  add(): void {
    if (!this.newName.trim()) return;
    this.errorMessage.set(null);

    this.adminProductService.createBrand({ name: this.newName.trim() }).subscribe({
      next: () => { this.newName = ''; this.load(); this.notify.success('Brand added'); },
      error: (err) => this.errorMessage.set(err?.error?.detail ?? 'Could not add brand.')
    });
  }

  startEdit(brand: BrandDto): void {
    this.editingId.set(brand.id);
    this.editingName = brand.name;
  }

  saveEdit(id: number): void {
    if (!this.editingName.trim()) return;

    this.adminProductService.updateBrand(id, { name: this.editingName.trim() }).subscribe(() => {
      this.editingId.set(null);
      this.load();
      this.notify.success('Brand updated');
    });
  }

  delete(brand: BrandDto): void {
    if (!confirm(`Delete brand "${brand.name}"?`)) return;

    this.adminProductService.deleteBrand(brand.id).subscribe({
      next: () => { this.load(); this.notify.success('Brand deleted'); },
      error: (err) => {
        const message = err?.error?.detail ?? 'Could not delete this brand.';
        alert(message);
        this.notify.error(message);
      }
    });
  }
}