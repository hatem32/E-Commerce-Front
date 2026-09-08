import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProductDto, TypeDto } from '../../core/models/product.model';
import { BasketService } from '../../core/services/basket.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/Notification.service';
import { WishlistButtonComponent } from '../../shared/wishlist-button/wishlist-button.component';

// A representative icon per known type name, with a sane fallback for anything new.
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
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, FormsModule, WishlistButtonComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);
  basket = inject(BasketService);

  featuredProducts = signal<ProductDto[]>([]);
  categories = signal<TypeDto[]>([]);
  newsletterEmail = '';

  ngOnInit(): void {
    this.productService.getProducts({ pageIndex: 1, pageSize: 8 })
      .subscribe(result => this.featuredProducts.set(result.data));

    this.productService.getTypes().subscribe(types => this.categories.set(types.slice(0, 8)));
  }

  iconFor(typeName: string): string {
    return CATEGORY_ICONS[typeName] ?? DEFAULT_CATEGORY_ICON;
  }

  addToCart(product: ProductDto, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.auth.requireLogin(this.router.url)) {
      return;
    }

    this.basket.addItem(product);
    this.notify.success(`${product.name} added to cart`);
  }

  subscribeNewsletter(): void {
    if (!this.newsletterEmail.trim()) return;

    this.notify.success("You're subscribed! Watch your inbox for deals.");
    this.newsletterEmail = '';
  }
}