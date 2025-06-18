import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
}

export interface LoginRequest {
  username: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  userId?: number;
  username?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is logged in via session
    this.checkSessionStatus();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (response.success && response.userId && response.username) {
            const user: User = {
              id: response.userId,
              username: response.username,
            };
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }

  // Check if a username exists
  checkUsernameExists(username: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(
      `${this.apiUrl}/check-username/${username}`
    );
  }

  // Check session status
  private checkSessionStatus(): void {
    // For now, we'll assume the session is valid if we have a user
    // In a real application, you might want to make an API call to validate the session
    const userCookie = this.getCookie('currentUser');
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        if (user && user.id && user.username) {
          this.currentUserSubject.next(user);
        } else {
          this.deleteCookie('currentUser');
        }
    } catch (e) {
        console.error('Error parsing user cookie', e);
        this.deleteCookie('currentUser');
      }
    }
  }

  // Cookie management functions (keeping for backward compatibility)
  private setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = '; expires=' + date.toUTCString();
    document.cookie =
      name +
      '=' +
      encodeURIComponent(value) +
      expires +
      '; path=/; SameSite=Strict';
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie =
      name +
      '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
  }
}
