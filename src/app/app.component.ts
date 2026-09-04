import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  // Injecting AuthService here guarantees it (and therefore BasketService.setUser)
  // runs once at app startup, even if no page happens to inject AuthService first.
  private auth = inject(AuthService);
}