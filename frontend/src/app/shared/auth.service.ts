// src/app/shared/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../auth/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: User | null = null;

  constructor(private router: Router) {
    const stored = localStorage.getItem('loggedUser');
    this.currentUser = stored ? JSON.parse(stored) : null;
  }

  login(email: string, password: string): boolean {
    const stored = localStorage.getItem('registeredUser');
    if (!stored) return false;

    const user: User = JSON.parse(stored);
    if (user.email === email && user.password === password) {
      this.currentUser = user;
      localStorage.setItem('loggedUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  getUserType(): 'student' | 'admin' | null {
    return this.currentUser?.role ?? null;
  }
}
