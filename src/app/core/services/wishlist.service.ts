import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WishlistItemDto } from '../models/wishlist.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/wishlist`;

  private itemsSignal = signal<WishlistItemDto[]>([]);
  items = computed(() => this.itemsSignal());
  count = computed(() => this.itemsSignal().length);

  private loggedIn = false;

  /** Called by AuthService on login/logout/app startup - same pattern as BasketService. */
  setUser(email: string | null): void {
    this.loggedIn = !!email;

    if (email) {
      this.load();
    } else {
      this.itemsSignal.set([]);
    }
  }

  load(): void {
    if (!this.loggedIn) return;

    this.http.get<WishlistItemDto[]>(this.baseUrl).pipe(
      catchError(() => of([]))
    ).subscribe(items => this.itemsSignal.set(items));
  }

  isWishlisted(productId: number): boolean {
    return this.itemsSignal().some(i => i.productId === productId);
  }

  add(productId: number): void {
    this.http.post<WishlistItemDto>(`${this.baseUrl}/${productId}`, {}).subscribe(item => {
      this.itemsSignal.update(items => [...items, item]);
    });
  }

  remove(productId: number): void {
    this.http.delete(`${this.baseUrl}/${productId}`).subscribe(() => {
      this.itemsSignal.update(items => items.filter(i => i.productId !== productId));
    });
  }

  toggle(productId: number): void {
    if (this.isWishlisted(productId)) {
      this.remove(productId);
    } else {
      this.add(productId);
    }
  }
}