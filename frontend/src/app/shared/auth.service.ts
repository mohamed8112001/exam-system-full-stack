import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api/auth';
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', response.role);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
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
