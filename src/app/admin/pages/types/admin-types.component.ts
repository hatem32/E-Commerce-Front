import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { AdminProductService } from '../../core/services/AdminProduct.service ';
import { NotificationService } from '../../../core/services/Notification.service';
import { TypeDto } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-types',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-types.component.html'
})
export class AdminTypesComponent implements OnInit {
  private productService = inject(ProductService);
  private adminProductService = inject(AdminProductService);
  private notify = inject(NotificationService);

  types = signal<TypeDto[]>([]);
  newName = '';
  editingId = signal<number | null>(null);
  editingName = '';
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.productService.getTypes().subscribe(b => this.types.set(b));
  }

  add(): void {
    if (!this.newName.trim()) return;
    this.errorMessage.set(null);

    this.adminProductService.createType({ name: this.newName.trim() }).subscribe({
      next: () => { this.newName = ''; this.load(); this.notify.success('Type added'); },
      error: (err) => this.errorMessage.set(err?.error?.detail ?? 'Could not add type.')
    });
  }

  startEdit(type: TypeDto): void {
    this.editingId.set(type.id);
    this.editingName = type.name;
  }

  saveEdit(id: number): void {
    if (!this.editingName.trim()) return;

    this.adminProductService.updateType(id, { name: this.editingName.trim() }).subscribe(() => {
      this.editingId.set(null);
      this.load();
      this.notify.success('Type updated');
    });
  }

  delete(type: TypeDto): void {
    if (!confirm(`Delete type "${type.name}"?`)) return;

    this.adminProductService.deleteType(type.id).subscribe({
      next: () => { this.load(); this.notify.success('Type deleted'); },
      error: (err) => {
        const message = err?.error?.detail ?? 'Could not delete this type.';
        alert(message);
        this.notify.error(message);
      }
    });
  }
}