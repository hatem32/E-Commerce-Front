import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/Notification.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './verify-otp.component.html'
})
export class VerifyOtpComponent {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private notify = inject(NotificationService);

  email = this.route.snapshot.queryParamMap.get('email') ?? '';
  otp = '';

  loading = signal(false);
  resending = signal(false);
  errorMessage = signal<string | null>(null);

  submit(): void {
    if (this.otp.length !== 6) return;

    this.errorMessage.set(null);
    this.loading.set(true);

    this.auth.verifyOtp({ email: this.email, otp: this.otp }).subscribe({
      next: () => {
        this.loading.set(false);
        this.notify.success('Email verified! Welcome to E-Shop.');
        this.auth.redirectAfterLogin();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.detail ?? 'That code is invalid or has expired.');
      }
    });
  }

  resend(): void {
    if (!this.email) return;

    this.resending.set(true);

    this.auth.resendOtp(this.email).subscribe({
      next: () => {
        this.resending.set(false);
        this.notify.success('A new code has been sent to your email.');
      },
      error: (err) => {
        this.resending.set(false);
        this.notify.error(err?.error?.detail ?? 'Could not resend the code. Please try again.');
      }
    });
  }
}