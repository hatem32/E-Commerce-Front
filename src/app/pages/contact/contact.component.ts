import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../core/services/Notification.service';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  private http = inject(HttpClient);
  private notify = inject(NotificationService);

  model: ContactForm = { name: '', email: '', subject: '', message: '' };
  sending = signal(false);

  submit(): void {
    if (!this.model.name || !this.model.email || !this.model.message) return;

    this.sending.set(true);

    this.http.post(`${environment.apiUrl}/contact`, this.model).subscribe({
      next: () => {
        this.sending.set(false);
        this.notify.success("Message sent! We'll get back to you soon.");
        this.model = { name: '', email: '', subject: '', message: '' };
      },
      error: () => {
        this.sending.set(false);
        this.notify.error('Could not send your message. Please try again or email us directly.');
      }
    });
  }
}