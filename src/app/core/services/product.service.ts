import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BrandDto, PaginatedResult, ProductDto, ProductQueryParams, TypeDto } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/products`;

  getProducts(query: ProductQueryParams): Observable<PaginatedResult<ProductDto>> {
    let params = new HttpParams()
      .set('pageIndex', query.pageIndex ?? 1)
      .set('pageSize', query.pageSize ?? 5);

    if (query.brandId) params = params.set('brandId', query.brandId);
    if (query.typeId) params = params.set('typeId', query.typeId);
    if (query.sort !== undefined && query.sort !== null) params = params.set('sort', query.sort);
    if (query.searchValue) params = params.set('searchValue', query.searchValue);

    return this.http.get<PaginatedResult<ProductDto>>(this.baseUrl, { params });
  }

  getProduct(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.baseUrl}/${id}`);
  }

  getBrands(): Observable<BrandDto[]> {
    return this.http.get<BrandDto[]>(`${this.baseUrl}/brands`);
  }

  getTypes(): Observable<TypeDto[]> {
    return this.http.get<TypeDto[]>(`${this.baseUrl}/types`);
  }
}