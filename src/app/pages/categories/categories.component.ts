import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { BrandDto, TypeDto } from '../../core/models/product.model';

const CATEGORY_ICONS: Record<string, string> = {
  Smartphones: 'fa-mobile-screen',
  Laptops: 'fa-laptop',
  Headphones: 'fa-headphones',
  'T-Shirts': 'fa-shirt',
  Shoes: 'fa-shoe-prints',
  Jackets: 'fa-vest',
  Furniture: 'fa-couch',
  Cookware: 'fa-kitchen-set',
  Fiction: 'fa-book',
  'Non-Fiction': 'fa-book-open',
  'Building Sets': 'fa-cubes',
  'Board Games': 'fa-dice',
  Skincare: 'fa-pump-soap',
  Makeup: 'fa-palette',
  'Fitness Equipment': 'fa-dumbbell',
  'Outdoor Gear': 'fa-campground',
  Snacks: 'fa-cookie-bite',
  Beverages: 'fa-mug-hot',
  'Home Appliances': 'fa-blender',
  'Pet Food': 'fa-bone'
};
const DEFAULT_CATEGORY_ICON = 'fa-tag';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  private productService = inject(ProductService);

  types = signal<TypeDto[]>([]);
  brands = signal<BrandDto[]>([]);

  ngOnInit(): void {
    this.productService.getTypes().subscribe(t => this.types.set(t));
    this.productService.getBrands().subscribe(b => this.brands.set(b));
  }

  iconFor(typeName: string): string {
    return CATEGORY_ICONS[typeName] ?? DEFAULT_CATEGORY_ICON;
  }
}