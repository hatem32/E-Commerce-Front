import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BasketService } from '../../core/services/basket.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  auth = inject(AuthService);
  basket = inject(BasketService);
  wishlist = inject(WishlistService);
  theme = inject(ThemeService);

  logout(): void {
    this.auth.logout();
  }
}