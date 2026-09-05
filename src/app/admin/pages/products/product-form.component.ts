import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AdminProductService } from '../../core/services/AdminProduct.service ';
import { BrandDto, TypeDto } from '../../../core/models/product.model';
import { ProductFormPayload } from '../../core/models/admin.models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private adminProductService = inject(AdminProductService);

  isEdit = false;
  productId: number | null = null;

  brands = signal<BrandDto[]>([]);
  types = signal<TypeDto[]>([]);

  model: ProductFormPayload = { name: '', description: '', price: 0, brandId: 0, typeId: 0, pictureUrl: '' };
  imagePreviewUrl = signal<string | null>(null);
  private selectedFile: File | null = null;

  saving = signal(false);
  uploadingImage = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.productService.getBrands().subscribe(b => this.brands.set(b));
    this.productService.getTypes().subscribe(t => this.types.set(t));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.productId = Number(idParam);

      this.productService.getProduct(this.productId).subscribe(product => {
        this.model = {
          name: product.name,
          description: product.description,
          price: product.price,
          brandId: product.brandId,
          typeId: product.typeId,
          pictureUrl: product.pictureUrl
        };
        this.imagePreviewUrl.set(product.pictureUrl);
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = e => this.imagePreviewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  submit(): void {
    this.errorMessage.set(null);

    if (!this.model.brandId || !this.model.typeId) {
      this.errorMessage.set('Please select a brand and a type.');
      return;
    }

    if (this.selectedFile) {
      this.uploadingImage.set(true);
      this.adminProductService.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          this.uploadingImage.set(false);
          this.model.pictureUrl = res.pictureUrl;
          this.saveProduct();
        },
        error: () => {
          this.uploadingImage.set(false);
          this.errorMessage.set('Image upload failed. Please try a different image.');
        }
      });
    } else {
      this.saveProduct();
    }
  }

  private saveProduct(): void {
    this.saving.set(true);

    const request = this.isEdit && this.productId
      ? this.adminProductService.updateProduct(this.productId, this.model)
      : this.adminProductService.createProduct(this.model);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigateByUrl('/admin/products');
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Could not save the product. Please check your details.');
      }
    });
  }
}