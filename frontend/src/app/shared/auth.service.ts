// frontend/src/app/shared/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(email: string, password: string): boolean {
    const storedUser = localStorage.getItem('registeredUser');
    if (!storedUser) return false;

    const user = JSON.parse(storedUser);

    if (user.email === email && user.password === password) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return true;
    }

    return false;
  }

  getUserType(): 'student' | 'admin' | null {
    const user = localStorage.getItem('loggedInUser');
    if (!user) return null;

    const parsedUser = JSON.parse(user);
    return parsedUser.role;
  }

  logout() {
    localStorage.removeItem('loggedInUser');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedInUser');
  }
}
