import { Component, Input, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { NotificationService } from '../../core/services/Notification.service';

@Component({
  selector: 'app-wishlist-button',
  standalone: true,
  templateUrl: './wishlist-button.component.html'
})
export class WishlistButtonComponent {
  @Input({ required: true }) productId!: number;
  /** 'sm' for product cards in a grid, 'lg' for the product details page. */
  @Input() size: 'sm' | 'lg' = 'sm';
  /** Show the "Wishlist" / "Wishlisted" text next to the icon. */
  @Input() showLabel = false;

  private auth = inject(AuthService);
  private router = inject(Router);
  private wishlistService = inject(WishlistService);
  private notify = inject(NotificationService);

  loading = signal(false);

  get wishlisted(): boolean {
    return this.wishlistService.isWishlisted(this.productId);
  }

  toggle(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.loading()) return;

    if (!this.auth.requireLogin(this.router.url)) {
      return;
    }

    const wasWishlisted = this.wishlisted;
    this.loading.set(true);

    this.wishlistService.toggle(this.productId).subscribe({
      next: () => {
        this.loading.set(false);
        this.notify.success(wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
      },
      error: () => {
        this.loading.set(false);
        this.notify.error('Something went wrong. Please try again.');
      }
    });
  }
}