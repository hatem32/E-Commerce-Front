import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BrandDto, ProductDto, TypeDto } from '../../../core/models/product.model';
import { NameFormPayload, ProductFormPayload } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/products`;

  createProduct(payload: ProductFormPayload): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.baseUrl, payload);
  }

  updateProduct(id: number, payload: ProductFormPayload): Observable<ProductDto> {
    return this.http.put<ProductDto>(`${this.baseUrl}/${id}`, payload);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadImage(file: File): Observable<{ pictureUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ pictureUrl: string }>(`${this.baseUrl}/images`, formData);
  }

  createBrand(payload: NameFormPayload): Observable<BrandDto> {
    return this.http.post<BrandDto>(`${this.baseUrl}/brands`, payload);
  }

  updateBrand(id: number, payload: NameFormPayload): Observable<BrandDto> {
    return this.http.put<BrandDto>(`${this.baseUrl}/brands/${id}`, payload);
  }

  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/brands/${id}`);
  }

  createType(payload: NameFormPayload): Observable<TypeDto> {
    return this.http.post<TypeDto>(`${this.baseUrl}/types`, payload);
  }

  updateType(id: number, payload: NameFormPayload): Observable<TypeDto> {
    return this.http.put<TypeDto>(`${this.baseUrl}/types/${id}`, payload);
  }

  deleteType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/types/${id}`);
  }
}