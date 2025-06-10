import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  role: 'student' | 'admin' = 'student';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
  console.log('Register clicked');

  if (this.password !== this.confirmPassword) {
    this.error = 'Passwords do not match!';
    return;
  }

  this.loading = true;

  const newUser = {
    username: this.name, 
    email: this.email,
    password: this.password,
    role: this.role
  };

  console.log('Data sent to backend:', newUser);

  this.authService.register(newUser).subscribe({
    next: () => {
      this.router.navigate(['/login'], {
        queryParams: { registered: 'true' }
      });
    },
    error: (err) => {
      console.error('Registration error', err);
      this.error = err.error?.message || 'Registration failed';
      this.loading = false;
    }
  });
}

}
