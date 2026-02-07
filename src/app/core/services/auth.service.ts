import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal(false);

  constructor(private readonly router: Router) {}

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    if (password.length < 6) {
      return throwError(() => new Error('Invalid credentials'));
    }

    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: 'admin',
    };

    const payload = btoa(JSON.stringify(user));
    const token = `fake.${payload}.token`;

    return of({ token, user }).pipe(
      delay(800),
      tap(({ token, user }) => {
        this.setToken(token);
        this.currentUser.set(user);
      }),
    );
  }

  init(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const payload = token.split('.')[1];
      const user: User = JSON.parse(atob(payload));
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    } catch {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    this.isAuthenticated.set(true);
  }
}
