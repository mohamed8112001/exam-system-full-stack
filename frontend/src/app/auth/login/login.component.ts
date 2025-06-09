import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const result = this.authService.login(this.email, this.password);
    if (result) {
      console.log(' Login successful:', result);

      const role = this.authService.getUserType();
      if (role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else if (role === 'student') {
        this.router.navigate(['/student/exams']);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      console.error(' Login failed');
      alert('Invalid email or password!');
    }
  }
}
