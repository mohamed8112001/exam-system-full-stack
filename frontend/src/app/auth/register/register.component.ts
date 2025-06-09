import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  role: 'student' | 'admin' = 'student';

  constructor(private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const newUser: User = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };


    localStorage.setItem('registeredUser', JSON.stringify(newUser));
    alert('Registration successful!');
    this.router.navigate(['/login']);
  }
}
