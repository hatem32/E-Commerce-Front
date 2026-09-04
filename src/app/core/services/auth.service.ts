import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrentUser, LoginDto, RegisterDto, UserDto } from '../models/auth.model';
import { BasketService } from './basket.service';

const TOKEN_KEY = 'ecommerce_token';
const USER_KEY = 'ecommerce_user';

// This is the standard System.Security.Claims.ClaimTypes.Role URI - it's what
// the API's TokenService actually puts in the JWT (not a plain "role" key).
const ROLE_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private basketService = inject(BasketService);

  private userSignal = signal<CurrentUser | null>(this.readUserFromStorage());
  currentUser = computed(() => this.userSignal());
  isLoggedIn = computed(() => this.userSignal() !== null);

  constructor() {
    // Scope (or clear) the cart to whoever is logged in right from app startup.
    this.basketService.setUser(this.userSignal()?.email ?? null);
  }

  login(dto: LoginDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${environment.apiUrl}/authentication/login`, dto).pipe(
      tap(user => this.setSession(user))
    );
  }

  register(dto: RegisterDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${environment.apiUrl}/authentication/register`, dto).pipe(
      tap(user => this.setSession(user))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSignal.set(null);
    this.basketService.setUser(null);
    this.router.navigateByUrl('/');
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /** Call right after login/register: sends admins to the MVC dashboard instead of the storefront. */
  redirectAfterLogin(returnUrl?: string): void {
    const user = this.userSignal();
    if (user?.isAdmin) {
      window.location.href = environment.adminDashboardUrl;
    } else {
      this.router.navigateByUrl(returnUrl || '/');
    }
  }

  /**
   * Guard for actions that require login (e.g. adding to cart) without a full route guard.
   * Returns true if already logged in; otherwise redirects to /login and returns false.
   */
  requireLogin(returnUrl: string): boolean {
    if (this.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl } });
    return false;
  }

  private setSession(user: UserDto): void {
    const isAdmin = this.hasAdminRole(user.token);
    const currentUser: CurrentUser = { email: user.email, displayName: user.displayName, isAdmin };

    localStorage.setItem(TOKEN_KEY, user.token);
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    this.userSignal.set(currentUser);
    this.basketService.setUser(currentUser.email);
  }

  private hasAdminRole(token: string): boolean {
    const payload = this.decodeJwt(token);
    if (!payload) return false;

    const role = payload[ROLE_CLAIM];
    if (!role) return false;

    return Array.isArray(role) ? role.includes('Admin') : role === 'Admin';
  }

  private decodeJwt(token: string): Record<string, any> | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private readUserFromStorage(): CurrentUser | null {
    const token = this.getToken();
    const rawUser = localStorage.getItem(USER_KEY);
    if (!token || !rawUser) return null;

    const payload = this.decodeJwt(token);
    // Basic expiry check so a stale token doesn't look "logged in".
    if (!payload || (payload['exp'] && Date.now() >= payload['exp'] * 1000)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }

    try {
      return JSON.parse(rawUser) as CurrentUser;
    } catch {
      return null;
    }
  }
}