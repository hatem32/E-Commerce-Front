import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BasketDto } from '../models/basket.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/payments`;

  createOrUpdatePaymentIntent(basketId: string): Observable<BasketDto> {
    return this.http.post<BasketDto>(`${this.baseUrl}/${basketId}`, {});
  }
}