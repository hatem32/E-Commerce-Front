import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/Notification.service';
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
  private router = inject(Router);
  private notify = inject(NotificationService);

  credentials: LoginDto = { email: '', password: '' };
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  submit(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.auth.login(this.credentials).subscribe({
      next: () => {
        this.loading.set(false);
        this.notify.success('Welcome back!');
        // Admins are sent to the built-in admin panel; everyone else goes back
        // to whichever page asked them to log in (e.g. Add to Cart), or home.
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? undefined;
        this.auth.redirectAfterLogin(returnUrl);
      },
      error: (err) => {
        this.loading.set(false);

        if (err?.status === 401 && err?.error?.detail?.includes('verify your email')) {
          this.router.navigate(['/verify-otp'], { queryParams: { email: this.credentials.email } });
          this.notify.info('Please verify your email to continue.');
          return;
        }

        this.errorMessage.set('Invalid email or password.');
      }
    });
  }
}