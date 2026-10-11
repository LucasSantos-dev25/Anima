import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';

import { environment } from '@env/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokenKey = 'anima.token';
  private readonly authUrl = `${environment.apiUrl}/auth`;
  private readonly usersUrl = `${environment.apiUrl}/users`;

  private readonly _token = signal<string | null>(this.readToken());
  private readonly _user = signal<User | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  register(body: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/register`, body);
  }

  login(body: LoginRequest): Observable<User> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, body).pipe(
      tap((res) => this.saveToken(res.token)),
      switchMap(() => this.loadMe()),
    );
  }

  loadMe(): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/me`).pipe(tap((user) => this._user.set(user)));
  }

  setUser(user: User): void {
    this._user.set(user);
  }

  logout(): void {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch {
      // armazenamento indisponível: segue sem persistir
    }
    this._token.set(null);
    this._user.set(null);
    void this.router.navigate(['/login']);
  }

  private saveToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch {
      // armazenamento indisponível: o token fica só em memória
    }
    this._token.set(token);
  }

  private readToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }
}