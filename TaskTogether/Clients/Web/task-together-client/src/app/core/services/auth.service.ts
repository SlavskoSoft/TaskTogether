import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'tt_token';

  constructor(private http: HttpClient) {
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
      tap((res) => {
        if (res?.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.loadCurrentUser();
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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
        next: (user) => this.currentUserSubject.next(user),
        error: () => {
          this.logout();
        },
      });
    }
  }
}
