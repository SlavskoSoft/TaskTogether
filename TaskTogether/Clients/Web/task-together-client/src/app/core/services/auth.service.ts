import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthResponse {
  token?: string;
}

export interface CurrentUser {
  userId?: string;
  role?: string;
  familyId?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'tt_token';

  constructor() {
    this.loadCurrentUser();
  }

  register(email: string, password: string, role = 'Parent'): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', {
      email,
      password,
      role,
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap((res: any) => {
        if (res?.token) {
          this.setToken(res.token);
          this.loadCurrentUser();
        }
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Observable<CurrentUser | null> {
    return this.currentUser$;
  }

  private loadCurrentUser(): void {
    if (this.isAuthenticated()) {
      this.http.get<CurrentUser>('/api/auth/current').subscribe({
        next: (user: CurrentUser | null) => this.currentUserSubject.next(user),
        error: () => {
          this.logout();
        },
      });
    }
  }
}
