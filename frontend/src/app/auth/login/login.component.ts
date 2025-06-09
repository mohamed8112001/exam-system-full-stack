import { Component  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  imports:  [FormsModule , RouterLink, ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
  const success = this.authService.login(this.email, this.password);
  
  if (!success) {
    alert('Invalid email or password!');
    return;
  }

  const role = this.authService.getUserType();
  if (role === 'admin') {
    this.router.navigate(['/admin/dashboard']);
  } else if (role === 'student') {
    this.router.navigate(['/student/exams']);
  }
}
}