import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BasketDto, BasketItemDto } from '../models/basket.model';
import { ProductDto } from '../models/product.model';

const BASKET_ID_KEY = 'ecommerce_basket_id';

function generateBasketId(): string {
  return crypto.randomUUID();
}

@Injectable({ providedIn: 'root' })
export class BasketService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/baskets`;

  private basketSignal = signal<BasketDto | null>(null);
  basket = computed(() => this.basketSignal());
  itemCount = computed(() =>
    this.basketSignal()?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0
  );
  subTotal = computed(() =>
    this.basketSignal()?.items.reduce((sum, i) => sum + i.quantity * i.price, 0) ?? 0
  );

  get basketId(): string {
    let id = localStorage.getItem(BASKET_ID_KEY);
    if (!id) {
      id = generateBasketId();
      localStorage.setItem(BASKET_ID_KEY, id);
    }
    return id;
  }

  loadBasket(): void {
    this.http.get<BasketDto>(`${this.baseUrl}/${this.basketId}`).pipe(
      catchError(() => of({ id: this.basketId, items: [] } as BasketDto))
    ).subscribe(basket => this.basketSignal.set(basket));
  }

  addItem(product: ProductDto, quantity = 1): void {
    const current = this.basketSignal() ?? { id: this.basketId, items: [] };
    const items = [...current.items];
    const existing = items.find(i => i.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        id: product.id,
        productName: product.name,
        pictureUrl: product.pictureUrl,
        price: product.price,
        quantity
      });
    }

    this.saveBasket({ ...current, items });
  }

  updateQuantity(item: BasketItemDto, quantity: number): void {
    const current = this.basketSignal();
    if (!current) return;

    if (quantity <= 0) {
      this.removeItem(item);
      return;
    }

    const items = current.items.map(i => (i.id === item.id ? { ...i, quantity } : i));
    this.saveBasket({ ...current, items });
  }

  removeItem(item: BasketItemDto): void {
    const current = this.basketSignal();
    if (!current) return;

    const items = current.items.filter(i => i.id !== item.id);
    this.saveBasket({ ...current, items });
  }

  setDeliveryMethod(deliveryMethodId: number, shippingPrice: number): void {
    const current = this.basketSignal();
    if (!current) return;

    this.saveBasket({ ...current, deliveryMethodId, shippingPrice });
  }

  clearBasket(): void {
    this.http.delete(`${this.baseUrl}/${this.basketId}`).subscribe();
    localStorage.removeItem(BASKET_ID_KEY);
    this.basketSignal.set({ id: this.basketId, items: [] });
  }

  private saveBasket(basket: BasketDto): Observable<BasketDto> {
    const request = this.http.post<BasketDto>(this.baseUrl, basket).pipe(
      tap(saved => this.basketSignal.set(saved))
    );
    request.subscribe();
    return request;
  }
}