import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BasketService } from '../../core/services/basket.service';
import { BasketItemDto } from '../../core/models/basket.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  basket = inject(BasketService);

  updateQuantity(item: BasketItemDto, quantity: string): void {
    this.basket.updateQuantity(item, Number(quantity));
  }

  removeItem(item: BasketItemDto): void {
    this.basket.removeItem(item);
  }
}