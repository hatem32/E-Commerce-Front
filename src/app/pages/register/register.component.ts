import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/Notification.service';
import { RegisterDto } from '../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  model: RegisterDto = { email: '', password: '', userName: '', displayName: '', phoneNumber: '' };
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  submit(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.auth.register(this.model).subscribe({
      next: (result) => {
        this.loading.set(false);
        this.notify.success('Account created! Check your email for a verification code.');
        this.router.navigate(['/verify-otp'], { queryParams: { email: result.email } });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Could not create your account. Please check your details.');
      }
    });
  }
}