import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(email: string, password: string) {
    if (email.includes('admin')) {
      localStorage.setItem('userType', 'admin');
    } else {
      localStorage.setItem('userType', 'student');
    }
  }

  logout() {
    localStorage.removeItem('userType');
  }

  getUserType() {
    return localStorage.getItem('userType');
  }

  isLoggedIn() {
    return !!this.getUserType();
  }
}
