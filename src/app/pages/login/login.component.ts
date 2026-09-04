import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginDto } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  credentials: LoginDto = { email: '', password: '' };
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  submit(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.auth.login(this.credentials).subscribe({
      next: () => {
        this.loading.set(false);
        // Admins are sent to the separate MVC dashboard; everyone else goes back
        // to whichever page asked them to log in (e.g. Add to Cart), or home.
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? undefined;
        this.auth.redirectAfterLogin(returnUrl);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Invalid email or password.');
      }
    });
  }
}