import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.error = 'Email and password are required';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        
        const role = this.authService.getUserRole();
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'student') {
          this.router.navigate(['/student/exams']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.error = err.error?.message || 'Invalid email or password';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
