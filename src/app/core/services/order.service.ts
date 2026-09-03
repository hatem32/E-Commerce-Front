import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeliveryMethodDto, OrderDto, OrderToReturnDto } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/orders`;

  getDeliveryMethods(): Observable<DeliveryMethodDto[]> {
    return this.http.get<DeliveryMethodDto[]>(`${this.baseUrl}/deliveryMethods`);
  }

  createOrder(order: OrderDto): Observable<OrderToReturnDto> {
    return this.http.post<OrderToReturnDto>(this.baseUrl, order);
  }

  getOrders(): Observable<OrderToReturnDto[]> {
    return this.http.get<OrderToReturnDto[]>(this.baseUrl);
  }

  getOrder(id: string): Observable<OrderToReturnDto> {
    return this.http.get<OrderToReturnDto>(`${this.baseUrl}/${id}`);
  }
}