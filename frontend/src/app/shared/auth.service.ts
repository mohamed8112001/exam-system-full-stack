import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  role: string;
  username?: string;
  email?: string;
}

interface User {
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize user from localStorage if available
    this.initializeUser();
  }

  private initializeUser(): void {
    const token = this.getToken();
    const role = this.getUserRole();
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (token && role && username) {
      this.currentUserSubject.next({
        username,
        email: email || '',
        role
      });
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('username', response.username || email.split('@')[0]);
          localStorage.setItem('email', email);

          // Update current user
          this.currentUserSubject.next({
            username: response.username || email.split('@')[0],
            email: email,
            role: response.role
          });
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isStudent(): boolean {
    return this.getUserRole() === 'student';
  }
}
