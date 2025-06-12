import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3001/api/auth'; 

  constructor(private http: HttpClient) {}

  /**
   * 
   * @param email
   * @param password 
   * @returns 
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password });
  }

  /**
   * @param user 
   * @returns 
   */
  register(user: User): Observable<any> {
    return this.http.post<any>('http://localhost:3001/api/auth/register', user);
  }

  createExam(examData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(
      'http://localhost:3001/api/exams',
      examData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  /**
   * 
   * @returns 
   */
  getUserType(): string {
    return localStorage.getItem('role') || '';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}
