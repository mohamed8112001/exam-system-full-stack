import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';

interface User {
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.user = user;
      this.isLoggedIn = !!user;
    });
  }

  navigateToDashboard(): void {
    if (this.user?.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.user?.role === 'student') {
      this.router.navigate(['/student/exams']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
