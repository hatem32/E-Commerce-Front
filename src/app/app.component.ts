import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastContainerComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  // Injecting these here guarantees they run once at app startup (auth session +
  // cart/wishlist scoping, and applying the saved light/dark theme) even if no
  // page happens to inject them first.
  private auth = inject(AuthService);
  private theme = inject(ThemeService);
}