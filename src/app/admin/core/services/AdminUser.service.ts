import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminRole, AdminUser } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/adminusers`;

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(this.baseUrl);
  }

  updateUserRoles(id: string, roles: string[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/roles`, { roles });
  }

  getRoles(): Observable<AdminRole[]> {
    return this.http.get<AdminRole[]>(`${this.baseUrl}/roles`);
  }

  createRole(name: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/roles`, { name });
  }

  deleteRole(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/roles/${id}`);
  }
}