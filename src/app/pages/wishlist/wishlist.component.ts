import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { BasketService } from '../../core/services/basket.service';
import { NotificationService } from '../../core/services/Notification.service';
import { WishlistItemDto } from '../../core/models/wishlist.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './wishlist.component.html'
})
export class WishlistComponent {
  wishlist = inject(WishlistService);
  private basket = inject(BasketService);
  private notify = inject(NotificationService);

  addToCart(item: WishlistItemDto): void {
    this.basket.addItem({
      id: item.productId,
      name: item.productName,
      pictureUrl: item.pictureUrl,
      price: item.price,
      description: '',
      brandId: 0,
      typeId: 0,
      productBrand: item.productBrand,
      productType: item.productType
    });
    this.notify.success(`${item.productName} added to cart`);
  }

  remove(item: WishlistItemDto): void {
    this.wishlist.remove(item.productId).subscribe(() => {
      this.notify.info('Removed from wishlist');
    });
  }
}