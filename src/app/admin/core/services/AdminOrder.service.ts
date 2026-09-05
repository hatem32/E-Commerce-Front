import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { OrderToReturnDto } from '../../../core/models/order.model';

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/orders`;

  getAllOrders(): Observable<OrderToReturnDto[]> {
    return this.http.get<OrderToReturnDto[]>(`${this.baseUrl}/admin/all`);
  }

  getOrder(id: string): Observable<OrderToReturnDto> {
    return this.http.get<OrderToReturnDto>(`${this.baseUrl}/${id}`);
  }

  // status is sent as its string name (e.g. "PaymentReceived") - matches the
  // OrderStatus enum names on the backend, which System.Text.Json accepts.
  updateStatus(id: string, status: string): Observable<OrderToReturnDto> {
    return this.http.put<OrderToReturnDto>(`${this.baseUrl}/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}